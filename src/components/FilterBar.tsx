import React from 'react';
import { Search, Calendar, Heart, Compass, X, Sparkles, Flame, MapPin, RotateCcw, LayoutGrid, Table2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getRelativeDateInfo } from '../utils/dateUtils';
import { isSpicyCoolSweetDate } from '../data/spicyCoolSweetData';

export type SeatFilterType =
  | 'SEAT_EAST'
  | 'SEAT_WEST'
  | 'SEAT_ZONE'
  | 'SEAT_DALE'
  | 'SEAT_EAST_R'
  | 'SEAT_WEST_R';

export type AreaFilterType =
  | 'ALL'
  | 'PERIOD_13'
  | 'PERIOD_78'
  | 'PERIOD_MID'
  | 'PERIOD_POST'
  | 'FAVORITES'
  | SeatFilterType;

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
  viewMode?: 'CARD' | 'MATRIX';
  onViewModeChange?: (mode: 'CARD' | 'MATRIX') => void;
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
  onResetFilters,
  viewMode = 'CARD',
  onViewModeChange
}) => {
  const { language, t } = useLanguage();

  const isSeatMode = areaFilter.startsWith('SEAT_');
  const hasThemeSchedule = dates.some(d => isSpicyCoolSweetDate(d));
  const hasRegularSchedule = dates.some(d => !isSpicyCoolSweetDate(d));
  const isThemeDate = selectedDate ? isSpicyCoolSweetDate(selectedDate) : hasThemeSchedule;
  const isRegularDate = selectedDate ? !isSpicyCoolSweetDate(selectedDate) : hasRegularSchedule;

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
    <div className="bg-[#fff8fa] dark:bg-[#180307] rounded-2xl p-3 sm:p-4 mb-3 sm:mb-4 transition-colors">
      {/* 1. Date Selector Tabs (Horizontal Scroll Rail) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2.5 mb-2.5 no-scrollbar">
        <div className="flex items-center gap-1 text-xs font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap pl-0.5 pr-1">
          <Calendar className="w-3.5 h-3.5 text-[#890022]" />
          <span>{t.tabSchedule}：</span>
        </div>

        <button
          onClick={() => onSelectDate('')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
            selectedDate === ''
              ? 'bg-[#890022] text-white'
              : 'bg-pink-100/70 dark:bg-[#25050c] text-gray-800 dark:text-gray-200 hover:bg-pink-200/80'
          }`}
        >
          {t.areaAll}
        </button>

        {dates.map((d) => {
          const rel = getRelativeDateInfo(d, language);
          const isSelected = selectedDate === d;

          let buttonClass = 'bg-pink-100/70 dark:bg-[#25050c] text-gray-800 dark:text-gray-200 hover:bg-pink-200/80';
          let badgeClass = 'bg-pink-200 dark:bg-pink-950 text-rose-900 dark:text-pink-200 font-semibold';

          if (isSelected) {
            buttonClass = 'bg-[#890022] text-white font-black';
            badgeClass = 'bg-white/20 text-white font-bold';
          } else {
            if (rel.isToday) {
              buttonClass = 'bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold';
              badgeClass = 'bg-rose-600 text-white font-black';
            } else if (rel.isTomorrow || rel.isDayAfterTomorrow) {
              buttonClass = 'bg-amber-100/80 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200';
              badgeClass = 'bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-bold';
            } else if (rel.isThisWeek) {
              buttonClass = 'bg-blue-100/80 dark:bg-blue-950/40 text-blue-950 dark:text-blue-200';
              badgeClass = 'bg-blue-200 dark:bg-blue-900 text-blue-950 dark:text-blue-100 font-semibold';
            }
          }

          return (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${buttonClass}`}
            >
              {rel.isToday && <Flame className="w-3.5 h-3.5 text-amber-500" />}
              <span>{d}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${badgeClass}`}>
                {rel.badgeText}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Dual-Mode Segmented Control & View Mode Switcher */}
      <div className="flex items-center gap-2 mb-2">
        <div className="flex-1 grid grid-cols-2 p-1 bg-pink-100/70 dark:bg-oled-surface rounded-xl gap-1">
          <button
            onClick={handleSwitchToInningMode}
            className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              !isSeatMode
                ? 'bg-[#890022] text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>{t.filterModeInning}</span>
          </button>

          <button
            onClick={handleSwitchToSeatMode}
            className={`py-1.5 px-2 rounded-lg text-xs font-extrabold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
              isSeatMode
                ? 'bg-[#890022] text-white'
                : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t.filterModeSeat}</span>
          </button>
        </div>

        {/* View Mode Toggle: Card List vs Matrix View */}
        {onViewModeChange && (
          <div className="flex items-center p-1 bg-pink-100/70 dark:bg-oled-surface rounded-xl gap-1 flex-shrink-0">
            <button
              onClick={() => onViewModeChange('CARD')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'CARD'
                  ? 'bg-[#890022] text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="卡片列表視圖"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">列表</span>
            </button>

            <button
              onClick={() => onViewModeChange('MATRIX')}
              className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg text-xs font-extrabold transition-colors flex items-center gap-1 cursor-pointer ${
                viewMode === 'MATRIX'
                  ? 'bg-[#c59b27] text-[#1a0007] font-black'
                  : 'text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
              title="看台輪替矩陣視圖"
            >
              <Table2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">矩陣</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. Compact Inline Search Bar */}
      <div className="relative mb-2">
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t.searchSchedulePlaceholder}
          className="w-full pl-8 pr-8 py-2 bg-pink-100/50 dark:bg-oled-surface hover:bg-pink-100/80 focus:bg-white dark:focus:bg-oled-surface text-xs sm:text-sm text-gray-800 dark:text-gray-100 placeholder-gray-500 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#890022] transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-full cursor-pointer"
            title="清除搜尋"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 4. Single-Row Horizontal Scrollable Chip Rail */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {!isSeatMode ? (
          /* Mode A: 依比賽局數看 */
          <>
            {/* 全部女孩 */}
            <button
              onClick={() => onAreaFilterChange('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex-shrink-0 cursor-pointer ${
                areaFilter === 'ALL'
                  ? 'bg-[#890022] text-white'
                  : 'bg-pink-100/70 dark:bg-oled-surface text-gray-800 dark:text-gray-200 hover:bg-pink-200/80'
              }`}
            >
              {t.areaAll} ({totalCount})
            </button>

            {/* 1-3 局 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_13' ? 'ALL' : 'PERIOD_13')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1 cursor-pointer ${
                areaFilter === 'PERIOD_13'
                  ? 'bg-[#1e40af] text-white'
                  : 'bg-blue-100/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 hover:bg-blue-200/70'
              }`}
            >
              <Compass className="w-3 h-3 flex-shrink-0" />
              <span>{t.filterPeriod13}</span>
            </button>

            {/* 中場表演 */}
            {isRegularDate && (
              <button
                onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_MID' ? 'ALL' : 'PERIOD_MID')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1 cursor-pointer ${
                  areaFilter === 'PERIOD_MID'
                    ? 'bg-[#c59b27] text-[#1a0007] font-black'
                    : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-200/70'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-500 flex-shrink-0" />
                <span>{t.filterPeriodMid}</span>
              </button>
            )}

            {/* 7-8 局 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_78' ? 'ALL' : 'PERIOD_78')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1 cursor-pointer ${
                areaFilter === 'PERIOD_78'
                  ? 'bg-[#890022] text-white'
                  : 'bg-pink-100/70 dark:bg-[#25050c] text-rose-900 dark:text-pink-300 hover:bg-pink-200/80'
              }`}
            >
              <Compass className="w-3 h-3 flex-shrink-0" />
              <span>{t.filterPeriod78}</span>
            </button>

            {/* 賽後表演 */}
            {isThemeDate && (
              <button
                onClick={() => onAreaFilterChange(areaFilter === 'PERIOD_POST' ? 'ALL' : 'PERIOD_POST')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1 cursor-pointer ${
                  areaFilter === 'PERIOD_POST'
                    ? 'bg-[#890022] text-white font-black'
                    : 'bg-rose-100/70 dark:bg-rose-950/40 text-rose-900 dark:text-pink-200 hover:bg-rose-200/80'
                }`}
              >
                <Sparkles className="w-3 h-3 text-amber-300 flex-shrink-0" />
                <span>{t.filterPeriodPost}</span>
              </button>
            )}

            {/* 最愛 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'FAVORITES' ? 'ALL' : 'FAVORITES')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex-shrink-0 flex items-center gap-1 cursor-pointer ${
                areaFilter === 'FAVORITES'
                  ? 'bg-[#be123c] text-white font-black'
                  : 'bg-rose-100/70 dark:bg-rose-950/40 text-rose-900 dark:text-rose-300 hover:bg-rose-200/80'
              }`}
            >
              <Heart className={`w-3 h-3 flex-shrink-0 ${favoritesCount > 0 ? 'fill-white' : ''}`} />
              <span>{t.filterFavorites} ({favoritesCount})</span>
            </button>
          </>
        ) : (
          /* Mode B: 依座位視角看 */
          <>
            {/* 一壘東區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_EAST' ? 'ALL' : 'SEAT_EAST')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                areaFilter === 'SEAT_EAST'
                  ? 'bg-[#1e40af] text-white'
                  : 'bg-blue-100/70 dark:bg-blue-950/40 text-blue-900 dark:text-blue-300 hover:bg-blue-200/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
              <span>{t.seatEastZoneShort}</span>
            </button>

            {/* 三壘西區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_WEST' ? 'ALL' : 'SEAT_WEST')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                areaFilter === 'SEAT_WEST'
                  ? 'bg-[#047857] text-white'
                  : 'bg-emerald-100/70 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 hover:bg-emerald-200/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0" />
              <span>{t.seatWestZoneShort}</span>
            </button>

            {/* 專區應援 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_ZONE' ? 'ALL' : 'SEAT_ZONE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                areaFilter === 'SEAT_ZONE'
                  ? 'bg-[#c59b27] text-[#1a0007] font-black'
                  : 'bg-amber-100/70 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-200/70'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
              <span>{t.seatSpecialZoneShort}</span>
            </button>

            {/* 大樂放鬆專區 */}
            <button
              onClick={() => onAreaFilterChange(areaFilter === 'SEAT_DALE' ? 'ALL' : 'SEAT_DALE')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                areaFilter === 'SEAT_DALE'
                  ? 'bg-[#1f1517] text-white font-black'
                  : 'bg-pink-100/70 dark:bg-oled-surface text-gray-800 dark:text-gray-200 hover:bg-pink-200/80'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
              <span>{t.seatDaLeZoneShort}</span>
            </button>

            {/* 走道 東R 舞台 */}
            {!isThemeDate && (
              <button
                onClick={() => onAreaFilterChange(areaFilter === 'SEAT_EAST_R' ? 'ALL' : 'SEAT_EAST_R')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  areaFilter === 'SEAT_EAST_R'
                    ? 'bg-[#0e7490] text-white font-black'
                    : 'bg-cyan-100/70 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-300 hover:bg-cyan-200/70'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />
                <span>{t.seatEastRZoneShort}</span>
              </button>
            )}

            {/* 走道 西R 舞台 */}
            {!isThemeDate && (
              <button
                onClick={() => onAreaFilterChange(areaFilter === 'SEAT_WEST_R' ? 'ALL' : 'SEAT_WEST_R')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 cursor-pointer ${
                  areaFilter === 'SEAT_WEST_R'
                    ? 'bg-[#0f766e] text-white font-black'
                    : 'bg-teal-100/70 dark:bg-teal-950/40 text-teal-900 dark:text-teal-300 hover:bg-teal-200/70'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-teal-500 flex-shrink-0" />
                <span>{t.seatWestRZoneShort}</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* 5. Micro-metadata Bar */}
      <div className="mt-2.5 pt-2 flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-1 font-medium">
          <span>
            {t.filterCountSummary.replace('{count}', String(filteredCount ?? totalCount))}
          </span>
          {selectedDate && (
            <span className="text-[#890022] dark:text-pink-300 font-bold">
              • {selectedDate}
            </span>
          )}
        </div>

        {hasActiveFilters && onResetFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-[#890022] dark:text-rose-300 hover:underline font-bold transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t.resetFilters}</span>
          </button>
        )}
      </div>
    </div>
  );
};
