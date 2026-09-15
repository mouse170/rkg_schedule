import React, { useEffect, useState } from 'react';
import { X, Heart, ExternalLink, Calendar, MapPin, Share2, Check, Sparkles, Globe } from 'lucide-react';
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
      {/* Backdrop with Frosted Blur */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Container (Lovable Sheet) */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-background text-foreground shadow-2xl flex flex-col h-full border-l border-border/80">
          {/* 1. Header with Close and Favorite */}
          <div className="p-4 border-b border-border/60 flex items-center justify-between bg-card/60 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-black shadow-sm">
                #{girl.number}
              </span>
              <h2 className="font-extrabold text-base text-foreground">
                {girl.name} {t.profileArchive}
              </h2>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onToggleFavorite(girl.name)}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-rose-500 transition-colors"
                title={isFavorite ? '取消最愛' : '加入最愛'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 text-rose-500 animate-heart-pulse' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 2. Main Content */}
          <div className="p-5 sm:p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Profile Hero Bento Card */}
            <div className="flex items-center gap-4 bg-muted/40 p-4 rounded-2xl border border-border/70 shadow-sm">
              <div className="w-24 h-28 rounded-xl overflow-hidden shadow-sm bg-muted border border-border/60 flex-shrink-0">
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
                  <h3 className="text-xl font-black text-foreground">{girl.name}</h3>
                  {(girl.nativeName || girl.koreanName) && (
                    <span className="text-sm font-bold text-primary">
                      {girl.nativeName || girl.koreanName}
                    </span>
                  )}
                  {(!girl.nationality || girl.nationality === 'TW') && (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-blue-600 text-white shadow-sm">
                      {t.badgeTaiwan}
                    </span>
                  )}
                  {girl.nationality === 'KR' && (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-indigo-700 text-white shadow-sm">
                      {t.badgeKorean}
                    </span>
                  )}
                  {girl.nationality === 'JP' && (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-sm">
                      {t.badgeJapanese}
                    </span>
                  )}
                  {girl.role && (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-500 text-white">
                      {girl.role}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-2.5">{t.teamAffiliation}</p>

                <div className="flex flex-wrap items-center gap-1.5">
                  {girl.instagram ? (
                    <a
                      href={girl.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full text-xs font-bold shadow-sm transition-transform active:scale-95 hover:opacity-90"
                    >
                      <span>@{girl.instagramHandle}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-muted-foreground">暫無官方 IG</span>
                  )}

                  {girl.nationality === 'KR' && girl.koreanName && (
                    <button
                      onClick={() => {
                        if (navigator.clipboard) {
                          navigator.clipboard.writeText(girl.koreanName!);
                        }
                      }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-muted hover:bg-accent text-foreground border border-border/80 transition-colors active:scale-95 shadow-sm"
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
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-muted hover:bg-accent text-foreground border border-border/80 transition-colors active:scale-95 shadow-sm"
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
                <h4 className="text-sm font-extrabold text-foreground flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>{t.dutyHistory}</span>
                </h4>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                  {t.dutyCount.replace('{count}', String(duties.length))}
                </span>
              </div>

              {duties.length > 0 ? (
                <div className="space-y-3">
                  {duties.map((duty, idx) => (
                    <div
                      key={idx}
                      className="bg-card rounded-2xl p-4 border border-border/70 shadow-bento dark:shadow-bento-dark"
                    >
                      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-border/40">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                          <span className="font-extrabold text-foreground text-sm">
                            {duty.date} {t.gameEvent}
                          </span>
                        </div>
                      </div>

                      {/* Inning Breakdown Table */}
                      {duty.innings.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2 text-center">
                          {duty.innings.map((inn, iIdx) => {
                            const loc = inn.location;
                            let style = 'bg-purple-500/10 border-purple-200/80 dark:border-purple-800/60 text-purple-900 dark:text-purple-300';
                            if (loc === '東R' || loc.includes('東R')) {
                              style = 'bg-cyan-500/10 border-cyan-300 dark:border-cyan-800 text-cyan-950 dark:text-cyan-300 font-black';
                            } else if (loc === '西R' || loc.includes('西R')) {
                              style = 'bg-teal-500/10 border-teal-300 dark:border-teal-800 text-teal-950 dark:text-teal-300 font-black';
                            } else if (loc.includes('大樂')) {
                              style = 'bg-violet-500/10 border-violet-300 dark:border-violet-700 text-violet-950 dark:text-violet-200 font-black shadow-sm';
                            } else if (loc.includes('專區')) {
                              style = 'bg-amber-500/15 border-amber-400 dark:border-amber-700 text-amber-950 dark:text-amber-200 font-black';
                            } else if (loc.includes('東')) {
                              style = 'bg-blue-500/10 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-300';
                            } else if (loc.includes('西')) {
                              style = 'bg-emerald-500/10 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300';
                            }
                            return (
                              <div
                                key={iIdx}
                                className={`p-2 rounded-xl border ${style}`}
                              >
                                <div className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">
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
                        <div className="py-2.5 px-3 text-center rounded-xl bg-muted/60 border border-dashed border-border/80">
                          <span className="text-xs font-bold text-primary">
                            {t.locationTBD}
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-muted/30 rounded-2xl border border-dashed border-border/80">
                  <p className="text-sm font-semibold text-muted-foreground">{t.noDutyNotice}</p>
                </div>
              )}
            </div>

            {/* Stadium Tip Box */}
            <div className="bg-muted/40 p-4 rounded-2xl border border-border/70 text-xs text-muted-foreground space-y-1.5">
              <div className="font-bold text-foreground flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>{t.fanKnowledgeTitle}</span>
              </div>
              <p>• <strong>{t.zoneEast}</strong>：{t.fanKnowledgeEast}</p>
              <p>• <strong>{t.zoneWest}</strong>：{t.fanKnowledgeWest}</p>
              <p>• {t.fanKnowledgeMid}</p>
            </div>

            {/* Language Switcher Section in Drawer */}
            <div className="pt-2 border-t border-border/50 flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-semibold flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>{t.switchLanguage}</span>
              </span>
              <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border/60">
                {(['zh-TW', 'ja', 'ko'] as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-2 py-0.5 rounded-lg font-bold text-[11px] transition ${
                      language === lang
                        ? 'bg-primary text-primary-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lang === 'zh-TW' ? '繁中' : lang === 'ja' ? '日本語' : '한국어'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Footer Action */}
          <div className="sticky bottom-0 bg-card/80 backdrop-blur-md border-t border-border/60 p-4">
            <button
              onClick={handleShare}
              className="w-full py-2.5 rounded-xl font-bold text-sm bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm flex items-center justify-center gap-2 transition active:scale-[0.98]"
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
