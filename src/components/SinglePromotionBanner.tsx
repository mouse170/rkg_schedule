import React, { useState } from 'react';
import { Play, Music, Sparkles, X, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { RAKUTEN_GIRLS_2026_SONG } from '../data/songData';

interface SinglePromotionBannerProps {
  onOpenModal: () => void;
}

const DISMISS_STORAGE_KEY = 'rkg_song_banner_dismissed_v1';

export const SinglePromotionBanner: React.FC<SinglePromotionBannerProps> = ({ onOpenModal }) => {
  const { t } = useLanguage();
  const [isDismissed, setIsDismissed] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDismissed(true);
    try {
      sessionStorage.setItem(DISMISS_STORAGE_KEY, 'true');
    } catch {
      // ignore
    }
  };

  if (isDismissed) {
    return null;
  }

  const youtubeThumb = `https://img.youtube.com/vi/${RAKUTEN_GIRLS_2026_SONG.youtubeId}/hqdefault.jpg`;

  return (
    <aside
      aria-label="2026 年度全新單曲宣傳"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#200008] via-[#3a0614] to-[#1a0006] text-white p-3 sm:p-4 mb-3 sm:mb-4 border border-rose-500/40 shadow-xl group transition-all duration-300 hover:border-amber-400/60"
    >
      {/* Background Ambient Glows */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-rose-600/25 blur-3xl pointer-events-none" />
      <div className="absolute right-1/3 -bottom-10 w-40 h-40 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
        {/* Left: Thumbnail & Song Info */}
        <div
          onClick={onOpenModal}
          className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto cursor-pointer flex-1 min-w-0"
        >
          {/* YouTube Thumbnail with Play Overlay */}
          <div className="relative w-20 h-14 sm:w-28 sm:h-18 rounded-2xl overflow-hidden flex-shrink-0 shadow-lg border border-rose-400/30 group-hover:scale-105 transition-transform duration-300 bg-neutral-900">
            <img
              src={youtubeThumb}
              alt={RAKUTEN_GIRLS_2026_SONG.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/20 transition-colors">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-md">
                <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white ml-0.5" />
              </div>
            </div>
            <span className="absolute bottom-1 right-1 bg-black/80 text-[8px] font-mono font-bold px-1 rounded text-white/90">
              MV
            </span>
          </div>

          {/* Texts */}
          <div className="flex flex-col min-w-0">
            <div className="flex items-center gap-1.5 mb-1 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] text-[10px] font-black shadow-xs tracking-wider uppercase">
                <Music className="w-2.5 h-2.5" />
                <span>{t.songPromoBadge}</span>
              </span>
              <span className="text-[10px] text-amber-300/80 font-bold hidden sm:inline flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                <span>Rakuten Girls</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white tracking-tight truncate group-hover:text-amber-200 transition-colors">
              {RAKUTEN_GIRLS_2026_SONG.title}
            </h3>
            <p className="text-[11px] text-rose-200/80 font-medium truncate">
              {t.songPromoSubtitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-shrink-0">
          <button
            type="button"
            onClick={onOpenModal}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-black bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            <span>{t.songWatchMv}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            title={t.songCloseBanner}
            aria-label={t.songCloseBanner}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
