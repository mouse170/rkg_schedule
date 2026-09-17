import React, { useRef, useState } from 'react';
import { X, Share2, Download, Copy, Check, Sparkles, Heart, Calendar, MapPin, QrCode, Sun, Moon } from 'lucide-react';
import { toPng } from 'html-to-image';
import { GirlProfile, ScheduleDataset, DailyDuty, InningAssignment } from '../types/schedule';
import { isSpicyCoolSweetDate, getZoneAssignment, getPostMatchZone } from '../data/spicyCoolSweetData';
import { getRelativeDateInfo } from '../utils/dateUtils';
import { useTheme } from '../context/ThemeContext';

interface ShareScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: string;
  favorites: string[];
  allGirls: GirlProfile[];
  schedule: ScheduleDataset;
  onShowToast: (message: string) => void;
}

export const ShareScheduleModal: React.FC<ShareScheduleModalProps> = ({
  isOpen,
  onClose,
  selectedDate,
  favorites,
  allGirls,
  schedule,
  onShowToast
}) => {
  const { theme } = useTheme();
  const cardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [cardTheme, setCardTheme] = useState<'light' | 'dark'>(() => (theme === 'light' ? 'light' : 'dark'));

  if (!isOpen) return null;

  // 日期與星期計算
  const dateInfo = selectedDate ? getRelativeDateInfo(selectedDate, 'zh-TW') : null;
  const weekdayShort = dateInfo?.weekdayName ? dateInfo.weekdayName.replace('週', '') : '';
  const formattedDateFull = selectedDate
    ? `${selectedDate} (${weekdayShort})`
    : '2026 全猿主場賽季';

  // 取得使用者收藏之女孩，若無收藏則展示當日前 4 位出勤女孩作為範例
  const favGirls = allGirls.filter(g => favorites.includes(g.name));
  const displayGirls = favGirls.length > 0
    ? favGirls
    : allGirls.filter(g => {
        const duties: DailyDuty[] = schedule.girlsScheduleMap[g.name] || [];
        return duties.some((d: DailyDuty) => d.date === selectedDate);
      }).slice(0, 4);

  const isTheme = Boolean(selectedDate && isSpicyCoolSweetDate(selectedDate));

  // 複製分享連結
  const handleCopyLink = async () => {
    try {
      const baseUrl = window.location.origin + window.location.pathname;
      const params = new URLSearchParams();
      if (selectedDate) params.set('date', selectedDate);
      if (favorites.length > 0) params.set('favs', favorites.join(','));
      const shareUrl = `${baseUrl}?${params.toString()}`;

      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShowToast('專屬追星班表連結已複製到剪貼簿！');
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
      onShowToast('複製失敗，請手動複製網址');
    }
  };

  // 下載 9:16 直式 PNG 圖卡
  const handleDownloadImage = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);
    onShowToast('正在生成 9:16 高解析圖卡...');

    try {
      await document.fonts?.ready;
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: cardTheme === 'light' ? '#fffbfc' : '#140104'
      });

      const link = document.createElement('a');
      link.download = `rkg_cheer_schedule_${selectedDate ? selectedDate.replace('/', '-') : 'all'}_${cardTheme}.png`;
      link.href = dataUrl;
      link.click();
      onShowToast('9:16 追星班表圖卡已下載完成！');
    } catch (err) {
      console.error('Failed to generate image', err);
      onShowToast('圖卡生成失敗，請稍後再試');
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
                分享專屬追星班表
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-amber-300/70">
                支援 URL 跨裝置同步與 9:16 IG 限動圖卡
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

        {/* Style Selector Toolbar */}
        <div className="flex items-center justify-between gap-2 mt-3 pt-1 flex-shrink-0">
          <span className="text-xs font-black text-slate-700 dark:text-amber-200 flex items-center gap-1">
            <span>圖卡風格：</span>
          </span>
          <div className="flex items-center gap-1 bg-rose-50 dark:bg-black/50 p-1 rounded-xl border border-rose-200 dark:border-amber-500/30">
            <button
              onClick={() => setCardTheme('light')}
              className={`py-1 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                cardTheme === 'light'
                  ? 'bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm font-black'
                  : 'text-slate-600 dark:text-amber-200/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>亮色甜酷</span>
            </button>
            <button
              onClick={() => setCardTheme('dark')}
              className={`py-1 px-3 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                cardTheme === 'dark'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-600 text-[#1a0007] shadow-sm font-black'
                  : 'text-slate-600 dark:text-amber-200/70 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>暗色黑曜</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Toolbar */}
        <div className="grid grid-cols-2 gap-2 my-3 flex-shrink-0">
          <button
            onClick={handleCopyLink}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 dark:bg-amber-500/20 dark:hover:bg-amber-500/30 border border-rose-300 dark:border-amber-400/50 text-rose-800 dark:text-amber-200 text-xs font-bold transition active:scale-95 shadow-xs"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5 text-rose-600 dark:text-amber-400" />}
            <span>{copied ? '已複製連結' : '複製分享連結'}</span>
          </button>

          <button
            onClick={handleDownloadImage}
            disabled={isExporting}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-[#1a0007] text-xs font-black transition active:scale-95 shadow-md shadow-amber-500/20 disabled:opacity-50"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExporting ? '生成中...' : '下載 9:16 限動圖卡'}</span>
          </button>
        </div>

        {/* 9:16 Card Preview Container */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-rose-200 dark:border-amber-500/30 bg-slate-50 dark:bg-[#120104] p-3 flex justify-center items-start no-scrollbar transition-colors">
          {/* Capture Area: 9:16 Aspect Ratio Card */}
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
                {isTheme ? '辣酷甜主題日 ‧ 私藏應援席位' : '全猿主場 ‧ 專屬追星班表'}
              </h3>

              <div className={`flex items-center justify-center gap-2 mt-1 text-[11px] font-bold ${
                cardTheme === 'light' ? 'text-rose-900/80' : 'text-amber-200/80'
              }`}>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-500" />
                  <span>樂天桃園棒球場</span>
                </span>
                {isTheme && (
                  <>
                    <span>•</span>
                    <span className="font-extrabold text-amber-700 dark:text-amber-300">
                      看台專區貼身應援
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
                  <span>我的追星女孩 ({displayGirls.length} 位)</span>
                </span>
                <span className={`text-[9px] font-medium ${
                  cardTheme === 'light' ? 'text-slate-500' : 'text-amber-300/60'
                }`}>
                  即時席位對照
                </span>
              </div>

              {/* Girls Row */}
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
                {displayGirls.map(girl => {
                  const duties: DailyDuty[] = schedule.girlsScheduleMap[girl.name] || [];
                  const duty = selectedDate ? duties.find((d: DailyDuty) => d.date === selectedDate) : duties[0];
                  const p13 = duty?.innings.find((i: InningAssignment) => i.period.includes('1-3'))?.location || (isTheme ? '看台應援' : '休息');
                  const p78 = duty?.innings.find((i: InningAssignment) => i.period.includes('7-8'))?.location || (isTheme ? '看台換側' : '休息');
                  const zoneAssign = isTheme ? getZoneAssignment(selectedDate, girl.name) : null;
                  const postZone = isTheme ? getPostMatchZone(selectedDate, girl.name) : null;

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
                            全場專區：{zoneAssign.zoneCode}
                          </span>
                          {postZone && (
                            <span className={`px-1.5 py-0.5 rounded font-bold text-[9px] border ${
                              cardTheme === 'light'
                                ? 'bg-rose-100 text-rose-800 border-rose-300'
                                : 'bg-rose-950 text-rose-200 border-rose-500/30'
                            }`}>
                              賽後{postZone}
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
                            1-3局：{p13}
                          </span>
                          <span className={`px-1.5 py-0.5 rounded border ${
                            cardTheme === 'light'
                              ? 'bg-purple-50 text-purple-800 border-purple-300 font-bold'
                              : 'bg-purple-950/70 text-purple-200 border-purple-600/30'
                          }`}>
                            7-8局：{p78}
                          </span>
                          {postZone && (
                            <span className={`px-1.5 py-0.5 rounded border ${
                              cardTheme === 'light'
                                ? 'bg-rose-100 text-rose-800 border-rose-300 font-bold'
                                : 'bg-rose-950/70 text-rose-200 border-rose-600/30'
                            }`}>
                              賽後{postZone}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Card Footer: Stadium Info & QR Code */}
            <div className={`relative z-10 pt-2 border-t flex items-center justify-between text-[10px] ${
              cardTheme === 'light'
                ? 'border-rose-200 text-slate-600'
                : 'border-amber-500/30 text-amber-300/70'
            }`}>
              <div className="flex flex-col">
                <span className={`font-black ${cardTheme === 'light' ? 'text-rose-900' : 'text-amber-200'}`}>
                  樂天女孩即時看台班表
                </span>
                <span className="text-[9px]">全猿主場應援席位即時查詢</span>
                <span className={`text-[8px] mt-0.5 ${cardTheme === 'light' ? 'text-slate-400' : 'text-amber-400/50'}`}>
                  mouse170.github.io/rkg_schedule
                </span>
              </div>
              <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-md border border-rose-100">
                <QrCode className="w-full h-full text-[#140104]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
