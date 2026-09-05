import React, { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { Header } from './components/Header';
import { DataSourceBanner } from './components/DataSourceBanner';
import { FilterBar, AreaFilterType } from './components/FilterBar';
import { GirlCard } from './components/GirlCard';
import { OFFICIAL_GIRLS } from './data/girlsRoster';
import { fetchLiveSchedule } from './services/sheetService';
import { GirlProfile, ScheduleDataset } from './types/schedule';
import { Language } from './i18n/translations';
import { Heart, Sparkles, AlertCircle, Globe, Loader2 } from 'lucide-react';

// Code Splitting via React.lazy for Non-initial View Components
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
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'INSTAGRAM'>('INSTAGRAM');
  const [schedule, setSchedule] = useState<ScheduleDataset>({
    dates: [],
    girlsScheduleMap: {},
    dailyRosterMap: {},
    lastUpdated: '載入中...',
    isLive: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [areaFilter, setAreaFilter] = useState<AreaFilterType>('ALL');
  const [selectedGirl, setSelectedGirl] = useState<GirlProfile | null>(null);
  const [isStadiumGuideOpen, setIsStadiumGuideOpen] = useState<boolean>(false);

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

  // Load schedule data
  const loadSchedule = async () => {
    setIsLoading(true);
    try {
      const data = await fetchLiveSchedule();
      setSchedule(data);
      // If dates exist and no date selected, default to first upcoming match
      if (data.dates.length > 0 && !selectedDate) {
        setSelectedDate(data.dates[0]);
      }
    } catch (err) {
      console.error('Error fetching live schedule:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

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
    } else if (areaFilter === 'ON_DUTY') {
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          return duties.some(d => d.date === selectedDate);
        }
        return duties.length > 0;
      });
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
    }

    // 3. Sorting: Favorites first, then on duty for selected date, then by jersey number
    list.sort((a, b) => {
      const aFav = favorites.includes(a.name) ? 1 : 0;
      const bFav = favorites.includes(b.name) ? 1 : 0;
      if (aFav !== bFav) return bFav - aFav;

      const aDuties = schedule.girlsScheduleMap[a.name] || [];
      const bDuties = schedule.girlsScheduleMap[b.name] || [];

      const aOnDuty = selectedDate ? aDuties.some(d => d.date === selectedDate) : aDuties.length > 0;
      const bOnDuty = selectedDate ? bDuties.some(d => d.date === selectedDate) : bDuties.length > 0;

      if (aOnDuty !== bOnDuty) return (bOnDuty ? 1 : 0) - (aOnDuty ? 1 : 0);

      // number sort
      const numA = parseInt(a.number, 10) || 999;
      const numB = parseInt(b.number, 10) || 999;
      return numA - numB;
    });

    return list;
  }, [searchQuery, areaFilter, selectedDate, favorites, schedule]);

  // Grouping helper function to determine a girl's station area for non-mid contexts
  const getGirlStationGroup = (girl: GirlProfile): 'EAST' | 'WEST' | 'SPECIAL' | 'OFF_DUTY' => {
    const duties = schedule.girlsScheduleMap[girl.name] || [];
    const duty = selectedDate ? duties.find(d => d.date === selectedDate) : duties[0];
    if (!duty || duty.innings.length === 0) return 'OFF_DUTY';

    // 依篩選時段或當日首要時段取得站位
    let targetInning = duty.innings[0];
    if (areaFilter === 'PERIOD_13') {
      targetInning = duty.innings.find(i => i.period.includes('1-3')) || targetInning;
    } else if (areaFilter === 'PERIOD_78') {
      targetInning = duty.innings.find(i => i.period.includes('7-8')) || targetInning;
    }

    const loc = targetInning.location || '';
    if (loc.includes('東R') || loc.includes('西R') || loc.includes('大樂') || loc.includes('專區')) {
      return 'SPECIAL';
    }
    if (loc.includes('東')) {
      return 'EAST';
    }
    if (loc.includes('西')) {
      return 'WEST';
    }
    return 'SPECIAL';
  };

  interface GroupSection {
    key: string;
    title: string;
    badgeStyle: string;
    girls: GirlProfile[];
    favCount: number;
    date?: string;
    emptyNotice?: string;
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
    const sortGirlsInGroup = (list: GirlProfile[]) => {
      list.sort((a, b) => {
        const aFav = favorites.includes(a.name) ? 1 : 0;
        const bFav = favorites.includes(b.name) ? 1 : 0;
        if (aFav !== bFav) return bFav - aFav;
        const numA = parseInt(a.number, 10) || 999;
        const numB = parseInt(b.number, 10) || 999;
        return numA - numB;
      });
    };

    // A. 中場表演專屬分組邏輯 (PERIOD_MID)
    if (areaFilter === 'PERIOD_MID') {
      const targetDates = selectedDate ? [selectedDate] : schedule.dates;
      const midSections: GroupSection[] = [];

      targetDates.forEach(date => {
        const eastGirls: GirlProfile[] = [];
        const westGirls: GirlProfile[] = [];
        const stageGirls: GirlProfile[] = [];

        filteredGirls.forEach(girl => {
          const duties = schedule.girlsScheduleMap[girl.name] || [];
          const duty = duties.find(d => d.date === date);
          if (!duty) return;

          const midInning = duty.innings.find(i => i.period.includes('中場') && i.location.trim().length > 0);
          if (!midInning) return;

          const loc = midInning.location;
          if (loc.includes('東R') || loc.includes('西R') || loc.includes('舞台') || loc.includes('專區')) {
            stageGirls.push(girl);
          } else if (loc.includes('東')) {
            eastGirls.push(girl);
          } else if (loc.includes('西')) {
            westGirls.push(girl);
          } else {
            stageGirls.push(girl);
          }
        });

        sortGirlsInGroup(eastGirls);
        sortGirlsInGroup(westGirls);
        sortGirlsInGroup(stageGirls);

        // 當日中場表演 (東區前)
        if (eastGirls.length > 0) {
          midSections.push({
            key: `MID_${date}_EAST`,
            title: `${date} ${t.groupTitleMidEast}`,
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
            title: `${date} ${t.groupTitleMidWest}`,
            badgeStyle: 'from-emerald-600 to-teal-600 text-white shadow-sm',
            girls: westGirls,
            favCount: countFavs(westGirls),
            date
          });
        }

        // 當日中場表演 (應援舞台/專區)
        if (stageGirls.length > 0) {
          midSections.push({
            key: `MID_${date}_STAGE`,
            title: `${date} ${t.groupTitleMidStage}`,
            badgeStyle: 'from-amber-500 to-orange-500 text-white shadow-sm',
            girls: stageGirls,
            favCount: countFavs(stageGirls),
            date
          });
        }
      });

      // 如果選定特定日期，但當日無中場表演 (例如 9/2)
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

    // B. 一般時段與站位分組邏輯 (ALL, ON_DUTY, PERIOD_13, PERIOD_78, FAVORITES)
    const groups: Record<'EAST' | 'WEST' | 'SPECIAL' | 'OFF_DUTY', GirlProfile[]> = {
      EAST: [],
      WEST: [],
      SPECIAL: [],
      OFF_DUTY: []
    };

    filteredGirls.forEach(girl => {
      const gType = getGirlStationGroup(girl);
      groups[gType].push(girl);
    });

    // 每組內部排序：最愛優先，再依背號大小
    Object.keys(groups).forEach(k => {
      const key = k as keyof typeof groups;
      sortGirlsInGroup(groups[key]);
    });

    // 預設區域排序權重 (相同最愛數時，東優先：EAST 0, WEST 1, SPECIAL 2, OFF_DUTY 3)
    const basePriority: Record<'EAST' | 'WEST' | 'SPECIAL' | 'OFF_DUTY', number> = {
      EAST: 0,
      WEST: 1,
      SPECIAL: 2,
      OFF_DUTY: 3
    };

    const sectionMeta: GroupSection[] = [
      {
        key: 'EAST',
        title: t.groupTitleEast,
        badgeStyle: 'from-blue-600 to-indigo-600 text-white shadow-sm',
        girls: groups.EAST,
        favCount: countFavs(groups.EAST)
      },
      {
        key: 'WEST',
        title: t.groupTitleWest,
        badgeStyle: 'from-emerald-600 to-teal-600 text-white shadow-sm',
        girls: groups.WEST,
        favCount: countFavs(groups.WEST)
      },
      {
        key: 'SPECIAL',
        title: t.groupTitleSpecial,
        badgeStyle: 'from-amber-500 to-orange-500 text-white shadow-sm',
        girls: groups.SPECIAL,
        favCount: countFavs(groups.SPECIAL)
      },
      {
        key: 'OFF_DUTY',
        title: t.groupTitleOffDuty,
        badgeStyle: 'from-gray-500 to-gray-600 text-white shadow-sm',
        girls: groups.OFF_DUTY,
        favCount: countFavs(groups.OFF_DUTY)
      }
    ];

    const activeSections = sectionMeta.filter(s => s.girls.length > 0);

    // 區域排序依據：
    // 1. 有上班之應援區域 (EAST, WEST, SPECIAL) 永遠優先於未排班／休假 (OFF_DUTY)
    // 2. 最愛數量多的在最上面
    // 3. 最愛數量相同時東區優先 (EAST > WEST > SPECIAL)
    activeSections.sort((a, b) => {
      const aIsOff = a.key === 'OFF_DUTY';
      const bIsOff = b.key === 'OFF_DUTY';
      if (aIsOff !== bIsOff) {
        return aIsOff ? 1 : -1;
      }

      if (b.favCount !== a.favCount) {
        return b.favCount - a.favCount;
      }
      return (basePriority[a.key as keyof typeof basePriority] ?? 99) - (basePriority[b.key as keyof typeof basePriority] ?? 99);
    });

    return activeSections;
  }, [filteredGirls, favorites, selectedDate, areaFilter, schedule, t]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8F8] via-[#FFF0F5]/40 to-[#FFF8F8] dark:from-black dark:via-black dark:to-black text-gray-900 dark:text-gray-100 transition-colors duration-200">
        {/* 1. Header */}
        <Header
          activeTab={activeTab}
          onTabChange={setActiveTab}
          lastUpdated={schedule.lastUpdated}
          isLive={schedule.isLive}
          isLoading={isLoading}
          onRefresh={loadSchedule}
          onOpenStadiumGuide={() => setIsStadiumGuideOpen(true)}
        />

        {/* 2. Data Source Notice Banner */}
        <DataSourceBanner />

        {/* 3. Main Content Container */}
        <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6">
          {activeTab === 'SCHEDULE' ? (
            <>
              {/* Banner Card (Compact) */}
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rkg-crimson via-rkg-crimson-light to-rkg-pink py-3 px-4 sm:py-3.5 sm:px-5 text-white mb-3 sm:mb-4 shadow-sm">
                <div className="relative z-10">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] sm:text-[11px] font-bold">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      <span>{t.bannerBadge}</span>
                    </span>
                    <h2 className="text-sm sm:text-base font-black tracking-tight">
                      {t.bannerTitle}
                    </h2>
                  </div>
                  <p className="text-[11px] sm:text-xs text-pink-100/90 leading-relaxed font-normal">
                    {t.bannerDesc}
                  </p>
                </div>
                <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
                <div className="absolute right-16 -top-8 w-32 h-32 rounded-full bg-pink-300/20 blur-lg pointer-events-none" />
              </div>

              {/* Filter Controls */}
              <FilterBar
                dates={schedule.dates}
                selectedDate={selectedDate}
                onSelectDate={setSelectedDate}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                areaFilter={areaFilter}
                onAreaFilterChange={setAreaFilter}
                totalCount={OFFICIAL_GIRLS.length}
                favoritesCount={favorites.length}
              />

              {/* Active Filter Summary Hint */}
              <div className="flex items-center justify-between mb-4 px-1 text-xs text-gray-500 dark:text-gray-400 font-medium">
                <div>
                  {t.filterCountSummary.replace('{count}', String(filteredGirls.length))}
                  {selectedDate && <span className="ml-1 text-rkg-pink-deep dark:text-pink-400">（{selectedDate}）</span>}
                </div>
                {favorites.length > 0 && areaFilter !== 'FAVORITES' && (
                  <button
                    onClick={() => setAreaFilter('FAVORITES')}
                    className="text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                    <span>{t.filterFavorites} ({favorites.length})</span>
                  </button>
                )}
              </div>

              {/* Grouped Member Cards by Station Area */}
              {groupedSections.length > 0 ? (
                <div className="space-y-8">
                  {groupedSections.map((sec) => (
                    <section key={sec.key} className="space-y-3.5">
                      {/* Section Header */}
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

                      {/* Cards Grid or Section Empty Notice */}
                      {sec.girls.length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
                          {sec.girls.map((girl, idx) => {
                            const duties = schedule.girlsScheduleMap[girl.name] || [];
                            const isFav = favorites.includes(girl.name);
                            return (
                              <GirlCard
                                key={girl.id}
                                girl={girl}
                                duties={duties}
                                selectedDate={sec.date || selectedDate}
                                isFavorite={isFav}
                                onToggleFavorite={(e) => toggleFavorite(e, girl.name)}
                                onClick={(g) => setSelectedGirl(g)}
                                priority={idx < 8}
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
              duties={schedule.girlsScheduleMap[selectedGirl.name] || []}
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
            />
          )}
        </Suspense>
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
