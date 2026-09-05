import React from 'react';
import { Search, Calendar, Heart, Compass, X, Sparkles } from 'lucide-react';

export type AreaFilterType = 'ALL' | 'ON_DUTY' | 'EAST' | 'WEST' | 'SPECIAL_ZONES' | 'FAVORITES';

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
  return (
    <div className="bg-white/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-card-soft border border-pink-100/80 mb-4 sm:mb-6 transition">
      {/* 1. Date Selector Tabs */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-pink-100/60 no-scrollbar">
        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 whitespace-nowrap pl-1 pr-2">
          <Calendar className="w-3.5 h-3.5 text-rkg-pink-deep" />
          <span>場次日期：</span>
        </div>

        <button
          onClick={() => onSelectDate('')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap ${
            selectedDate === ''
              ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-pink-glow'
              : 'bg-pink-50/70 text-gray-700 hover:bg-pink-100 border border-pink-200/60'
          }`}
        >
          全部場次總覽
        </button>

        {dates.map((d) => (
          <button
            key={d}
            onClick={() => onSelectDate(d)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap flex items-center gap-1 ${
              selectedDate === d
                ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-pink-glow'
                : 'bg-white text-gray-700 hover:bg-pink-50 border border-pink-200 shadow-sm'
            }`}
          >
            <span>{d}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              selectedDate === d ? 'bg-white/20 text-white' : 'bg-pink-100 text-rkg-pink-deep font-semibold'
            }`}>
              比賽日
            </span>
          </button>
        ))}
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
            placeholder="搜尋女孩姓名、背號（例如：筠熹、15、00）..."
            className="w-full pl-9 pr-9 py-2 bg-pink-50/40 hover:bg-pink-50/80 focus:bg-white text-sm text-gray-800 placeholder-gray-400 rounded-xl border border-pink-200/80 focus:border-rkg-pink focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Quick Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => onAreaFilterChange('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              areaFilter === 'ALL'
                ? 'bg-gray-800 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部 ({totalCount})
          </button>

          <button
            onClick={() => onAreaFilterChange('ON_DUTY')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
              areaFilter === 'ON_DUTY'
                ? 'bg-rkg-pink-deep text-white shadow-pink-glow'
                : 'bg-pink-50 text-rkg-pink-deep hover:bg-pink-100 border border-pink-200'
            }`}
          >
            <span>{selectedDate ? `${selectedDate} 有上班` : '有出勤'}</span>
          </button>

          <button
            onClick={() => onAreaFilterChange('EAST')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'EAST'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>東區</span>
          </button>

          <button
            onClick={() => onAreaFilterChange('WEST')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'WEST'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
            }`}
          >
            <Compass className="w-3 h-3" />
            <span>西區</span>
          </button>

          <button
            onClick={() => onAreaFilterChange('SPECIAL_ZONES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'SPECIAL_ZONES'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
            }`}
            title="包含大樂區、東R舞台、西R舞台、專區等假日特別席位"
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>大樂/R舞台/專區</span>
          </button>

          <button
            onClick={() => onAreaFilterChange('FAVORITES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              areaFilter === 'FAVORITES'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            <Heart className={`w-3 h-3 ${favoritesCount > 0 ? 'fill-rose-500' : ''}`} />
            <span>最愛 ({favoritesCount})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
