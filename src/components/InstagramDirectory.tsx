import React, { useState, useMemo } from 'react';
import { ExternalLink, Copy, Check, Search, Heart } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { OFFICIAL_GIRLS } from '../data/girlsRoster';
import { GirlProfile } from '../types/schedule';

interface InstagramDirectoryProps {
  onSelectGirl: (girl: GirlProfile) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent | null, name: string) => void;
}

export const InstagramDirectory: React.FC<InstagramDirectoryProps> = ({
  onSelectGirl,
  favorites,
  onToggleFavorite
}) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'KOREAN' | 'LOCAL' | 'FAVORITES'>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, key: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const filteredGirls = useMemo(() => {
    let list = [...OFFICIAL_GIRLS];

    // Filter
    list = list.filter(girl => {
      // 1. Search
      const matchSearch =
        girl.name.toLowerCase().includes(search.toLowerCase()) ||
        (girl.koreanName && girl.koreanName.toLowerCase().includes(search.toLowerCase())) ||
        girl.number.includes(search) ||
        (girl.instagramHandle && girl.instagramHandle.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

      // 2. Role / Category filter
      const isKorean = Boolean(girl.koreanName);
      if (roleFilter === 'KOREAN') {
        return isKorean;
      }
      if (roleFilter === 'LOCAL') {
        return !isKorean;
      }
      if (roleFilter === 'FAVORITES') {
        return favorites.includes(girl.name);
      }
      return true;
    });

    // Favorites sorted first, then number
    list.sort((a, b) => {
      const favA = favorites.includes(a.name) ? 1 : 0;
      const favB = favorites.includes(b.name) ? 1 : 0;
      if (favA !== favB) return favB - favA;

      const numA = parseInt(a.number, 10) || 999;
      const numB = parseInt(b.number, 10) || 999;
      return numA - numB;
    });

    return list;
  }, [search, roleFilter, favorites]);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rkg-crimson p-4 sm:p-7 text-white shadow-elevated">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] sm:text-xs font-bold mb-2 sm:mb-3">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Rakuten Girls 官方社群目錄</span>
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-1.5 sm:mb-2">
            樂天女孩全體成員 IG 目錄
          </h2>
          <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-normal">
            收錄樂天桃猿啦啦隊全體 27 位現役成員之官方 Instagram 帳號。直立卡片一鍵快速開啟與複製帳號，點擊肖像即可查看上班班表！
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Official Team Account Card */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 dark:from-oled-surface dark:via-oled-card dark:to-oled-surface border border-purple-200/80 dark:border-oled-border rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center text-white flex-shrink-0">
            <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-gray-900 dark:text-white text-sm sm:text-base truncate">
                Rakuten Girls 官方 Instagram
              </h3>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 flex-shrink-0">
                球團官方
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium truncate">
              @rakutengirls • 掌握最新應援活動與賽事公告
            </p>
          </div>
        </div>

        <a
          href="https://www.instagram.com/rakutengirls/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 whitespace-nowrap"
        >
          <span>追蹤球團官方 IG</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 3. Search & Filter Controls */}
      <div className="bg-white/90 dark:bg-oled-card/90 backdrop-blur-md rounded-2xl p-3 sm:p-4 shadow-card-soft dark:shadow-card-oled border border-pink-100 dark:border-oled-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋姓名、背號或 IG 帳號..."
            className="w-full pl-9 pr-4 py-2 bg-pink-50/40 dark:bg-oled-surface hover:bg-pink-50/80 dark:hover:bg-oled-elevated focus:bg-white dark:focus:bg-oled-surface text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 rounded-xl border border-pink-200/80 dark:border-oled-border focus:border-rkg-pink focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              roleFilter === 'ALL'
                ? 'bg-gray-900 dark:bg-pink-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-oled-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-oled-elevated'
            }`}
          >
            全部 ({OFFICIAL_GIRLS.length})
          </button>
          <button
            onClick={() => setRoleFilter('KOREAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              roleFilter === 'KOREAN'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60'
            }`}
          >
            韓籍外援 (5)
          </button>
          <button
            onClick={() => setRoleFilter('LOCAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              roleFilter === 'LOCAL'
                ? 'bg-rkg-pink-deep text-white shadow-sm'
                : 'bg-pink-50 dark:bg-pink-950/40 text-rkg-pink-deep dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/60 border border-pink-200 dark:border-pink-800/60'
            }`}
          >
            本隊成員 ({OFFICIAL_GIRLS.length - 5})
          </button>
          <button
            onClick={() => setRoleFilter('FAVORITES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1 ${
              roleFilter === 'FAVORITES'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <Heart className={`w-3 h-3 ${favorites.length > 0 ? 'fill-rose-500' : ''}`} />
            <span>最愛 ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* 4. Girls IG Vertical Cards Grid (Stitch Idol Bloom Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {filteredGirls.map((girl) => {
          const isCopiedHandle = copiedKey === `handle_${girl.id}`;
          const isCopiedKorean = copiedKey === `korean_${girl.id}`;
          const isFav = favorites.includes(girl.name);
          const isKorean = Boolean(girl.koreanName);

          return (
            <div
              key={girl.id}
              onClick={() => onSelectGirl(girl)}
              className="group relative bg-white dark:bg-oled-card rounded-3xl p-3 sm:p-3.5 shadow-card-soft dark:shadow-card-oled hover:shadow-pink-glow dark:hover:shadow-pink-glow-oled border border-pink-100/90 dark:border-oled-border hover:border-rkg-pink/50 dark:hover:border-rkg-pink transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-[0.98]"
            >
              {/* Favorite Heart Button */}
              <button
                onClick={(e) => onToggleFavorite(e, girl.name)}
                className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-oled-surface/90 backdrop-blur-sm shadow-sm hover:scale-110 active:scale-95 transition"
                title={isFav ? '取消最愛' : '加入最愛'}
              >
                <Heart
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition ${
                    isFav
                      ? 'fill-rose-500 text-rose-500 animate-heart-pulse'
                      : 'text-gray-300 dark:text-gray-600 hover:text-rose-400'
                  }`}
                />
              </button>

              {/* Portrait & Badges */}
              <div>
                <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100/50 dark:from-oled-surface dark:to-oled-card mb-2.5 sm:mb-3">
                  <img
                    src={girl.localPhoto}
                    alt={girl.name}
                    loading="lazy"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== girl.photo) {
                        target.src = girl.photo;
                      }
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />

                  {/* Jersey Number Badge */}
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rkg-crimson/95 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-black tracking-wider shadow-sm flex items-center gap-0.5">
                    <span>#</span>
                    <span>{girl.number}</span>
                  </div>

                  {/* Korean or Role Badge */}
                  {isKorean && (
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-extrabold shadow-sm flex items-center gap-1">
                      <span>韓援</span>
                      <span className="opacity-90 font-medium">| {girl.koreanName}</span>
                    </div>
                  )}
                  {girl.role && (
                    <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-black shadow-sm">
                      {girl.role}
                    </div>
                  )}
                </div>

                {/* Member Info */}
                <div className="px-0.5">
                  <div className="flex items-baseline gap-1.5 truncate">
                    <h4 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-rkg-pink-deep dark:group-hover:text-rkg-pink transition">
                      {girl.name}
                    </h4>
                    {girl.koreanName && (
                      <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                        {girl.koreanName}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] sm:text-xs font-semibold text-purple-700 dark:text-purple-300 truncate mt-0.5">
                    @{girl.instagramHandle}
                  </p>
                </div>
              </div>

              {/* Action Buttons: Open IG & Copy Buttons */}
              <div className="mt-3 pt-2.5 border-t border-pink-50 dark:border-oled-border space-y-1.5">
                <div className="flex items-center gap-1.5">
                  {girl.instagram && (
                    <a
                      href={girl.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm transition active:scale-95"
                      title="開啟官方 IG 頁面"
                    >
                      <span>開啟 IG</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  )}

                  {girl.instagramHandle && (
                    <button
                      onClick={(e) => handleCopy(e, `@${girl.instagramHandle}`, `handle_${girl.id}`)}
                      className={`inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition ${
                        isCopiedHandle
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                          : 'bg-pink-50/70 dark:bg-oled-surface hover:bg-pink-100 dark:hover:bg-oled-elevated text-gray-600 dark:text-gray-300 border-pink-100 dark:border-oled-border'
                      }`}
                      title="複製 IG 帳號"
                    >
                      {isCopiedHandle ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px]">已複製</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px] hidden sm:inline">帳號</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Dedicated Korean Name Copy Button (Only for Korean members) */}
                {girl.koreanName && (
                  <button
                    onClick={(e) => handleCopy(e, girl.koreanName!, `korean_${girl.id}`)}
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition active:scale-95 ${
                      isCopiedKorean
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50/60 dark:from-oled-surface dark:to-oled-elevated hover:from-purple-100 hover:to-pink-100 dark:hover:from-oled-elevated dark:hover:to-pink-950/40 text-purple-800 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60 shadow-sm'
                    }`}
                    title={`複製韓文名字：${girl.koreanName}`}
                  >
                    {isCopiedKorean ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span>已複製韓文名（{girl.koreanName}）</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        <span>複製韓文名（{girl.koreanName}）</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
