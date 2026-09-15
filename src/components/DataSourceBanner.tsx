import React, { useState } from 'react';
import { ExternalLink, Database, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const DataSourceBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <div className="bg-muted/30 border-y border-border/40 px-3 sm:px-4 py-2 text-xs text-muted-foreground transition-colors">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
        <div className="flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex h-2 w-2 relative flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-muted-foreground truncate text-[11px] sm:text-xs">
              {t.dataConnected}
            </span>
          </div>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden text-primary flex items-center gap-0.5 ml-2 font-bold text-[11px] whitespace-nowrap px-2 py-0.5 rounded-lg bg-background border border-border/80"
          >
            <span>{isOpen ? '收合連結' : '展開連結'}</span>
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className={`flex flex-wrap items-center gap-2 sm:gap-3 sm:flex ${isOpen ? 'flex pt-1 border-t sm:border-t-0 border-border/40' : 'hidden'}`}>
          <a
            href="https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background hover:bg-accent text-primary border border-border/80 rounded-full font-medium transition shadow-sm"
            title="Google Sheet"
          >
            <Database className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <span>{t.googleSheetLink}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://monkeys.rakuten.com.tw/girls"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-background hover:bg-accent text-foreground border border-border/80 rounded-full font-medium transition shadow-sm"
            title="Rakuten Girls"
          >
            <Info className="w-3 h-3 text-primary" />
            <span>{t.officialRosterLink}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://www.instagram.com/rakutengirls/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 text-purple-800 dark:text-purple-300 border border-purple-300/50 dark:border-purple-800/50 rounded-full font-medium transition shadow-sm"
            title="Rakuten Girls Instagram"
          >
            <span className="text-[11px] font-bold">IG</span>
            <span>{t.officialIgLink}</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>
        </div>
      </div>
    </div>
  );
};
