import React from 'react';
import { Heart, ExternalLink, Sparkles, MapPin, Flame } from 'lucide-react';
import { GirlProfile, DailyDuty } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';
import { getRelativeDateInfo, translateLocation, isPastDate } from '../utils/dateUtils';
import { isSpicyCoolSweetDate, getZoneAssignment } from '../data/spicyCoolSweetData';

export interface PairedInfo {
  isPaired: boolean;
  location: string;
  period: string;
  partnerNames: string[];
}

interface GirlCardProps {
  girl: GirlProfile;
  duties: DailyDuty[];
  selectedDate: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, girlName: string) => void;
  onClick: (girl: GirlProfile) => void;
  priority?: boolean;
  pairedInfo?: PairedInfo;
  isPartnerHovered?: boolean;
  onHover?: (girlName: string | null) => void;
  seatFilter?: 'SEAT_EAST' | 'SEAT_WEST' | 'SEAT_DALE' | 'SEAT_EAST_R' | 'SEAT_WEST_R' | null;
}

export const GirlCard: React.FC<GirlCardProps> = ({
  girl,
  duties,
  selectedDate,
  isFavorite,
  onToggleFavorite,
  onClick,
  priority = false,
  pairedInfo,
  isPartnerHovered = false,
  onHover,
  seatFilter = null
}) => {
  const { language, t } = useLanguage();
  // 過濾掉已過去的歷史日期
  const activeDuties = duties.filter(d => !isPastDate(d.date));

  // Duty on selected date (if a date is chosen)
  const currentDuty = selectedDate
    ? duties.find(d => d.date === selectedDate)
    : activeDuties[0]; // 最靠近之未來排班

  const isOnDuty = selectedDate
    ? duties.some(d => d.date === selectedDate)
    : activeDuties.length > 0;

  const dateRelInfo = selectedDate ? getRelativeDateInfo(selectedDate, language) : null;
  const isTodayDuty = isOnDuty && dateRelInfo?.isToday;

  const isThemeDay = isSpicyCoolSweetDate(selectedDate);
  const zoneAssign = isThemeDay ? getZoneAssignment(selectedDate, girl.name) : undefined;

  const isPaired = pairedInfo?.isPaired;

  // 動態邊框與光暈樣式
  let cardBorderGlowClass = 'border-border/70 hover:border-primary/50';
  if (isPaired) {
    cardBorderGlowClass = 'animate-paired-shimmer border-pink-400 dark:border-pink-500 ring-2 ring-pink-400/60 dark:ring-pink-500/50';
  }
  if (isPartnerHovered) {
    cardBorderGlowClass = 'ring-2 ring-amber-400 shadow-purple-glow animate-partner-highlight border-amber-300';
  }

  return (
    <div
      onClick={() => onClick(girl)}
      onMouseEnter={() => onHover && onHover(girl.name)}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group relative flex flex-col justify-between bg-card text-card-foreground rounded-2xl p-2.5 sm:p-3 border shadow-bento dark:shadow-bento-dark hover:shadow-bento-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden card-render-layer ${cardBorderGlowClass}`}
    >
      <div>
        {/* Top Header: Number, Paired Badge & Favorite Button */}
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-extrabold text-xs text-primary">
              #{girl.number}
            </span>
            {isPaired && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-amber-400 text-white text-[9px] font-black shadow-sm animate-pulse whitespace-nowrap cursor-help"
                title={`${t.pairedPartnerHint.replace('{partner}', pairedInfo.partnerNames.join('、'))} (${pairedInfo.period} ${translateLocation(pairedInfo.location, language)})`}
              >
                <span>✨</span>
                <span>{pairedInfo.period} {translateLocation(pairedInfo.location, language)}</span>
              </span>
            )}
          </div>
          <button
            onClick={(e) => onToggleFavorite(e, girl.name)}
            className="p-1 rounded-full text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 transition-colors active:scale-90"
            title={isFavorite ? '取消最愛' : '加入最愛'}
          >
            <Heart
              className={`w-4 h-4 transition-transform ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500 scale-110 animate-heart-pulse'
                  : 'stroke-[2.2]'
              }`}
            />
          </button>
        </div>

        {/* Member Photo */}
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-muted/60 mb-2 border border-border/50">
          <img
            src={girl.localPhoto}
            alt={girl.name}
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            fetchPriority={priority ? 'high' : 'auto'}
            onError={(e) => {
              // Fallback to official remote URL if local photo fails
              (e.target as HTMLImageElement).src = girl.photo;
            }}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
          />

          {/* Role Badge (Captain / Vice Captain) */}
          {girl.role && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] sm:text-[10px] font-bold shadow-sm whitespace-nowrap">
              {girl.role}
            </div>
          )}

          {/* Duty Status Ribbon */}
          <div className="absolute bottom-2 right-2">
            {isOnDuty ? (
              isThemeDay ? (
                zoneAssign ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] text-[9px] sm:text-[10px] font-black shadow-md ring-1 ring-amber-300 whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-[#1a0007] fill-[#1a0007]" />
                    <span>專區應援</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-[#3d000f] to-[#73001e] border border-amber-400/40 text-amber-200 text-[9px] sm:text-[10px] font-bold shadow-sm whitespace-nowrap">
                    <span>全員出席</span>
                  </span>
                )
              ) : isTodayDuty ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary text-primary-foreground text-[9px] sm:text-[10px] font-black shadow-md ring-1 ring-white/40 animate-pulse whitespace-nowrap">
                  <Flame className="w-2.5 h-2.5 text-amber-300" />
                  <span>{t.onDutyToday}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/90 text-primary-foreground text-[9px] sm:text-[10px] font-bold shadow-sm whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{selectedDate ? `${selectedDate} ${t.onDuty}` : `${t.dutyCount.replace('{count}', String(duties.length))}`}</span>
                </span>
              )
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-muted/90 text-muted-foreground text-[9px] sm:text-[10px] font-medium shadow-sm whitespace-nowrap border border-border/60">
                {t.offDuty}
              </span>
            )}
          </div>
        </div>

        {/* Member Info */}
        <div className="px-0.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors truncate">
              {girl.name}
            </h3>
            {girl.instagramHandle && (
              <a
                href={girl.instagram!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-muted-foreground hover:text-primary transition-colors"
                title={`前往 @${girl.instagramHandle}`}
              >
                <span>IG</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          {/* Theme Day Zone Info Tag */}
          {zoneAssign && (
            <div className="mt-1 mb-1 px-1.5 py-0.5 rounded-lg bg-amber-500/15 dark:bg-amber-950/40 border border-amber-500/40 text-[10px] font-black text-amber-800 dark:text-amber-300 flex items-center justify-between shadow-sm">
              <span>{zoneAssign.name}</span>
              <span className="text-[9px] font-semibold opacity-80">{zoneAssign.ticketType.split(' ')[0]}</span>
            </div>
          )}

          {/* Cheering Inning Pills */}
          {selectedDate ? (
            /* 單一指定日期模式 */
            currentDuty ? (
              currentDuty.innings.length > 0 ? (
                <div className="mt-2 pt-2 border-t border-border/40 flex flex-wrap gap-1">
                  {currentDuty.innings.map((inn, idx) => {
                    const loc = inn.location;
                    const isMid = inn.period.includes('中場');
                    const isZoneSingle = inn.period === '全場專區';
                    const isPending = loc.includes('待公布');
                    let badgeStyle = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60';
                    if (isZoneSingle) {
                      badgeStyle = 'bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 text-amber-950 dark:text-amber-200 border border-amber-400/70 font-black shadow-sm ring-1 ring-amber-400/30';
                    } else if (isPending) {
                      badgeStyle = 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-300/60 dark:border-pink-800/50 font-medium';
                    } else if (isMid) {
                      badgeStyle = 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-black';
                    } else if (loc === '東R' || loc.includes('東R')) {
                      badgeStyle = 'bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-black';
                    } else if (loc === '西R' || loc.includes('西R')) {
                      badgeStyle = 'bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 font-black';
                    } else if (loc.includes('大樂')) {
                      badgeStyle = 'bg-violet-500/10 text-violet-900 dark:text-violet-200 border border-violet-300 dark:border-violet-700 font-black shadow-sm';
                    } else if (loc.includes('專區')) {
                      badgeStyle = 'bg-gradient-to-r from-red-950/85 to-amber-950/85 text-amber-300 border border-amber-500/70 font-black shadow-sm ring-1 ring-amber-400/30';
                    } else if (loc.includes('東')) {
                      badgeStyle = 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60 font-medium';
                    } else if (loc.includes('西')) {
                      badgeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60 font-medium';
                    }

                    // 檢查此時段是否精確對應使用者當前選定的座位視角
                    let isSeatFocused = false;
                    let isSeatDimmed = false;
                    if (seatFilter) {
                      const matchesSeat =
                        (seatFilter === 'SEAT_EAST' && loc.includes('東') && !loc.includes('東R')) ||
                        (seatFilter === 'SEAT_WEST' && loc.includes('西') && !loc.includes('西R')) ||
                        (seatFilter === 'SEAT_DALE' && (loc.includes('大樂') || (loc.includes('專區') && !loc.includes('東') && !loc.includes('西')))) ||
                        (seatFilter === 'SEAT_EAST_R' && loc.includes('東R')) ||
                        (seatFilter === 'SEAT_WEST_R' && loc.includes('西R'));
                      if (matchesSeat) {
                        isSeatFocused = true;
                      } else {
                        isSeatDimmed = true;
                      }
                    }

                    const focusClass = isSeatFocused
                      ? 'ring-2 ring-amber-400 dark:ring-amber-500 shadow-sm font-black scale-105 transition-transform'
                      : isSeatDimmed
                      ? 'opacity-40'
                      : '';

                    let labelText = `${inn.period}:${translateLocation(inn.location, language)}`;
                    if (isZoneSingle) {
                      labelText = `全場專區 ‧ ${zoneAssign ? zoneAssign.zoneCode : inn.location}`;
                    } else if (isPending) {
                      labelText = inn.location;
                    }

                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${badgeStyle} ${focusClass}`}
                      >
                        {isZoneSingle ? (
                          <Sparkles className="w-2.5 h-2.5 text-amber-500 flex-shrink-0" />
                        ) : (
                          <MapPin className="w-2.5 h-2.5 opacity-70 flex-shrink-0" />
                        )}
                        <span>{labelText}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-border/40">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-primary/10 text-primary border border-primary/20 whitespace-nowrap">
                    <MapPin className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
                    <span>{t.locationTBD}</span>
                  </span>
                </div>
              )
            ) : (
              <p className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/40">
                {t.noDutyNotice}
              </p>
            )
          ) : (
            /* 全部天數模式：結構化日期清單，確保小手機雙欄下排版垂直對齊不錯亂 */
            activeDuties.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-border/40 space-y-1.5">
                {activeDuties.map((duty, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-1 sm:p-1.5 rounded-xl bg-muted/40 border border-border/40"
                  >
                    {/* 日期標頭 */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-primary/10 text-primary font-black text-[9px] sm:text-[10px] whitespace-nowrap">
                        <span>{duty.date}</span>
                      </span>
                    </div>

                    {/* 該日局數膠囊 */}
                    {duty.innings.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {duty.innings.map((inn, iIdx) => {
                          const loc = inn.location;
                          const isMid = inn.period.includes('中場');
                          let badgeStyle = 'bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 font-medium';
                          if (isMid) {
                            badgeStyle = 'bg-amber-500/10 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-black';
                          } else if (loc === '東R' || loc.includes('東R')) {
                            badgeStyle = 'bg-cyan-500/10 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-black';
                          } else if (loc === '西R' || loc.includes('西R')) {
                            badgeStyle = 'bg-teal-500/10 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 font-black';
                          } else if (loc.includes('大樂')) {
                            badgeStyle = 'bg-violet-500/10 text-violet-900 dark:text-violet-200 border border-violet-300 dark:border-violet-700 font-black shadow-sm';
                          } else if (inn.period === '全場專區' || loc.includes('專區')) {
                            badgeStyle = 'bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-700 font-black shadow-sm';
                          } else if (loc.includes('待公布')) {
                            badgeStyle = 'bg-pink-500/10 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40 font-medium';
                          } else if (loc.includes('東')) {
                            badgeStyle = 'bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-200/80 dark:border-blue-800/60';
                          } else if (loc.includes('西')) {
                            badgeStyle = 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/80 dark:border-emerald-800/60';
                          }

                          let allDaysLabel = `${inn.period}:${translateLocation(inn.location, language)}`;
                          if (inn.period === '全場專區') {
                            allDaysLabel = `全場專區 ‧ ${inn.location}`;
                          } else if (loc.includes('待公布')) {
                            allDaysLabel = inn.location;
                          }

                          return (
                            <span
                              key={iIdx}
                              className={`inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${badgeStyle}`}
                            >
                              <span>{allDaysLabel}</span>
                            </span>
                          );
                        })}
                      </div>
                    ) : (
                      <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-primary whitespace-nowrap">
                        <span>{t.locationTBD}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-muted-foreground mt-2 pt-2 border-t border-border/40">
                {t.noDutyNotice}
              </p>
            )
          )}
        </div>
      </div>

      {/* Card Action Hint */}
      <div className="mt-2.5 sm:mt-3 pt-2 text-center border-t border-border/40">
        <span className="text-[11px] text-primary font-semibold group-hover:underline">
          {t.viewSchedule}
        </span>
      </div>
    </div>
  );
};
