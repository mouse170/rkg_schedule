import React, { useState } from 'react';
import { Sparkles, Map, X, CheckCircle2, Users } from 'lucide-react';
import { SPICY_COOL_SWEET_THEME } from '../data/spicyCoolSweetData';

interface ThemeDayBannerProps {
  selectedDate: string;
  onSelectDate?: (date: string) => void;
}

export const ThemeDayBanner: React.FC<ThemeDayBannerProps> = ({ selectedDate, onSelectDate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<'9/19' | '9/20'>(selectedDate === '9/20' ? '9/20' : '9/19');

  const activeDateKey = selectedDate === '9/20' ? '9/20' : '9/19';

  return (
    <>
      {/* 1. Theatrical Velvet Crimson & Gold Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#1a0007] via-[#4d0913] to-[#7f0d1b] p-4 sm:p-5 text-white mb-3 sm:mb-4 shadow-xl border border-amber-500/40 ring-1 ring-amber-400/20">
        {/* Decorative Gold Inlay Accents */}
        <div className="absolute -top-12 -right-12 w-44 h-44 rounded-full bg-amber-500/10 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-44 h-44 rounded-full bg-rose-600/20 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1">
            {/* Top Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] text-[11px] font-black shadow-sm tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-[#1a0007] fill-[#1a0007]" />
                <span>辣酷甜 THEME DAY</span>
              </span>

              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-red-950/80 border border-amber-400/40 text-amber-200 text-[10px] font-bold">
                <Users className="w-3 h-3 text-amber-400" />
                <span>全體 27 位女孩全員出席盛典</span>
              </span>

              <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full bg-white/10 text-pink-100">
                {selectedDate}
              </span>
            </div>

            {/* Main Headline */}
            <h2 className="text-base sm:text-xl font-black text-amber-100 tracking-tight flex items-center gap-2">
              <span>辣酷甜主題日 ‧ 看台專區貼身應援</span>
            </h2>

            {/* Inning Rules Subtitle */}
            <p className="text-[11px] sm:text-xs text-amber-200/90 leading-relaxed font-medium max-w-2xl">
              1、2、3、7、8 局專區女孩全程於專屬看台貼身應援 ‧ 第 5 局下全體女孩於內野主舞台合體演出「辣酷甜」單曲！
            </p>
          </div>

          {/* Action Trigger Button & Single Art Thumbnail */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end pt-2 md:pt-0 border-t md:border-t-0 border-amber-500/20">
            <button
              onClick={() => {
                setModalDate(activeDateKey);
                setIsModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0007] shadow-md active:scale-95 whitespace-nowrap"
            >
              <Map className="w-4 h-4 text-[#1a0007]" />
              <span>專區看台配置與票價圖 →</span>
            </button>

            {/* Single Visual Badge Thumbnail */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden border-2 border-amber-400/50 shadow-md flex-shrink-0 hidden sm:block">
              <img
                src="./theme/spicy_cool_sweet_key_visual.jpg"
                alt="辣酷甜單曲主視覺"
                className="w-full h-full object-cover"
              />
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
            <div className="relative w-full max-w-2xl bg-[#1f030a] text-white rounded-3xl p-4 sm:p-6 shadow-2xl border border-amber-500/50 overflow-hidden">
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-amber-500/30">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#1a0007]">
                    <Sparkles className="w-5 h-5 fill-[#1a0007]" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-amber-100">
                      辣酷甜主題日 ‧ 看台專區配置與球場席位
                    </h3>
                    <p className="text-xs text-amber-300/80">
                      女孩 1、2、3、7、8 局個人專屬看台貼身應援
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-full text-amber-200/70 hover:text-white hover:bg-white/10 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Single Key Visual Banner in Modal */}
              <div className="mt-3 rounded-2xl overflow-hidden border border-amber-500/40 shadow-md">
                <img
                  src="./theme/spicy_cool_sweet_key_visual.jpg"
                  alt="辣酷甜主題日全員主視覺"
                  className="w-full h-24 sm:h-32 object-cover object-center"
                />
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
                      : 'bg-red-950/60 text-amber-200/70 border border-amber-500/30 hover:bg-red-900/40'
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
                      : 'bg-red-950/60 text-amber-200/70 border border-amber-500/30 hover:bg-red-900/40'
                  }`}
                >
                  <span>9/20 (日) 專區次回戰 (13位)</span>
                </button>
              </div>

              {/* Stadium Map Image from User */}
              <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-black/60 p-1 mb-4">
                <img
                  src="./theme/spicy_cool_sweet_stadium_map.png"
                  alt="樂天桃園棒球場看台位置圖與票價"
                  className="w-full h-auto rounded-xl object-contain max-h-64 sm:max-h-80 mx-auto"
                />
              </div>

              {/* Zone Breakdown Grid */}
              <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1 no-scrollbar">
                {/* 1. 東下一壘熱區 */}
                <div className="bg-red-950/40 rounded-xl p-2.5 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-400" />
                      <span>一壘東下熱區（全票 500 / 半票 400）</span>
                    </span>
                    <span className="text-[10px] text-amber-200/60">下層看台 I~M 區</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {(SPICY_COOL_SWEET_THEME.zoneAssignments[modalDate] || [])
                      .filter(z => z.deck === '東下')
                      .map(z => (
                        <div key={z.name} className="px-2 py-1 rounded-lg bg-red-900/40 border border-amber-500/20 text-[11px] font-bold text-amber-100 flex items-center justify-between">
                          <span className="text-amber-400">{z.zoneCode}</span>
                          <span>{z.girlName}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 2. 西下三壘熱區 */}
                <div className="bg-red-950/40 rounded-xl p-2.5 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>三壘西下熱區（全票 500 / 半票 400）</span>
                    </span>
                    <span className="text-[10px] text-amber-200/60">下層看台 I~K 區</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {(SPICY_COOL_SWEET_THEME.zoneAssignments[modalDate] || [])
                      .filter(z => z.deck === '西下')
                      .map(z => (
                        <div key={z.name} className="px-2 py-1 rounded-lg bg-red-900/40 border border-amber-500/20 text-[11px] font-bold text-amber-100 flex items-center justify-between">
                          <span className="text-amber-400">{z.zoneCode}</span>
                          <span>{z.girlName}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 3. 東上二樓視野區 */}
                <div className="bg-red-950/40 rounded-xl p-2.5 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-indigo-400" />
                      <span>一壘東上視野區（全票 450 / 半票 350）</span>
                    </span>
                    <span className="text-[10px] text-amber-200/60">上層 4F B~D 區</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {(SPICY_COOL_SWEET_THEME.zoneAssignments[modalDate] || [])
                      .filter(z => z.deck === '東上')
                      .map(z => (
                        <div key={z.name} className="px-2 py-1 rounded-lg bg-red-900/40 border border-amber-500/20 text-[11px] font-bold text-amber-100 flex items-center justify-between">
                          <span className="text-amber-400">{z.zoneCode}</span>
                          <span>{z.girlName}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* 4. 西上二樓視野區 */}
                <div className="bg-red-950/40 rounded-xl p-2.5 border border-amber-500/30">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-teal-400" />
                      <span>三壘西上視野區（全票 450 / 半票 350）</span>
                    </span>
                    <span className="text-[10px] text-amber-200/60">上層 4F B~D 區</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {(SPICY_COOL_SWEET_THEME.zoneAssignments[modalDate] || [])
                      .filter(z => z.deck === '西上')
                      .map(z => (
                        <div key={z.name} className="px-2 py-1 rounded-lg bg-red-900/40 border border-amber-500/20 text-[11px] font-bold text-amber-100 flex items-center justify-between">
                          <span className="text-amber-400">{z.zoneCode}</span>
                          <span>{z.girlName}</span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Special Theme Rules Description */}
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/30 p-3 text-xs text-amber-200/90 space-y-1.5 mb-4">
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>局數規則</strong>：專區女孩於第 1、2、3、7、8 局皆固定在專屬指定看台應援，不進行一般局數換側輪替。</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span><strong>中場演出</strong>：第 5 局下全體 27 位女孩合體於內野主舞台帶來「辣酷甜」年度主題單曲震撼演出！</span>
                </div>
                <div className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
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
    </>
  );
};
