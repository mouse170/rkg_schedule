import React, { useEffect, useState } from 'react';
import { X, Heart, ExternalLink, Calendar, MapPin, Share2, Check, Sparkles, Globe } from 'lucide-react';
import { GirlProfile, DailyDuty } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';
import { Language } from '../i18n/translations';

interface GirlDetailDrawerProps {
  girl: GirlProfile | null;
  duties: DailyDuty[];
  isFavorite: boolean;
  onToggleFavorite: (girlName: string) => void;
  onClose: () => void;
}

export const GirlDetailDrawer: React.FC<GirlDetailDrawerProps> = ({
  girl,
  duties,
  isFavorite,
  onToggleFavorite,
  onClose
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
    const dutySummary = duties.length > 0
      ? duties.map(d => `${d.date}: ${d.innings.map(i => `${i.period}(${i.location})`).join(' ')}`).join('\n')
      : '近期尚無排班紀錄';
    const shareText = `【Rakuten Girls 樂天女孩班表】\n女孩：#${girl.number} ${girl.name}\n${girl.instagram ? `IG: ${girl.instagram}\n` : ''}\n【近期排班】\n${dutySummary}\n\n掌握更多女孩班表：https://mouse170.github.io/rkg_schedule/`;

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
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-oled-bg shadow-2xl flex flex-col h-full border-l border-pink-100 dark:border-oled-border">
          {/* 1. Header with Close and Favorite */}
          <div className="p-4 border-b border-pink-100 dark:border-oled-border flex items-center justify-between bg-white dark:bg-oled-surface">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-rkg-crimson text-white text-xs font-black shadow-sm">
                #{girl.number}
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
            <div className="flex items-center gap-4 bg-gradient-to-r from-pink-50/80 via-rose-50/50 to-pink-50/80 dark:from-oled-card dark:via-oled-surface dark:to-oled-card p-4 rounded-3xl border border-pink-100/90 dark:border-oled-border shadow-sm">
              <div className="w-24 h-28 rounded-2xl overflow-hidden shadow-card-soft dark:shadow-card-oled bg-white dark:bg-oled-surface border border-pink-100 dark:border-oled-border flex-shrink-0">
                <img
                  src={girl.localPhoto}
                  alt={girl.name}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = girl.photo;
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
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-sm">
                      {t.badgeTaiwan}
                    </span>
                  )}
                  {girl.nationality === 'KR' && (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-600 text-white shadow-sm">
                      {t.badgeKorean}
                    </span>
                  )}
                  {girl.nationality === 'JP' && (
                    <span className="text-[11px] font-black px-2.5 py-0.5 rounded-full bg-gradient-to-r from-red-600 to-rose-700 text-white shadow-sm">
                      {t.badgeJapanese}
                    </span>
                  )}
                  {girl.role && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white">
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
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full text-xs font-bold shadow-sm transition active:scale-95"
                    >
                      <span>@{girl.instagramHandle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400">暫無官方 IG</span>
                  )}

                  {girl.nationality === 'KR' && girl.koreanName && (
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(girl.koreanName!);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 transition active:scale-95 shadow-sm"
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 hover:bg-rose-100 dark:hover:bg-rose-900/60 border border-rose-200 dark:border-rose-800/60 transition active:scale-95 shadow-sm"
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
                  {t.dutyCount.replace('{count}', String(duties.length))}
                </span>
              </div>

              {duties.length > 0 ? (
                <div className="space-y-3">
                  {duties.map((duty, idx) => (
                    <div
                      key={idx}
                      className="bg-white dark:bg-oled-card rounded-2xl p-4 border border-pink-100 dark:border-oled-border shadow-card-soft dark:shadow-card-oled"
                    >
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-gray-100 dark:border-oled-border">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-rkg-pink" />
                          <span className="font-extrabold text-gray-900 dark:text-white text-sm">
                            {duty.date} {t.gameEvent}
                          </span>
                        </div>
                      </div>

                      {/* Inning Breakdown Table */}
                      <div className="grid grid-cols-3 gap-2 text-center">
                        {duty.innings.map((inn, iIdx) => {
                          const loc = inn.location;
                          let style = 'bg-purple-50/70 dark:bg-purple-950/60 border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300';
                          if (loc === '東R' || loc.includes('東R')) {
                            style = 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-300 dark:border-cyan-800 text-cyan-950 dark:text-cyan-300 font-black';
                          } else if (loc === '西R' || loc.includes('西R')) {
                            style = 'bg-teal-50 dark:bg-teal-950/60 border-teal-300 dark:border-teal-800 text-teal-950 dark:text-teal-300 font-black';
                          } else if (loc.includes('大樂')) {
                            style = 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800 text-amber-950 dark:text-amber-300 font-black';
                          } else if (loc.includes('專區')) {
                            style = 'bg-fuchsia-50 dark:bg-fuchsia-950/60 border-fuchsia-300 dark:border-fuchsia-800 text-fuchsia-950 dark:text-fuchsia-300 font-black';
                          } else if (loc.includes('東')) {
                            style = 'bg-blue-50/70 dark:bg-blue-950/60 border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-300';
                          } else if (loc.includes('西')) {
                            style = 'bg-emerald-50/70 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-300';
                          }
                          return (
                            <div
                              key={iIdx}
                              className={`p-2 rounded-xl border ${style}`}
                            >
                              <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                                {inn.period}
                              </div>
                              <div className="font-black text-sm mt-0.5 flex items-center justify-center gap-0.5">
                                <MapPin className="w-3 h-3 opacity-70" />
                                <span>{inn.location}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-pink-50/50 dark:bg-oled-surface rounded-2xl border border-dashed border-pink-200 dark:border-oled-border">
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-300">{t.noDutyNotice}</p>
                </div>
              )}
            </div>

            {/* Stadium Tip Box */}
            <div className="bg-gradient-to-br from-gray-50 to-pink-50/40 dark:from-oled-surface dark:to-oled-card p-4 rounded-2xl border border-pink-100/80 dark:border-oled-border text-xs text-gray-600 dark:text-gray-300 space-y-1.5">
              <div className="font-bold text-gray-800 dark:text-white flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-rkg-pink" />
                <span>{t.fanKnowledgeTitle}</span>
              </div>
              <p>• <strong>{t.zoneEast}</strong>：{t.fanKnowledgeEast}</p>
              <p>• <strong>{t.zoneWest}</strong>：{t.fanKnowledgeWest}</p>
              <p>• {t.fanKnowledgeMid}</p>
            </div>

            {/* Language Switcher Section in Drawer */}
            <div className="pt-2 border-t border-pink-100/70 dark:border-oled-border flex items-center justify-between text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>{t.switchLanguage}</span>
              </span>
              <div className="flex items-center gap-1 bg-pink-50/80 dark:bg-oled-surface p-1 rounded-xl border border-pink-100 dark:border-oled-border">
                {(['zh-TW', 'ja', 'ko'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition ${
                      language === lang
                        ? 'bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson text-white shadow-sm'
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
          <div className="sticky bottom-0 bg-white dark:bg-oled-surface border-t border-pink-100 dark:border-oled-border p-4">
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-rkg-pink-deep to-rkg-crimson hover:from-rkg-pink hover:to-rkg-pink-deep text-white shadow-pink-glow flex items-center justify-center gap-2 transition active:scale-95"
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
