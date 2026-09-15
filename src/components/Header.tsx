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
    <header className="sticky top-0 z-30 glass-nav gpu-layer border-b border-border/60 shadow-sm transition-colors duration-200">
      {/* Main App Navigation Bar */}
      <div className="max-w-6xl mx-auto px-3 sm:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-2">
        {/* Brand & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-background to-muted border border-border/80 p-1 shadow-sm flex items-center justify-center flex-shrink-0 active:scale-95 transition-transform overflow-hidden" title="Rakuten Girls 樂天女孩 • RKG Badge">
            <img
              src="./rkg_badge.png"
              alt="Rakuten Girls Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-nowrap">
              <h1 className="font-extrabold text-sm sm:text-base md:text-lg text-foreground tracking-tight whitespace-nowrap flex items-center gap-1">
                <span>{t.appTitle}</span>
                <Sparkles className="w-3.5 h-3.5 text-primary fill-primary animate-pulse hidden sm:inline" />
              </h1>
              <span className="text-[10px] font-black px-1.5 py-0.2 rounded-full bg-primary/10 text-primary border border-primary/20 whitespace-nowrap flex-shrink-0">
                2026
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground font-medium truncate hidden md:block">
              {t.appSubtitle}
            </p>
          </div>
        </div>

        {/* Right Section: View Mode Tabs, Theme Toggle & Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* View Mode Navigation Tabs */}
          <div className="flex items-center bg-muted/80 dark:bg-muted/40 p-0.5 sm:p-1 rounded-xl border border-border/60">
            <button
              onClick={() => onTabChange('INSTAGRAM')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'INSTAGRAM'
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5" />
              <span>{t.tabInstagram}</span>
            </button>

            <button
              onClick={() => onTabChange('SCHEDULE')}
              className={`inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                activeTab === 'SCHEDULE'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.tabSchedule}</span>
            </button>
          </div>

          {/* OLED / Dark Mode Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-xl bg-background/80 hover:bg-accent border border-border/80 text-foreground transition shadow-sm active:scale-95"
            title={t.themeToggle}
            aria-label={t.themeToggle}
          >
            {resolvedTheme === 'dark' ? (
              <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground" />
            )}
          </button>

          {/* Stadium Guide Button (Desktop) */}
          <button
            onClick={onOpenStadiumGuide}
            className="hidden md:inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-background/80 hover:bg-accent text-foreground border border-border/80 shadow-sm transition active:scale-95 whitespace-nowrap"
          >
            <Map className="w-3.5 h-3.5 text-primary" />
            <span>{t.stadiumGuideBtn}</span>
          </button>

          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            className={`inline-flex items-center justify-center gap-1.5 h-8 sm:h-auto px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm active:scale-95 whitespace-nowrap ${
              isLoading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm'
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
      <div className="bg-muted/40 border-t border-border/40 px-3 sm:px-4 py-1 text-[11px] text-muted-foreground">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            {isLive ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold whitespace-nowrap flex-shrink-0">
                <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden xs:inline sm:inline">Google 試算表即時連線</span>
                <span className="xs:hidden sm:hidden">即時連線</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold whitespace-nowrap flex-shrink-0">
                <AlertCircle className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                <span>離線模式</span>
              </span>
            )}
            <span className="text-border">|</span>
            <span className="truncate text-muted-foreground">更新時間：{lastUpdated}</span>
          </div>

          <button
            onClick={onOpenStadiumGuide}
            className="md:hidden text-primary font-bold hover:underline flex items-center gap-0.5 whitespace-nowrap flex-shrink-0 text-[11px]"
          >
            <Map className="w-3 h-3" />
            <span>席位說明</span>
          </button>
        </div>
      </div>
    </header>
  );
};
