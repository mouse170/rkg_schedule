import React from 'react';
import { RefreshCw, Sparkles, Map, ShieldCheck, AlertCircle, Calendar, Share2, Sun, Moon } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  activeTab: 'SCHEDULE' | 'INSTAGRAM';
  onTabChange: (tab: 'SCHEDULE' | 'INSTAGRAM') => void;
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenStadiumGuide: () => void;
  onOpenShareModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  lastUpdated,
  isLive,
  isLoading,
  onRefresh,
  onOpenStadiumGuide,
  onOpenShareModal
}) => {
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 bg-[#fff8fa]/95 dark:bg-[#160105]/95 backdrop-blur-md gpu-layer border-b border-pink-200 dark:border-amber-500/30 shadow-md shadow-pink-950/5 dark:shadow-black/40 transition-colors duration-300">
      {/* Main App Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-rose-50 to-pink-100 dark:from-[#2a040b] dark:to-[#140104] border border-rose-300 dark:border-amber-500/40 p-1 shadow-sm dark:shadow-md flex items-center justify-center flex-shrink-0 active:scale-95 transition-all overflow-hidden" title="Rakuten Girls 樂天女孩 • 辣酷甜主視覺">
            <img
              src="./rkg_badge.png"
              alt="Rakuten Girls Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <h1 className="font-extrabold text-sm sm:text-base md:text-lg text-rose-950 dark:text-amber-100 tracking-tight whitespace-nowrap flex items-center gap-1.5">
                <span>{t.appTitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 animate-pulse hidden sm:inline" />
              </h1>
              <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-rose-100 dark:bg-amber-500/20 text-rose-800 dark:text-amber-300 border border-rose-300/80 dark:border-amber-400/50 whitespace-nowrap flex-shrink-0 shadow-sm">
                2026 辣酷甜
              </span>
            </div>
            <p className="text-[11px] text-rose-900/70 dark:text-amber-200/70 font-medium truncate hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Section: View Mode Tabs & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* View Mode Navigation Tabs */}
          <div className="flex items-center bg-pink-100/60 dark:bg-[#130104] p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-pink-200 dark:border-amber-500/30 shadow-inner">
            <button
              onClick={() => onTabChange('INSTAGRAM')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'INSTAGRAM'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm font-black'
                  : 'text-gray-600 dark:text-amber-200/70 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>{t.tabInstagram}</span>
            </button>

            <button
              onClick={() => onTabChange('SCHEDULE')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'SCHEDULE'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-[#1a0007] shadow-md font-black ring-1 ring-amber-300/50'
                  : 'text-gray-600 dark:text-amber-200/70 hover:text-gray-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.tabSchedule}</span>
            </button>
          </div>

          {/* Stadium Guide Button (Desktop) */}
          <button
            onClick={onOpenStadiumGuide}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-pink-50 dark:bg-[#24040b] hover:bg-pink-100 dark:hover:bg-[#380611] text-rose-900 dark:text-amber-200 border border-pink-200 dark:border-amber-500/30 shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <Map className="w-3.5 h-3.5 text-rose-600 dark:text-amber-400" />
            <span>{t.stadiumGuideBtn}</span>
          </button>

          {/* Share Schedule Button */}
          <button
            onClick={onOpenShareModal}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-50 dark:bg-[#26040c] hover:bg-pink-100 dark:hover:bg-[#3d0714] text-rose-900 dark:text-amber-200 border border-pink-200 dark:border-amber-500/40 shadow-sm transition active:scale-95 whitespace-nowrap"
            title="分享專屬追星班表與 9:16 IG 限動圖卡"
          >
            <Share2 className="w-3.5 h-3.5 text-rose-600 dark:text-amber-400" />
            <span className="hidden sm:inline">分享</span>
          </button>

          {/* Theme Toggle Button (Light / Dark) */}
          <button
            onClick={toggleTheme}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold bg-pink-50 dark:bg-[#26040c] hover:bg-pink-100 dark:hover:bg-[#3d0714] text-rose-900 dark:text-amber-200 border border-pink-200 dark:border-amber-500/40 shadow-sm transition active:scale-95 whitespace-nowrap"
            title={theme === 'dark' ? '切換為亮色粉金主題' : '切換為暗色黑金主題'}
          >
            {theme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span className="hidden sm:inline">{theme === 'dark' ? '亮色' : '暗色'}</span>
          </button>

          {/* Sync / Force Cache Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-1.5 h-8 sm:h-auto px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold transition shadow-md active:scale-95 whitespace-nowrap ${
              isLoading
                ? 'bg-[#2b050f] text-amber-400/50 cursor-not-allowed border border-amber-500/20'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0007] shadow-amber-500/20'
            }`}
            title="手動強制清除快取並同步最新班表"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isLoading ? '同步中' : '同步更新'}
            </span>
          </button>
        </div>
      </div>

      {/* Sync Status Micro Bar */}
      <div className="bg-pink-50/90 dark:bg-[#120104]/90 border-t border-pink-200 dark:border-amber-500/20 px-3 sm:px-4 py-1 text-[11px] text-gray-700 dark:text-amber-200/80">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap flex-shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden xs:inline sm:inline">Google 試算表即時連線</span>
                <span className="xs:hidden sm:hidden">即時連線</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-300 font-semibold whitespace-nowrap flex-shrink-0">
                <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>離線模式</span>
              </span>
            )}
            <span className="text-pink-300 dark:text-amber-500/40">|</span>
            <span className="truncate text-gray-600 dark:text-amber-200/70">更新時間：{lastUpdated}</span>
          </div>

          <button
            onClick={onOpenStadiumGuide}
            className="md:hidden text-rose-700 dark:text-amber-300 hover:text-rose-900 dark:hover:text-amber-200 font-bold hover:underline flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 text-[11px]"
          >
            <Map className="w-3 h-3 text-rose-600 dark:text-amber-400" />
            <span>席位說明</span>
          </button>
        </div>
      </div>
    </header>
  );
};
