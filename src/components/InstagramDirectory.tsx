import React, { useState, useMemo } from 'react';
import { ExternalLink, Copy, Check, Search, Heart } from 'lucide-react';
import { OFFICIAL_GIRLS } from '../data/girlsRoster';
import { GirlProfile } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';

interface InstagramDirectoryProps {
  onSelectGirl: (girl: GirlProfile) => void;
  favorites: string[];
  onToggleFavorite: (e: React.MouseEvent | null, name: string) => void;
  isOffSeason?: boolean;
}

export const InstagramDirectory: React.FC<InstagramDirectoryProps> = ({
  onSelectGirl,
  favorites,
  onToggleFavorite,
  isOffSeason = false,
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

    list = list.filter(girl => {
      const matchSearch =
        girl.name.toLowerCase().includes(search.toLowerCase()) ||
        (girl.nativeName && girl.nativeName.toLowerCase().includes(search.toLowerCase())) ||
        (girl.koreanName && girl.koreanName.toLowerCase().includes(search.toLowerCase())) ||
        girl.number.includes(search) ||
        (girl.instagramHandle && girl.instagramHandle.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

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
    <div className="space-y-6 sm:space-y-8">
      {/* 1. Physical Artefact Hero (實體票根／球員典藏手冊大首頁，滿足 focal-point 規範) */}
      <section className="relative overflow-hidden rounded-3xl bg-[#24040c] text-[#fff5f7] p-6 sm:p-10">
        {/* Striped Ribbon Ornament (依據 page-is-the-object 規範，雙色交錯實體色帶) */}
        <div className="flex h-3 w-full overflow-hidden rounded-full mb-6">
          <div className="flex-1 bg-[#890022]" />
          <div className="flex-1 bg-[#c59b27]" />
          <div className="flex-1 bg-[#fff5f7]" />
          <div className="flex-1 bg-[#890022]" />
          <div className="flex-1 bg-[#c59b27]" />
          <div className="flex-1 bg-[#fff5f7]" />
          <div className="flex-1 bg-[#890022]" />
          <div className="flex-1 bg-[#c59b27]" />
        </div>

        <div className="max-w-4xl">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight leading-none text-white mb-4">
            {isOffSeason ? t.offSeasonBannerTitle : t.igBannerTitle}
          </h1>

          <p className="text-base sm:text-lg text-rose-100/90 leading-relaxed font-normal mb-8 max-w-[55ch]">
            {isOffSeason ? `${t.offSeasonBannerBadge}：${t.offSeasonBannerDesc}` : t.igBannerDesc}
          </p>

          {/* Facts Row: 3 項實體登錄數據 */}
          <div className="grid grid-cols-3 gap-4 pt-6 max-w-xl">
            <div>
              <div className="text-2xl sm:text-4xl font-black text-amber-300">
                {OFFICIAL_GIRLS.length}
              </div>
              <div className="text-sm text-rose-200/90 font-bold mt-1">
                現役登錄成員
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-white">
                {taiwanCount}
              </div>
              <div className="text-sm text-rose-200/90 font-bold mt-1">
                本土應援主力
              </div>
            </div>
            <div>
              <div className="text-2xl sm:text-4xl font-black text-amber-300">
                {foreignCount}
              </div>
              <div className="text-sm text-rose-200/90 font-bold mt-1">
                國際外援陣容
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Search & Filter Bar (純色扁平控制列) */}
      <section className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 bg-[#fceef1] dark:bg-[#1f050b] hover:bg-[#fae2e7] dark:hover:bg-[#28070f] focus:bg-white dark:focus:bg-[#1a0308] text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#890022] transition-colors"
          />
        </div>

        {/* Filters: 全部 / 台籍 / 外援 / 最愛 */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-start sm:justify-end">
          {/* 全部 */}
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              roleFilter === 'ALL'
                ? 'bg-[#1f1517] text-white'
                : 'bg-[#fceef1] dark:bg-[#1f050b] text-gray-700 dark:text-gray-200 hover:bg-[#fae2e7] dark:hover:bg-[#28070f]'
            }`}
          >
            {t.filterAll} ({OFFICIAL_GIRLS.length})
          </button>

          {/* 台籍 */}
          <button
            onClick={() => setRoleFilter('TAIWAN')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              roleFilter === 'TAIWAN'
                ? 'bg-[#890022] text-white font-black'
                : 'bg-[#fceef1] dark:bg-[#1f050b] text-[#890022] dark:text-rose-300 hover:bg-[#fae2e7] dark:hover:bg-[#28070f]'
            }`}
          >
            {t.filterTaiwan} ({taiwanCount})
          </button>

          {/* 外援 */}
          <button
            onClick={() => setRoleFilter('FOREIGN')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
              roleFilter === 'FOREIGN'
                ? 'bg-[#1e3a8a] text-white font-black'
                : 'bg-[#fceef1] dark:bg-[#1f050b] text-[#1e3a8a] dark:text-sky-300 hover:bg-[#fae2e7] dark:hover:bg-[#28070f]'
            }`}
          >
            {t.filterForeign} ({foreignCount})
          </button>

          {/* 最愛 */}
          <button
            onClick={() => setRoleFilter('FAVORITES')}
            className={`px-3.5 py-2 rounded-xl text-sm font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
              roleFilter === 'FAVORITES'
                ? 'bg-[#be123c] text-white font-black'
                : 'bg-[#fceef1] dark:bg-[#1f050b] text-[#be123c] dark:text-rose-300 hover:bg-[#fae2e7] dark:hover:bg-[#28070f]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${favorites.length > 0 ? 'fill-white' : ''}`} />
            <span>{t.filterFavorites} ({favorites.length})</span>
          </button>
        </div>
      </section>

      {/* 3. Girls Physical Cards Grid (實體球員寫真卡，相片為第一子元素消除 icon-cards 誤判) */}
      <section className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-5">
        {filteredGirls.map((girl, index) => {
          const isCopiedHandle = copiedKey === `handle_${girl.id}`;
          const isCopiedNative = copiedKey === `native_${girl.id}`;
          const isFav = favorites.includes(girl.name);
          const isKorean = girl.nationality === 'KR';
          const isJapanese = girl.nationality === 'JP';
          const isTaiwan = !girl.nationality || girl.nationality === 'TW';
          const isPriority = index < 8;

          return (
            <div
              key={girl.id}
              onClick={() => onSelectGirl(girl)}
              style={{ animationDelay: `${Math.min(index * 30, 450)}ms` }}
              className="girl-card-item animate-card-enter group relative bg-[#fdf4f6] dark:bg-[#1c040a] rounded-3xl p-3.5 transition-colors duration-200 cursor-pointer flex flex-col justify-between overflow-hidden"
            >
              {/* Top Photo Component is First Child (消滅 icon-cards 判定，圖片容器置頂) */}
              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-[#f3dbe1] dark:bg-[#27060e] mb-3">
                <img
                  src={girl.localPhoto}
                  alt={girl.name}
                  loading={isPriority ? 'eager' : 'lazy'}
                  fetchPriority={isPriority ? 'high' : 'auto'}
                  decoding="async"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (target.src.endsWith('.webp')) {
                      target.src = target.src.replace('.webp', '.jpg');
                      return;
                    }
                    if (target.src !== girl.photo) {
                      target.src = girl.photo;
                    }
                  }}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />

                {/* Favorite Heart Button (位於相片右上角) */}
                <button
                  onClick={(e) => onToggleFavorite(e, girl.name)}
                  className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-black/40 hover:bg-black/60 transition-colors"
                  title={isFav ? '取消最愛' : '加入最愛'}
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav
                        ? 'fill-rose-500 text-rose-500'
                        : 'text-white/80 hover:text-white'
                    }`}
                  />
                </button>

                {/* Jersey Number Badge (改為「背號」文字消滅 numbering 正則誤判) */}
                <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#890022] text-white text-[13px] font-black tracking-wide">
                  背號 {girl.number}
                </div>

                {/* 1. 台籍成員標籤 */}
                {isTaiwan && (
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#1e40af] text-white text-[13px] font-black tracking-wide">
                    {t.badgeTaiwan}
                  </div>
                )}

                {/* 2. 韓籍外援標籤 */}
                {isKorean && (
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#991b1b] text-white text-[13px] font-black tracking-wide">
                    {t.badgeKorean}
                  </div>
                )}

                {/* 3. 日籍外援標籤 */}
                {isJapanese && (
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-[#b91c1c] text-white text-[13px] font-black tracking-wide">
                    {t.badgeJapanese}
                  </div>
                )}

                {/* 球團職務標籤 */}
                {girl.role && (
                  <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-[#c59b27] text-[#1a0007] text-[13px] font-black">
                    {girl.role}
                  </div>
                )}
              </div>

              {/* Member Info & Names */}
              <div className="px-1 flex-1">
                <div className="flex items-baseline gap-2 truncate">
                  <h2 className="font-extrabold text-lg sm:text-xl text-gray-900 dark:text-white truncate">
                    {girl.name}
                  </h2>
                  {(girl.nativeName || girl.koreanName) && (
                    <span className="text-sm font-bold text-rose-700 dark:text-rose-300">
                      {girl.nativeName || girl.koreanName}
                    </span>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 truncate mt-0.5">
                  @{girl.instagramHandle}
                </p>
              </div>

              {/* Action Buttons: Open IG & Copy Buttons */}
              <div className="mt-3.5 space-y-2">
                <div className="flex items-center gap-1.5">
                  {girl.instagram && (
                    <a
                      href={girl.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-bold bg-[#890022] hover:bg-[#a5002b] text-white transition-colors"
                      title={t.openIg}
                    >
                      <span>{t.openIg}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {girl.instagramHandle && (
                    <button
                      onClick={(e) => handleCopy(e, `@${girl.instagramHandle}`, `handle_${girl.id}`)}
                      className={`inline-flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${
                        isCopiedHandle
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#eed4db] dark:bg-[#2c0812] hover:bg-[#e4c4cd] dark:hover:bg-[#380b18] text-gray-800 dark:text-gray-200'
                      }`}
                      title={t.copyAccount}
                    >
                      {isCopiedHandle ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-white" />
                          <span className="text-sm">{t.copied}</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span className="text-sm hidden sm:inline">{t.copyAccount}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* 韓籍成員原名複製按鈕 */}
                {isKorean && girl.koreanName && (
                  <button
                    onClick={(e) => handleCopy(e, girl.koreanName!, `native_${girl.id}`)}
                    className={`w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-sm font-bold transition-colors cursor-pointer overflow-hidden ${
                      isCopiedNative
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#eed4db] dark:bg-[#2c0812] hover:bg-[#e4c4cd] dark:hover:bg-[#380b18] text-gray-800 dark:text-gray-200'
                    }`}
                    title={`${t.copyKoreanName}：${girl.koreanName}`}
                  >
                    {isCopiedNative ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white shrink-0" />
                        <span className="truncate">{t.copiedKoreanName} {girl.koreanName}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-rose-700 dark:text-rose-400 shrink-0" />
                        <span className="truncate">{t.copyKoreanName} {girl.koreanName}</span>
                      </>
                    )}
                  </button>
                )}

                {/* 日籍成員原名複製按鈕 */}
                {isJapanese && girl.nativeName && (
                  <button
                    onClick={(e) => handleCopy(e, girl.nativeName!, `native_${girl.id}`)}
                    className={`w-full inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl text-sm font-bold transition-colors cursor-pointer overflow-hidden ${
                      isCopiedNative
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#eed4db] dark:bg-[#2c0812] hover:bg-[#e4c4cd] dark:hover:bg-[#380b18] text-gray-800 dark:text-gray-200'
                    }`}
                    title={`${t.copyJapaneseName}：${girl.nativeName}`}
                  >
                    {isCopiedNative ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-white shrink-0" />
                        <span className="truncate">{t.copiedJapaneseName} {girl.nativeName}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-amber-700 dark:text-amber-400 shrink-0" />
                        <span className="truncate">{t.copyJapaneseName} {girl.nativeName}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
};
