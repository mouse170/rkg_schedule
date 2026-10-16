import React, { useMemo } from 'react';
import { Heart, ExternalLink, Sparkles, MapPin, Flame } from 'lucide-react';
import { GirlProfile, DailyDuty } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';
import { getRelativeDateInfo, translateLocation, isPastDate } from '../utils/dateUtils';
import { isSpicyCoolSweetDate, getZoneAssignment } from '../data/spicyCoolSweetData';
import { SeatFilterType } from './FilterBar';

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
  seatFilter?: SeatFilterType | null;
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

  // 專區女孩標示簡化：比賽期間都在自己專區，專區只需標示一個
  const displayInnings = useMemo(() => {
    if (!currentDuty || currentDuty.innings.length === 0) return [];
    if (!zoneAssign) return currentDuty.innings;

    // 若為專區女孩：合併 1-3 與 7-8 專區為單一「全場專區」標籤，保留賽後表演（若有）
    const postMatchInning = currentDuty.innings.find(i => i.period.includes('賽後'));
    const zonePill = {
      period: '全場專區',
      location: `${zoneAssign.zoneCode}專區`
    };

    if (postMatchInning) {
      return [zonePill, postMatchInning];
    }
    return [zonePill];
  }, [currentDuty, zoneAssign]);

  // 動態邊框與光暈樣式（方案 A）
  let cardBorderGlowClass = 'border-pink-100/90 dark:border-oled-border shadow-card-soft dark:shadow-card-oled hover:border-pink-300 dark:hover:border-pink-700';
  if (isPaired) {
    cardBorderGlowClass = 'animate-paired-shimmer border-pink-400 dark:border-pink-500 ring-2 ring-pink-400/60 dark:ring-pink-500/50';
  }
  if (isPartnerHovered) {
    cardBorderGlowClass = 'ring-2 ring-amber-400 shadow-purple-glow animate-partner-highlight border-amber-300';
  }

  return (
    <div
      onClick={() => onClick(girl)}
      onMouseEnter={() => {
        if (onHover) onHover(girl.name);
        import('./GirlDetailDrawer');
      }}
      onTouchStart={() => {
        import('./GirlDetailDrawer');
      }}
      onMouseLeave={() => onHover && onHover(null)}
      className={`group relative flex flex-col justify-between bg-[#fff5f7] dark:bg-[#1a0308] rounded-2xl p-2.5 sm:p-3 hover:-translate-y-0.5 transition duration-300 cursor-pointer overflow-hidden card-render-layer ${cardBorderGlowClass}`}
    >
      <div>
        {/* Top Header: Number, Paired Badge & Favorite Button */}
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1 min-w-0">
            <span className="font-extrabold text-xs text-rose-700 dark:text-amber-300">
              背號 {girl.number}
            </span>
            {isPaired && (
              <span
                className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full bg-[#890022] text-white text-[9px] font-black whitespace-nowrap cursor-help"
                title={`${t.pairedPartnerHint.replace('{partner}', pairedInfo.partnerNames.join('、'))} (${pairedInfo.period} ${translateLocation(pairedInfo.location, language)})`}
              >
                <span>{pairedInfo.period} {translateLocation(pairedInfo.location, language)}</span>
              </span>
            )}
          </div>
          <button
            onClick={(e) => onToggleFavorite(e, girl.name)}
            className="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-90"
            title={isFavorite ? '取消最愛' : '加入最愛'}
          >
            <Heart
              className={`w-4 h-4 transition ${
                isFavorite
                  ? 'fill-rose-500 text-rose-500 scale-110'
                  : 'stroke-[2.2]'
              }`}
            />
          </button>
        </div>

        {/* Member Photo */}
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-oled-surface mb-2">
          <img
            src={girl.localPhoto}
            alt={girl.name}
            width="200"
            height="250"
            loading={priority ? 'eager' : 'lazy'}
            decoding="async"
            {...(priority ? { fetchPriority: 'high' as const } : {})}
            onError={(e) => {
              // Fallback to official remote URL if local photo fails
              (e.target as HTMLImageElement).src = girl.photo;
            }}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
          />

          {/* Role Badge (Captain / Vice Captain) */}
          {girl.role && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-[#c59b27] text-[#1a0007] text-[9px] sm:text-[10px] font-bold whitespace-nowrap">
              {girl.role}
            </div>
          )}

          {/* Duty Status Ribbon */}
          <div className="absolute bottom-2 right-2">
            {isOnDuty ? (
              isThemeDay ? (
                zoneAssign ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#c59b27] text-[#1a0007] text-[9px] sm:text-[10px] font-black whitespace-nowrap">
                    <Sparkles className="w-2.5 h-2.5 text-[#1a0007] fill-[#1a0007]" />
                    <span>專區應援</span>
                  </span>
                ) : null
              ) : isTodayDuty ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#890022] text-white text-[9px] sm:text-[10px] font-black whitespace-nowrap">
                  <Flame className="w-2.5 h-2.5 text-amber-300" />
                  <span>{t.onDutyToday}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#890022] text-white text-[9px] sm:text-[10px] font-bold whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{selectedDate ? `${selectedDate} ${t.onDuty}` : `${t.dutyCount.replace('{count}', String(duties.length))}`}</span>
                </span>
              )
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-800 text-gray-200 text-[9px] sm:text-[10px] font-medium whitespace-nowrap">
                {t.offDuty}
              </span>
            )}
          </div>
        </div>

        {/* Member Info */}
        <div className="px-0.5">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-sm sm:text-base text-gray-900 dark:text-white group-hover:text-rkg-pink-deep dark:group-hover:text-rkg-pink transition truncate">
              {girl.name}
            </h3>
            {girl.instagramHandle && (
              <a
                href={girl.instagram!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-gray-400 dark:text-gray-400 hover:text-pink-600 dark:hover:text-pink-400 transition"
                title={`前往 @${girl.instagramHandle}`}
              >
                <span>IG</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          {/* Theme Day Zone Info Tag */}
          {zoneAssign && (
            <div className="mt-1 mb-1 px-1.5 py-0.5 rounded-lg bg-amber-500/15 dark:bg-amber-950/40 border border-amber-500/40 text-[10px] font-black text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span>{zoneAssign.name}</span>
              <span className="text-[9px] font-semibold opacity-80">{zoneAssign.ticketType.split(' ')[0]}</span>
            </div>
          )}

          {/* Cheering Inning Pills */}
          {selectedDate ? (
            /* 單一指定日期模式 */
            currentDuty ? (
              displayInnings.length > 0 ? (
                <div className="mt-2 pt-2 flex flex-wrap gap-1">
                  {displayInnings.map((inn, idx) => {
                    const loc = inn.location;
                    const isMid = inn.period.includes('中場');
                    const isPostMatch = inn.period.includes('賽後');
                    const isZoneSingle = inn.period === '全場專區';
                    const isPending = loc.includes('待公布');
                    let badgeStyle = 'bg-rose-900 text-rose-100 font-bold';
                    if (isZoneSingle) {
                      badgeStyle = 'bg-[#c59b27] text-[#1a0007] font-black';
                    } else if (isPostMatch) {
                      if (loc.includes('東')) {
                        badgeStyle = 'bg-rose-950 text-rose-200 font-black';
                      } else {
                        badgeStyle = 'bg-zinc-900 text-zinc-100 font-black';
                      }
                    } else if (isPending) {
                      badgeStyle = 'bg-pink-100 dark:bg-pink-950/50 text-pink-700 dark:text-pink-300 font-medium';
                    } else if (isMid) {
                      badgeStyle = 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black';
                    } else if (loc === '東R' || loc.includes('東R')) {
                      badgeStyle = 'bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-200 font-black';
                    } else if (loc === '西R' || loc.includes('西R')) {
                      badgeStyle = 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-black';
                    } else if (loc.includes('大樂')) {
                      badgeStyle = 'bg-zinc-800 text-amber-200 font-black';
                    } else if (loc.includes('專區')) {
                      badgeStyle = 'bg-[#890022] text-amber-200 font-black';
                    } else if (loc.includes('東')) {
                      badgeStyle = 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold';
                    } else if (loc.includes('西')) {
                      badgeStyle = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold';
                    }

                    // 檢查此時段是否精確對應使用者當前選定的座位視角
                    let isSeatFocused = false;
                    let isSeatDimmed = false;
                    if (seatFilter) {
                      const isZoneMember = Boolean(zoneAssign) || isZoneSingle || loc.includes('專區');
                      const matchesSeat =
                        (seatFilter === 'SEAT_EAST' && !isZoneMember && loc.includes('東') && !loc.includes('東R')) ||
                        (seatFilter === 'SEAT_WEST' && !isZoneMember && loc.includes('西') && !loc.includes('西R')) ||
                        (seatFilter === 'SEAT_ZONE' && isZoneMember) ||
                        (seatFilter === 'SEAT_DALE' && loc.includes('大樂')) ||
                        (seatFilter === 'SEAT_EAST_R' && loc.includes('東R')) ||
                        (seatFilter === 'SEAT_WEST_R' && loc.includes('西R'));
                      if (matchesSeat) {
                        isSeatFocused = true;
                      } else {
                        isSeatDimmed = true;
                      }
                    }

                    const focusClass = isSeatFocused
                      ? 'ring-2 ring-amber-400 dark:ring-amber-500 font-black scale-105 transition-transform'
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
                <div className="mt-2 pt-2">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-100 dark:bg-pink-950/50 text-rose-800 dark:text-pink-300 whitespace-nowrap">
                    <MapPin className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
                    <span>{t.locationTBD}</span>
                  </span>
                </div>
              )
            ) : (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 pt-2">
                {t.noDutyNotice}
              </p>
            )
          ) : (
            /* 全部天數模式：結構化日期清單 */
            activeDuties.length > 0 ? (
              <div className="mt-2 pt-2 space-y-1.5">
                {activeDuties.map((duty, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-1 sm:p-1.5 rounded-xl bg-pink-100/40 dark:bg-oled-surface"
                  >
                    {/* 日期標頭 */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-pink-200/80 dark:bg-pink-950/80 text-rose-900 dark:text-pink-200 font-black text-[9px] sm:text-[10px] whitespace-nowrap">
                        <span>{duty.date}</span>
                      </span>
                    </div>

                    {/* 該日局數膠囊 */}
                    {duty.innings.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {duty.innings.map((inn, iIdx) => {
                          const loc = inn.location;
                          const isMid = inn.period.includes('中場');
                          const isPostMatch = inn.period.includes('賽後');
                          let badgeStyle = 'bg-rose-900 text-rose-100 font-bold';
                          if (isPostMatch) {
                            if (loc.includes('東')) {
                              badgeStyle = 'bg-rose-950 text-rose-200 font-black';
                            } else {
                              badgeStyle = 'bg-zinc-900 text-zinc-100 font-black';
                            }
                          } else if (isMid) {
                            badgeStyle = 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-200 font-black';
                          } else if (loc === '東R' || loc.includes('東R')) {
                            badgeStyle = 'bg-cyan-100 dark:bg-cyan-950 text-cyan-900 dark:text-cyan-200 font-black';
                          } else if (loc === '西R' || loc.includes('西R')) {
                            badgeStyle = 'bg-teal-100 dark:bg-teal-950 text-teal-900 dark:text-teal-200 font-black';
                          } else if (loc.includes('大樂')) {
                            badgeStyle = 'bg-zinc-800 text-amber-200 font-black';
                          } else if (inn.period === '全場專區' || loc.includes('專區')) {
                            badgeStyle = 'bg-[#c59b27] text-[#1a0007] font-black';
                          } else if (loc.includes('待公布')) {
                            badgeStyle = 'bg-pink-100 dark:bg-pink-950/40 text-rose-700 dark:text-pink-300 font-medium';
                          } else if (loc.includes('東')) {
                            badgeStyle = 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 font-bold';
                          } else if (loc.includes('西')) {
                            badgeStyle = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-900 dark:text-emerald-200 font-bold';
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
                      <span className="inline-flex items-center gap-0.5 text-[9px] sm:text-[10px] font-bold text-pink-500 dark:text-pink-400 whitespace-nowrap">
                        <span>{t.locationTBD}</span>
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-2 pt-1">
                {t.noDutyNotice}
              </p>
            )
          )}
        </div>
      </div>

      {/* Card Action Hint */}
      <div className="mt-2.5 sm:mt-3 pt-2 text-center">
        <span className="text-[11px] text-rose-800 dark:text-rose-300 font-semibold group-hover:underline">
          {t.viewSchedule}
        </span>
      </div>
    </div>
  );
};
