import React from 'react';
import { Heart, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { GirlProfile, DailyDuty } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';

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
  const { t } = useLanguage();
  // Duty on selected date (if a date is chosen)
  const currentDuty = selectedDate
    ? duties.find(d => d.date === selectedDate)
    : duties[0]; // most recent duty

  const isOnDuty = selectedDate ? !!currentDuty : duties.length > 0;

  return (
    <div
      onClick={() => onClick(girl)}
      className="group relative bg-white dark:bg-oled-card rounded-3xl p-3 sm:p-3.5 shadow-card-soft dark:shadow-card-oled hover:shadow-pink-glow dark:hover:shadow-pink-glow-oled border border-pink-100/90 dark:border-oled-border hover:border-rkg-pink/50 dark:hover:border-rkg-pink transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-[0.98]"
    >
      {/* Favorite Heart Button */}
      <button
        onClick={(e) => onToggleFavorite(e, girl.name)}
        className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full bg-white/90 dark:bg-oled-surface/90 backdrop-blur-sm shadow-sm hover:scale-110 active:scale-95 transition"
        title={isFavorite ? '取消最愛' : '加入最愛'}
      >
        <Heart
          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition ${
            isFavorite
              ? 'fill-rose-500 text-rose-500 animate-heart-pulse'
              : 'text-gray-300 dark:text-gray-600 hover:text-rose-400'
          }`}
        />
      </button>

      {/* Portrait & Badges */}
      <div>
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100/50 dark:from-oled-surface dark:to-oled-card mb-2.5 sm:mb-3">
          <img
            src={girl.localPhoto}
            alt={girl.name}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Fallback 1: Try local JPG if WebP fails
              if (target.src.endsWith('.webp')) {
                target.src = target.src.replace('.webp', '.jpg');
                return;
              }
              // Fallback 2: Fallback to official web photo CDN
              if (target.src !== girl.photo) {
                target.src = girl.photo;
              }
            }}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
          />

          {/* Jersey Number Badge */}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-rkg-crimson/95 backdrop-blur-sm text-white text-[10px] sm:text-[11px] font-black tracking-wider shadow-sm flex items-center gap-0.5">
            <span>#</span>
            <span>{girl.number}</span>
          </div>

          {/* Role Tag (if director, etc.) */}
          {girl.role && (
            <div className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[9px] sm:text-[10px] font-bold shadow-sm">
              {girl.role}
            </div>
          )}

          {/* Duty Status Ribbon */}
          <div className="absolute bottom-2 right-2">
            {isOnDuty ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/90 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-bold shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{selectedDate ? `${selectedDate} ${t.onDuty}` : `${t.dutyCount.replace('{count}', String(duties.length))}`}</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-600/70 backdrop-blur-sm text-gray-200 text-[9px] sm:text-[10px] font-medium">
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
            currentDuty && currentDuty.innings.length > 0 ? (
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
                      className={`inline-flex items-center gap-0.5 px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeStyle}`}
                    >
                      <MapPin className="w-2.5 h-2.5 opacity-70" />
                      <span>{inn.period}:{inn.location}</span>
                    </span>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2 pt-2 border-t border-pink-50 dark:border-oled-border">
                此場次無應援任務
              </p>
            )
          ) : (
            /* 全部天數模式：依日期列出所有排班站位，包含中場舞 */
            duties.length > 0 ? (
              <div className="mt-2 pt-2 border-t border-pink-50 dark:border-oled-border space-y-1.5">
                {duties.map((duty, dIdx) => (
                  <div key={dIdx} className="flex flex-wrap items-center gap-1 text-[10px]">
                    <span className="px-1.5 py-0.5 rounded bg-pink-100/90 dark:bg-pink-950/80 text-rkg-pink-deep dark:text-pink-300 font-extrabold text-[9px] sm:text-[10px] whitespace-nowrap">
                      {duty.date}
                    </span>
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
                            className={`inline-flex items-center gap-0.5 px-1 sm:px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold ${badgeStyle}`}
                          >
                            <span>{inn.period}:{inn.location}</span>
                          </span>
                        );
                      })}
                    </div>
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
