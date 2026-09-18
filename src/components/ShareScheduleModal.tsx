import React, { useRef, useState, useMemo, useEffect } from 'react';
import { X, Share2, Download, Copy, Check, Sparkles, Heart, HeartOff, Calendar, MapPin, Sun, Moon, AlertTriangle, ArrowRight } from 'lucide-react';
import { toPng } from 'html-to-image';
import { InstagramIcon } from './InstagramIcon';
import { XIcon, ThreadsIcon } from './SocialIcons';
import { GirlProfile, ScheduleDataset, DailyDuty, InningAssignment } from '../types/schedule';
import { isSpicyCoolSweetDate, getZoneAssignment, getPostMatchZone } from '../data/spicyCoolSweetData';
import { getRelativeDateInfo, translateLocation, isPastDate, compareScheduleDates } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

interface ShareScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  favorites: string[];
  allGirls: GirlProfile[];
  schedule: ScheduleDataset;
  onShowToast: (message: string) => void;
  onToggleFavorite?: (girlName: string) => void;
  onNavigateToInstagram?: () => void;
}

// 9:16 限動圖卡物理高度防破版上限
const MAX_GIRLS_SINGLE_DATE = 8;
const MAX_GIRLS_ALL_DATES = 4;

export const ShareScheduleModal: React.FC<ShareScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  favorites,
  allGirls,
  schedule,
  onShowToast,
  onToggleFavorite,
  onNavigateToInstagram
}) => {
  const { theme } = useTheme();
  const { language, t } = useLanguage();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<'light' | 'dark'>(() => (theme === 'light' ? 'light' : 'dark'));

  // 內部選定匯出之日期範圍：空字串代表「當期一次匯出 (全部天數)」，若有值則為指定特定日期
  const [exportDate, setExportDate] = useState<string>(selectedDate);

  // 隨外部 selectedDate 或開窗狀態同步初始化
  useEffect(() => {
    setExportDate(selectedDate);
  }, [selectedDate, isOpen]);

  // 當期有效賽事（排除已過期歷史賽事）
  const activeDates = useMemo(() => {
    return schedule.dates
      .filter(d => !isPastDate(d))
      .sort((a, b) => compareScheduleDates(a, b));
  }, [schedule.dates]);

  // 最愛女孩名單
  const favGirls = useMemo(() => {
    return allGirls.filter(g => favorites.includes(g.name));
  }, [allGirls, favorites]);

  // 是否已有最愛女孩（若未新增則不提供隨機預覽，引導至 IG 目錄新增）
  const hasFavorites = favGirls.length > 0;
  const displayGirls = favGirls;

  // 人數限制計算：單日模式上限 8 位，跨日當期全賽事模式上限 4 位
  const currentMaxLimit = exportDate ? MAX_GIRLS_SINGLE_DATE : MAX_GIRLS_ALL_DATES;
  const isOverLimit = hasFavorites && favGirls.length > currentMaxLimit;

  if (!isOpen) return null;

  // 日期與星期多語系計算 (以 exportDate 為準)
  const dateInfo = exportDate ? getRelativeDateInfo(exportDate, language) : null;
  const weekdayShort = dateInfo?.weekdayName ? dateInfo.weekdayName.replace('週', '').replace('曜日', '') : '';
  const formattedDateFull = exportDate
    ? `${exportDate} (${weekdayShort})`
    : t.shareAllSeasonTitle;

  const isTheme = Boolean(exportDate && isSpicyCoolSweetDate(exportDate));

  // 建立包含語系參數的分享網址
  const shareUrl = useMemo(() => {
    try {
      const baseUrl = typeof window !== 'undefined' ? window.location.origin + window.location.pathname : 'https://mouse170.github.io/rkg_schedule/';
      const params = new URLSearchParams();
      if (exportDate) params.set('date', exportDate);
      if (favorites.length > 0) params.set('favs', favorites.join(','));
      if (language) params.set('lang', language);
      return `${baseUrl}?${params.toString()}`;
    } catch {
      return typeof window !== 'undefined' ? window.location.href : 'https://mouse170.github.io/rkg_schedule/';
    }
  }, [exportDate, favorites, language]);

  // 組裝多語系推文內文與標籤
  const shareText = useMemo(() => {
    const headline = t.shareTweetHeadline;
    const dateText = exportDate ? `📅 ${formattedDateFull}` : `📅 ${t.shareAllSeasonTitle}`;
    
    // 最愛女孩清單文字
    let girlsText = '';
    if (favGirls.length > 0) {
      const favNames = favGirls.map(g => `#${g.number} ${g.name}`).join(', ');
      girlsText = `✨ ${favNames}`;
    }

    // 依語系與特定日韓成員追加專屬標籤
    const baseTags = t.shareTweetHashtags;
    const extraTags: string[] = [];
    
    if (language === 'ja') {
      if (favorites.includes('高橋佳帆')) extraTags.push('#高橋佳帆');
    } else if (language === 'ko') {
      if (favorites.includes('河智媛')) extraTags.push('#하지원');
      if (favorites.includes('禹洙漢')) extraTags.push('#우수한');
      if (favorites.includes('廉世彬')) extraTags.push('#염세빈');
      if (favorites.includes('高佳彬')) extraTags.push('#고가빈');
      if (favorites.includes('金佳垠')) extraTags.push('#김가은');
      if (favorites.includes('崔荷潾')) extraTags.push('#최하린');
    }

    const fullTags = extraTags.length > 0 ? `${baseTags} ${extraTags.join(' ')}` : baseTags;
    return `${headline}\n${dateText}${girlsText ? `\n${girlsText}` : ''}\n\n${fullTags}`;
  }, [t.shareTweetHeadline, t.shareTweetHashtags, t.shareAllSeasonTitle, exportDate, formattedDateFull, favGirls, favorites, language]);

  // 社群分享 Intent 網址（依規範分離 text 與 url 參數）
  const xShareUrl = useMemo(() => {
    return `https://x.com/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  }, [shareText, shareUrl]);

  const threadsShareUrl = useMemo(() => {
    return `https://www.threads.net/intent/post?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  }, [shareText, shareUrl]);

  // 複製分享連結
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShowToast(t.shareToastCopied);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
      onShowToast(t.shareToastFailed);
    }
  };

  // 下載 9:16 直式 PNG 圖卡
  const handleDownloadImage = async () => {
    if (!cardRef.current || !hasFavorites || isOverLimit) return;
    setIsExporting(true);
    onShowToast(t.shareToastGenerating);

    try {
      await document.fonts?.ready;
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: cardTheme === 'light' ? '#fffbfc' : '#140104'
      });

      const link = document.createElement('a');
      const dateTag = exportDate ? exportDate.replace('/', '-') : 'all';
      link.download = `rkg_cheer_schedule_${dateTag}_${language}_${cardTheme}.png`;
      link.href = dataUrl;
      link.click();
      onShowToast(t.shareToastDownloadSuccess);
    } catch (err) {
      console.error('Failed to generate image', err);
      onShowToast(t.shareToastFailed);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#180206] border border-rose-200 dark:border-amber-500/40 rounded-3xl p-4 sm:p-6 shadow-2xl text-slate-800 dark:text-amber-100 flex flex-col my-auto max-h-[95vh] overflow-hidden transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-rose-200/70 dark:border-amber-500/20 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-[#1a0007] shadow-md">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-amber-200">
                {t.shareModalTitle}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-amber-300/70">
                {t.shareModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 flex items-center justify-center text-slate-600 dark:text-amber-300 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Export Scope Toolbar & Theme Selector */}
        <div className="flex flex-col gap-2 mt-3 pt-1 flex-shrink-0">
          {/* 匯出範圍工具列 */}
          <div className="flex flex-col gap-1.5 bg-rose-50/60 dark:bg-black/40 p-2.5 rounded-2xl border border-rose-200/80 dark:border-amber-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-700 dark:text-amber-200 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-rose-500 dark:text-amber-400" />
                <span>{t.shareDateScope}</span>
              </span>
              <span className="text-[10px] font-bold text-slate-500 dark:text-amber-300/70">
                {exportDate ? t.shareExportSpecificDate : t.shareExportCurrentPeriod}
              </span>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
              {/* 當期一次匯出（全部賽事） */}
              <button
                type="button"
                onClick={() => setExportDate('')}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 flex-shrink-0 border cursor-pointer ${
                  exportDate === ''
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-xs font-black'
                    : 'bg-white dark:bg-[#120104] text-slate-700 dark:text-amber-200/80 border-rose-200 dark:border-amber-500/30 hover:bg-rose-50 dark:hover:bg-amber-500/10'
                }`}
              >
                <Sparkles className="w-3 h-3" />
                <span>{t.shareExportCurrentPeriod}</span>
              </button>

              {/* 當期特定日期按鈕清單 */}
              {activeDates.map(d => {
                const info = getRelativeDateInfo(d, language);
                const wShort = info?.weekdayName ? info.weekdayName.replace('週', '').replace('曜日', '') : '';
                const isSelected = exportDate === d;
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setExportDate(d)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1 flex-shrink-0 border cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white border-transparent shadow-xs font-black'
                        : 'bg-white dark:bg-[#120104] text-slate-700 dark:text-amber-200/80 border-rose-200 dark:border-amber-500/30 hover:bg-rose-50 dark:hover:bg-amber-500/10'
                    }`}
                  >
                    <span>{d} ({wShort})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Style Selector Toolbar */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-black text-slate-700 dark:text-amber-200 flex items-center gap-1">
              <span>{t.shareCardTheme}</span>
            </span>
            <div className="flex items-center gap-1 bg-rose-50 dark:bg-black/50 p-1 rounded-xl border border-rose-200 dark:border-amber-500/30">
              <button
                type="button"
                onClick={() => setCardTheme('light')}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  cardTheme === 'light'
                    ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm font-black'
                    : 'text-slate-600 dark:text-amber-200/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>{t.shareThemeLight}</span>
              </button>
              <button
                type="button"
                onClick={() => setCardTheme('dark')}
                className={`py-1 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  cardTheme === 'dark'
                    ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#1a0007] shadow-sm font-black'
                    : 'text-slate-600 dark:text-amber-200/70 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{t.shareThemeDark}</span>
              </button>
            </div>
          </div>
        </div>

        {/* 尚未加入最愛女孩提示引導橫幅 */}
        {!hasFavorites && (
          <div className="mt-3 p-3.5 sm:p-4 rounded-2xl bg-rose-50/90 dark:bg-rose-950/40 border-2 border-rose-300 dark:border-rose-500/50 text-slate-800 dark:text-rose-100 shadow-sm flex flex-col gap-2.5 flex-shrink-0">
            <div className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-rose-500/20 border border-rose-400 flex items-center justify-center text-rose-600 dark:text-rose-300 flex-shrink-0 mt-0.5">
                <HeartOff className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs sm:text-sm font-black text-rose-900 dark:text-rose-200 mb-0.5">
                  {t.shareNoFavoritesTitle}
                </h4>
                <p className="text-xs text-rose-800/90 dark:text-rose-200/80 leading-relaxed">
                  {t.shareNoFavoritesDesc}
                </p>
              </div>
            </div>
            {onNavigateToInstagram && (
              <button
                type="button"
                onClick={onNavigateToInstagram}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black shadow-md shadow-rose-500/20 transition active:scale-[0.98] cursor-pointer"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span>{t.shareGoToIgDirectory}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            )}
          </div>
        )}

        {/* 超額警示提示欄（支援手機版與電腦版響應式字級） */}
        {isOverLimit && (
          <div className="mt-3 p-3 sm:p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-400/80 dark:border-amber-500/50 text-amber-950 dark:text-amber-100 shadow-sm flex items-start gap-2.5 sm:gap-3 flex-shrink-0">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-700 dark:text-amber-300 flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="flex-1">
              <h4 className="text-xs sm:text-sm font-black text-amber-900 dark:text-amber-200 mb-0.5">
                {t.shareLimitBtnDisabled.replace('{max}', String(currentMaxLimit))}
              </h4>
              <p className="text-xs sm:text-sm font-medium leading-relaxed text-amber-800/90 dark:text-amber-200/80">
                {t.shareLimitWarning
                  .replace('{count}', String(favGirls.length))
                  .replace('{mode}', exportDate ? t.shareModeSingle : t.shareModeAll)
                  .replace('{max}', String(currentMaxLimit))}
              </p>
            </div>
          </div>
        )}

        {/* 最愛名單即時調整區（超過門檻時顯示，提供成員姓名與背號標籤點擊即除） */}
        {isOverLimit && (
          <div className="mt-2.5 p-3 sm:p-4 rounded-2xl bg-white/95 dark:bg-[#1a0106]/95 border-2 border-amber-400/80 dark:border-amber-500/50 shadow-md flex-shrink-0 transition-all">
            <div className="flex items-center justify-between gap-2 mb-2 pb-1.5 border-b border-rose-200/60 dark:border-amber-500/20">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs sm:text-sm font-black text-slate-900 dark:text-amber-200">
                  {t.shareAdjustFavTitle}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-black bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-500/40">
                {t.shareAdjustCurrentCount.replace('{count}', String(favGirls.length)).replace('{max}', String(currentMaxLimit))}
              </span>
            </div>

            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-amber-300/70 mb-2.5">
              {t.shareAdjustFavTip}
            </p>

            {/* 成員姓名與背號清單晶片按鈕 */}
            <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1 no-scrollbar">
              {favGirls.map(girl => (
                <button
                  key={girl.name}
                  type="button"
                  onClick={() => onToggleFavorite && onToggleFavorite(girl.name)}
                  className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-rose-50/90 hover:bg-rose-100/90 dark:bg-black/50 dark:hover:bg-rose-950/60 border border-rose-200 dark:border-amber-500/30 text-slate-800 dark:text-amber-100 text-xs font-bold transition active:scale-95 shadow-2xs hover:border-rose-400 dark:hover:border-rose-500 cursor-pointer"
                  title={`點擊移除 #${girl.number} ${girl.name}`}
                >
                  <span className="text-[10px] sm:text-xs font-black text-amber-600 dark:text-amber-400">
                    #{girl.number}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {girl.name}
                  </span>
                  <X className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition ml-0.5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons Toolbar */}
        <div className="flex items-center gap-2 my-3 flex-shrink-0">
          <button
            type="button"
            onClick={handleCopyLink}
            className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 border border-rose-300 dark:border-amber-400/50 text-rose-800 dark:text-amber-200 text-xs font-bold transition active:scale-95 shadow-xs cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-rose-600 dark:text-amber-400 shrink-0" />}
            <span className="truncate">{copied ? t.shareCopiedLink : t.shareCopyLink}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadImage}
            disabled={isExporting || isOverLimit || !hasFavorites}
            title={
              !hasFavorites
                ? t.shareNoFavoritesDesc
                : isOverLimit
                ? t.shareLimitBtnDisabled.replace('{max}', String(currentMaxLimit))
                : ''
            }
            className={`flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-black transition active:scale-95 shadow-md ${
              !hasFavorites || isOverLimit
                ? 'bg-neutral-300 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 border border-neutral-300 dark:border-neutral-700 cursor-not-allowed opacity-75'
                : 'bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0007] shadow-amber-500/20 disabled:opacity-50 cursor-pointer'
            }`}
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">
              {!hasFavorites
                ? t.shareNoFavoritesBtn
                : isOverLimit
                ? t.shareLimitBtnDisabled.replace('{max}', String(currentMaxLimit))
                : (isExporting ? t.shareGenerating : t.shareDownloadCard)}
            </span>
          </button>

          {/* X (Twitter) 純圖標分享按鈕 */}
          <a
            href={xShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t.shareToX}
            aria-label={t.shareToX}
            className="flex-shrink-0 p-2.5 rounded-xl bg-black hover:bg-neutral-800 text-white border border-neutral-700/80 hover:border-neutral-600 shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <XIcon className="w-4 h-4 text-white" />
          </a>

          {/* Threads 純圖標分享按鈕 */}
          <a
            href={threadsShareUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={t.shareToThreads}
            aria-label={t.shareToThreads}
            className="flex-shrink-0 p-2.5 rounded-xl bg-neutral-900 hover:bg-black text-white border border-neutral-700/80 hover:border-neutral-600 shadow-md hover:shadow-lg transition active:scale-95 cursor-pointer flex items-center justify-center"
          >
            <ThreadsIcon className="w-4 h-4 text-white" />
          </a>
        </div>

        {/* 9:16 Card Preview Container */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-rose-200 dark:border-amber-500/30 bg-slate-50 dark:bg-[#120104] p-3 flex justify-center items-start no-scrollbar transition-colors">
          {!hasFavorites ? (
            /* 未設定最愛女孩時的空狀態導引卡片 */
            <div className="w-[320px] min-h-[420px] sm:w-[340px] sm:min-h-[480px] rounded-2xl border-2 border-dashed border-rose-300 dark:border-amber-500/40 p-6 flex flex-col items-center justify-center text-center bg-white/70 dark:bg-[#1c0208]/60 backdrop-blur-sm shadow-sm my-auto">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-rose-500/20 via-pink-500/20 to-amber-500/20 border border-rose-300 dark:border-amber-500/40 flex items-center justify-center text-rose-500 dark:text-amber-400 mb-4 shadow-inner">
                <HeartOff className="w-8 h-8" />
              </div>
              <h3 className="text-base font-black text-slate-900 dark:text-amber-200 mb-2">
                {t.shareNoFavoritesTitle}
              </h3>
              <p className="text-xs text-slate-600 dark:text-amber-200/80 leading-relaxed mb-6 max-w-[260px]">
                {t.shareNoFavoritesDesc}
              </p>
              {onNavigateToInstagram && (
                <button
                  type="button"
                  onClick={onNavigateToInstagram}
                  className="flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white text-xs font-black shadow-lg shadow-rose-500/20 transition active:scale-95 cursor-pointer"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>{t.shareGoToIgDirectory}</span>
                  <ArrowRight className="w-4 h-4 ml-0.5" />
                </button>
              )}
            </div>
          ) : (
            /* Capture Area: 9:16 Aspect Ratio Card */
            <div
              ref={cardRef}
              className={`w-[320px] min-h-[568px] sm:w-[340px] sm:min-h-[604px] rounded-2xl border-2 p-4 shadow-2xl flex flex-col justify-between relative overflow-hidden transition-all ${
                cardTheme === 'light'
                  ? 'bg-gradient-to-b from-[#fffbfc] via-[#fff3f5] to-[#faeef1] border-amber-400/80 text-slate-800'
                  : 'bg-gradient-to-b from-[#1c0208] via-[#24040b] to-[#140104] border-amber-500/50 text-amber-100'
              }`}
            >
              {/* Background Decorative Accents */}
              <div className={`absolute -top-16 -right-16 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
                cardTheme === 'light' ? 'bg-amber-400/20' : 'bg-amber-500/10'
              }`} />
              <div className={`absolute -bottom-16 -left-16 w-36 h-36 rounded-full blur-2xl pointer-events-none ${
                cardTheme === 'light' ? 'bg-rose-500/15' : 'bg-rose-600/10'
              }`} />

              {/* Card Header */}
              <div className={`relative z-10 text-center pb-2.5 border-b ${
                cardTheme === 'light' ? 'border-rose-200' : 'border-amber-500/30'
              }`}>
                <div className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase mb-1 border ${
                  cardTheme === 'light'
                    ? 'bg-rose-100 border-rose-300 text-rose-800'
                    : 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                }`}>
                  <Sparkles className="w-2.5 h-2.5" />
                  <span>Rakuten Girls Cheer Schedule</span>
                </div>

                {/* 明顯日期標籤 */}
                <div className="flex justify-center my-1.5">
                  <div className={`inline-flex items-center gap-1.5 px-4 py-1 rounded-full font-black text-sm tracking-wide shadow-md border ${
                    cardTheme === 'light'
                      ? 'bg-gradient-to-r from-rose-600 via-rose-500 to-amber-500 text-white border-rose-300 shadow-rose-500/20'
                      : 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 text-[#1a0007] border-amber-300 shadow-amber-500/20'
                  }`}>
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{formattedDateFull}</span>
                  </div>
                </div>

                <h3 className={`text-base font-black ${
                  cardTheme === 'light'
                    ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#890022] via-[#af1b33] to-[#890022]'
                    : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300'
                }`}>
                  {isTheme ? t.shareThemeDayHighlight : t.shareAllSeasonHighlight}
                </h3>

                <div className={`flex items-center justify-center gap-2 mt-1 text-[11px] font-bold ${
                  cardTheme === 'light' ? 'text-rose-900/80' : 'text-amber-200/80'
                }`}>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{t.shareStadiumName}</span>
                  </span>
                  {isTheme && (
                    <>
                      <span>•</span>
                      <span className="font-extrabold text-amber-700 dark:text-amber-300">
                        {t.shareZoneSubtitle}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Cheer Squad Avatar Showcase */}
              <div className="relative z-10 my-2.5">
                <div className="flex items-center justify-between mb-1.5 px-1">
                  <span className={`text-[10px] font-extrabold flex items-center gap-1 uppercase tracking-wider ${
                    cardTheme === 'light' ? 'text-rose-900' : 'text-amber-300'
                  }`}>
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>{t.shareMyFavoritesCount.replace('{count}', String(displayGirls.length))}</span>
                  </span>
                  <span className={`text-[9px] font-medium ${
                    cardTheme === 'light' ? 'text-slate-500' : 'text-amber-300/60'
                  }`}>
                    {t.shareLiveSeatComparison}
                  </span>
                </div>

                {/* Girls Top Avatars (最多展示前 4 位頭像) */}
                <div className="grid grid-cols-4 gap-1.5 mb-2">
                  {displayGirls.slice(0, 4).map(g => (
                    <div
                      key={g.name}
                      className={`flex flex-col items-center rounded-xl p-1.5 border ${
                        cardTheme === 'light'
                          ? 'bg-white/95 border-rose-200/80 shadow-xs'
                          : 'bg-black/30 border-amber-500/20'
                      }`}
                    >
                      <div className={`relative w-12 h-12 rounded-full overflow-hidden border mb-1 ${
                        cardTheme === 'light'
                          ? 'border-amber-400 shadow-sm bg-rose-50'
                          : 'border-amber-400/60 shadow-sm bg-neutral-900'
                      }`}>
                        <img src={g.localPhoto || g.photo} alt={g.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 right-0 bg-amber-500 text-[#1a0007] text-[8px] font-black px-1 rounded-full leading-none py-0.5">
                          #{g.number}
                        </span>
                      </div>
                      <span className={`text-[11px] font-extrabold truncate max-w-full ${
                        cardTheme === 'light' ? 'text-slate-900' : 'text-white'
                      }`}>
                        {g.name}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Schedule Timeline Table */}
                <div className="space-y-1.5">
                  {exportDate ? (
                    // --- 單一日期檢視：女孩單行緊湊呈現 ---
                    displayGirls.map(girl => {
                      const duties: DailyDuty[] = schedule.girlsScheduleMap[girl.name] || [];
                      const duty = duties.find((d: DailyDuty) => d.date === exportDate);
                      const isDateTheme = isSpicyCoolSweetDate(exportDate);
                      const zoneAssign = isDateTheme ? getZoneAssignment(exportDate, girl.name) : null;
                      const postZone = isDateTheme ? getPostMatchZone(exportDate, girl.name) : null;
                      const rawP13 = duty?.innings.find((i: InningAssignment) => i.period.includes('1-3'))?.location || (isDateTheme ? '看台應援' : '休息');
                      const rawP78 = duty?.innings.find((i: InningAssignment) => i.period.includes('7-8'))?.location || (isDateTheme ? '看台換側' : '休息');
                      const p13 = translateLocation(rawP13, language);
                      const p78 = translateLocation(rawP78, language);
                      const translatedPostZone = postZone ? translateLocation(postZone, language) : null;

                      return (
                        <div
                          key={girl.name}
                          className={`rounded-xl p-2 border flex items-center justify-between text-[11px] ${
                            cardTheme === 'light'
                              ? 'bg-white/95 border-rose-200/90 shadow-xs text-slate-800'
                              : 'bg-[#2a050e]/80 border-amber-500/20 text-white'
                          }`}
                        >
                          <div className="flex items-center gap-1.5 min-w-[70px]">
                            <span className={`font-black text-[10px] ${
                              cardTheme === 'light' ? 'text-rose-600' : 'text-amber-400'
                            }`}>
                              #{girl.number}
                            </span>
                            <span className={`font-extrabold ${
                              cardTheme === 'light' ? 'text-slate-900' : 'text-white'
                            }`}>
                              {girl.name}
                            </span>
                          </div>

                          {zoneAssign ? (
                            <div className="flex items-center gap-1 text-right">
                              <span className={`px-2 py-0.5 rounded-full font-black text-[10px] border ${
                                cardTheme === 'light'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                              }`}>
                                {t.shareAllDayZone}{zoneAssign.zoneCode}
                              </span>
                              {translatedPostZone && (
                                <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] border ${
                                  cardTheme === 'light'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : 'bg-rose-950 text-rose-200 border-rose-500/30'
                                }`}>
                                  {t.sharePostMatch}{translatedPostZone}
                                </span>
                              )}
                            </div>
                          ) : (
                            <div className="flex items-center gap-1 text-[10px] font-medium">
                              <span className={`px-1.5 py-0.5 rounded border ${
                                cardTheme === 'light'
                                  ? 'bg-sky-50 text-sky-800 border-sky-300 font-bold'
                                  : 'bg-sky-950/70 text-sky-200 border-sky-600/30'
                              }`}>
                                {t.sharePeriod13}{p13}
                              </span>
                              <span className={`px-1.5 py-0.5 rounded border ${
                                cardTheme === 'light'
                                  ? 'bg-purple-50 text-purple-800 border-purple-300 font-bold'
                                  : 'bg-purple-950/70 text-purple-200 border-purple-600/30'
                              }`}>
                                {t.sharePeriod78}{p78}
                              </span>
                              {translatedPostZone && (
                                <span className={`px-1.5 py-0.5 rounded border ${
                                  cardTheme === 'light'
                                    ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                                    : 'bg-rose-950/70 text-rose-200 border-rose-600/30'
                                }`}>
                                  {t.sharePostMatch}{translatedPostZone}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    // --- 全部日期檢視：每位女孩依照日期完整呈現兩天各別站位 ---
                    displayGirls.map(girl => {
                      const duties: DailyDuty[] = schedule.girlsScheduleMap[girl.name] || [];

                      return (
                        <div
                          key={girl.name}
                          className={`rounded-xl p-2 border flex flex-col gap-1.5 text-[11px] ${
                            cardTheme === 'light'
                              ? 'bg-white/95 border-rose-200/90 shadow-xs text-slate-800'
                              : 'bg-[#2a050e]/80 border-amber-500/20 text-white'
                          }`}
                        >
                          {/* 女孩背號與姓名 */}
                          <div className="flex items-center justify-between border-b border-dashed border-rose-200/60 dark:border-amber-500/20 pb-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-black text-[10px] ${
                                cardTheme === 'light' ? 'text-rose-600' : 'text-amber-400'
                              }`}>
                                #{girl.number}
                              </span>
                              <span className={`font-extrabold ${
                                cardTheme === 'light' ? 'text-slate-900' : 'text-white'
                              }`}>
                                {girl.name}
                              </span>
                            </div>
                            {girl.instagramHandle && (
                              <span className="text-[9px] font-mono text-slate-400 dark:text-amber-400/50">
                                @{girl.instagramHandle}
                              </span>
                            )}
                          </div>

                          {/* 兩天各別站位列 */}
                          <div className="space-y-1">
                            {activeDates.map(date => {
                              const duty = duties.find((d: DailyDuty) => d.date === date);
                              const dateInfoItem = getRelativeDateInfo(date, language);
                              const wShort = dateInfoItem?.weekdayName ? dateInfoItem.weekdayName.replace('週', '').replace('曜日', '') : '';
                              const dateLabel = `${date} (${wShort})`;
                              const isDateTheme = isSpicyCoolSweetDate(date);
                              const zoneAssign = isDateTheme ? getZoneAssignment(date, girl.name) : null;
                              const postZone = isDateTheme ? getPostMatchZone(date, girl.name) : null;
                              const rawP13 = duty?.innings.find((i: InningAssignment) => i.period.includes('1-3'))?.location || (isDateTheme ? '看台應援' : '休息');
                              const rawP78 = duty?.innings.find((i: InningAssignment) => i.period.includes('7-8'))?.location || (isDateTheme ? '看台換側' : '休息');
                              const p13 = translateLocation(rawP13, language);
                              const p78 = translateLocation(rawP78, language);
                              const translatedPostZone = postZone ? translateLocation(postZone, language) : null;

                              return (
                                <div key={date} className="flex items-center justify-between text-[10px] gap-1">
                                  <span className={`px-1.5 py-0.5 rounded font-black text-[9px] flex-shrink-0 ${
                                    cardTheme === 'light'
                                      ? 'bg-rose-100 text-rose-800'
                                      : 'bg-amber-500/20 text-amber-300'
                                  }`}>
                                    {dateLabel}
                                  </span>

                                  {zoneAssign ? (
                                    <div className="flex items-center gap-1 text-right flex-wrap justify-end">
                                      <span className={`px-1.5 py-0.5 rounded-full font-black text-[9px] border ${
                                        cardTheme === 'light'
                                          ? 'bg-amber-100 text-amber-900 border-amber-300'
                                          : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                                      }`}>
                                        {t.shareAllDayZone}{zoneAssign.zoneCode}
                                      </span>
                                      {translatedPostZone && (
                                        <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] border ${
                                          cardTheme === 'light'
                                            ? 'bg-rose-100 text-rose-800 border-rose-300'
                                            : 'bg-rose-950 text-rose-200 border-rose-500/30'
                                        }`}>
                                          {t.sharePostMatch}{translatedPostZone}
                                        </span>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1 text-[9px] font-medium flex-wrap justify-end">
                                      <span className={`px-1 py-0.5 rounded border ${
                                        cardTheme === 'light'
                                          ? 'bg-sky-50 text-sky-800 border-sky-300 font-bold'
                                          : 'bg-sky-950/70 text-sky-200 border-sky-600/30'
                                      }`}>
                                        {t.sharePeriod13}{p13}
                                      </span>
                                      <span className={`px-1 py-0.5 rounded border ${
                                        cardTheme === 'light'
                                          ? 'bg-purple-50 text-purple-800 border-purple-300 font-bold'
                                          : 'bg-purple-950/70 text-purple-200 border-purple-600/30'
                                      }`}>
                                        {t.sharePeriod78}{p78}
                                      </span>
                                      {translatedPostZone && (
                                        <span className={`px-1 py-0.5 rounded border ${
                                          cardTheme === 'light'
                                            ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                                            : 'bg-rose-950 text-rose-200 border-rose-600/30'
                                        }`}>
                                          {t.sharePostMatch}{translatedPostZone}
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Card Footer: Stadium Info (Clean without QR Code) */}
              <div className={`relative z-10 pt-2 border-t flex items-center justify-between text-[10px] ${
                cardTheme === 'light'
                  ? 'border-rose-200 text-slate-600'
                  : 'border-amber-500/30 text-amber-300/70'
              }`}>
                <div className="flex flex-col">
                  <span className={`font-black ${cardTheme === 'light' ? 'text-rose-900' : 'text-amber-200'}`}>
                    {t.shareFooterTitle}
                  </span>
                  <span className="text-[9px]">{t.shareFooterSubtitle}</span>
                </div>
                <span className={`text-[9px] font-mono ${cardTheme === 'light' ? 'text-slate-400' : 'text-amber-400/50'}`}>
                  mouse170.github.io/rkg_schedule
                </span>
              </div>

              {/* 若人數超額，於卡片上方提供防破版警示覆蓋層（響應式手機版與電腦版） */}
              {isOverLimit && (
                <div className="absolute inset-0 z-20 bg-black/75 backdrop-blur-[3px] rounded-2xl flex flex-col items-center justify-center p-3 sm:p-5 text-center">
                  <div className="w-[92%] max-w-[290px] sm:max-w-[310px] p-4 sm:p-5 rounded-2xl bg-[#1a0006]/95 border-2 border-amber-400/80 shadow-2xl backdrop-blur-md flex flex-col items-center text-center">
                    <div className="w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-amber-500/25 border border-amber-400/80 flex items-center justify-center text-amber-400 mb-2.5 sm:mb-3 shadow-lg shadow-amber-500/20">
                      <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <h4 className="text-sm sm:text-base font-black text-amber-300 tracking-wide mb-1.5 sm:mb-2">
                      {t.shareLimitBtnDisabled.replace('{max}', String(currentMaxLimit))}
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-100 font-semibold leading-relaxed mb-3">
                      {t.shareLimitWarning
                        .replace('{count}', String(favGirls.length))
                        .replace('{mode}', exportDate ? t.shareModeSingle : t.shareModeAll)
                        .replace('{max}', String(currentMaxLimit))}
                    </p>
                    {/* 覆蓋層內快速調整晶片清單 */}
                    <div className="flex flex-wrap gap-1.5 justify-center max-h-32 overflow-y-auto pr-0.5 no-scrollbar">
                      {favGirls.map(girl => (
                        <button
                          key={girl.name}
                          type="button"
                          onClick={() => onToggleFavorite && onToggleFavorite(girl.name)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-black/60 hover:bg-rose-900/60 border border-amber-400/50 hover:border-rose-400 text-amber-100 text-[11px] sm:text-xs font-bold transition active:scale-95 cursor-pointer shadow-xs"
                          title={`點擊移除 #${girl.number} ${girl.name}`}
                        >
                          <span className="text-amber-400 font-black">#{girl.number}</span>
                          <span className="text-white">{girl.name}</span>
                          <X className="w-3 h-3 text-amber-300/80 hover:text-rose-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
