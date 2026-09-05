import React, { useState } from 'react';
import { ExternalLink, Database, Info, ChevronDown, ChevronUp } from 'lucide-react';

export const DataSourceBanner: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-gradient-to-r from-pink-50 via-rose-50 to-pink-50 border-y border-pink-100/80 px-4 py-2.5 text-xs text-gray-700">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-medium">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-rkg-crimson font-bold">資料來源公告</span>
          <span className="text-gray-500">本站班表與女孩資料均即時串接球團與公開試算表</span>
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="sm:hidden text-rkg-pink-deep flex items-center gap-0.5 ml-1 font-semibold"
          >
            {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className={`flex flex-wrap items-center gap-3 sm:flex ${isOpen ? 'flex mt-1' : 'hidden'}`}>
          <a
            href="https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-pink-50 text-rkg-crimson border border-pink-200 rounded-full font-medium transition shadow-sm hover:border-rkg-pink"
            title="查看即時 Google 試算表"
          >
            <Database className="w-3 h-3 text-emerald-600" />
            <span>Google 試算表班表</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://monkeys.rakuten.com.tw/girls"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white hover:bg-pink-50 text-gray-700 border border-gray-200 rounded-full font-medium transition shadow-sm hover:border-rkg-pink"
            title="前往樂天桃猿官方網站"
          >
            <Info className="w-3 h-3 text-rkg-crimson" />
            <span>樂天官網女孩名冊</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-60" />
          </a>

          <a
            href="https://www.instagram.com/rakutengirls/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 text-purple-800 border border-purple-200 rounded-full font-medium transition shadow-sm"
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
