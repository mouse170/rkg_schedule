import React from 'react';
import { RefreshCw, Sparkles, Map, ShieldCheck, AlertCircle, Calendar, Sun, Moon } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeTab: 'SCHEDULE' | 'INSTAGRAM';
  onTabChange: (tab: 'SCHEDULE' | 'INSTAGRAM') => void;
  lastUpdated: string;
  isLive: boolean;
  isLoading: boolean;
  onRefresh: () => void;
  onOpenStadiumGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  lastUpdated,
  isLive,
  isLoading,
  onRefresh,
  onOpenStadiumGuide
}) => {
  const { resolvedTheme, toggleTheme } = useTheme();
  const { t } = useLanguage();

  return (
    <header className="sticky top-0 z-30 glass-nav border-b border-pink-100/90 dark:border-oled-border shadow-sm transition-colors duration-300">
      {/* Main App Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-pink-50 to-pink-100/70 dark:from-oled-surface dark:to-oled-card border border-pink-200/80 dark:border-oled-border p-1 shadow-sm flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform overflow-hidden" title="Rakuten Girls 樂天女孩 • RKG Badge">
            <img
              src="./rkg_badge.png"
              alt="Rakuten Girls Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <h1 className="font-extrabold text-sm sm:text-base md:text-lg text-gray-900 dark:text-white tracking-tight whitespace-nowrap flex items-center gap-1">
                <span>{t.appTitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-rkg-pink fill-rkg-pink animate-pulse hidden sm:inline" />
              </h1>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-pink-100 dark:bg-pink-950/60 text-rkg-crimson dark:text-rkg-pink border border-pink-200/80 dark:border-pink-800/60 whitespace-nowrap flex-shrink-0">
                2026
              </span>
            </div>
            <p className="text-[11px] text-gray-400 dark:text-gray-400 font-medium truncate hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Section: View Mode Tabs, Theme Toggle & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* View Mode Navigation Tabs */}
          <div className="flex items-center bg-pink-50/90 dark:bg-oled-surface p-0.5 sm:p-1 rounded-xl sm:rounded-2xl border border-pink-200/70 dark:border-oled-border">
            <button
              onClick={() => onTabChange('INSTAGRAM')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'INSTAGRAM'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-pink-400'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>{t.tabInstagram}</span>
            </button>

            <button
              onClick={() => onTabChange('SCHEDULE')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-xl text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'SCHEDULE'
                  ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.tabSchedule}</span>
            </button>
          </div>

          {/* OLED Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-white dark:bg-oled-surface border border-pink-200 dark:border-oled-border text-gray-600 dark:text-amber-400 hover:bg-pink-50 dark:hover:bg-oled-card transition shadow-sm active:scale-95"
            title={t.themeToggle}
            aria-label={t.themeToggle}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-700" />
            )}
          </button>

          {/* Stadium Guide Button (Desktop) */}
          <button
            onClick={onOpenStadiumGuide}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-oled-surface hover:bg-pink-50 dark:hover:bg-oled-card text-gray-700 dark:text-gray-200 border border-pink-200 dark:border-oled-border shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <Map className="w-3.5 h-3.5 text-rkg-crimson dark:text-rkg-pink" />
            <span>{t.stadiumGuideBtn}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-1.5 h-8 sm:h-auto px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm active:scale-95 whitespace-nowrap ${
              isLoading
                ? 'bg-pink-100 dark:bg-oled-surface text-pink-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson hover:from-rkg-pink hover:to-rkg-pink-deep text-white shadow-pink-glow'
            }`}
            title={t.refreshBtn}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">
              {isLoading ? '...' : t.refreshBtn}
            </span>
          </button>
        </div>
      </div>

      {/* Sync Status Micro Bar */}
      <div className="bg-pink-50/70 dark:bg-oled-surface/90 border-t border-pink-100/70 dark:border-oled-border px-3 sm:px-4 py-1 text-[11px] text-gray-500 dark:text-gray-400">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold whitespace-nowrap flex-shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden xs:inline sm:inline">Google 試算表即時連線</span>
                <span className="xs:hidden sm:hidden">即時連線</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-400 font-semibold whitespace-nowrap flex-shrink-0">
                <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>離線模式</span>
              </span>
            )}
            <span className="text-gray-300 dark:text-gray-700">|</span>
            <span className="truncate text-gray-500 dark:text-gray-400">更新時間：{lastUpdated}</span>
          </div>

          <button
            onClick={onOpenStadiumGuide}
            className="md:hidden text-rkg-crimson dark:text-rkg-pink font-bold hover:underline flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 text-[11px]"
          >
            <Map className="w-3 h-3" />
            <span>席位說明</span>
          </button>
        </div>
      </div>
    </header>
  );
};
