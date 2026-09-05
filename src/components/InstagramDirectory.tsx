import React, { useState, useMemo } from 'react';
import { ExternalLink, Copy, Check, Search, Heart } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { OFFICIAL_GIRLS } from '../data/girlsRoster';
import { GirlProfile } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'TAIWAN' | 'FOREIGN' | 'FAVORITES'>('ALL');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, text: string, key: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  const taiwanCount = useMemo(() => {
    return OFFICIAL_GIRLS.filter(g => g.nationality === 'TW').length;
  }, []);

  const foreignCount = useMemo(() => {
    return OFFICIAL_GIRLS.filter(g => g.nationality !== 'TW').length;
  }, []);

  const filteredGirls = useMemo(() => {
    let list = [...OFFICIAL_GIRLS];

    // Filter
    list = list.filter(girl => {
      // 1. Search
      const matchSearch =
        girl.name.toLowerCase().includes(search.toLowerCase()) ||
        (girl.nativeName && girl.nativeName.toLowerCase().includes(search.toLowerCase())) ||
        (girl.koreanName && girl.koreanName.toLowerCase().includes(search.toLowerCase())) ||
        girl.number.includes(search) ||
        (girl.instagramHandle && girl.instagramHandle.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

      // 2. Role / Category filter (方案 A：外援統合架構)
      if (roleFilter === 'TAIWAN') {
        return girl.nationality === 'TW';
      }
      if (roleFilter === 'FOREIGN') {
        return girl.nationality !== 'TW';
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
            <span>{t.igBannerBadge}</span>
          </span>
          <h2 className="text-xl sm:text-3xl font-black tracking-tight mb-1.5 sm:mb-2">
            {t.igBannerTitle}
          </h2>
          <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-normal">
            {t.igBannerDesc}
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
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white">
                Rakuten Girls 官方 Instagram
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/60 text-rkg-pink-deep dark:text-pink-300 text-[10px] font-extrabold border border-pink-200 dark:border-pink-800/60">
                Official
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              @rakuten_girls • 樂天桃猿棒球隊專屬啦啦隊
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="https://www.instagram.com/rakutengirls/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-sm transition active:scale-95"
          >
            <span>{t.followTeamIg}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
          <button
            onClick={(e) => handleCopy(e, '@rakuten_girls', 'official_ig')}
            className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition active:scale-95 ${
              copiedKey === 'official_ig'
                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                : 'bg-white dark:bg-oled-surface hover:bg-gray-50 dark:hover:bg-oled-elevated text-gray-700 dark:text-gray-200 border-gray-200 dark:border-oled-border'
            }`}
            title="複製球團 IG 帳號"
          >
            {copiedKey === 'official_ig' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.copied}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t.copyAccount}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. Search & Filter Bar (Stitch Idol Bloom Style) */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-9 pr-4 py-2 bg-pink-50/40 dark:bg-oled-surface hover:bg-pink-50/80 dark:hover:bg-oled-elevated focus:bg-white dark:focus:bg-oled-surface text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 rounded-xl border border-pink-200/80 dark:border-oled-border focus:border-rkg-pink focus:outline-none focus:ring-2 focus:ring-pink-200 dark:focus:ring-pink-900 transition"
          />
        </div>

        {/* Filters: 全部 / 台籍 / 外援 / 最愛 */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
          {/* 全部 */}
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              roleFilter === 'ALL'
                ? 'bg-gray-900 dark:bg-pink-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-oled-surface text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-oled-elevated'
            }`}
          >
            {t.filterAll} ({OFFICIAL_GIRLS.length})
          </button>

          {/* 台籍 (樂天粉紅/酒紅風格) */}
          <button
            onClick={() => setRoleFilter('TAIWAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              roleFilter === 'TAIWAN'
                ? 'bg-gradient-to-r from-rkg-pink to-rkg-pink-deep text-white shadow-pink-glow border border-pink-300 dark:border-pink-500'
                : 'bg-pink-50 dark:bg-pink-950/40 text-rkg-pink-deep dark:text-pink-300 hover:bg-pink-100 dark:hover:bg-pink-900/60 border border-pink-200 dark:border-pink-800/60'
            }`}
          >
            {t.filterTaiwan} ({taiwanCount})
          </button>

          {/* 外援 (星光紫羅蘭/靛藍風格，含韓籍與日籍) */}
          <button
            onClick={() => setRoleFilter('FOREIGN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
              roleFilter === 'FOREIGN'
                ? 'bg-gradient-to-r from-violet-500 to-indigo-600 text-white shadow-purple-glow border border-purple-300 dark:border-purple-500'
                : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60'
            }`}
          >
            {t.filterForeign} ({foreignCount})
          </button>

          {/* 最愛 */}
          <button
            onClick={() => setRoleFilter('FAVORITES')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 flex items-center gap-1 ${
              roleFilter === 'FAVORITES'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60'
            }`}
          >
            <Heart className={`w-3 h-3 ${favorites.length > 0 ? 'fill-rose-500' : ''}`} />
            <span>{t.filterFavorites} ({favorites.length})</span>
          </button>
        </div>
      </div>

      {/* 4. Girls IG Vertical Cards Grid (Stitch Idol Bloom Style) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {filteredGirls.map((girl) => {
          const isCopiedHandle = copiedKey === `handle_${girl.id}`;
          const isCopiedNative = copiedKey === `native_${girl.id}`;
          const isFav = favorites.includes(girl.name);
          const isKorean = girl.nationality === 'KR';
          const isJapanese = girl.nationality === 'JP';
          const isTaiwan = !girl.nationality || girl.nationality === 'TW';

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

                  {/* 1. 台籍成員標籤：湛藍/青海漸層 (不同於 IG 粉紫，體現青天白日之清爽湛藍風格) */}
                  {isTaiwan && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-black shadow-md tracking-wider">
                      {t.badgeTaiwan}
                    </div>
                  )}

                  {/* 2. 韓籍外援標籤：太極紅藍雙色漸層 (寶石深藍至緋紅赤色，獨立於 IG 粉紫) */}
                  {isKorean && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-600 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-black shadow-md tracking-wider">
                      {t.badgeKorean}
                    </div>
                  )}

                  {/* 3. 日籍外援標籤：日之丸烈焰赤紅漸層 (朱紅至赤紅寶石，獨立於 IG 粉紫) */}
                  {isJapanese && (
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-black shadow-md tracking-wider">
                      {t.badgeJapanese}
                    </div>
                  )}

                  {/* 球團職務標籤 (如總監、隊長等) */}
                  {girl.role && (
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-black shadow-sm">
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
                    {/* 原名或韓文名展示 */}
                    {(girl.nativeName || girl.koreanName) && (
                      <span className="text-xs font-bold text-pink-600 dark:text-pink-400">
                        {girl.nativeName || girl.koreanName}
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
                      title={t.openIg}
                    >
                      <span>{t.openIg}</span>
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
                      title={t.copyAccount}
                    >
                      {isCopiedHandle ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-[10px]">{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px] hidden sm:inline">{t.copyAccount}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* 韓籍成員原名複製按鈕 */}
                {isKorean && girl.koreanName && (
                  <button
                    onClick={(e) => handleCopy(e, girl.koreanName!, `native_${girl.id}`)}
                    className={`w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition active:scale-95 whitespace-nowrap overflow-hidden ${
                      isCopiedNative
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gradient-to-r from-purple-50 to-pink-50/60 dark:from-oled-surface dark:to-oled-elevated hover:from-purple-100 hover:to-pink-100 dark:hover:from-oled-elevated dark:hover:to-pink-950/40 text-purple-800 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60 shadow-sm'
                    }`}
                    title={`${t.copyKoreanName}：${girl.koreanName}`}
                  >
                    {isCopiedNative ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{t.copiedKoreanName} {girl.koreanName}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-purple-600 dark:text-purple-400 shrink-0" />
                        <span className="truncate">{t.copyKoreanName} {girl.koreanName}</span>
                      </>
                    )}
                  </button>
                )}

                {/* 日籍成員原名複製按鈕 */}
                {isJapanese && girl.nativeName && (
                  <button
                    onClick={(e) => handleCopy(e, girl.nativeName!, `native_${girl.id}`)}
                    className={`w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-[11px] font-bold border transition active:scale-95 whitespace-nowrap overflow-hidden ${
                      isCopiedNative
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400'
                        : 'bg-gradient-to-r from-rose-50 to-amber-50/60 dark:from-oled-surface dark:to-oled-elevated hover:from-rose-100 hover:to-amber-100 dark:hover:from-oled-elevated dark:hover:to-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-200/80 dark:border-rose-800/60 shadow-sm'
                    }`}
                    title={`${t.copyJapaneseName}：${girl.nativeName}`}
                  >
                    {isCopiedNative ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{t.copiedJapaneseName} {girl.nativeName}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
                        <span className="truncate">{t.copyJapaneseName} {girl.nativeName}</span>
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
