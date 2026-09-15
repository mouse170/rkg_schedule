import React from 'react';
import { Search, Calendar, Heart, Compass, X, Sparkles, Flame, MapPin, RotateCcw } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getRelativeDateInfo } from '../utils/dateUtils';

export type AreaFilterType =
  | 'ALL'
  | 'PERIOD_13'
  | 'PERIOD_78'
  | 'PERIOD_MID'
  | 'FAVORITES'
  | 'SEAT_EAST'
  | 'SEAT_WEST'
  | 'SEAT_DALE'
  | 'SEAT_EAST_R'
  | 'SEAT_WEST_R';

interface FilterBarProps {
  dates: string[];
  selectedDate: string;
  onSelectDate: (date: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  areaFilter: AreaFilterType;
  onAreaFilterChange: (filter: AreaFilterType) => void;
  totalCount: number;
  favoritesCount: number;
  filteredCount?: number;
  onResetFilters?: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  dates,
  selectedDate,
  onSelectDate,
  searchQuery,
  onSearchChange,
  areaFilter,
  onAreaFilterChange,
  totalCount,
  favoritesCount,
  filteredCount,
  onResetFilters
}) => {
  const { language, t } = useLanguage();

  const isSeatMode = areaFilter.startsWith('SEAT_');

  // 切換至局數模式
  const handleSwitchToInningMode = () => {
    if (isSeatMode) {
      onAreaFilterChange('ALL');
    }
  };

  // 切換至座位視角模式
  const handleSwitchToSeatMode = () => {
    if (!isSeatMode) {
      onAreaFilterChange('SEAT_EAST');
    }
  };

  // 判斷是否有套用非預設的篩選條件
  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' ||
    areaFilter !== 'ALL' ||
    selectedDate !== ''
  );

  return (
    <div className="bg-white/90 dark:bg-oled-card/90 backdrop-blur-md rounded-2xl p-2.5 sm:p-3.5 shadow-card-soft dark:shadow-card-oled border border-pink-100/80 dark:border-oled-border mb-3 sm:mb-4 transition">
      {/* 1. Date Selector Tabs (Horizontal Scroll Rail) */}
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-2 mb-2.5 border-b border-pink-100/60 dark:border-oled-border no-scrollbar">
        <div className="flex items-center gap-1 text-[11px] font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap pl-0.5 pr-1">
          <Calendar className="w-3 h-3 text-rkg-pink-deep dark:text-rkg-pink" />
          <span>{t.tabSchedule}：</span>
        </div>

        <button
          onClick={() => onSelectDate('')}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap ${
            selectedDate === ''
              ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-pink-glow'
              : 'bg-pink-50 dark:bg-oled-surface text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-oled-elevated'
          }`}
        >
          {t.areaAll}
        </button>

        {dates.map((d) => {
          const rel = getRelativeDateInfo(d, language);
          const isSelected = selectedDate === d;

          let buttonClass = 'bg-pink-50 dark:bg-oled-surface text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-oled-elevated';
          let badgeClass = 'bg-pink-100 dark:bg-pink-950/80 text-rkg-pink-deep dark:text-pink-300 font-semibold';

          if (isSelected) {
            if (rel.isToday) {
              buttonClass = 'bg-gradient-to-r from-rose-600 via-pink-600 to-rkg-crimson text-white shadow-pink-glow ring-1.5 ring-pink-400/50 animate-pulse';
              badgeClass = 'bg-white/25 text-white font-black';
            } else {
              buttonClass = 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-pink-glow';
              badgeClass = 'bg-white/20 text-white font-bold';
            }
          } else {
            if (rel.isToday) {
              buttonClass = 'bg-gradient-to-r from-rose-50 to-pink-100/70 dark:from-pink-950/40 dark:to-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 hover:bg-rose-100 shadow-sm';
              badgeClass = 'bg-rose-600 text-white font-black';
            } else if (rel.isTomorrow || rel.isDayAfterTomorrow) {
              buttonClass = 'bg-amber-50/70 dark:bg-amber-950/30 text-amber-900 dark:text-amber-200 border border-amber-200/80 dark:border-amber-800/60 hover:bg-amber-100/80';
              badgeClass = 'bg-amber-200/80 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold';
            } else if (rel.isThisWeek) {
              buttonClass = 'bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border border-blue-200/70 dark:border-blue-800/50 hover:bg-blue-100/70';
              badgeClass = 'bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 font-semibold';
            }
          }

          return (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${buttonClass}`}
            >
              {rel.isToday && <Flame className="w-3 h-3 text-amber-300 animate-bounce" />}
              <span>{d}</span>
              <span className={`text-[9px] px-1 py-0.2 rounded-full ${badgeClass}`}>
                {rel.badgeText}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Dual-Mode Segmented Control (Idol Bloom Tactile Pill) */}
      <div className="grid grid-cols-2 p-1 bg-pink-100/60 dark:bg-oled-surface rounded-xl mb-2 gap-1">
        <button
          onClick={handleSwitchToInningMode}
          className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
            !isSeatMode
              ? 'bg-white dark:bg-oled-card text-rkg-crimson dark:text-pink-400 shadow-sm ring-1 ring-pink-200 dark:ring-oled-border'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t.filterModeInning}</span>
        </button>

        <button
          onClick={handleSwitchToSeatMode}
          className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 ${
            isSeatMode
              ? 'bg-white dark:bg-oled-card text-rkg-crimson dark:text-pink-400 shadow-sm ring-1 ring-pink-200 dark:ring-oled-border'
              : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t.filterModeSeat}</span>
        </button>
      </div>

      {/* 3. Compact Inline Search Bar */}
      <div className="relative mb-2">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchSchedulePlaceholder}
          className="w-full pl-8 pr-8 py-1.5 bg-pink-50/30 dark:bg-oled-surface hover:bg-pink-50/70 dark:hover:bg-oled-elevated focus:bg-white dark:focus:bg-oled-surface text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 rounded-xl border border-pink-200/70 dark:border-oled-border focus:border-rkg-pink focus:outline-none focus:ring-1 focus:ring-pink-300 dark:focus:ring-pink-900 transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-full"
            title="清除搜尋"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4. Single-Row Horizontal Scrollable Chip Rail (依分段動態渲染) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {!isSeatMode ? (
          /* Mode A: 依比賽局數看 */
          <>
            {/* 全部女孩 */}
            <button
              onClick={() => onAreaFilterChange('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 ${
                areaFilter === 'ALL'
                  ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-sm ring-1 ring-pink-300/50'
                  : 'bg-pink-50 dark:bg-oled-surface text-gray-600 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-oled-elevated border border-pink-100 dark:border-oled-border'
              }`}
            >
              {t.areaAll} ({totalCount})
            </button>

            {/* 1-3 局 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_13' ? 'ALL' : 'PERIOD_13')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
                areaFilter === 'PERIOD_13'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm ring-1 ring-sky-300/50'
                  : 'bg-sky-50/80 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200/80 dark:border-sky-800/60'
              }`}
            >
              <Compass className="w-3 h-3 flex-shrink-0" />
              <span>{t.filterPeriod13}</span>
            </button>

            {/* 中場表演 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_MID' ? 'ALL' : 'PERIOD_MID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
                areaFilter === 'PERIOD_MID'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm ring-1 ring-amber-300/50'
                  : 'bg-amber-50/80 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800/60'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>{t.filterPeriodMid}</span>
            </button>

            {/* 7-8 局 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_78' ? 'ALL' : 'PERIOD_78')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
                areaFilter === 'PERIOD_78'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm ring-1 ring-purple-300/50'
                  : 'bg-purple-50/80 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200/80 dark:border-purple-800/60'
              }`}
            >
              <Compass className="w-3 h-3 flex-shrink-0" />
              <span>{t.filterPeriod78}</span>
            </button>

            {/* 最愛 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'FAVORITES' ? 'ALL' : 'FAVORITES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 ${
                areaFilter === 'FAVORITES'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm ring-1 ring-rose-300/50'
                  : 'bg-rose-50/80 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200/80 dark:border-rose-800/60'
              }`}
            >
              <Heart className={`w-3 h-3 flex-shrink-0 ${favoritesCount > 0 ? 'fill-rose-500' : ''}`} />
              <span>{t.filterFavorites} ({favoritesCount})</span>
            </button>
          </>
        ) : (
          /* Mode B: 依座位視角看 */
          <>
            {/* 一壘東區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_EAST' ? 'ALL' : 'SEAT_EAST')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                areaFilter === 'SEAT_EAST'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-blue-300/50'
                  : 'bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50 border border-blue-200/80 dark:border-blue-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <span>{t.seatEastZoneShort}</span>
            </button>

            {/* 三壘西區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_WEST' ? 'ALL' : 'SEAT_WEST')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                areaFilter === 'SEAT_WEST'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-300/50'
                  : 'bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200/80 dark:border-emerald-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{t.seatWestZoneShort}</span>
            </button>

            {/* 大樂放鬆專區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_DALE' ? 'ALL' : 'SEAT_DALE')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                areaFilter === 'SEAT_DALE'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm ring-1 ring-violet-300/50'
                  : 'bg-violet-50/80 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200/80 dark:border-violet-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
              <span>{t.seatDaLeZoneShort}</span>
            </button>

            {/* 走道 東R 舞台 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_EAST_R' ? 'ALL' : 'SEAT_EAST_R')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                areaFilter === 'SEAT_EAST_R'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md ring-1 ring-cyan-300/50'
                  : 'bg-cyan-50/80 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/50 border border-cyan-200/80 dark:border-cyan-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
              <span>{t.seatEastRZoneShort}</span>
            </button>

            {/* 走道 西R 舞台 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_WEST_R' ? 'ALL' : 'SEAT_WEST_R')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                areaFilter === 'SEAT_WEST_R'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-sm ring-1 ring-teal-300/50'
                  : 'bg-teal-50/80 dark:bg-teal-950/40 text-teal-800 dark:text-teal-300 hover:bg-teal-100 dark:hover:bg-teal-900/50 border border-teal-200/80 dark:border-teal-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
              <span>{t.seatWestRZoneShort}</span>
            </button>
          </>
        )}
      </div>

      {/* 5. Micro-metadata Bar (即時微型統計與重設按鈕) */}
      <div className="mt-2 pt-2 border-t border-pink-100/60 dark:border-oled-border flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
        <div className="flex items-center gap-1 font-medium">
          <span>
            {t.filterCountSummary.replace('{count}', String(filteredCount ?? totalCount))}
          </span>
          {selectedDate && (
            <span className="text-rkg-pink-deep dark:text-pink-400 font-bold">
              • {selectedDate}
            </span>
          )}
        </div>

        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-rkg-crimson dark:text-pink-400 hover:underline font-bold transition active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetFilters}</span>
          </button>
        )}
      </div>
    </div>
  );
};
