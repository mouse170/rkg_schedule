import React from 'react';
import { Heart, ExternalLink, Sparkles, MapPin, Flame } from 'lucide-react';
import { GirlProfile, DailyDuty } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';
import { getRelativeDateInfo, translateLocation } from '../utils/dateUtils';

interface GirlCardProps {
  girl: GirlProfile;
  duties: DailyDuty[];
  selectedDate: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, girlName: string) => void;
  onClick: (girl: GirlProfile) => void;
  priority?: boolean;
}

export const GirlCard: React.FC<GirlCardProps> = ({
  girl,
  duties,
  selectedDate,
  isFavorite,
  onToggleFavorite,
  onClick,
  priority = false
}) => {
  const { language, t } = useLanguage();
  // Duty on selected date (if a date is chosen)
  const currentDuty = selectedDate
    ? duties.find(d => d.date === selectedDate)
    : duties[0]; // most recent duty

  const isOnDuty = selectedDate
    ? duties.some(d => d.date === selectedDate)
    : duties.length > 0;

  const dateRelInfo = selectedDate ? getRelativeDateInfo(selectedDate, language) : null;
  const isTodayDuty = isOnDuty && dateRelInfo?.isToday;

  return (
    <div
      onClick={() => onClick(girl)}
      className="group relative flex flex-col justify-between bg-white dark:bg-oled-card rounded-2xl p-2.5 sm:p-3 border border-pink-100/90 dark:border-oled-border shadow-card-soft dark:shadow-card-oled hover:shadow-card-hover hover:-translate-y-0.5 hover:border-pink-300 dark:hover:border-pink-700 transition duration-300 cursor-pointer overflow-hidden card-render-layer"
    >
      <div>
        {/* Top Header: Number & Favorite Button */}
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <span className="font-extrabold text-xs text-pink-600 dark:text-pink-400">
            #{girl.number}
          </span>
          <button
            onClick={(e) => onToggleFavorite(e, girl.name)}
            className="p-1 rounded-full text-gray-300 dark:text-gray-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition active:scale-90"
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
        <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-gray-100 dark:bg-oled-surface mb-2 border border-pink-50 dark:border-oled-border">
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
            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-300"
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
              isTodayDuty ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-rkg-crimson text-white text-[9px] sm:text-[10px] font-black shadow-md ring-1 ring-white/50 animate-pulse whitespace-nowrap">
                  <Flame className="w-2.5 h-2.5 text-amber-300" />
                  <span>{t.onDutyToday}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/95 text-white text-[9px] sm:text-[10px] font-bold shadow-sm whitespace-nowrap">
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>{selectedDate ? `${selectedDate} ${t.onDuty}` : `${t.dutyCount.replace('{count}', String(duties.length))}`}</span>
                </span>
              )
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-700/90 text-gray-200 text-[9px] sm:text-[10px] font-medium shadow-sm whitespace-nowrap">
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

          {/* Cheering Inning Pills */}
          {selectedDate ? (
            /* 單一指定日期模式 */
            currentDuty ? (
              currentDuty.innings.length > 0 ? (
                <div className="mt-2 pt-2 border-t border-pink-50 dark:border-oled-border flex flex-wrap gap-1">
                  {currentDuty.innings.map((inn, idx) => {
                    const loc = inn.location;
                    const isMid = inn.period.includes('中場');
                    let badgeStyle = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60';
                    if (isMid) {
                      badgeStyle = 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-black';
                    } else if (loc === '東R' || loc.includes('東R')) {
                      badgeStyle = 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-black';
                    } else if (loc === '西R' || loc.includes('西R')) {
                      badgeStyle = 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 font-black';
                    } else if (loc.includes('大樂')) {
                      badgeStyle = 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-black';
                    } else if (loc.includes('專區')) {
                      badgeStyle = 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-800 dark:text-fuchsia-300 border border-fuchsia-300 dark:border-fuchsia-800 font-black';
                    } else if (loc.includes('東')) {
                      badgeStyle = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60';
                    } else if (loc.includes('西')) {
                      badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60';
                    }
                    return (
                      <span
                        key={idx}
                        className={`inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${badgeStyle}`}
                      >
                        <MapPin className="w-2.5 h-2.5 opacity-70 flex-shrink-0" />
                        <span>{inn.period}:{translateLocation(inn.location, language)}</span>
                      </span>
                    );
                  })}
                </div>
              ) : (
                <div className="mt-2 pt-2 border-t border-pink-50 dark:border-oled-border">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-pink-50 dark:bg-pink-950/50 text-rkg-pink-deep dark:text-pink-300 border border-pink-200/70 dark:border-pink-800/60 whitespace-nowrap">
                    <MapPin className="w-2.5 h-2.5 opacity-60 flex-shrink-0" />
                    <span>{t.locationTBD}</span>
                  </span>
                </div>
              )
            ) : (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-pink-50 dark:border-oled-border">
                {t.noDutyNotice}
              </p>
            )
          ) : (
            /* 全部天數模式：結構化日期清單，確保小手機雙欄下排版垂直對齊不錯亂 */
            duties.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-pink-50 dark:border-oled-border space-y-1.5">
                {duties.map((duty, dIdx) => (
                  <div
                    key={dIdx}
                    className="p-1 sm:p-1.5 rounded-xl bg-pink-50/50 dark:bg-oled-surface border border-pink-100/60 dark:border-oled-border"
                  >
                    {/* 日期標頭 */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-md bg-pink-100 dark:bg-pink-950/80 text-rkg-pink-deep dark:text-pink-300 font-black text-[9px] sm:text-[10px] whitespace-nowrap">
                        <span>{duty.date}</span>
                      </span>
                    </div>

                    {/* 該日局數膠囊 */}
                    {duty.innings.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-1">
                        {duty.innings.map((inn, iIdx) => {
                          const loc = inn.location;
                          const isMid = inn.period.includes('中場');
                          let badgeStyle = 'bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/60';
                          if (isMid) {
                            badgeStyle = 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-black';
                          } else if (loc === '東R' || loc.includes('東R')) {
                            badgeStyle = 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-800 font-black';
                          } else if (loc === '西R' || loc.includes('西R')) {
                            badgeStyle = 'bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300 dark:border-teal-800 font-black';
                          } else if (loc.includes('大樂')) {
                            badgeStyle = 'bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 font-black';
                          } else if (loc.includes('專區')) {
                            badgeStyle = 'bg-fuchsia-50 dark:bg-fuchsia-950/60 text-fuchsia-800 dark:text-fuchsia-300 border border-fuchsia-300 dark:border-fuchsia-800 font-black';
                          } else if (loc.includes('東')) {
                            badgeStyle = 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800/60';
                          } else if (loc.includes('西')) {
                            badgeStyle = 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60';
                          }
                          return (
                            <span
                              key={iIdx}
                              className={`inline-flex items-center px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold whitespace-nowrap flex-shrink-0 ${badgeStyle}`}
                            >
                              <span>{inn.period}:{translateLocation(inn.location, language)}</span>
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
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-pink-50 dark:border-oled-border">
                {t.noDutyNotice}
              </p>
            )
          )}
        </div>
      </div>

      {/* Card Action Hint */}
      <div className="mt-2.5 sm:mt-3 pt-2 text-center border-t border-pink-50/80 dark:border-oled-border">
        <span className="text-[11px] text-rkg-pink-deep dark:text-rkg-pink font-semibold group-hover:underline">
          {t.viewSchedule}
        </span>
      </div>
    </div>
  );
};
