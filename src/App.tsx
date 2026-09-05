import React, { useEffect, useState, useMemo } from 'react';
import { Header } from './components/Header';
import { DataSourceBanner } from './components/DataSourceBanner';
import { FilterBar, AreaFilterType } from './components/FilterBar';
import { GirlCard } from './components/GirlCard';
import { GirlDetailDrawer } from './components/GirlDetailDrawer';
import { StadiumGuideModal } from './components/StadiumGuideModal';
import { InstagramDirectory } from './components/InstagramDirectory';
import { OFFICIAL_GIRLS } from './data/girlsRoster';
import { fetchLiveSchedule } from './services/sheetService';
import { GirlProfile, ScheduleDataset, DailyDuty } from './types/schedule';
import { Heart, Sparkles, AlertCircle } from 'lucide-react';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'INSTAGRAM'>('SCHEDULE');
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

    // Helper for special weekend zones
    const isSpecialStation = (d: DailyDuty) => {
      const specialKeys = ['大樂', '東R', '西R', '專區'];
      return specialKeys.includes(d.primaryArea) ||
        d.innings.some(inn => specialKeys.some(k => inn.location.includes(k)));
    };

    // 2. Area & Duty filter
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
    } else if (areaFilter === 'EAST') {
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && (d.primaryArea === '東區' || d.innings.some(inn => inn.location.includes('東') && !inn.location.includes('東R')));
        }
        return duties.some(d => d.primaryArea === '東區' || d.innings.some(inn => inn.location.includes('東') && !inn.location.includes('東R')));
      });
    } else if (areaFilter === 'WEST') {
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && (d.primaryArea === '西區' || d.innings.some(inn => inn.location.includes('西') && !inn.location.includes('西R')));
        }
        return duties.some(d => d.primaryArea === '西區' || d.innings.some(inn => inn.location.includes('西') && !inn.location.includes('西R')));
      });
    } else if (areaFilter === 'SPECIAL_ZONES') {
      list = list.filter(g => {
        const duties = schedule.girlsScheduleMap[g.name] || [];
        if (selectedDate) {
          const d = duties.find(item => item.date === selectedDate);
          return d && isSpecialStation(d);
        }
        return duties.some(isSpecialStation);
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-[#FFF8F8] via-[#FFF0F5]/40 to-[#FFF8F8]">
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
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'SCHEDULE' ? (
          <>
            {/* Banner Card */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rkg-crimson via-rkg-crimson-light to-rkg-pink p-6 sm:p-8 text-white mb-6 shadow-elevated">
              <div className="relative z-10 max-w-xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>2026 全猿主場 • 應援指南</span>
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
                  Rakuten Girls 樂天女孩 2026 班表
                </h2>
                <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-normal">
                  掌握女孩每場賽事的 1-3 局、中場表演與 7-8 局應援站位（一壘東區／三壘西區／假日大樂／R 舞台專區）。點擊卡片可查看個別出勤月曆與 Instagram！
                </p>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute right-20 -top-10 w-40 h-40 rounded-full bg-pink-300/20 blur-xl pointer-events-none" />
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
            <div className="flex items-center justify-between mb-4 px-1 text-xs text-gray-500 font-medium">
              <div>
                顯示結果：<strong>{filteredGirls.length}</strong> 位女孩
                {selectedDate && <span className="ml-1 text-rkg-pink-deep">（{selectedDate} 場次）</span>}
              </div>
              {favorites.length > 0 && areaFilter !== 'FAVORITES' && (
                <button
                  onClick={() => setAreaFilter('FAVORITES')}
                  className="text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                  <span>已收藏 {favorites.length} 位女孩</span>
                </button>
              )}
            </div>

            {/* Member Cards Grid */}
            {filteredGirls.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
                {filteredGirls.map((girl) => {
                  const duties = schedule.girlsScheduleMap[girl.name] || [];
                  const isFav = favorites.includes(girl.name);
                  return (
                    <GirlCard
                      key={girl.id}
                      girl={girl}
                      duties={duties}
                      selectedDate={selectedDate}
                      isFavorite={isFav}
                      onToggleFavorite={(e) => toggleFavorite(e, girl.name)}
                      onClick={(g) => setSelectedGirl(g)}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white/80 rounded-3xl border border-dashed border-pink-200 p-8 shadow-sm">
                <AlertCircle className="w-10 h-10 text-pink-300 mx-auto mb-3" />
                <h4 className="text-base font-bold text-gray-700 mb-1">找不到符合條件的女孩</h4>
                <p className="text-xs text-gray-400 mb-4">
                  請嘗試切換其他日期、清除搜尋文字或重設篩選標籤
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setAreaFilter('ALL');
                    setSelectedDate('');
                  }}
                  className="px-4 py-2 rounded-full text-xs font-bold bg-pink-100 text-rkg-pink-deep hover:bg-pink-200 transition"
                >
                  重設所有條件
                </button>
              </div>
            )}
          </>
        ) : (
          /* Instagram Directory View */
          <InstagramDirectory onSelectGirl={(g) => setSelectedGirl(g)} />
        )}
      </main>

      {/* 4. Footer */}
      <footer className="mt-12 bg-white border-t border-pink-100 text-center py-8 text-xs text-gray-500">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-gray-600">
            <a
              href="https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rkg-pink-deep transition"
            >
              Google 試算表班表
            </a>
            <span>•</span>
            <a
              href="https://monkeys.rakuten.com.tw/girls"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rkg-pink-deep transition"
            >
              樂天桃猿棒球隊官方網站
            </a>
            <span>•</span>
            <a
              href="https://www.instagram.com/rakutengirls/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rkg-pink-deep transition"
            >
              Rakuten Girls 官方 IG
            </a>
          </div>
          <p className="text-[11px] text-gray-400">
            本專案由粉絲應援所建立，所有肖像與商標權屬樂天桃猿棒球隊與 Rakuten 所有。班表資料即時連線公開 Google Sheet。
          </p>
        </div>
      </footer>

      {/* 5. Detail Drawer */}
      {selectedGirl && (
        <GirlDetailDrawer
          girl={selectedGirl}
          duties={schedule.girlsScheduleMap[selectedGirl.name] || []}
          isFavorite={favorites.includes(selectedGirl.name)}
          onToggleFavorite={(name) => toggleFavorite(null, name)}
          onClose={() => setSelectedGirl(null)}
        />
      )}

      {/* 6. Stadium Guide Modal */}
      <StadiumGuideModal
        isOpen={isStadiumGuideOpen}
        onClose={() => setIsStadiumGuideOpen(false)}
      />
    </div>
  );
};
