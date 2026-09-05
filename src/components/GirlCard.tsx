import React from 'react';
import { Heart, ExternalLink, Sparkles, MapPin } from 'lucide-react';
import { GirlProfile, DailyDuty } from '../types/schedule';

interface GirlCardProps {
  girl: GirlProfile;
  duties: DailyDuty[];
  selectedDate: string;
  isFavorite: boolean;
  onToggleFavorite: (e: React.MouseEvent, girlName: string) => void;
  onClick: (girl: GirlProfile) => void;
}

export const GirlCard: React.FC<GirlCardProps> = ({
  girl,
  duties,
  selectedDate,
  isFavorite,
  onToggleFavorite,
  onClick
}) => {
  // Duty on selected date (if a date is chosen)
  const currentDuty = selectedDate
    ? duties.find(d => d.date === selectedDate)
    : duties[0]; // most recent duty

  const isOnDuty = selectedDate ? !!currentDuty : duties.length > 0;

  return (
    <div
      onClick={() => onClick(girl)}
      className="group relative bg-white rounded-3xl p-3.5 shadow-card-soft hover:shadow-pink-glow border border-pink-100/90 hover:border-rkg-pink/50 transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden active:scale-[0.98]"
    >
      {/* Favorite Heart Button */}
      <button
        onClick={(e) => onToggleFavorite(e, girl.name)}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:scale-110 active:scale-95 transition"
        title={isFavorite ? '取消最愛' : '加入最愛'}
      >
        <Heart
          className={`w-4 h-4 transition ${
            isFavorite
              ? 'fill-rose-500 text-rose-500 animate-heart-pulse'
              : 'text-gray-300 hover:text-rose-400'
          }`}
        />
      </button>

      {/* Portrait & Badges */}
      <div>
        <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden bg-gradient-to-b from-pink-50 to-pink-100/50 mb-3">
          <img
            src={girl.localPhoto}
            alt={girl.name}
            loading="lazy"
            onError={(e) => {
              // Fallback to official web photo if local file is missing
              const target = e.target as HTMLImageElement;
              if (target.src !== girl.photo) {
                target.src = girl.photo;
              }
            }}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
          />

          {/* Jersey Number Badge */}
          <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-rkg-crimson/95 backdrop-blur-sm text-white text-[11px] font-black tracking-wider shadow-sm flex items-center gap-0.5">
            <span>#</span>
            <span>{girl.number}</span>
          </div>

          {/* Role Tag (if director, etc.) */}
          {girl.role && (
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[10px] font-bold shadow-sm">
              {girl.role}
            </div>
          )}

          {/* Duty Status Ribbon */}
          <div className="absolute bottom-2 right-2">
            {isOnDuty ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-pink-500/90 backdrop-blur-sm text-white text-[10px] font-bold shadow-sm">
                <Sparkles className="w-2.5 h-2.5" />
                <span>{selectedDate ? `${selectedDate} 上班` : `已排 ${duties.length} 場`}</span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-gray-600/70 backdrop-blur-sm text-gray-200 text-[10px] font-medium">
                休假
              </span>
            )}
          </div>
        </div>

        {/* Member Info */}
        <div className="px-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-extrabold text-base text-gray-900 group-hover:text-rkg-pink-deep transition">
              {girl.name}
            </h3>
            {girl.instagramHandle && (
              <a
                href={girl.instagram!}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-gray-400 hover:text-pink-600 transition"
                title={`前往 @${girl.instagramHandle}`}
              >
                <span>IG</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
          </div>

          {/* Cheering Inning Pills (if on duty) */}
          {currentDuty && currentDuty.innings.length > 0 ? (
            <div className="mt-2 pt-2 border-t border-pink-50 flex flex-wrap gap-1">
              {currentDuty.innings.map((inn, idx) => {
                const loc = inn.location;
                let badgeStyle = 'bg-purple-50 text-purple-700 border border-purple-200/60';
                if (loc === '東R' || loc.includes('東R')) {
                  badgeStyle = 'bg-cyan-50 text-cyan-800 border border-cyan-300 font-black';
                } else if (loc === '西R' || loc.includes('西R')) {
                  badgeStyle = 'bg-teal-50 text-teal-800 border border-teal-300 font-black';
                } else if (loc.includes('大樂')) {
                  badgeStyle = 'bg-amber-50 text-amber-900 border border-amber-300 font-black';
                } else if (loc.includes('專區')) {
                  badgeStyle = 'bg-fuchsia-50 text-fuchsia-800 border border-fuchsia-300 font-black';
                } else if (loc.includes('東')) {
                  badgeStyle = 'bg-blue-50 text-blue-700 border border-blue-200/60';
                } else if (loc.includes('西')) {
                  badgeStyle = 'bg-emerald-50 text-emerald-700 border border-emerald-200/60';
                }
                return (
                  <span
                    key={idx}
                    className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold ${badgeStyle}`}
                  >
                    <MapPin className="w-2.5 h-2.5 opacity-70" />
                    <span>{inn.period}:{inn.location}</span>
                  </span>
                );
              })}
            </div>
          ) : (
            <p className="text-[11px] text-gray-400 mt-2 pt-2 border-t border-pink-50">
              {selectedDate ? '此場次無應援任務' : '點擊查看完整班表與站位'}
            </p>
          )}
        </div>
      </div>

      {/* Card Action Hint */}
      <div className="mt-3 pt-2 text-center border-t border-pink-50/80">
        <span className="text-[11px] text-rkg-pink-deep font-semibold group-hover:underline">
          查看完整班表 →
        </span>
      </div>
    </div>
  );
};
