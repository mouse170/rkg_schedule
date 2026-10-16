import React, { useEffect, useState } from 'react';
import { X, Heart, ExternalLink, Calendar, MapPin, Share2, Check, Sparkles, Globe } from 'lucide-react';
import { DeskCalendarIcon } from './DeskCalendarIcon';
import { GirlProfile, DailyDuty } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';
import { translateLocation } from '../utils/dateUtils';

interface GirlDetailDrawerProps {
  girl: GirlProfile | null;
  duties: DailyDuty[];
  isFavorite: boolean;
  onToggleFavorite: (girlName: string) => void;
  onClose: () => void;
  isOffSeason?: boolean;
}

export const GirlDetailDrawer: React.FC<GirlDetailDrawerProps> = ({
  girl,
  duties,
  isFavorite,
  onToggleFavorite,
  onClose,
  isOffSeason = false,
}) => {
  const [copied, setCopied] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!girl) return null;

  const handleShare = () => {
    const dutySummary = isOffSeason
      ? t.offSeasonDrawerNotice
      : duties.length > 0
      ? duties.map(d => `${d.date}: ${d.innings.map(i => `${i.period}(${translateLocation(i.location, language)})`).join(' ')}`).join('\n')
      : t.shareTextNoDuty;
    const shareText = `${t.shareTextTitle}\n${t.shareTextGirl}#${girl.number} ${girl.name}\n${girl.instagram ? `IG: ${girl.instagram}\n` : ''}\n${t.shareTextSchedule}\n${dutySummary}\n\n${t.shareTextLearnMore}https://mouse170.github.io/rkg_schedule/`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10" data-ui="drawer">
        <div className="w-screen max-w-md bg-white dark:bg-oled-bg flex flex-col h-full">
          {/* 1. Header with Close and Favorite */}
          <div className="p-4 flex items-center justify-between bg-zinc-50 dark:bg-oled-surface">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-rkg-crimson text-white text-xs font-black">
                背號 {girl.number}
              </span>
              <h2 className="font-extrabold text-base text-gray-900 dark:text-white">
                {girl.name} {t.profileArchive}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleFavorite(girl.name)}
                className="p-2 rounded-full hover:bg-pink-50 dark:hover:bg-oled-surface transition text-gray-400 dark:text-gray-500 hover:text-rose-500"
                title={isFavorite ? '取消最愛' : '加入最愛'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-oled-surface text-gray-500 dark:text-gray-400 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Main Content */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Profile Hero Card */}
            <div className="flex items-center gap-4 bg-[#fff0f3] dark:bg-[#1f0208] p-4 rounded-3xl">
              <div className="w-24 h-28 rounded-2xl overflow-hidden bg-white dark:bg-oled-surface flex-shrink-0">
                <img
                  src={girl.localCalendarCover || girl.calendarCover || girl.localPhoto}
                  alt={girl.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (girl.calendarCover && target.src !== girl.calendarCover && !target.src.includes('r10s.com')) {
                      target.src = girl.calendarCover;
                      return;
                    }
                    if (target.src !== girl.localPhoto && !target.src.includes('girl_')) {
                      target.src = girl.localPhoto;
                      return;
                    }
                    target.src = girl.photo;
                  }}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 mb-1 flex-wrap">
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">{girl.name}</h3>
                  {(girl.nativeName || girl.koreanName) && (
                    <span className="text-sm font-bold text-pink-600 dark:text-pink-400">
                      {girl.nativeName || girl.koreanName}
                    </span>
                  )}
                  {(!girl.nationality || girl.nationality === 'TW') && (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-blue-700 text-white">
                      {t.badgeTaiwan}
                    </span>
                  )}
                  {girl.nationality === 'KR' && (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-rose-700 text-white">
                      {t.badgeKorean}
                    </span>
                  )}
                  {girl.nationality === 'JP' && (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-red-700 text-white">
                      {t.badgeJapanese}
                    </span>
                  )}
                  {girl.role && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-600 text-white">
                      {girl.role}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2.5">{t.teamAffiliation}</p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {girl.instagram ? (
                    <a
                      href={girl.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-full text-xs font-bold transition active:scale-95"
                    >
                      <span>@{girl.instagramHandle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">暫無官方 IG</span>
                  )}

                  {girl.calendarUrl && (
                    <a
                      href={girl.calendarUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#c59b27] hover:bg-[#d8ab32] text-[#1a0007] rounded-full text-xs font-black transition active:scale-95"
                      title={`${girl.name} ${t.deskCalendarPreorder}`}
                    >
                      <DeskCalendarIcon className="w-3.5 h-3.5" />
                      <span>{t.deskCalendarPreorder}</span>
                      <ExternalLink className="w-3 h-3 opacity-70" />
                    </a>
                  )}

                  {girl.nationality === 'KR' && girl.koreanName && (
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(girl.koreanName!);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-200 hover:bg-rose-200 transition active:scale-95"
                      title={`${t.copyKoreanName}：${girl.koreanName}`}
                    >
                      <span>{t.copyKoreanName} {girl.koreanName}</span>
                    </button>
                  )}

                  {girl.nationality === 'JP' && girl.nativeName && (
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(girl.nativeName!);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-200 hover:bg-red-200 transition active:scale-95"
                      title={`${t.copyJapaneseName}：${girl.nativeName}`}
                    >
                      <span>{t.copyJapaneseName} {girl.nativeName}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Schedule Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-extrabold text-gray-900 dark:text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-rkg-pink-deep dark:text-rkg-pink" />
                  <span>{t.dutyHistory}</span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-pink-100 dark:bg-pink-950/80 text-rkg-pink-deep dark:text-pink-300">
                  {isOffSeason ? t.offSeasonBadge : t.dutyCount.replace('{count}', String(duties.length))}
                </span>
              </div>

              {isOffSeason ? (
                <div className="p-6 text-center bg-[#fff0f3] dark:bg-oled-surface rounded-2xl space-y-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-rose-200 dark:bg-rose-950 text-rkg-crimson dark:text-rose-200">
                    {t.offSeasonStatus}
                  </span>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                    {t.offSeasonDrawerNotice}
                  </p>
                  {girl.calendarUrl && (
                    <div className="pt-2">
                      <a
                        href={girl.calendarUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#c59b27] hover:bg-[#d8ab32] text-[#1a0007] rounded-xl text-xs font-black transition active:scale-95"
                      >
                        <DeskCalendarIcon className="w-4 h-4" />
                        <span>{girl.name} {t.deskCalendarPreorder}</span>
                        <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                      </a>
                    </div>
                  )}
                </div>
              ) : duties.length > 0 ? (
                <div className="space-y-3">
                  {duties.map((duty, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-50 dark:bg-oled-card rounded-2xl p-4"
                    >
                      <div className="flex items-center justify-between mb-2.5 pb-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rkg-pink" />
                          <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                            {duty.date} {t.gameEvent}
                          </span>
                        </div>
                      </div>

                      {/* Inning Breakdown Table */}
                      {duty.innings.length > 0 ? (
                        <div className="flex flex-wrap gap-2 text-center">
                          {duty.innings.map((inn, iIdx) => {
                            const loc = inn.location;
                            const isPostMatch = inn.period.includes('賽後');
                            let style = 'bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-200';
                            if (isPostMatch) {
                              if (loc.includes('東')) {
                                style = 'bg-rose-900 text-white font-black';
                              } else {
                                style = 'bg-zinc-900 text-white font-black';
                              }
                            } else if (loc === '東R' || loc.includes('東R')) {
                              style = 'bg-cyan-100 text-cyan-950 font-black';
                            } else if (loc === '西R' || loc.includes('西R')) {
                              style = 'bg-teal-100 text-teal-950 font-black';
                            } else if (loc.includes('大樂') || loc.includes('專區')) {
                              style = 'bg-amber-100 text-amber-950 font-black';
                            } else if (loc.includes('東')) {
                              style = 'bg-blue-100 text-blue-950';
                            } else if (loc.includes('西')) {
                              style = 'bg-emerald-100 text-emerald-950';
                            }
                            return (
                              <div
                                key={iIdx}
                                className={`flex-1 min-w-[90px] p-2 rounded-xl ${style}`}
                              >
                                <div className="text-[11px] text-gray-600 dark:text-gray-300 font-medium whitespace-nowrap">
                                  {inn.period}
                                </div>
                                <div className="font-black text-sm mt-0.5 flex items-center justify-center gap-0.5 whitespace-nowrap">
                                  <MapPin className="w-3 h-3 opacity-70 flex-shrink-0" />
                                  <span className="truncate">{translateLocation(inn.location, language)}</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="py-2.5 px-3 text-center rounded-xl bg-pink-50 dark:bg-pink-950/30">
                          <span className="text-xs font-bold text-rkg-pink-deep dark:text-pink-300">
                            {t.locationTBD}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#fff0f3] dark:bg-oled-surface rounded-2xl">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">{t.noDutyNotice}</p>
                </div>
              )}
            </div>

            {/* Stadium Tip Box */}
            <div className="bg-[#fff0f3] dark:bg-[#1a0207] p-4 rounded-2xl text-xs text-gray-700 dark:text-gray-300 space-y-1.5">
              <div className="font-bold text-gray-900 dark:text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rkg-pink" />
                <span>{t.fanKnowledgeTitle}</span>
              </div>
              <p>• <strong>{t.zoneEast}</strong>：{t.fanKnowledgeEast}</p>
              <p>• <strong>{t.zoneWest}</strong>：{t.fanKnowledgeWest}</p>
              <p>• {t.fanKnowledgeMid}</p>
            </div>

            {/* Language Switcher Section in Drawer */}
            <div className="pt-3 flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>{t.switchLanguage}</span>
              </span>
              <div className="flex items-center gap-1 bg-zinc-100 dark:bg-oled-surface p-1 rounded-xl">
                {(['zh-TW', 'ja', 'ko'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition ${
                      language === lang
                        ? 'bg-rkg-crimson text-white'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {lang === 'zh-TW' ? '繁中' : lang === 'ja' ? '日本語' : '한국어'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Footer Action */}
          <div className="sticky bottom-0 bg-white dark:bg-oled-surface p-4">
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-rkg-crimson hover:bg-rose-800 text-white flex items-center justify-center gap-2 transition active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{t.copiedSchedule}</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4" />
                  <span>{t.shareSchedule.replace('{name}', girl.name)}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
