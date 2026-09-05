import React, { useState, useMemo } from 'react';
import { ExternalLink, Copy, Check, Search } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { OFFICIAL_GIRLS } from '../data/girlsRoster';
import { GirlProfile } from '../types/schedule';

interface InstagramDirectoryProps {
  onSelectGirl: (girl: GirlProfile) => void;
}

export const InstagramDirectory: React.FC<InstagramDirectoryProps> = ({ onSelectGirl }) => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'ALL' | 'KOREAN' | 'LOCAL'>('ALL');
  const [copiedHandle, setCopiedHandle] = useState<string | null>(null);

  const handleCopy = (e: React.MouseEvent, handle: string) => {
    e.stopPropagation();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`@${handle}`);
      setCopiedHandle(handle);
      setTimeout(() => setCopiedHandle(null), 2000);
    }
  };

  const filteredGirls = useMemo(() => {
    return OFFICIAL_GIRLS.filter(girl => {
      // 1. Search
      const matchSearch =
        girl.name.toLowerCase().includes(search.toLowerCase()) ||
        girl.number.includes(search) ||
        (girl.instagramHandle && girl.instagramHandle.toLowerCase().includes(search.toLowerCase()));

      if (!matchSearch) return false;

      // 2. Role filter
      const isKorean = ['河智媛', '廉世彬', '禹洙漢', '高佳彬', '金佳垠'].includes(girl.name);
      if (roleFilter === 'KOREAN') {
        return isKorean;
      }
      if (roleFilter === 'LOCAL') {
        return !isKorean;
      }
      return true;
    });
  }, [search, roleFilter]);

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-600 via-pink-600 to-rkg-crimson p-6 sm:p-8 text-white shadow-elevated">
        <div className="relative z-10 max-w-xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold mb-3">
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Rakuten Girls 官方社群名錄</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-2">
            樂天女孩全體成員 IG 專區
          </h2>
          <p className="text-xs sm:text-sm text-pink-100/90 leading-relaxed font-normal">
            收錄樂天桃猿啦啦隊全體 29 位現役成員之官方 Instagram 帳號。點擊卡片可直接跳轉追蹤或複製帳號！
          </p>
        </div>
        <div className="absolute -right-8 -bottom-8 w-60 h-60 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      </div>

      {/* 2. Official Team Account Card */}
      <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-rose-50 border border-purple-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-md flex items-center justify-center text-white">
            <InstagramIcon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-gray-900 text-sm sm:text-base">
                Rakuten Girls 官方 Instagram
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                球團官方
              </span>
            </div>
            <p className="text-xs text-gray-500 font-medium">
              @rakutengirls • 掌握最新應援活動與賽事公告
            </p>
          </div>
        </div>

        <a
          href="https://www.instagram.com/rakutengirls/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl text-xs font-bold shadow-sm transition active:scale-95 whitespace-nowrap"
        >
          <span>追蹤球團官方 IG</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* 3. Search & Filter Controls */}
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-card-soft border border-pink-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜尋姓名、背號或 IG 帳號..."
            className="w-full pl-9 pr-4 py-2 bg-pink-50/40 hover:bg-pink-50/80 focus:bg-white text-sm text-gray-800 placeholder-gray-400 rounded-xl border border-pink-200/80 focus:border-rkg-pink focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto justify-start sm:justify-end">
          <button
            onClick={() => setRoleFilter('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              roleFilter === 'ALL'
                ? 'bg-gray-900 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部 ({OFFICIAL_GIRLS.length})
          </button>
          <button
            onClick={() => setRoleFilter('KOREAN')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              roleFilter === 'KOREAN'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
            }`}
          >
            韓籍外援 (5)
          </button>
          <button
            onClick={() => setRoleFilter('LOCAL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              roleFilter === 'LOCAL'
                ? 'bg-rkg-pink-deep text-white shadow-sm'
                : 'bg-pink-50 text-rkg-pink-deep hover:bg-pink-100 border border-pink-200'
            }`}
          >
            本隊成員 ({OFFICIAL_GIRLS.length - 5})
          </button>
        </div>
      </div>

      {/* 4. Girls IG Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredGirls.map((girl) => {
          const isCopied = copiedHandle === girl.instagramHandle;
          const isKorean = ['河智媛', '廉世彬', '禹洙漢', '高佳彬', '金佳垠'].includes(girl.name);

          return (
            <div
              key={girl.id}
              onClick={() => onSelectGirl(girl)}
              className="group bg-white rounded-3xl p-4 shadow-card-soft hover:shadow-pink-glow border border-pink-100/90 hover:border-rkg-pink/50 transition duration-300 flex items-center justify-between gap-3 cursor-pointer"
            >
              {/* Photo & Info */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="relative w-16 h-20 rounded-2xl overflow-hidden shadow-sm bg-pink-50 flex-shrink-0">
                  <img
                    src={girl.localPhoto}
                    alt={girl.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = girl.photo;
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-1 left-1 px-1.5 py-0.2 rounded-md bg-rkg-crimson text-white text-[9px] font-black">
                    #{girl.number}
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 mb-1">
                    <h4 className="font-extrabold text-base text-gray-900 group-hover:text-rkg-pink-deep transition truncate">
                      {girl.name}
                    </h4>
                    {girl.role && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-amber-500 text-white flex-shrink-0">
                        {girl.role}
                      </span>
                    )}
                    {isKorean && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-purple-500 text-white flex-shrink-0">
                        韓援
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-purple-700 truncate">
                    @{girl.instagramHandle}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">點擊查看班表與站位</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                {girl.instagram && (
                  <a
                    href={girl.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-sm transition active:scale-95"
                    title="前往個人 IG"
                  >
                    <span>開啟 IG</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {girl.instagramHandle && (
                  <button
                    onClick={(e) => handleCopy(e, girl.instagramHandle!)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 transition"
                    title="複製帳號"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600 font-bold">已複製</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>複製帳號</span>
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
