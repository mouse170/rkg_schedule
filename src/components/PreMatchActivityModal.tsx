import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  Users,
  X,
  FileCheck,
  AlertCircle,
  Heart,
  ChevronRight,
  Store
} from 'lucide-react';
import { SPICY_COOL_SWEET_PRE_MATCH } from '../data/spicyCoolSweetData';
import { GirlProfile } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';

interface PreMatchActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: '9/19' | '9/20';
  onSelectDate: (date: '9/19' | '9/20') => void;
  allGirls: GirlProfile[];
  favorites: string[];
  onSelectGirl?: (girl: GirlProfile) => void;
}

export const PreMatchActivityModal: React.FC<PreMatchActivityModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
  allGirls,
  favorites,
  onSelectGirl
}) => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'BOOTH_MAP'>('SCHEDULE');

  if (!isOpen) return null;

  const preMatchConfig = SPICY_COOL_SWEET_PRE_MATCH;
  const currentDayData = preMatchConfig.days[selectedDate] || preMatchConfig.days['9/19'];
  const autograph = preMatchConfig.autographRules;

  // Helper to find girl profile by name
  const findGirl = (name: string): GirlProfile | undefined => {
    const target = name.trim().toLowerCase();
    return allGirls.find(g => {
      const gName = g.name.toLowerCase();
      if (gName === target) return true;
      if (gName === '琳妲' && (target === '琳蛋' || target === '琳妲')) return true;
      if (gName === '高橋佳帆' && (target.includes('佳帆') || target === 'kaho')) return true;
      if (gName === 'mika' && (target === 'mika' || target === '蜜卡')) return true;
      return false;
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
      />

      <div className="flex min-h-full items-center justify-center p-3 sm:p-5">
        <div className="relative w-full max-w-3xl bg-white dark:bg-[#140104] text-slate-800 dark:text-rose-50 rounded-3xl p-4 sm:p-6 shadow-2xl border border-rose-300 dark:border-rose-900/60 overflow-hidden transition-colors">
          
          {/* Decorative Glow Accents */}
          <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-rose-500/10 dark:bg-rose-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-amber-400/10 dark:bg-amber-500/10 blur-3xl pointer-events-none" />

          {/* Modal Header */}
          <div className="relative z-10 flex items-center justify-between pb-4 border-b border-rose-200/80 dark:border-rose-900/50">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-500 to-rose-700 text-white shadow-md shadow-rose-900/20">
                <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
              </div>
              <div>
                <h3 className="text-base sm:text-xl font-black text-[#890022] dark:text-rose-100 tracking-tight">
                  {t.preMatchModalTitle}
                </h3>
                <p className="text-xs text-rose-950/70 dark:text-rose-300/80 font-medium">
                  {t.preMatchModalSubtitle}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-rose-200/70 dark:hover:text-white dark:hover:bg-rose-950/60 transition"
              aria-label="關閉"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Sub Navigation: Date Switcher & Content Tabs */}
          <div className="relative z-10 mt-4 space-y-3">
            {/* 1. Date Selector Pills */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onSelectDate('9/19')}
                className={`py-2 px-3 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
                  selectedDate === '9/19'
                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white shadow-md shadow-rose-900/20 ring-1 ring-rose-400/40'
                    : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-slate-700 dark:text-rose-200/80 border border-rose-200/80 dark:border-rose-900/50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>9/19 (六) 賽前活動首日</span>
              </button>

              <button
                onClick={() => onSelectDate('9/20')}
                className={`py-2 px-3 rounded-2xl text-xs sm:text-sm font-black transition flex items-center justify-center gap-2 ${
                  selectedDate === '9/20'
                    ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white shadow-md shadow-rose-900/20 ring-1 ring-rose-400/40'
                    : 'bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/40 text-slate-700 dark:text-rose-200/80 border border-rose-200/80 dark:border-rose-900/50'
                }`}
              >
                <Calendar className="w-4 h-4" />
                <span>9/20 (日) 賽前活動次日</span>
              </button>
            </div>

            {/* 2. Content Tabs (Schedule vs Booth Map) */}
            <div className="flex border-b border-rose-200/70 dark:border-rose-900/50">
              <button
                onClick={() => setActiveTab('SCHEDULE')}
                className={`flex-1 pb-2.5 text-xs sm:text-sm font-extrabold text-center transition border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'SCHEDULE'
                    ? 'border-rose-600 dark:border-rose-400 text-rose-700 dark:text-rose-200'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-rose-200'
                }`}
              >
                <Clock className="w-4 h-4" />
                <span>{t.tabPreMatchSchedule}</span>
              </button>

              <button
                onClick={() => setActiveTab('BOOTH_MAP')}
                className={`flex-1 pb-2.5 text-xs sm:text-sm font-extrabold text-center transition border-b-2 flex items-center justify-center gap-2 ${
                  activeTab === 'BOOTH_MAP'
                    ? 'border-rose-600 dark:border-rose-400 text-rose-700 dark:text-rose-200'
                    : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-rose-200'
                }`}
              >
                <Store className="w-4 h-4" />
                <span>{t.tabBoothMap}</span>
              </button>
            </div>
          </div>

          {/* Modal Main Content Container */}
          <div className="relative z-10 mt-4 space-y-4 max-h-[62vh] overflow-y-auto pr-1">
            {activeTab === 'SCHEDULE' ? (
              <>
                {/* 1. Key Timetable Card */}
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                  <div className="rounded-2xl p-3.5 bg-gradient-to-br from-rose-50 to-pink-50/60 dark:from-rose-950/40 dark:to-rose-900/20 border border-rose-200/80 dark:border-rose-900/50">
                    <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 font-bold text-xs mb-1">
                      <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>{t.ticketAdmissionTime}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-rose-900 dark:text-rose-100 tracking-tight">
                      {currentDayData.ticketTime}
                    </div>
                    <p className="text-[11px] text-rose-950/60 dark:text-rose-300/70 mt-0.5 font-medium">
                      售票處與全區驗票閘門同步開放
                    </p>
                  </div>

                  <div className="rounded-2xl p-3.5 bg-gradient-to-br from-amber-50 to-rose-50/60 dark:from-amber-950/30 dark:to-rose-950/20 border border-amber-200/80 dark:border-amber-500/30">
                    <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs mb-1">
                      <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{t.gameStartTimeLabel}</span>
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-100 tracking-tight">
                      {currentDayData.gameStartTime}
                    </div>
                    <p className="text-[11px] text-amber-950/60 dark:text-amber-300/70 mt-0.5 font-medium">
                      主客場正式點燃戰火
                    </p>
                  </div>
                </div>

                {/* 2. Autograph Session Rules Card */}
                <div className="rounded-2xl p-4 bg-gradient-to-br from-[#fff7f9] to-[#fff0f4] dark:from-[#21050a] dark:to-[#170105] border border-rose-300/80 dark:border-rose-800/60 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-rose-600 text-white shadow-sm">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm sm:text-base font-black text-[#890022] dark:text-rose-200">
                        {autograph.title}
                      </h4>
                    </div>

                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-200 text-rose-900 dark:bg-rose-900/60 dark:text-rose-100 border border-rose-300/80 dark:border-rose-700/50">
                      限額每日 100 名
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-rose-950 dark:text-rose-200/90 leading-relaxed font-medium">
                    <div className="flex items-start gap-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                      <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{autograph.location}</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                        <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                        <span><strong>14:40</strong> 檢查單曲本並發放號碼牌</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span><strong>15:10</strong> 正式開始簽名（限簽單曲本）</span>
                      </div>
                    </div>

                    <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-900/80 dark:text-rose-300/80 pl-1">
                      <li>單曲簽名本及本人均需在場，一人限一本。</li>
                      <li>領完號碼牌並完成驗票後，請直接至三壘側簽名區帳篷依序等候。</li>
                    </ul>
                  </div>
                </div>

                {/* 3. Pre-Match Booth Girls Schedule */}
                <div className="rounded-2xl p-4 bg-white dark:bg-[#1a0206] border border-rose-200 dark:border-rose-900/60 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <h4 className="text-sm sm:text-base font-black text-slate-900 dark:text-rose-100">
                        {selectedDate} ({currentDayData.weekday}) {t.boothScheduleTitle}
                      </h4>
                    </div>
                    <span className="text-[11px] text-rose-700 dark:text-rose-300 font-semibold hidden sm:inline">
                      {t.boothInteractiveTip}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {currentDayData.boothEvents.map((evt, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-2xl bg-rose-50/50 hover:bg-rose-100/60 dark:bg-rose-950/30 dark:hover:bg-rose-900/30 border border-rose-200/70 dark:border-rose-900/50 transition gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="px-2.5 py-1 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 text-white text-xs font-black tracking-wide shadow-sm flex-shrink-0">
                            {evt.timeSlot}
                          </span>
                          <div>
                            <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-rose-100">
                              {evt.boothName}
                            </span>
                            <span className="block text-[11px] text-rose-900/60 dark:text-rose-300/70">
                              攤位專屬互動活動
                            </span>
                          </div>
                        </div>

                        {/* Interactive Girl Chips */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {evt.girls.map((girlName) => {
                            const profile = findGirl(girlName);
                            const isFav = favorites.includes(profile?.name || girlName);
                            return (
                              <button
                                key={girlName}
                                onClick={() => {
                                  if (profile && onSelectGirl) {
                                    onSelectGirl(profile);
                                  }
                                }}
                                className="group inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white dark:bg-black/50 border border-rose-200 dark:border-rose-800/80 hover:border-rose-400 dark:hover:border-rose-500 shadow-sm transition active:scale-95"
                                title="查看女孩出勤與個人檔案"
                              >
                                {profile?.localPhoto ? (
                                  <img
                                    src={profile.localPhoto}
                                    alt={girlName}
                                    className="w-5 h-5 rounded-full object-cover border border-rose-300 dark:border-rose-600"
                                  />
                                ) : null}

                                <span className="text-xs font-extrabold text-rose-900 dark:text-rose-200 group-hover:text-rose-600 dark:group-hover:text-rose-300">
                                  {girlName}
                                </span>

                                {profile?.number && (
                                  <span className="text-[10px] font-bold px-1 rounded bg-rose-100 dark:bg-rose-900/60 text-rose-700 dark:text-rose-300">
                                    #{profile.number}
                                  </span>
                                )}

                                {isFav && (
                                  <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                                )}

                                <ChevronRight className="w-3 h-3 text-rose-300 group-hover:text-rose-500 transition-transform group-hover:translate-x-0.5" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              /* Tab 2: Booth Map & Exhibitor Directory */
              <div className="space-y-4">
                {/* Visual Map Frame */}
                <div className="rounded-2xl overflow-hidden border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-black/60 p-2 shadow-inner">
                  <picture>
                    <source srcSet="./theme/spicy_cool_sweet_booth_map.webp" type="image/webp" />
                    <img
                      src="./theme/spicy_cool_sweet_booth_map.jpg"
                      alt="樂天桃園棒球場攤位位置圖與號碼牌排隊動線"
                      width="1080"
                      height="1080"
                      loading="eager"
                      decoding="async"
                      className="w-full h-auto rounded-xl object-contain max-h-[380px] sm:max-h-[460px] mx-auto"
                    />
                  </picture>
                  <p className="text-center text-[11px] text-rose-950/60 dark:text-rose-300/60 mt-2 font-medium">
                    三壘側 GATE W 旁設有女孩簽名會帳篷 ‧ 1 至 11 號外圍廠商攤位一覽
                  </p>
                </div>

                {/* Booth Directory Legend Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* West (3rd Base / Gate W) */}
                  <div className="rounded-2xl p-3.5 bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/70 dark:border-rose-900/50 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-rose-900 dark:text-rose-200">
                      <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                      <span>{t.boothMapLegendWest}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {preMatchConfig.boothMapLegend[0]?.booths.map(b => (
                        <li key={b.number} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {b.number}
                          </span>
                          <span className="text-slate-800 dark:text-rose-100 font-bold">{b.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* East (1st Base / Gate E) */}
                  <div className="rounded-2xl p-3.5 bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-black text-amber-900 dark:text-amber-200">
                      <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      <span>{t.boothMapLegendEast}</span>
                    </div>
                    <ul className="space-y-1.5 text-xs">
                      {preMatchConfig.boothMapLegend[1]?.booths.map(b => (
                        <li key={b.number} className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-[#1a0007] text-[10px] font-black flex items-center justify-center flex-shrink-0">
                            {b.number}
                          </span>
                          <span className="text-slate-800 dark:text-amber-100 font-bold">{b.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Footnote Notice */}
                <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-900 dark:text-amber-200/90 font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>各攤位實際互動細則與名額以當日廠商現場公告為主，建議球迷提早抵達球場配合工作人員指引。</span>
                </div>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="relative z-10 pt-4 mt-4 border-t border-rose-200/80 dark:border-rose-900/50">
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl font-black text-xs sm:text-sm bg-gradient-to-r from-rose-600 via-rose-500 to-pink-600 text-white hover:brightness-110 transition active:scale-95 shadow-md shadow-rose-900/20"
            >
              {t.closePreMatchModal}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
