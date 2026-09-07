import React from 'react';
import { Search, Calendar, Heart, Compass, X, Sparkles, Flame } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getRelativeDateInfo } from '../utils/dateUtils';

export type AreaFilterType =
  | 'ALL'
  | 'PERIOD_13'
  | 'PERIOD_78'
  | 'PERIOD_MID'
  | 'FAVORITES';

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
  favoritesCount
}) => {
  const { language, t } = useLanguage();

  return (
    <div className="bg-white/90 dark:bg-oled-card/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-card-soft dark:shadow-card-oled border border-pink-100/80 dark:border-oled-border mb-4 sm:mb-6 transition">
      {/* 1. Date Selector Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-pink-100/60 dark:border-oled-border no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 dark:text-gray-400 whitespace-nowrap pl-1 pr-2">
          <Calendar className="w-3.5 h-3.5 text-rkg-pink-deep dark:text-rkg-pink" />
          <span>{t.tabSchedule}：</span>
        </div>

        <button
          onClick={() => onSelectDate('')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
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

          // 樣式區分：今天（特別醒目紅色光暈）、明天／後天／本週幾
          let buttonClass = 'bg-pink-50 dark:bg-oled-surface text-gray-700 dark:text-gray-300 hover:bg-pink-100 dark:hover:bg-oled-elevated';
          let badgeClass = 'bg-pink-100 dark:bg-pink-950/80 text-rkg-pink-deep dark:text-pink-300 font-semibold';

          if (isSelected) {
            if (rel.isToday) {
              buttonClass = 'bg-gradient-to-r from-rose-600 via-pink-600 to-rkg-crimson text-white shadow-pink-glow ring-2 ring-pink-400/50 animate-pulse';
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
              badgeClass = 'bg-amber-200/80 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 font-bold';
            } else if (rel.isThisWeek) {
              buttonClass = 'bg-blue-50/60 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 border border-blue-200/70 dark:border-blue-800/50 hover:bg-blue-100/70';
              badgeClass = 'bg-blue-100 dark:bg-blue-900/70 text-blue-800 dark:text-blue-200 font-semibold';
            }
          }

          return (
            <button
              key={d}
              onClick={() => onSelectDate(d)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 ${buttonClass}`}
            >
              {rel.isToday && <Flame className="w-3 h-3 text-amber-300 animate-bounce" />}
              <span>{d}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${badgeClass}`}>
                {rel.badgeText}
              </span>
            </button>
          );
        })}
      </div>

      {/* 2. Search & Filter Tags Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t.searchSchedulePlaceholder}
            className="w-full pl-9 pr-9 py-2 bg-pink-50/40 dark:bg-oled-surface hover:bg-pink-50/80 dark:hover:bg-oled-elevated focus:bg-white dark:focus:bg-oled-surface text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 rounded-xl border border-pink-200/80 dark:border-oled-border focus:border-rkg-pink focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Pills (依時段與局數區分) */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* 全部女孩 */}
          <button
            onClick={() => onAreaFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              areaFilter === 'ALL'
                ? 'bg-gray-800 dark:bg-pink-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-oled-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-oled-elevated'
            }`}
          >
            {t.areaAll} ({totalCount})
          </button>

          {/* 1-3 局站位 (採用中性專業天青石灰藍，避免佔用東區一壘深藍) */}
          <button
            onClick={() => onAreaFilterChange('PERIOD_13')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'PERIOD_13'
                ? 'bg-gradient-to-r from-sky-600 to-slate-700 text-white shadow-sm'
                : 'bg-sky-50 dark:bg-sky-950/40 text-sky-800 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>{t.filterPeriod13}</span>
          </button>

          {/* 7-8 局站位 (採用紫羅蘭色，避免佔用西區三壘草綠) */}
          <button
            onClick={() => onAreaFilterChange('PERIOD_78')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'PERIOD_78'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-800 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>{t.filterPeriod78}</span>
          </button>

          {/* 中場表演 */}
          <button
            onClick={() => onAreaFilterChange('PERIOD_MID')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'PERIOD_MID'
                ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>{t.filterPeriodMid}</span>
          </button>

          {/* 最愛 */}
          <button
            onClick={() => onAreaFilterChange('FAVORITES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'FAVORITES'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <Heart className={`w-3 h-3 ${favoritesCount > 0 ? 'fill-rose-500' : ''}`} />
            <span>{t.filterFavorites} ({favoritesCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
