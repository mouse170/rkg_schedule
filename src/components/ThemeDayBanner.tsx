import React, { useState, useEffect } from 'react';
import { Sparkles, X, CheckCircle2, Store, HelpCircle, Layers } from 'lucide-react';
import { PreMatchActivityModal } from './PreMatchActivityModal';
import { GirlProfile } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';

interface ThemeDayBannerProps {
  selectedDate: string;
  onSelectDate?: (date: string) => void;
  allGirls?: GirlProfile[];
  favorites?: string[];
  onSelectGirl?: (girl: GirlProfile) => void;
  onOpenStadiumGuide?: () => void;
}

export const ThemeDayBanner: React.FC<ThemeDayBannerProps> = ({
  selectedDate,
  onSelectDate,
  allGirls = [],
  favorites = [],
  onSelectGirl,
  onOpenStadiumGuide
}) => {
  const { t } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPreMatchModalOpen, setIsPreMatchModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<'9/19' | '9/20'>(selectedDate === '9/20' ? '9/20' : '9/19');

  const activeDateKey = selectedDate === '9/20' ? '9/20' : '9/19';

  // 提前於瀏覽器背景靜態預載入主題日大圖，開窗即刻 0 延遲秒開
  useEffect(() => {
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    preload('./theme/spicy_cool_sweet_banner.webp');
    preload('./theme/spicy_cool_sweet_court_map.webp');
    preload('./theme/spicy_cool_sweet_booth_map.webp');
    preload('./theme/spicy_cool_sweet_booth_map.jpg');
  }, []);

  const handlePreloadModalImages = () => {
    const preload = (src: string) => {
      const img = new Image();
      img.src = src;
    };
    preload('./theme/spicy_cool_sweet_banner.webp');
    preload('./theme/spicy_cool_sweet_court_map.webp');
    preload('./theme/spicy_cool_sweet_booth_map.webp');
    preload('./theme/spicy_cool_sweet_booth_map.jpg');
  };

  return (
    <>
      {/* 1. Theatrical Velvet Crimson & Gold Banner with Light/Dark Adaptive Colors */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff0f4] via-[#ffe8ec] to-[#fff3e8] dark:from-[#1a0007] dark:via-[#4d0913] dark:to-[#7f0d1b] p-4 sm:p-5 text-slate-800 dark:text-white mb-3 sm:mb-4 shadow-lg shadow-rose-900/5 dark:shadow-xl border border-rose-300/80 dark:border-amber-500/40 ring-1 ring-rose-200 dark:ring-amber-400/20 transition-colors duration-300">
        {/* Decorative Gold Inlay Accents */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-400/15 dark:bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-rose-500/15 dark:bg-rose-600/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] text-[11px] font-black shadow-sm tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#1a0007] fill-[#1a0007]" />
                <span>辣酷甜 THEME DAY</span>
              </span>

              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-rose-200/70 dark:bg-white/10 text-rose-900 dark:text-pink-100 border border-rose-300/80 dark:border-transparent">
                {selectedDate}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-base sm:text-xl font-black text-[#890022] dark:text-amber-100 tracking-tight flex items-center gap-2">
              <span>辣酷甜主題日 ‧ 看台專區寵粉應援</span>
            </h2>

            {/* Inning Rules Subtitle */}
            <p className="text-[11px] sm:text-xs text-rose-950/80 dark:text-amber-200/90 leading-relaxed font-medium max-w-2xl">
              1、2、3、7、8 局專區女孩全程於專屬看台寵粉應援 ‧ 賽前攤位簽名會熱烈展開
            </p>
          </div>

          {/* Action Trigger Buttons in ONE unified row & Visual Badge Thumbnail */}
          <div className="flex items-center gap-1.5 sm:gap-2 w-full xl:w-auto overflow-x-auto no-scrollbar pt-2.5 xl:pt-0 border-t xl:border-t-0 border-rose-200/80 dark:border-amber-500/20">
            {/* 1. 席位說明 (Stadium Guide) */}
            {onOpenStadiumGuide && (
              <button
                onClick={onOpenStadiumGuide}
                className="flex-1 sm:flex-initial px-2.5 sm:px-3 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 bg-white/90 hover:bg-white dark:bg-[#25030a] dark:hover:bg-[#380611] text-rose-900 dark:text-amber-200 border border-rose-200/80 dark:border-amber-500/30 shadow-sm active:scale-95 whitespace-nowrap flex-shrink-0 cursor-pointer"
                title={t.stadiumGuideBtn}
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-600 dark:text-amber-400" />
                <span>{t.stadiumGuideBtn}</span>
              </button>
            )}

            {/* 2. 賽前活動資訊 (Pre-Match Activities & Booths) */}
            <button
              onClick={() => {
                setModalDate(activeDateKey);
                setIsPreMatchModalOpen(true);
              }}
              onMouseEnter={handlePreloadModalImages}
              onFocus={handlePreloadModalImages}
              className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-md active:scale-95 whitespace-nowrap ring-1 ring-rose-400/40 flex-shrink-0 cursor-pointer"
              title={t.themeDayPreMatchBtn}
            >
              <Store className="w-3.5 h-3.5 text-white" />
              <span>{t.themeDayPreMatchBtn}</span>
            </button>

            {/* 3. 看台配置 (Stadium Zone Map & Ticket Info) */}
            <button
              onClick={() => {
                setModalDate(activeDateKey);
                setIsModalOpen(true);
              }}
              onMouseEnter={handlePreloadModalImages}
              onFocus={handlePreloadModalImages}
              className="flex-1 sm:flex-initial px-3 sm:px-3.5 py-2 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0007] shadow-md active:scale-95 whitespace-nowrap ring-1 ring-amber-400/40 flex-shrink-0 cursor-pointer"
              title={t.themeDayStadiumBtn}
            >
              <Layers className="w-3.5 h-3.5 text-[#1a0007]" />
              <span>{t.themeDayStadiumBtn}</span>
            </button>

            {/* Single Visual Badge Thumbnail */}
            <div className="relative w-9 h-9 rounded-xl overflow-hidden border-2 border-rose-300 dark:border-amber-400/50 shadow-md flex-shrink-0 hidden md:block ml-0.5">
              <picture>
                <source srcSet="./theme/spicy_cool_sweet_key_visual.webp" type="image/webp" />
                <img
                  src="./theme/spicy_cool_sweet_key_visual.jpg"
                  alt="辣酷甜單曲主視覺"
                  width="36"
                  height="36"
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
              </picture>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Theme Day Stadium Guide & Zone Assignment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
          />

          <div className="flex min-h-full items-center justify-center p-3 sm:p-4">
            <div className="relative w-full max-w-2xl bg-white dark:bg-[#1f030a] text-slate-800 dark:text-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-rose-200 dark:border-amber-500/50 overflow-hidden transition-colors">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-rose-200 dark:border-amber-500/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#1a0007]">
                    <Sparkles className="w-5 h-5 fill-[#1a0007]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-amber-100">
                      辣酷甜主題日 ‧ 看台專區配置與球場席位
                    </h3>
                    <p className="text-xs text-rose-900/70 dark:text-amber-300/80">
                      女孩 1、2、3、7、8 局個人專屬看台寵粉應援
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-amber-200/70 dark:hover:text-white dark:hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* 27-Girl Panoramic Key Visual Banner in Modal */}
              <div className="mt-3 rounded-2xl overflow-hidden border border-rose-200 dark:border-amber-500/50 shadow-lg bg-black/5 dark:bg-black/60 relative aspect-[1024/409]">
                <picture>
                  <source srcSet="./theme/spicy_cool_sweet_banner.webp" type="image/webp" />
                  <img
                    src="./theme/spicy_cool_sweet_banner.jpg"
                    alt="辣酷甜主題日 27 位女孩全員主視覺"
                    width="1024"
                    height="409"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-auto object-contain object-center"
                  />
                </picture>
              </div>

              {/* Date Switcher Tabs inside Modal */}
              <div className="flex items-center gap-2 mt-4 mb-3">
                <button
                  onClick={() => {
                    setModalDate('9/19');
                    onSelectDate?.('9/19');
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                    modalDate === '9/19'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] shadow-md'
                      : 'bg-rose-50 hover:bg-rose-100 dark:bg-red-950/60 dark:hover:bg-red-900/40 text-slate-700 dark:text-amber-200/70 border border-rose-200 dark:border-amber-500/30'
                  }`}
                >
                  <span>9/19 (六) 專區首回戰 (14位)</span>
                </button>
                <button
                  onClick={() => {
                    setModalDate('9/20');
                    onSelectDate?.('9/20');
                  }}
                  className={`flex-1 py-1.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 ${
                    modalDate === '9/20'
                      ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] shadow-md'
                      : 'bg-rose-50 hover:bg-rose-100 dark:bg-red-950/60 dark:hover:bg-red-900/40 text-slate-700 dark:text-amber-200/70 border border-rose-200 dark:border-amber-500/30'
                  }`}
                >
                  <span>9/20 (日) 專區次回戰 (13位)</span>
                </button>
              </div>

              {/* Stadium Map Image from User (Court layout) */}
              <div className="rounded-2xl overflow-hidden border border-rose-200 dark:border-amber-500/30 bg-slate-50 dark:bg-black/80 p-2 mb-4 flex items-center justify-center min-h-[220px]">
                <picture>
                  <source srcSet="./theme/spicy_cool_sweet_court_map.webp" type="image/webp" />
                  <img
                    src="./theme/spicy_cool_sweet_court_map.png"
                    alt="樂天桃園棒球場看台位置圖"
                    width="446"
                    height="447"
                    loading="eager"
                    decoding="async"
                    fetchPriority="high"
                    className="w-full h-auto rounded-xl object-contain max-h-72 sm:max-h-96 mx-auto"
                  />
                </picture>
              </div>

              {/* Special Theme Rules Description */}
              <div className="rounded-xl bg-amber-50/80 dark:bg-amber-500/10 border border-amber-300/80 dark:border-amber-500/30 p-3 text-xs text-amber-900 dark:text-amber-200/90 space-y-1.5 mb-4">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>局數規則</strong>：專區女孩於比賽期間固定在個人專屬看台全程應援；一般看台女孩依東、西、大樂區輪替安排（本次主題日無東R、西R站位，亦無中場表演）。</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-500 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>座位視角導引</strong>：若購買東下或東上看台票，切換至「一壘東區」視角即可鎖定您面前的專區女孩！</span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-full py-2.5 rounded-xl font-extrabold text-xs sm:text-sm bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] hover:brightness-110 transition active:scale-95 shadow-md"
              >
                關閉主題日說明
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. Pre-Match Activities & Booths Modal */}
      <PreMatchActivityModal
        isOpen={isPreMatchModalOpen}
        onClose={() => setIsPreMatchModalOpen(false)}
        selectedDate={modalDate}
        onSelectDate={(d) => {
          setModalDate(d);
          onSelectDate?.(d);
        }}
        allGirls={allGirls}
        favorites={favorites}
        onSelectGirl={onSelectGirl}
      />
    </>
  );
};
