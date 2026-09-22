import React, { useState, useRef, useEffect, useCallback } from 'react';
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
  Store,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Move
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

  // Interactive Zoom & Pan State for Booth Map
  const [zoomScale, setZoomScale] = useState(1);
  const [zoomTranslate, setZoomTranslate] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const pinchStartDistRef = useRef<number | null>(null);
  const pinchStartScaleRef = useRef(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset zoom & pan when closing or switching tab
  const handleResetZoom = useCallback(() => {
    setZoomScale(1);
    setZoomTranslate({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    if (!isOpen || activeTab !== 'BOOTH_MAP') {
      handleResetZoom();
    }
  }, [isOpen, activeTab, handleResetZoom]);

  // Touch Gesture Handlers (Pinch-to-zoom & Pan)
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2) {
      // Pinch gesture start
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      pinchStartDistRef.current = dist;
      pinchStartScaleRef.current = zoomScale;
    } else if (e.touches.length === 1 && zoomScale > 1) {
      // Pan gesture start when zoomed in
      setIsDragging(true);
      dragStartRef.current = {
        x: e.touches[0].clientX - zoomTranslate.x,
        y: e.touches[0].clientY - zoomTranslate.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 2 && pinchStartDistRef.current !== null) {
      // Pinch to zoom
      e.preventDefault();
      const touch1 = e.touches[0];
      const touch2 = e.touches[1];
      const dist = Math.hypot(touch1.clientX - touch2.clientX, touch1.clientY - touch2.clientY);
      const ratio = dist / pinchStartDistRef.current;
      const nextScale = Math.min(Math.max(pinchStartScaleRef.current * ratio, 1), 3.5);
      setZoomScale(nextScale);
      if (nextScale === 1) {
        setZoomTranslate({ x: 0, y: 0 });
      }
    } else if (e.touches.length === 1 && isDragging && zoomScale > 1) {
      // Pan image
      e.preventDefault();
      const currentX = e.touches[0].clientX - dragStartRef.current.x;
      const currentY = e.touches[0].clientY - dragStartRef.current.y;
      
      // Limit panning bounds according to scale
      const maxTranslate = (zoomScale - 1) * 200;
      setZoomTranslate({
        x: Math.max(Math.min(currentX, maxTranslate), -maxTranslate),
        y: Math.max(Math.min(currentY, maxTranslate), -maxTranslate)
      });
    }
  };

  const handleTouchEnd = () => {
    pinchStartDistRef.current = null;
    setIsDragging(false);
  };

  // Double Tap to toggle Zoom
  const lastTapRef = useRef<number>(0);
  const handleDoubleTap = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      e.preventDefault();
      if (zoomScale > 1) {
        handleResetZoom();
      } else {
        setZoomScale(2);
      }
    }
    lastTapRef.current = now;
  };

  // Mouse Drag Handlers for Desktop
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (zoomScale > 1) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - zoomTranslate.x,
        y: e.clientY - zoomTranslate.y
      };
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging && zoomScale > 1) {
      e.preventDefault();
      const currentX = e.clientX - dragStartRef.current.x;
      const currentY = e.clientY - dragStartRef.current.y;
      const maxTranslate = (zoomScale - 1) * 200;
      setZoomTranslate({
        x: Math.max(Math.min(currentX, maxTranslate), -maxTranslate),
        y: Math.max(Math.min(currentY, maxTranslate), -maxTranslate)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

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

                {/* 2. Autograph Session Rules & Lineup Matrix Card */}
                <div className="rounded-2xl p-4 bg-gradient-to-br from-[#fff7f9] to-[#fff0f4] dark:from-[#21050a] dark:to-[#170105] border border-rose-300/80 dark:border-rose-800/60 shadow-sm space-y-3.5">
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
                      {t.autographQuotaBadge}
                    </span>
                  </div>

                  <div className="space-y-2 text-xs text-rose-950 dark:text-rose-200/90 leading-relaxed font-medium">
                    <div className="flex items-start gap-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                      <MapPin className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                      <span>{autograph.location}</span>
                    </div>

                    {/* 3-Step Quota Flow */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                        <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                        <span className="text-[11px]"><strong>14:40</strong> {t.autographStepCheckin.replace('14:40 ', '')}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                        <Clock className="w-4 h-4 text-pink-600 dark:text-pink-400 flex-shrink-0" />
                        <span className="text-[11px]"><strong>15:00</strong> {t.autographStepAdmission.replace('15:00 ', '')}</span>
                      </div>
                      <div className="flex items-center gap-2 bg-white/70 dark:bg-black/30 p-2.5 rounded-xl border border-rose-200/60 dark:border-rose-900/40">
                        <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0" />
                        <span className="text-[11px]"><strong>15:10</strong> {t.autographStepStart.replace('15:10 ', '')}</span>
                      </div>
                    </div>

                    <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-900/80 dark:text-rose-300/80 pl-1">
                      <li>單曲簽名本及本人均需在場，一人限一本。</li>
                      <li>領完號碼牌並完成驗票後，請直接至三壘側簽名區帳篷依序等候。</li>
                    </ul>
                  </div>

                  {/* 簽名會出席女孩矩陣圖視圖 (Autograph Lineup Matrix View) */}
                  <div className="pt-2.5 border-t border-rose-200/80 dark:border-rose-900/40">
                    <div className="flex flex-wrap items-center justify-between gap-1 mb-2.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        <span className="text-xs sm:text-sm font-black text-rose-900 dark:text-rose-100">
                          {t.autographLineupTitle.replace('{count}', String(currentDayData.autographGirls?.length || 0))}
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-rose-800/80 dark:text-rose-300/80 font-medium">
                        {t.autographMatrixTip}
                      </span>
                    </div>

                    {/* 矩陣圖網格：手機 4 欄，平板/電腦 7 欄 */}
                    <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2">
                      {(currentDayData.autographGirls || []).map((girlName: string) => {
                        const girl = findGirl(girlName);
                        const isFav = favorites.includes(girl?.name || girlName);
                        const number = girl?.number || '—';
                        const photo = girl?.localPhoto || girl?.photo;

                        return (
                          <button
                            key={girlName}
                            type="button"
                            onClick={() => girl && onSelectGirl && onSelectGirl(girl)}
                            className={`group relative flex flex-col items-center justify-center p-1.5 sm:p-2 rounded-xl transition text-center active:scale-95 border cursor-pointer ${
                              isFav
                                ? 'bg-gradient-to-b from-rose-100 via-pink-50 to-amber-50 dark:from-rose-950/80 dark:to-[#2e0510] border-rose-400 dark:border-amber-400/80 shadow-md ring-2 ring-rose-400/50 dark:ring-amber-400/40'
                                : 'bg-white/90 hover:bg-rose-50 dark:bg-[#1f0207]/90 dark:hover:bg-[#2d050f] border-rose-200/80 dark:border-rose-900/50 shadow-2xs hover:border-rose-300'
                            }`}
                            title={`${girlName} (#${number}) - 點擊查看個人檔案與出勤班表`}
                          >
                            {/* 女孩圓形頭像（小圖） */}
                            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden mb-1 border-2 border-rose-200 dark:border-rose-900/60 bg-neutral-100 dark:bg-neutral-900 flex-shrink-0">
                              {photo ? (
                                <img
                                  src={photo}
                                  alt={girlName}
                                  className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                  loading="lazy"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-rose-500">
                                  {girlName.slice(0, 2)}
                                </div>
                              )}
                              {isFav && (
                                <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                                  <Heart className="w-3 h-3 text-rose-500 dark:text-rose-300 fill-rose-500 dark:fill-rose-300" />
                                </div>
                              )}
                            </div>

                            {/* 背號徽章（背號） */}
                            <span className="text-[11px] sm:text-xs font-black text-[#890022] dark:text-amber-300 leading-none mb-0.5">
                              #{number}
                            </span>

                            {/* 女孩姓名 */}
                            <span className="text-[10px] sm:text-[11px] font-bold text-slate-800 dark:text-rose-100 truncate max-w-full leading-tight">
                              {girl?.name || girlName}
                            </span>

                            {/* 外援標籤 (KR / JP) */}
                            {girl?.nationality && girl.nationality !== 'TW' && (
                              <span className="absolute top-1 right-1 px-1 py-0.2 rounded text-[8px] font-black leading-none uppercase bg-amber-400 text-black shadow-xs">
                                {girl.nationality}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
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
                    {currentDayData.boothEvents.map((evt: any, idx: number) => (
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
                          {evt.girls.map((girlName: string) => {
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
                {/* Visual Map Frame with Pinch-to-Zoom & Pan */}
                <div className="relative rounded-2xl overflow-hidden border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-black/60 shadow-inner">
                  {/* Floating Zoom Control Toolbar */}
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-xl border border-white/20 text-white shadow-lg">
                    <button
                      type="button"
                      onClick={() => setZoomScale(s => Math.min(s + 0.5, 3.5))}
                      className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition text-amber-200"
                      title="放大"
                      aria-label="放大"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setZoomScale(s => {
                          const next = Math.max(s - 0.5, 1);
                          if (next === 1) setZoomTranslate({ x: 0, y: 0 });
                          return next;
                        });
                      }}
                      className="p-1 rounded-lg hover:bg-white/20 active:scale-90 transition text-amber-200"
                      title="縮小"
                      aria-label="縮小"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    {zoomScale > 1 && (
                      <button
                        type="button"
                        onClick={handleResetZoom}
                        className="px-1.5 py-1 text-[10px] font-black rounded-lg bg-rose-600 hover:bg-rose-500 text-white active:scale-90 transition flex items-center gap-1"
                        title={t.boothZoomReset}
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>{t.boothZoomReset}</span>
                      </button>
                    )}
                    <span className="text-[10px] font-extrabold text-white/80 px-1 border-l border-white/20">
                      {Math.round(zoomScale * 100)}%
                    </span>
                  </div>

                  {/* Interactive Map Viewport */}
                  <div
                    ref={containerRef}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onClick={handleDoubleTap}
                    className={`relative w-full h-[360px] sm:h-[450px] overflow-hidden flex items-center justify-center select-none ${
                      zoomScale > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-zoom-in'
                    }`}
                    style={{ touchAction: 'none' }}
                  >
                    <div
                      style={{
                        transform: `translate3d(${zoomTranslate.x}px, ${zoomTranslate.y}px, 0px) scale(${zoomScale})`,
                        transformOrigin: 'center center',
                        transition: isDragging ? 'none' : 'transform 0.2s cubic-bezier(0.25, 1, 0.5, 1)',
                        willChange: 'transform'
                      }}
                      className="w-full h-full flex items-center justify-center p-2"
                    >
                      <picture className="pointer-events-none w-full h-full flex items-center justify-center">
                        <source srcSet="./theme/spicy_cool_sweet_booth_map.webp" type="image/webp" />
                        <img
                          src="./theme/spicy_cool_sweet_booth_map.jpg"
                          alt="樂天桃園棒球場攤位位置圖與號碼牌排隊動線"
                          width="1080"
                          height="1080"
                          loading="eager"
                          decoding="async"
                          draggable={false}
                          className="w-full h-full object-contain rounded-xl"
                        />
                      </picture>
                    </div>

                    {/* Hint overlay for first-time viewers */}
                    {zoomScale === 1 && (
                      <div className="absolute bottom-2.5 inset-x-3 pointer-events-none flex items-center justify-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-[11px] font-semibold text-rose-100 border border-white/15 shadow-md animate-fade-in">
                          <Move className="w-3.5 h-3.5 text-amber-300" />
                          <span>{t.boothZoomTip}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <p className="text-center text-[11px] text-rose-950/60 dark:text-rose-300/60 py-2 font-medium bg-rose-50/50 dark:bg-black/40 border-t border-rose-100 dark:border-rose-950">
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
                      {preMatchConfig.boothMapLegend[0]?.booths.map((b: any) => (
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
                      {preMatchConfig.boothMapLegend[1]?.booths.map((b: any) => (
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
