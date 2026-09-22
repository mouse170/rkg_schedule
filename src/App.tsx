import React, { useEffect, useState, useMemo, lazy, Suspense, useTransition } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Language } from './i18n/translations';
import { Header } from './components/Header';
import { DataSourceBanner } from './components/DataSourceBanner';
import { FilterBar, AreaFilterType, SeatFilterType } from './components/FilterBar';
import { GirlCard, PairedInfo } from './components/GirlCard';
import { OFFICIAL_GIRLS } from './data/girlsRoster';
import { fetchLiveSchedule, getInitialSchedule, getCachedSchedule, SCHEDULE_CACHE_KEY, SHEET_HTMLVIEW_URL } from './services/sheetService';
import { GirlProfile, ScheduleDataset } from './types/schedule';
import { Heart, Sparkles, AlertCircle, Globe, Loader2, Flame, CheckCircle2, CalendarX2, FileSpreadsheet, ExternalLink, Users, Map } from 'lucide-react';
import { getRelativeDateInfo, isPastDate, compareScheduleDates, getSmartDefaultDate } from './utils/dateUtils';
import { isSpicyCoolSweetDate, getZoneAssignment } from './data/spicyCoolSweetData';

// Code Splitting via React.lazy for Non-initial View Components (大幅縮減首屏 Bundle 體積)
const MatrixView = lazy(() =>
  import('./components/MatrixView').then(module => ({ default: module.MatrixView }))
);
const ShareScheduleModal = lazy(() =>
  import('./components/ShareScheduleModal').then(module => ({ default: module.ShareScheduleModal }))
);
const InstagramDirectory = lazy(() =>
  import('./components/InstagramDirectory').then(module => ({ default: module.InstagramDirectory }))
);
const GirlDetailDrawer = lazy(() =>
  import('./components/GirlDetailDrawer').then(module => ({ default: module.GirlDetailDrawer }))
);
const StadiumGuideModal = lazy(() =>
  import('./components/StadiumGuideModal').then(module => ({ default: module.StadiumGuideModal }))
);

