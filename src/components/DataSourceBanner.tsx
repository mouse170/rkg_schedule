import React, { useState } from 'react';
import { ExternalLink, Database, Info, ChevronDown, ChevronUp } from 'lucide-react';

export const DataSourceBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 dark:from-oled-surface dark:via-oled-card dark:to-oled-surface border-y border-pink-100/80 dark:border-oled-border px-3 sm:px-4 py-2 text-xs text-gray-700 dark:text-gray-300 transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-rkg-crimson dark:text-rkg-pink font-bold whitespace-nowrap flex-shrink-0">資料來源</span>
            <span className="text-gray-500 dark:text-gray-400 truncate text-[11px] sm:text-xs">即時串接球團與 Google 公開試算表</span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden text-rkg-pink-deep dark:text-rkg-pink flex items-center gap-0.5 ml-2 font-bold text-[11px] whitespace-nowrap px-2 py-0.5 rounded-lg bg-white/80 dark:bg-oled-elevated border border-pink-200 dark:border-oled-border"
          >
            <span>{isOpen ? '收合連結' : '展開連結'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className={`flex flex-wrap items-center gap-2 sm:gap-3 sm:flex ${isOpen ? 'flex pt-1 border-t sm:border-t-0 border-pink-100 dark:border-oled-border' : 'hidden'}`}>
          <a
            href="https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-oled-surface hover:bg-pink-50 dark:hover:bg-oled-elevated text-rkg-crimson dark:text-pink-300 border border-pink-200 dark:border-oled-border rounded-full font-medium transition shadow-sm hover:border-rkg-pink"
            title="查看即時 Google 試算表"
          >
            <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>Google 試算表班表</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://monkeys.rakuten.com.tw/girls"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white dark:bg-oled-surface hover:bg-pink-50 dark:hover:bg-oled-elevated text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-oled-border rounded-full font-medium transition shadow-sm hover:border-rkg-pink"
            title="前往樂天桃猿官方網站"
          >
            <Info className="w-3 h-3 text-rkg-crimson dark:text-rkg-pink" />
            <span>Rakuten Girls 官方名冊</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://www.instagram.com/rakutengirls/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/60 dark:hover:to-pink-900/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-900/60 rounded-full font-medium transition shadow-sm"
            title="追蹤 Rakuten Girls 官方 Instagram"
          >
            <span className="text-[11px] font-bold">IG</span>
            <span>@rakutengirls 官方</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
};
