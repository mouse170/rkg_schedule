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
    <div className="glass-nav rounded-2xl p-2.5 sm:p-3.5 shadow-bento dark:shadow-bento-dark border border-border/70 mb-3 sm:mb-4 transition">
      {/* 1. Date Selector Tabs (Horizontal Scroll Rail) */}
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto pb-2 mb-2.5 border-b border-border/50 no-scrollbar">
        <div className="flex items-center gap-1 text-[11px] font-bold text-muted-foreground whitespace-nowrap pl-0.5 pr-1">
          <Calendar className="w-3 h-3 text-primary" />
          <span>{t.tabSchedule}：</span>
        </div>

        <button
          onClick={() => onSelectDate('')}
          className={`px-2.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap active:scale-95 ${
            selectedDate === ''
              ? 'bg-primary text-primary-foreground shadow-sm'
              : 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {t.areaAll}
        </button>

        {dates.map((d) => {
          const rel = getRelativeDateInfo(d, language);
          const isSelected = selectedDate === d;

          let buttonClass = 'bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground';
          let badgeClass = 'bg-background/80 text-foreground font-semibold';

          if (isSelected) {
            if (rel.isToday) {
              buttonClass = 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/40 animate-pulse font-black';
              badgeClass = 'bg-white/20 text-white font-black';
            } else {
              buttonClass = 'bg-primary text-primary-foreground shadow-sm font-bold';
              badgeClass = 'bg-white/20 text-white font-bold';
            }
          } else {
            if (rel.isToday) {
              buttonClass = 'bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800/80 hover:bg-rose-500/20 shadow-sm';
              badgeClass = 'bg-rose-600 text-white font-black';
            } else if (rel.isTomorrow || rel.isDayAfterTomorrow) {
              buttonClass = 'bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-300/80 dark:border-amber-800/60 hover:bg-amber-500/20';
              badgeClass = 'bg-amber-400 text-amber-950 font-bold';
            } else if (rel.isThisWeek) {
              buttonClass = 'bg-blue-500/10 text-blue-900 dark:text-blue-200 border border-blue-300/70 dark:border-blue-800/50 hover:bg-blue-500/20';
              badgeClass = 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 font-semibold';
            }
          }

          return (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              className={`px-2.5 py-1 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1 active:scale-95 ${buttonClass}`}
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

      {/* 2. Dual-Mode Segmented Control (Lovable Tactile Pill) */}
      <div className="grid grid-cols-2 p-1 bg-muted/70 rounded-xl mb-2 gap-1 border border-border/40">
        <button
          onClick={handleSwitchToInningMode}
          className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 active:scale-[0.98] ${
            !isSeatMode
              ? 'bg-background text-primary shadow-sm ring-1 ring-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t.filterModeInning}</span>
        </button>

        <button
          onClick={handleSwitchToSeatMode}
          className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition flex items-center justify-center gap-1.5 active:scale-[0.98] ${
            isSeatMode
              ? 'bg-background text-primary shadow-sm ring-1 ring-border/80'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>{t.filterModeSeat}</span>
        </button>
      </div>

      {/* 3. Compact Inline Search Bar */}
      <div className="relative mb-2">
        <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchSchedulePlaceholder}
          className="w-full pl-8 pr-8 py-1.5 bg-muted/40 hover:bg-muted/60 focus:bg-background text-xs sm:text-sm text-foreground placeholder-muted-foreground rounded-xl border border-border/70 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/40 transition"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded-full"
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
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 active:scale-95 ${
                areaFilter === 'ALL'
                  ? 'bg-primary text-primary-foreground shadow-sm ring-1 ring-primary/40'
                  : 'bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/60'
              }`}
            >
              {t.areaAll} ({totalCount})
            </button>

            {/* 1-3 局 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_13' ? 'ALL' : 'PERIOD_13')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 active:scale-95 ${
                areaFilter === 'PERIOD_13'
                  ? 'bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-sm ring-1 ring-sky-300/50'
                  : 'bg-sky-500/10 text-sky-800 dark:text-sky-300 hover:bg-sky-500/20 border border-sky-300/60 dark:border-sky-800/60'
              }`}
            >
              <Compass className="w-3 h-3 flex-shrink-0" />
              <span>{t.filterPeriod13}</span>
            </button>

            {/* 中場表演 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_MID' ? 'ALL' : 'PERIOD_MID')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 active:scale-95 ${
                areaFilter === 'PERIOD_MID'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm ring-1 ring-amber-300/50'
                  : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-300/60 dark:border-amber-800/60'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
              <span>{t.filterPeriodMid}</span>
            </button>

            {/* 7-8 局 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_78' ? 'ALL' : 'PERIOD_78')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 active:scale-95 ${
                areaFilter === 'PERIOD_78'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm ring-1 ring-purple-300/50'
                  : 'bg-purple-500/10 text-purple-800 dark:text-purple-300 hover:bg-purple-500/20 border border-purple-300/60 dark:border-purple-800/60'
              }`}
            >
              <Compass className="w-3 h-3 flex-shrink-0" />
              <span>{t.filterPeriod78}</span>
            </button>

            {/* 最愛 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'FAVORITES' ? 'ALL' : 'FAVORITES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap flex-shrink-0 flex items-center gap-1 active:scale-95 ${
                areaFilter === 'FAVORITES'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-sm ring-1 ring-rose-300/50'
                  : 'bg-rose-500/10 text-rose-600 dark:text-rose-300 hover:bg-rose-500/20 border border-rose-300/60 dark:border-rose-800/60'
              }`}
            >
              <Heart className={`w-3 h-3 flex-shrink-0 ${favoritesCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
              <span>{t.filterFavorites} ({favoritesCount})</span>
            </button>
          </>
        ) : (
          /* Mode B: 依座位視角看 */
          <>
            {/* 一壘東區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_EAST' ? 'ALL' : 'SEAT_EAST')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                areaFilter === 'SEAT_EAST'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm ring-1 ring-blue-300/50'
                  : 'bg-blue-500/10 text-blue-700 dark:text-blue-300 hover:bg-blue-500/20 border border-blue-300/60 dark:border-blue-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <span>{t.seatEastZoneShort}</span>
            </button>

            {/* 三壘西區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_WEST' ? 'ALL' : 'SEAT_WEST')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                areaFilter === 'SEAT_WEST'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-sm ring-1 ring-emerald-300/50'
                  : 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 border border-emerald-300/60 dark:border-emerald-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{t.seatWestZoneShort}</span>
            </button>

            {/* 大樂放鬆專區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_DALE' ? 'ALL' : 'SEAT_DALE')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                areaFilter === 'SEAT_DALE'
                  ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-sm ring-1 ring-violet-300/50'
                  : 'bg-violet-500/10 text-violet-700 dark:text-violet-300 hover:bg-violet-500/20 border border-violet-300/60 dark:border-violet-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-violet-500 flex-shrink-0" />
              <span>{t.seatDaLeZoneShort}</span>
            </button>

            {/* 走道 東R 舞台 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_EAST_R' ? 'ALL' : 'SEAT_EAST_R')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                areaFilter === 'SEAT_EAST_R'
                  ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md ring-1 ring-cyan-300/50'
                  : 'bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-500/20 border border-cyan-300/60 dark:border-cyan-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
              <span>{t.seatEastRZoneShort}</span>
            </button>

            {/* 走道 西R 舞台 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_WEST_R' ? 'ALL' : 'SEAT_WEST_R')}
              className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 active:scale-95 ${
                areaFilter === 'SEAT_WEST_R'
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-700 text-white shadow-sm ring-1 ring-teal-300/50'
                  : 'bg-teal-500/10 text-teal-800 dark:text-teal-300 hover:bg-teal-500/20 border border-teal-300/60 dark:border-teal-800/60'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
              <span>{t.seatWestRZoneShort}</span>
            </button>
          </>
        )}
      </div>

      {/* 5. Micro-metadata Bar (即時微型統計與重設按鈕) */}
      <div className="mt-2 pt-2 border-t border-border/50 flex items-center justify-between text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1 font-medium">
          <span>
            {t.filterCountSummary.replace('{count}', String(filteredCount ?? totalCount))}
          </span>
          {selectedDate && (
            <span className="text-primary font-bold">
              • {selectedDate}
            </span>
          )}
        </div>

        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-primary hover:underline font-bold transition active:scale-95"
          >
            <RotateCcw className="w-3 h-3" />
            <span>{t.resetFilters}</span>
          </button>
        )}
      </div>
    </div>
  );
};