const MainApp: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [, startTransition] = useTransition();

  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'INSTAGRAM'>('SCHEDULE');
  const [viewMode, setViewMode] = useState<'CARD' | 'MATRIX'>('CARD');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // SWR 快取即刻繪製，首屏零等待消除 LCP 起跑延遲
  const [schedule, setSchedule] = useState<ScheduleDataset>(getInitialSchedule);
  const [isLoading, setIsLoading] = useState<boolean>(() => !getCachedSchedule());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const init = getInitialSchedule();
    const validUpcoming = init.dates.filter(d => !isPastDate(d)).sort(compareScheduleDates);
    let favs: string[] = [];
    try {
      const saved = localStorage.getItem('rkg_favorites');
      if (saved) favs = JSON.parse(saved);
    } catch {
      favs = [];
    }
    return getSmartDefaultDate(validUpcoming, favs, init);
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<AreaFilterType>('ALL');
  const [selectedGirl, setSelectedGirl] = useState<GirlProfile | null>(null);
  const [isStadiumGuideOpen, setIsStadiumGuideOpen] = useState<boolean>(false);
  const [hoveredGirl, setHoveredGirl] = useState<string | null>(null);

  // 瀏覽器閒置時預先載入次要模組，徹底根除點擊抽屜時高達 920ms 的 INP 卡頓
  useEffect(() => {
    const prefetchComponents = () => {
      import('./components/GirlDetailDrawer');
      import('./components/StadiumGuideModal');
    };

    if (typeof window !== 'undefined') {
      if ('requestIdleCallback' in window) {
        (window as any).requestIdleCallback(prefetchComponents, { timeout: 2500 });
      } else {
        setTimeout(prefetchComponents, 1200);
      }
    }
  }, []);

  const handleSelectGirl = (girl: GirlProfile) => {
    startTransition(() => {
      setSelectedGirl(girl);
    });
  };

  const handleAreaFilterChange = (filter: AreaFilterType) => {
    startTransition(() => {
      setAreaFilter(filter);
    });
  };

  // Favorites stored in LocalStorage
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('rkg_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (e: React.MouseEvent | null, girlName: string) => {
    if (e) e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(girlName)
        ? prev.filter(n => n !== girlName)
        : [...prev, girlName];
      try {
        localStorage.setItem('rkg_favorites', JSON.stringify(next));
      } catch (err) {
        console.error('Failed to save favorites to localStorage:', err);
      }
      return next;
    });
  };

  // 日期選取處理（若選中主題日，因無東R/西R席位與中場表演，自動切換為全部視角；若離開主題日且在賽後表演視角，自動切回全部視角）
  const handleSelectDate = (date: string) => {
    startTransition(() => {
      setSelectedDate(date);
      if (isSpicyCoolSweetDate(date)) {
        if (areaFilter === 'SEAT_EAST_R' || areaFilter === 'SEAT_WEST_R' || areaFilter === 'PERIOD_MID') {
          setAreaFilter('ALL');
        }
      } else {
        if (areaFilter === 'PERIOD_POST') {
          setAreaFilter('ALL');
        }
      }
    });
  };

  // 依時間排序並過濾掉已過去的歷史日期（今天與未來的比賽日）
  const upcomingDates = useMemo(() => {
    return schedule.dates
      .filter(d => !isPastDate(d))
      .sort((a, b) => compareScheduleDates(a, b));
  }, [schedule.dates]);

  // Load schedule data (SWR: 背景靜默驗證，首屏依賴快取零阻塞)
  const loadSchedule = async (isSilent = false, force = false) => {
    if (!isSilent) setIsLoading(true);
    try {
      const data = await fetchLiveSchedule(force);
      setSchedule(data);

      const validUpcoming = data.dates
        .filter(d => !isPastDate(d))
        .sort((a, b) => compareScheduleDates(a, b));

      // 若目前選取的日期為空或已經過去，重新計算智慧預設日期
      if (!selectedDate || isPastDate(selectedDate)) {
        const smartDate = getSmartDefaultDate(validUpcoming, favorites, data, language);
        setSelectedDate(smartDate);
      }
    } catch (err) {
      console.error('Error fetching live schedule:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 手動強制清除快取並向網路重新同步最新班表
  const handleManualRefresh = async () => {
    setIsLoading(true);
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(name => caches.delete(name))
        );
      }
      try {
        localStorage.removeItem(SCHEDULE_CACHE_KEY);
      } catch {
        // ignore
      }
      await loadSchedule(false, true);
      showToast('已清除離線快取並同步最新班表');
    } catch (err) {
      console.error('Manual refresh error:', err);
      await loadSchedule(false);
      showToast('班表已重新載入');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // SWR 靜默背景載入，避免觸發全頁面阻塞
    loadSchedule(schedule.dates.length > 0);
  }, []);

  // 網址參數同步（URL Query Params Share & Sync）
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const dateParam = params.get('date');
      const favsParam = params.get('favs');

      if (dateParam) {
        setSelectedDate(dateParam);
      }
      if (favsParam) {
        const importedFavs = favsParam.split(',').map(decodeURIComponent).filter(Boolean);
        if (importedFavs.length > 0) {
          setFavorites(prev => {
            const merged = Array.from(new Set([...prev, ...importedFavs]));
            try {
              localStorage.setItem('rkg_favorites', JSON.stringify(merged));
            } catch (e) {
              console.error(e);
            }
            return merged;
          });
          showToast(`已載入分享的追星班表 (${importedFavs.length} 位女孩)`);
        }
      }
    } catch (err) {
      console.error('Failed to parse URL search params:', err);
    }
  }, []);

  // 當使用者變更最愛女孩且當前未手動選定日期（或目前日期無最愛但其他日期有最愛）時進行智慧校準
  useEffect(() => {
    if (upcomingDates.length === 0) return;

    // 如果目前選取的日期已經過去，強制重選
    if (selectedDate && isPastDate(selectedDate)) {
      setSelectedDate(getSmartDefaultDate(upcomingDates, favorites, schedule));
      return;
    }

    // 若尚未選取日期，自動套用智慧日期
    if (!selectedDate) {
      setSelectedDate(getSmartDefaultDate(upcomingDates, favorites, schedule));
    }
  }, [favorites, upcomingDates, schedule]);

  type StationAreaTier = 'ZONE' | 'EAST' | 'WEST' | 'SPECIAL' | 'UNASSIGNED';

  const TIER_PRIORITY: Record<StationAreaTier, number> = {
    ZONE: 1,
    EAST: 2,
    WEST: 3,
    SPECIAL: 4,
    UNASSIGNED: 5
  };

  const getGirlStationTier = (girl: GirlProfile, targetDate?: string, targetFilter?: string): StationAreaTier => {
    const date = targetDate || selectedDate;
    const filter = targetFilter || areaFilter;
    const duties = schedule.girlsScheduleMap[girl.name] || [];
    const duty = date ? duties.find(d => d.date === date) : duties[0];
    if (!duty) return 'UNASSIGNED';

    // 1. 專區優先判定：主題日專區女孩，或站位包含專區
    if (date && isSpicyCoolSweetDate(date)) {
      const assign = getZoneAssignment(date, girl.name);
      if (assign) return 'ZONE';
    }

    let targetInning = duty.innings[0];
    if (filter === 'PERIOD_13') {
      targetInning = duty.innings.find(i => i.period.includes('1-3')) || targetInning;
    } else if (filter === 'PERIOD_78') {
      targetInning = duty.innings.find(i => i.period.includes('7-8')) || targetInning;
    } else if (filter === 'PERIOD_MID') {
      targetInning = duty.innings.find(i => i.period.includes('中場')) || targetInning;
    } else if (filter === 'PERIOD_POST') {
      targetInning = duty.innings.find(i => i.period.includes('賽後')) || targetInning;
    }

    if (!targetInning) return 'UNASSIGNED';
    const loc = targetInning.location || '';

    if (loc.includes('專區')) return 'ZONE';
    if (loc.includes('待公布') || loc.includes('待定') || loc.includes('未安排') || !loc.trim()) return 'UNASSIGNED';
    if (loc.includes('東R') || loc.includes('西R') || loc.includes('大樂')) return 'SPECIAL';
    if (loc.includes('東')) return 'EAST';
    if (loc.includes('西')) return 'WEST';

    // Fallback based on primaryArea
    if (duty.primaryArea === '專區') return 'ZONE';
    if (duty.primaryArea === '東區') return 'EAST';
    if (duty.primaryArea === '西區') return 'WEST';
    if (duty.primaryArea === '東R' || duty.primaryArea === '西R' || duty.primaryArea === '大樂') return 'SPECIAL';

    return 'UNASSIGNED';
  };

  // Filter and sort girls
  const filteredGirls = useMemo(() => {
    let list = [...OFFICIAL_GIRLS];

    // 1. Search Query filter (name or number)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(g =>
        g.name.toLowerCase().includes(q) ||
        g.number.toLowerCase().includes(q) ||
        (g.instagramHandle && g.instagramHandle.toLowerCase().includes(q))
      );
    }

    // 2. Period & Duty filter
    if (areaFilter === 'FAVORITES') {
      list = list.filter(g => favorites.includes(g.name));
    } else if (areaFilter === 'PERIOD_13') {
      // 1-3 局有排定站位之女孩
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && d.innings.some(inn => inn.period.includes('1-3') && inn.location.trim().length > 0);
        }
        return duties.some(d => d.innings.some(inn => inn.period.includes('1-3') && inn.location.trim().length > 0));
      });
    } else if (areaFilter === 'PERIOD_78') {
      // 7-8 局有排定站位之女孩
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && d.innings.some(inn => inn.period.includes('7-8') && inn.location.trim().length > 0);
        }
        return duties.some(d => d.innings.some(inn => inn.period.includes('7-8') && inn.location.trim().length > 0));
      });
    } else if (areaFilter === 'PERIOD_MID') {
      // 中場表演有排定之女孩
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && d.innings.some(inn => inn.period.includes('中場') && inn.location.trim().length > 0);
        }
        return duties.some(d => d.innings.some(inn => inn.period.includes('中場') && inn.location.trim().length > 0));
      });
    } else if (areaFilter === 'PERIOD_POST') {
      // 賽後表演有排定之女孩
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && d.innings.some(inn => inn.period.includes('賽後') && inn.location.trim().length > 0);
        }
        return duties.some(d => d.innings.some(inn => inn.period.includes('賽後') && inn.location.trim().length > 0));
      });
    } else if (areaFilter === 'SEAT_EAST') {
      // 球迷座位視角：一壘東區 (排除專區與東R)
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        const checkDuty = (duty: any) => {
          if (duty.date && isSpicyCoolSweetDate(duty.date) && getZoneAssignment(duty.date, g.name)) return false;
          if (duty.primaryArea === '專區') return false;
          return duty.innings.some((inn: any) => {
            const loc = inn.location || '';
            if (loc.includes('待公布') || loc.includes('專區')) return false;
            return loc.includes('東') && !loc.includes('東R');
          });
        };
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && checkDuty(d);
        }
        return duties.some(checkDuty);
      });
    } else if (areaFilter === 'SEAT_WEST') {
      // 球迷座位視角：三壘西區 (排除專區與西R)
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        const checkDuty = (duty: any) => {
          if (duty.date && isSpicyCoolSweetDate(duty.date) && getZoneAssignment(duty.date, g.name)) return false;
          if (duty.primaryArea === '專區') return false;
          return duty.innings.some((inn: any) => {
            const loc = inn.location || '';
            if (loc.includes('待公布') || loc.includes('專區')) return false;
            return loc.includes('西') && !loc.includes('西R');
          });
        };
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && checkDuty(d);
        }
        return duties.some(checkDuty);
      });
    } else if (areaFilter === 'SEAT_ZONE') {
      // 球迷座位視角：專區應援 (主題日個人專區寵粉應援)
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        const checkDuty = (duty: any) => {
          if (duty.date && isSpicyCoolSweetDate(duty.date) && getZoneAssignment(duty.date, g.name)) return true;
          if (duty.primaryArea === '專區') return true;
          return duty.innings.some((inn: any) => {
            const loc = inn.location || '';
            return loc.includes('專區') || inn.period === '全場專區';
          });
        };
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && checkDuty(d);
        }
        return duties.some(checkDuty);
      });
    } else if (areaFilter === 'SEAT_DALE') {
      // 球迷座位視角：大樂放鬆席
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        const checkDuty = (duty: any) =>
          duty.innings.some((inn: any) => {
            const loc = inn.location || '';
            if (loc.includes('待公布')) return false;
            return loc.includes('大樂');
          });
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && checkDuty(d);
        }
        return duties.some(checkDuty);
      });
    } else if (areaFilter === 'SEAT_EAST_R') {
      // 球迷座位視角：走道 東R 舞台
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        const checkDuty = (duty: any) =>
          duty.innings.some((inn: any) => {
            const loc = inn.location || '';
            if (loc.includes('待公布')) return false;
            return loc.includes('東R');
          });
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && checkDuty(d);
        }
        return duties.some(checkDuty);
      });
    } else if (areaFilter === 'SEAT_WEST_R') {
      // 球迷座位視角：走道 西R 舞台
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        const checkDuty = (duty: any) =>
          duty.innings.some((inn: any) => {
            const loc = inn.location || '';
            if (loc.includes('待公布')) return false;
            return loc.includes('西R');
          });
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && checkDuty(d);
        }
        return duties.some(checkDuty);
      });
    }

    // 3. Sorting: 最愛女孩絕對優先置頂，再依 5 階區域排序階層
    list.sort((a, b) => {
      const aFav = favorites.includes(a.name) ? 1 : 0;
      const bFav = favorites.includes(b.name) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;

      const aTier = getGirlStationTier(a, selectedDate, areaFilter);
      const bTier = getGirlStationTier(b, selectedDate, areaFilter);
      if (TIER_PRIORITY[aTier] !== TIER_PRIORITY[bTier]) {
        return TIER_PRIORITY[aTier] - TIER_PRIORITY[bTier];
      }

      // 檢查在勤狀態（若未指定日期）
      const aDuties = schedule.girlsScheduleMap[a.name] || [];
      const bDuties = schedule.girlsScheduleMap[b.name] || [];
      const aOnDuty = selectedDate ? aDuties.some(d => d.date === selectedDate) : aDuties.length > 0;
      const bOnDuty = selectedDate ? bDuties.some(d => d.date === selectedDate) : bDuties.length > 0;
      if (aOnDuty !== bOnDuty) return (bOnDuty ? 1 : 0) - (aOnDuty ? 1 : 0);

      // 同階同最愛狀態依背號遞增排序
      const numA = parseInt(a.number, 10) || 999;
      const numB = parseInt(b.number, 10) || 999;
      return numA - numB;
    });

    return list;
  }, [searchQuery, areaFilter, selectedDate, favorites, schedule]);

  // 方案 A：最愛女孩於「東R、西R、大樂區」且「同時段（同日期 + 同局數）」之配對計算
  const pairedMatchesMap = useMemo((): Record<string, PairedInfo> => {
    // 必須有選定日期且最愛數量至少 2 位才可能觸發同台配對
    if (!selectedDate || favorites.length < 2) return {};

    // 關鍵特殊站位白名單
    const isSpecialZone = (loc: string) => {
      const trimmed = loc.trim();
      return trimmed === '東R' || trimmed === '西R' || trimmed.includes('東R') || trimmed.includes('西R') || trimmed.includes('大樂');
    };

    const getNormalizedZoneName = (loc: string) => {
      const trimmed = loc.trim();
      if (trimmed === '東R' || trimmed.includes('東R')) return '東R';
      if (trimmed === '西R' || trimmed.includes('西R')) return '西R';
      if (trimmed.includes('大樂')) return '大樂';
      return trimmed;
    };

    // key: `${period}__${normalizedLocation}` -> string[] (girl names)
    const slotMap: Record<string, { period: string; location: string; girls: string[] }> = {};

    favorites.forEach(favName => {
      const duties = schedule.girlsScheduleMap[favName] || [];
      const duty = duties.find(d => d.date === selectedDate);
      if (!duty) return;

      duty.innings.forEach(inn => {
        if (!inn.location || !isSpecialZone(inn.location)) return;

        // 若有套用時段篩選，僅在符合時段時採計
        if (areaFilter === 'PERIOD_13' && !inn.period.includes('1-3')) return;
        if (areaFilter === 'PERIOD_78' && !inn.period.includes('7-8')) return;
        if (areaFilter === 'PERIOD_MID' && !inn.period.includes('中場')) return;

        const normLoc = getNormalizedZoneName(inn.location);
        const slotKey = `${inn.period}__${normLoc}`;

        if (!slotMap[slotKey]) {
          slotMap[slotKey] = {
            period: inn.period,
            location: normLoc,
            girls: []
          };
        }
        if (!slotMap[slotKey].girls.includes(favName)) {
          slotMap[slotKey].girls.push(favName);
        }
      });
    });

    const result: Record<string, PairedInfo> = {};

    Object.values(slotMap).forEach(slot => {
      if (slot.girls.length >= 2) {
        slot.girls.forEach(girlName => {
          const partners = slot.girls.filter(name => name !== girlName);
          result[girlName] = {
            isPaired: true,
            location: slot.location,
            period: slot.period,
            partnerNames: partners
          };
        });
      }
    });

    return result;
  }, [selectedDate, favorites, schedule, areaFilter]);


  interface GroupSection {
    key: string;
    title: string;
    badgeStyle: string;
    girls: GirlProfile[];
    favCount: number;
    date?: string;
    emptyNotice?: string;
    hideHeader?: boolean;
  }

  // 4. Grouped & sorted girls according to user criteria:
  // - 中場表演篩選時：
  //   * 若為全部日期：依排定日期分別分區（東區前、西區前），標註是哪一天的中場舞表演
  //   * 若為特定日期：依當天中場表演分區（東區前、西區前）呈現；若無中場則提示當日無中場表演
  //   * 最愛數量多的在最上方，相同數量時東區優先，每組內最愛置頂後依背號排序
  // - 其他時段篩選時：
  //   * 依東區、西區、假日專區、未排班分區呈現，最愛多的在上，東優先，組內最愛置頂
  const groupedSections = useMemo((): GroupSection[] => {
    if (filteredGirls.length === 0 && areaFilter !== 'PERIOD_MID') return [];

    const countFavs = (list: GirlProfile[]) => list.filter(g => favorites.includes(g.name)).length;
    const sortGirlsInGroup = (list: GirlProfile[], targetDate?: string) => {
      const dateToUse = targetDate || selectedDate;
      list.sort((a, b) => {
        const aFav = favorites.includes(a.name) ? 1 : 0;
        const bFav = favorites.includes(b.name) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav; // 最愛優先置頂

        const aTier = getGirlStationTier(a, dateToUse, areaFilter);
        const bTier = getGirlStationTier(b, dateToUse, areaFilter);
        if (TIER_PRIORITY[aTier] !== TIER_PRIORITY[bTier]) {
          return TIER_PRIORITY[aTier] - TIER_PRIORITY[bTier];
        }

        const numA = parseInt(a.number, 10) || 999;
        const numB = parseInt(b.number, 10) || 999;
        return numA - numB;
      });
    };

    // A0. 賽後表演專屬分組邏輯 (PERIOD_POST)
    if (areaFilter === 'PERIOD_POST') {
      const targetDates = selectedDate ? [selectedDate] : upcomingDates.filter(d => isSpicyCoolSweetDate(d));
      const postSections: GroupSection[] = [];

      targetDates.forEach(date => {
        const eastGirls: GirlProfile[] = [];
        const westGirls: GirlProfile[] = [];

        filteredGirls.forEach(girl => {
          const duties = schedule.girlsScheduleMap[girl.name] || [];
          const duty = duties.find(d => d.date === date);
          if (!duty) return;

          const postInning = duty.innings.find(i => i.period.includes('賽後') && i.location.trim().length > 0);
          if (!postInning) return;

          if (postInning.location.includes('東')) {
            eastGirls.push(girl);
          } else if (postInning.location.includes('西')) {
            westGirls.push(girl);
          }
        });

        sortGirlsInGroup(eastGirls, date);
        sortGirlsInGroup(westGirls, date);

        if (eastGirls.length > 0) {
          postSections.push({
            key: `POST_${date}_EAST`,
            title: `${date} ${t.groupTitlePostEast} (${eastGirls.length} 位)`,
            badgeStyle: 'from-rose-600 via-pink-600 to-rose-700 text-white shadow-md font-bold',
            girls: eastGirls,
            favCount: countFavs(eastGirls),
            date
          });
        }

        if (westGirls.length > 0) {
          postSections.push({
            key: `POST_${date}_WEST`,
            title: `${date} ${t.groupTitlePostWest} (${westGirls.length} 位)`,
            badgeStyle: 'from-zinc-800 via-zinc-900 to-black text-amber-200 shadow-md border border-zinc-700 font-bold',
            girls: westGirls,
            favCount: countFavs(westGirls),
            date
          });
        }
      });

      return postSections;
    }

    // A. 中場表演專屬分組邏輯 (PERIOD_MID)
    if (areaFilter === 'PERIOD_MID') {
      const targetDates = selectedDate ? [selectedDate] : upcomingDates;
      const midSections: GroupSection[] = [];

      targetDates.forEach(date => {
        if (isSpicyCoolSweetDate(date)) return;
        const eastGirls: GirlProfile[] = [];
        const westGirls: GirlProfile[] = [];
        const stageGirls: GirlProfile[] = [];

        filteredGirls.forEach(girl => {
          const duties = schedule.girlsScheduleMap[girl.name] || [];
          const duty = duties.find(d => d.date === date);
          if (!duty) return;

          const midInning = duty.innings.find(i => (i.period.includes('中場') || i.period.toUpperCase().includes('IF')) && i.location.trim().length > 0);
          if (!midInning) return;

          const loc = midInning.location;
          if (loc.includes('東R') || loc.includes('西R') || loc.includes('舞台') || loc.includes('專區') || loc.includes('全員')) {
            stageGirls.push(girl);
          } else if (loc.includes('東')) {
            eastGirls.push(girl);
          } else if (loc.includes('西')) {
            westGirls.push(girl);
          } else {
            stageGirls.push(girl);
          }
        });

        sortGirlsInGroup(eastGirls, date);
        sortGirlsInGroup(westGirls, date);
        sortGirlsInGroup(stageGirls, date);

        // 當日中場表演 (東區前)
        if (eastGirls.length > 0) {
          midSections.push({
            key: `MID_${date}_EAST`,
            title: `${date} ${t.groupTitleMidEast} (${eastGirls.length} 位)`,
            badgeStyle: 'from-blue-600 to-indigo-600 text-white shadow-sm',
            girls: eastGirls,
            favCount: countFavs(eastGirls),
            date
          });
        }

        // 當日中場表演 (西區前)
        if (westGirls.length > 0) {
          midSections.push({
            key: `MID_${date}_WEST`,
            title: `${date} ${t.groupTitleMidWest} (${westGirls.length} 位)`,
            badgeStyle: 'from-emerald-600 to-teal-600 text-white shadow-sm',
            girls: westGirls,
            favCount: countFavs(westGirls),
            date
          });
        }

        // 當日中場表演 (應援舞台/全員合體/專區)
        if (stageGirls.length > 0) {
          const stageTitle = `${date} ${t.groupTitleMidStage} (${stageGirls.length} 位)`;

          midSections.push({
            key: `MID_${date}_STAGE`,
            title: stageTitle,
            badgeStyle: 'from-amber-500 to-orange-500 text-white shadow-sm',
            girls: stageGirls,
            favCount: countFavs(stageGirls),
            date
          });
        }
      });

      // 如果選定特定日期，但當日無中場表演
      if (midSections.length === 0 && selectedDate) {
        midSections.push({
          key: `MID_${selectedDate}_EMPTY`,
          title: `${selectedDate} ${t.groupTitleMid}`,
          badgeStyle: 'from-gray-500 to-gray-600 text-white shadow-sm',
          girls: [],
          favCount: 0,
          date: selectedDate,
          emptyNotice: t.noMidPerformance
        });
      }

      // 中場分區排序：最愛數量多的在最上面，相同數量時東區優先
      midSections.sort((a, b) => {
        if (b.favCount !== a.favCount) {
          return b.favCount - a.favCount;
        }
        const getZonePriority = (k: string) => {
          if (k.endsWith('_EAST')) return 0;
          if (k.endsWith('_WEST')) return 1;
          if (k.endsWith('_STAGE')) return 2;
          return 3;
        };
        const zoneDiff = getZonePriority(a.key) - getZonePriority(b.key);
        if (zoneDiff !== 0) return zoneDiff;

        return (a.date || '').localeCompare(b.date || '');
      });

      return midSections;
    }

    // B. 最愛篩選且全部天數時之專屬分組 (FAVORITES + ALL DATES)
    if (areaFilter === 'FAVORITES' && !selectedDate) {
      const onDutyFavs: GirlProfile[] = [];
      const offDutyFavs: GirlProfile[] = [];

      filteredGirls.forEach(girl => {
        const duties = schedule.girlsScheduleMap[girl.name] || [];
        if (duties.length > 0) {
          onDutyFavs.push(girl);
        } else {
          offDutyFavs.push(girl);
        }
      });

      sortGirlsInGroup(onDutyFavs);
      sortGirlsInGroup(offDutyFavs);

      const favSections: GroupSection[] = [];
      if (onDutyFavs.length > 0) {
        favSections.push({
          key: 'FAV_ON_DUTY',
          title: t.groupTitleFavOnDuty,
          badgeStyle: 'from-rose-600 via-pink-600 to-rkg-crimson text-white shadow-sm',
          girls: onDutyFavs,
          favCount: onDutyFavs.length
        });
      }
      if (offDutyFavs.length > 0) {
        favSections.push({
          key: 'FAV_OFF_DUTY',
          title: t.groupTitleFavOffDuty,
          badgeStyle: 'from-gray-500 to-gray-600 text-white shadow-sm',
          girls: offDutyFavs,
          favCount: offDutyFavs.length
        });
      }
      return favSections;
    }

    // C. 全部女孩且全部日期時：隱藏分區標題，直接以完整網格平鋪所有女孩站位資訊
    if (areaFilter === 'ALL' && !selectedDate) {
      const allGirls = [...filteredGirls];
      sortGirlsInGroup(allGirls);
      return [
        {
          key: 'ALL_FLAT',
          title: t.areaAll,
          badgeStyle: 'from-gray-800 to-gray-900 text-white',
          girls: allGirls,
          favCount: countFavs(allGirls),
          hideHeader: true
        }
      ];
    }

    // D. 全部女孩且選定特定日期時：因局數會換側應援，依「今日上班女孩」與「未排班／休假女孩」劃分分組
    if (areaFilter === 'ALL' && selectedDate) {
      const onDutyGirls: GirlProfile[] = [];
      const offDutyGirls: GirlProfile[] = [];

      filteredGirls.forEach(girl => {
        const duties = schedule.girlsScheduleMap[girl.name] || [];
        const isDuty = duties.some(d => d.date === selectedDate);
        if (isDuty) {
          onDutyGirls.push(girl);
        } else {
          offDutyGirls.push(girl);
        }
      });

      sortGirlsInGroup(onDutyGirls);
      sortGirlsInGroup(offDutyGirls);

      const relInfo = getRelativeDateInfo(selectedDate, language);
      const onDutyTitle = relInfo.isToday
        ? `${selectedDate} ${relInfo.badgeText} • ${t.groupTitleOnDutySection}`
        : `${selectedDate} (${relInfo.badgeText}) • ${t.groupTitleOnDutySection}`;

      const onDutyBadgeStyle = relInfo.isToday
        ? 'from-rose-600 via-pink-600 to-rkg-crimson text-white shadow-md ring-1 ring-white/40 animate-pulse'
        : 'from-rkg-pink-deep to-rkg-crimson text-white shadow-sm';

      const daySections: GroupSection[] = [];
      if (onDutyGirls.length > 0) {
        daySections.push({
          key: `DAY_${selectedDate}_ON_DUTY`,
          title: onDutyTitle,
          badgeStyle: onDutyBadgeStyle,
          girls: onDutyGirls,
          favCount: countFavs(onDutyGirls),
          date: selectedDate
        });
      }
      if (offDutyGirls.length > 0) {
        daySections.push({
          key: `DAY_${selectedDate}_OFF_DUTY`,
          title: `${selectedDate} ${t.groupTitleOffDuty}`,
          badgeStyle: 'from-gray-500 to-gray-600 text-white shadow-sm',
          girls: offDutyGirls,
          favCount: countFavs(offDutyGirls),
          date: selectedDate
        });
      }
      return daySections;
    }

    // E. 球迷席位視角專屬時間軸分組 (SEAT_EAST, SEAT_WEST, SEAT_ZONE, SEAT_DALE, SEAT_EAST_R, SEAT_WEST_R)
    if (areaFilter.startsWith('SEAT_')) {
      const isMatchZone = (loc: string) => {
        if (!loc || loc.includes('待公布')) return false;
        if (areaFilter === 'SEAT_EAST') return !loc.includes('專區') && loc.includes('東') && !loc.includes('東R');
        if (areaFilter === 'SEAT_WEST') return !loc.includes('專區') && loc.includes('西') && !loc.includes('西R');
        if (areaFilter === 'SEAT_ZONE') return loc.includes('專區');
        if (areaFilter === 'SEAT_DALE') return loc.includes('大樂');
        if (areaFilter === 'SEAT_EAST_R') return loc.includes('東R');
        if (areaFilter === 'SEAT_WEST_R') return loc.includes('西R');
        return false;
      };

      const p13Girls: GirlProfile[] = [];
      const midGirls: GirlProfile[] = [];
      const p78Girls: GirlProfile[] = [];
      const continuousGirls: GirlProfile[] = [];

      filteredGirls.forEach(girl => {
        const duties = schedule.girlsScheduleMap[girl.name] || [];
        const duty = selectedDate ? duties.find(d => d.date === selectedDate) : duties[0];
        if (!duty) return;

        const isThemeDate = duty.date && isSpicyCoolSweetDate(duty.date);
        const isZoneMember = (isThemeDate && Boolean(getZoneAssignment(duty.date, girl.name))) || duty.primaryArea === '專區';

        const has13 = duty.innings.some(i => i.period.includes('1-3') && isMatchZone(i.location));
        const hasMid = duty.innings.some(i => i.period.includes('中場') && isMatchZone(i.location));
        const has78 = duty.innings.some(i => i.period.includes('7-8') && isMatchZone(i.location));
        const hasWholeGame = (areaFilter === 'SEAT_ZONE' && isZoneMember) || duty.innings.some(i => (i.period.includes('全場') || i.period.includes('專區')) && isMatchZone(i.location));

        // 若多個時段都在此區（例如大樂區或專區常駐）
        if (hasWholeGame || (has13 && has78)) {
          continuousGirls.push(girl);
        } else {
          if (has13) p13Girls.push(girl);
          if (has78) p78Girls.push(girl);
        }
        if (hasMid) midGirls.push(girl);
      });

      sortGirlsInGroup(p13Girls);
      sortGirlsInGroup(midGirls);
      sortGirlsInGroup(p78Girls);
      sortGirlsInGroup(continuousGirls);

      const seatSections: GroupSection[] = [];

      // 1. 全場固定此區
      if (continuousGirls.length > 0) {
        seatSections.push({
          key: 'SEAT_CONTINUOUS',
          title: areaFilter === 'SEAT_ZONE' ? t.seatSpecialZone : t.groupTitleSeatAllMatch,
          badgeStyle: areaFilter === 'SEAT_ZONE'
            ? 'from-amber-500 via-rose-600 to-amber-600 text-white shadow-md ring-1 ring-amber-300/60 font-black'
            : 'from-fuchsia-600 to-pink-600 text-white shadow-sm',
          girls: continuousGirls,
          favCount: countFavs(continuousGirls),
          date: selectedDate
        });
      }

      // 2. 1-3 局來到你這區
      if (p13Girls.length > 0) {
        seatSections.push({
          key: 'SEAT_PERIOD_13',
          title: t.groupTitleSeat13,
          badgeStyle: 'from-sky-600 to-indigo-600 text-white shadow-sm',
          girls: p13Girls,
          favCount: countFavs(p13Girls),
          date: selectedDate
        });
      }

      // 3. 第 5 局下中場舞
      if (midGirls.length > 0) {
        seatSections.push({
          key: 'SEAT_PERIOD_MID',
          title: t.groupTitleSeatMid,
          badgeStyle: 'from-amber-500 to-orange-500 text-white shadow-sm',
          girls: midGirls,
          favCount: countFavs(midGirls),
          date: selectedDate
        });
      }

      // 4. 7-8 局換側來到你面前
      if (p78Girls.length > 0) {
        seatSections.push({
          key: 'SEAT_PERIOD_78',
          title: t.groupTitleSeat78,
          badgeStyle: 'from-purple-600 to-pink-600 text-white shadow-sm',
          girls: p78Girls,
          favCount: countFavs(p78Girls),
          date: selectedDate
        });
      }

      return seatSections;
    }

    // F. 指定時段站位分組邏輯 (PERIOD_13, PERIOD_78, FAVORITES w/ date)
    const groups: Record<StationAreaTier, GirlProfile[]> = {
      ZONE: [],
      EAST: [],
      WEST: [],
      SPECIAL: [],
      UNASSIGNED: []
    };

    filteredGirls.forEach(girl => {
      const gType = getGirlStationTier(girl, selectedDate, areaFilter);
      groups[gType].push(girl);
    });

    // 每組內部排序：最愛優先，再依背號大小
    Object.keys(groups).forEach(k => {
      const key = k as StationAreaTier;
      sortGirlsInGroup(groups[key], selectedDate);
    });

    const sectionMeta: GroupSection[] = [
      {
        key: 'ZONE',
        title: `看台專區應援女孩 (${groups.ZONE.length} 位)`,
        badgeStyle: 'from-amber-500 via-amber-400 to-amber-600 text-[#1a0007] shadow-md ring-1 ring-amber-400/40 font-black',
        girls: groups.ZONE,
        favCount: countFavs(groups.ZONE),
        date: selectedDate
      },
      {
        key: 'EAST',
        title: selectedDate
          ? `${selectedDate} 一壘東區應援 (${groups.EAST.length} 位)`
          : `${t.groupTitleEast} (${groups.EAST.length} 位)`,
        badgeStyle: 'from-blue-600 to-indigo-600 text-white shadow-sm',
        girls: groups.EAST,
        favCount: countFavs(groups.EAST),
        date: selectedDate
      },
      {
        key: 'WEST',
        title: selectedDate
          ? `${selectedDate} 三壘西區應援 (${groups.WEST.length} 位)`
          : `${t.groupTitleWest} (${groups.WEST.length} 位)`,
        badgeStyle: 'from-emerald-600 to-teal-600 text-white shadow-sm',
        girls: groups.WEST,
        favCount: countFavs(groups.WEST),
        date: selectedDate
      },
      {
        key: 'SPECIAL',
        title: selectedDate
          ? `${selectedDate} 特殊區域（東R／西R／大樂） (${groups.SPECIAL.length} 位)`
          : `${t.groupTitleSpecial} (${groups.SPECIAL.length} 位)`,
        badgeStyle: 'from-purple-600 to-pink-600 text-white shadow-sm',
        girls: groups.SPECIAL,
        favCount: countFavs(groups.SPECIAL),
        date: selectedDate
      },
      {
        key: 'UNASSIGNED',
        title: `${selectedDate ? `${selectedDate} ` : ''}未安排站位／待公布 (${groups.UNASSIGNED.length} 位)`,
        badgeStyle: 'from-gray-600 to-gray-700 text-white shadow-sm',
        girls: groups.UNASSIGNED,
        favCount: countFavs(groups.UNASSIGNED),
        date: selectedDate
      }
    ];

    // 區域排序依據：嚴格依循 專區 > 東區 > 西區 > 特殊區域 > 未安排站位人員
    const activeSections = sectionMeta.filter(s => s.girls.length > 0);
    return activeSections;
  }, [filteredGirls, favorites, selectedDate, areaFilter, schedule, t]);

  return (
    <div className="min-h-screen flex flex-col bg-[#fff8f9] dark:bg-gradient-to-b dark:from-[#140104] dark:via-[#1c0208] dark:to-[#140104] text-slate-800 dark:text-[#fff5f5] transition-colors duration-300">
        {/* 1. Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          isLoading={isLoading}
          onRefresh={handleManualRefresh}
          onOpenStadiumGuide={() => setIsStadiumGuideOpen(true)}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />

        {/* 2. Data Source Notice & Live Verification Bar */}
        <DataSourceBanner
          schedule={schedule}
          selectedDate={selectedDate}
        />

        {/* 3. Main Content Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {activeTab === 'SCHEDULE' ? (
            upcomingDates.length === 0 ? (
              /* 當期班表更新中 / 無當期賽事專屬引導視圖 */
              <div className="py-8 sm:py-12 max-w-2xl w-full mx-auto">
                <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-oled-card border border-pink-100 dark:border-oled-border shadow-xl p-6 sm:p-10 text-center space-y-6">
                  {/* 背景氛圍光效 */}
                  <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gradient-to-br from-pink-400/10 to-rose-500/10 blur-2xl pointer-events-none" />
                  <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-gradient-to-tr from-amber-400/10 to-pink-500/10 blur-2xl pointer-events-none" />

                  {/* 圖標與徽章 */}
                  <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-rose-50 via-pink-100 to-amber-50 dark:from-rose-950/40 dark:via-pink-900/30 dark:to-amber-950/20 text-rkg-crimson dark:text-pink-400 border border-pink-200/60 dark:border-rose-800/40 shadow-inner">
                    <CalendarX2 className="w-10 h-10 stroke-[1.75]" />
                  </div>

                  {/* 標題與說明 */}
                  <div className="space-y-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-pink-100 dark:bg-rose-950/60 text-rkg-crimson dark:text-rose-300 border border-pink-200 dark:border-rose-900/60">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span>{t.noScheduleTitle}</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white tracking-tight">
                      {t.noScheduleTitle}
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mx-auto leading-relaxed">
                      {t.noScheduleDesc}
                    </p>
                  </div>

                  {/* 核心操作：外連 Google 試算表大按鈕 */}
                  <div className="pt-2">
                    <a
                      href={SHEET_HTMLVIEW_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 ring-2 ring-emerald-400/30"
                    >
                      <FileSpreadsheet className="w-5 h-5" />
                      <span>{t.openOfficialSheet}</span>
                      <ExternalLink className="w-4 h-4 opacity-80" />
                    </a>
                  </div>

                  {/* 周邊功能快捷入口 */}
                  <div className="pt-4 border-t border-slate-100 dark:border-oled-border/80 flex flex-wrap items-center justify-center gap-3">
                    <button
                      onClick={() => setActiveTab('INSTAGRAM')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-pink-50 dark:bg-oled-elevated hover:bg-pink-100 dark:hover:bg-slate-800 text-xs font-bold text-rkg-crimson dark:text-pink-300 border border-pink-200/70 dark:border-oled-border transition cursor-pointer"
                    >
                      <Users className="w-4 h-4" />
                      <span>{t.viewGirlsRoster}</span>
                    </button>
                    <button
                      onClick={() => setIsStadiumGuideOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-oled-elevated hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-oled-border transition cursor-pointer"
                    >
                      <Map className="w-4 h-4" />
                      <span>{t.viewStadiumGuide}</span>
                    </button>
                  </div>

                  {/* 同步時間提示 */}
                  {schedule.lastUpdated && (
                    <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">
                      最後同步檢查：{schedule.lastUpdated}
                    </div>
                  )}
                </div>
              </div>
            ) : (
            <>
              {/* Banner Card (Today Highlight, or Default Makeup Game Week) */}
              {(() => {
                const currentRelInfo = selectedDate ? getRelativeDateInfo(selectedDate, language) : null;
                const isCurrentToday = currentRelInfo?.isToday;

                if (isCurrentToday) {
                  return (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rkg-crimson py-2.5 px-3.5 sm:py-3 sm:px-4 text-white mb-2.5 sm:mb-3 shadow-md ring-1.5 ring-pink-400/40">
                      <div className="relative z-10">
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white text-rose-700 text-[10px] font-black shadow-sm">
                            <Flame className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span>{t.todayScheduleBannerBadge}</span>
                          </span>
                          <span className="text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded-full bg-white/20 text-white">
                            {selectedDate} ({currentRelInfo.weekdayName})
                          </span>
                          <h2 className="text-xs sm:text-sm font-black tracking-tight">
                            {t.todayScheduleBannerTitle}
                          </h2>
                        </div>
                        <p className="text-[10px] sm:text-xs text-pink-100 leading-snug font-normal line-clamp-1 sm:line-clamp-none">
                          {t.todayScheduleBannerDesc}
                        </p>
                      </div>
                      <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
                      <div className="absolute right-16 -top-8 w-28 h-28 rounded-full bg-amber-400/20 blur-lg pointer-events-none" />
                    </div>
                  );
                }

                return (
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rkg-crimson via-rkg-crimson-light to-rkg-pink py-2 px-3.5 sm:py-2.5 sm:px-4 text-white mb-2.5 sm:mb-3 shadow-sm">
                    <div className="relative z-10">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-0.5">
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-bold">
                          <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                          <span>{t.bannerBadge}</span>
                        </span>
                        <span className="text-xs font-bold tracking-tight">
                          {t.bannerTitle}
                        </span>
                      </div>
                      <p className="text-[10px] sm:text-xs text-pink-100/90 leading-snug font-normal line-clamp-1 sm:line-clamp-none">
                        {areaFilter.startsWith('SEAT_')
                          ? t.seatViewBannerDesc
                          : t.bannerDesc}
                      </p>
                    </div>
                    <div className="absolute -right-8 -bottom-8 w-36 h-36 rounded-full bg-white/10 blur-xl pointer-events-none" />
                    <div className="absolute right-16 -top-8 w-24 h-24 rounded-full bg-pink-300/20 blur-lg pointer-events-none" />
                  </div>
                );
              })()}

              {/* Filter Controls (Ultra-Compact Stitch Dual-Mode) */}
              <FilterBar
                dates={upcomingDates}
                selectedDate={selectedDate}
                onSelectDate={handleSelectDate}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                areaFilter={areaFilter}
                onAreaFilterChange={handleAreaFilterChange}
                totalCount={OFFICIAL_GIRLS.length}
                favoritesCount={favorites.length}
                filteredCount={filteredGirls.length}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onResetFilters={() => {
                  setSearchQuery('');
                  handleAreaFilterChange('ALL');
                  handleSelectDate('');
                }}
              />

              {/* Conditional View Mode: Matrix View vs Grouped Cards (Lazy Loaded) */}
              {viewMode === 'MATRIX' ? (
                <Suspense
                  fallback={
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 gap-3">
                      <Loader2 className="w-8 h-8 animate-spin text-rkg-pink-deep dark:text-pink-400" />
                      <span className="text-xs font-medium">載入看台矩陣中...</span>
                    </div>
                  }
                >
                  <MatrixView
                    selectedDate={selectedDate}
                    allGirls={OFFICIAL_GIRLS}
                    schedule={schedule}
                    favorites={favorites}
                    onSelectGirl={handleSelectGirl}
                    onToggleFavorite={(name) => toggleFavorite(null, name)}
                    onSelectDate={handleSelectDate}
                    areaFilter={areaFilter}
                    searchQuery={searchQuery}
                  />
                </Suspense>
              ) : groupedSections.length > 0 ? (
                <div className="space-y-8">
                  {groupedSections.map((sec) => (
                    <section key={sec.key} className="space-y-3.5">
                      {/* Section Header (若 hideHeader 為 true 則不渲染) */}
                      {!sec.hideHeader && (
                        <div className="flex items-center justify-between px-1 border-b border-pink-100/70 dark:border-oled-border pb-2">
                          <div className="flex items-center gap-2">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-black bg-gradient-to-r ${sec.badgeStyle}`}>
                              {sec.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                              {sec.girls.length} 位
                            </span>
                          </div>

                          {sec.favCount > 0 && (
                            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200/80 dark:border-rose-800/60">
                              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                              <span>{sec.favCount} 位最愛</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Cards Grid or Section Empty Notice */}
                      {sec.girls.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
                          {sec.girls.map((girl, idx) => {
                            const duties = schedule.girlsScheduleMap[girl.name] || [];
                            const isFav = favorites.includes(girl.name);
                            const paired = pairedMatchesMap[girl.name];
                            const isPartnerHovered = Boolean(
                              hoveredGirl &&
                              paired &&
                              paired.partnerNames.includes(hoveredGirl)
                            );
                            return (
                              <GirlCard
                                key={girl.id}
                                girl={girl}
                                duties={duties}
                                selectedDate={sec.date || selectedDate}
                                isFavorite={isFav}
                                onToggleFavorite={(e) => toggleFavorite(e, girl.name)}
                                onClick={handleSelectGirl}
                                priority={idx < 2}
                                pairedInfo={paired}
                                isPartnerHovered={isPartnerHovered}
                                onHover={(name) => setHoveredGirl(name)}
                                seatFilter={
                                  areaFilter.startsWith('SEAT_')
                                    ? (areaFilter as SeatFilterType)
                                    : null
                                }
                              />
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-6 text-center bg-pink-50/50 dark:bg-oled-surface rounded-2xl border border-dashed border-pink-200 dark:border-oled-border">
                          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                            {sec.emptyNotice || t.noMatchTitle}
                          </p>
                        </div>
                      )}
                    </section>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white/80 dark:bg-oled-surface rounded-3xl border border-dashed border-pink-200 dark:border-oled-border p-8 shadow-sm">
                  <AlertCircle className="w-10 h-10 text-pink-300 dark:text-pink-500 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-gray-700 dark:text-gray-200 mb-1">
                    {areaFilter === 'PERIOD_MID' ? t.noMidPerformance : t.noMatchTitle}
                  </h4>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
                    {areaFilter === 'PERIOD_MID' ? '' : t.noMatchDesc}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setAreaFilter('ALL');
                      setSelectedDate('');
                    }}
                    className="px-4 py-2 rounded-full text-xs font-bold bg-pink-100 dark:bg-oled-card text-rkg-pink-deep dark:text-pink-400 hover:bg-pink-200 dark:hover:bg-oled-elevated transition"
                  >
                    {t.resetFilters}
                  </button>
                </div>
              )}
            </>
            )
          ) : (
            /* Instagram Directory View with Suspense */
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-gray-500 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-rkg-pink-deep dark:text-pink-400" />
                  <span className="text-xs font-medium">載入中...</span>
                </div>
              }
            >
              <InstagramDirectory
                onSelectGirl={(g) => setSelectedGirl(g)}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            </Suspense>
          )}
        </main>

        {/* 4. Footer */}
        <footer className="mt-12 bg-white dark:bg-oled-surface border-t border-pink-100 dark:border-oled-border text-center py-8 text-xs text-gray-500 dark:text-gray-400">
          <div className="max-w-4xl mx-auto px-4 space-y-4">
            {/* Language Switcher in Footer */}
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-rkg-pink" />
                <span>{t.switchLanguage}：</span>
              </span>
              <div className="inline-flex items-center gap-1 bg-pink-50/80 dark:bg-oled-card p-1 rounded-2xl border border-pink-100 dark:border-oled-border shadow-sm">
                {(['zh-TW', 'ja', 'ko'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition active:scale-95 ${
                      language === lang
                        ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-sm'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'zh-TW' ? '繁體中文' : lang === 'ja' ? '日本語' : '한국어'}
                  </button>
                ))}
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-500 dark:text-gray-400">
              <a
                href="https://docs.google.com/spreadsheets/d/1w6j9q349x-5bK2K2v1e_0U6T20vB_o_8-pY5c7rQ4oM/htmlview"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rkg-pink-deep dark:hover:text-pink-400 transition"
              >
                {t.googleSheetLink}
              </a>
              <span>•</span>
              <a
                href="https://monkeys.rakuten.com.tw/girls"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rkg-pink-deep dark:hover:text-pink-400 transition"
              >
                {t.officialRosterLink}
              </a>
              <span>•</span>
              <a
                href="https://www.instagram.com/rakutengirls/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-rkg-pink-deep dark:hover:text-pink-400 transition"
              >
                {t.officialIgLink}
              </a>
            </div>

            {/* Vibe Coding Notice */}
            <div className="p-3 rounded-2xl bg-pink-50/50 dark:bg-oled-card/60 border border-pink-100/70 dark:border-oled-border text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
              {t.vibeCodingNotice}
            </div>

            {/* Disclaimer Copyright */}
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              {t.disclaimerCopyright}
            </p>
          </div>
        </footer>

        {/* 5. Detail Drawer with Suspense */}
        <Suspense fallback={null}>
          {selectedGirl && (
            <GirlDetailDrawer
              girl={selectedGirl}
              duties={(schedule.girlsScheduleMap[selectedGirl.name] || []).filter(duty => !isPastDate(duty.date))}
              isFavorite={favorites.includes(selectedGirl.name)}
              onToggleFavorite={(name) => toggleFavorite(null, name)}
              onClose={() => setSelectedGirl(null)}
            />
          )}
        </Suspense>

        {/* 6. Stadium Guide Modal with Suspense */}
        <Suspense fallback={null}>
          {isStadiumGuideOpen && (
            <StadiumGuideModal
              isOpen={isStadiumGuideOpen}
              onClose={() => setIsStadiumGuideOpen(false)}
              onSelectSeat={(seat) => {
                setAreaFilter(seat);
                setIsStadiumGuideOpen(false);
              }}
            />
          )}
        </Suspense>

        {/* 7. Share Schedule Modal (Lazy Loaded with Suspense) */}
        {isShareModalOpen && (
          <Suspense fallback={null}>
            <ShareScheduleModal
              isOpen={isShareModalOpen}
              onClose={() => setIsShareModalOpen(false)}
              selectedDate={selectedDate}
              favorites={favorites}
              allGirls={OFFICIAL_GIRLS}
              schedule={schedule}
              onShowToast={showToast}
              onToggleFavorite={(girlName) => toggleFavorite(null, girlName)}
              onNavigateToInstagram={() => {
                setIsShareModalOpen(false);
                setActiveTab('INSTAGRAM');
              }}
            />
          </Suspense>
        )}

        {/* 8. Light Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#1a0007] font-black text-xs sm:text-sm shadow-2xl border border-amber-300 ring-2 ring-amber-400/40 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-[#1a0007] flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </div>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <MainApp />
      </LanguageProvider>
    </ThemeProvider>
  );
};
