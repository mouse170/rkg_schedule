import React, { useRef, useState, useMemo } from 'react';
import { X, Play, Music, Copy, Check, Share2, Heart, VolumeX, Repeat, Sparkles } from 'lucide-react';
import { toPng } from 'html-to-image';
import { FacebookIcon, ThreadsIcon, XIcon, YouTubeIcon } from './SocialIcons';
import { InstagramIcon } from './InstagramIcon';
import { useLanguage } from '../context/LanguageContext';
import { RAKUTEN_GIRLS_2026_SONG } from '../data/songData';
import { GirlProfile } from '../types/schedule';

interface SinglePromotionModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: string[];
  allGirls: GirlProfile[];
  onShowToast: (message: string) => void;
}

export const SinglePromotionModal: React.FC<SinglePromotionModalProps> = ({
  isOpen,
  onClose,
  favorites,
  allGirls,
  onShowToast,
}) => {
  const { language, t } = useLanguage();
  const storyCardRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [copied, setCopied] = useState(false);

  // 最愛女孩名單（使用者有標註愛心的成員）
  const favGirls = useMemo(() => {
    return allGirls.filter(g => favorites.includes(g.name));
  }, [allGirls, favorites]);

  // 官方歌曲分享網址
  const songUrl = RAKUTEN_GIRLS_2026_SONG.youtubeUrl;

  // 社群宣傳文案
  const promoShareText = useMemo(() => {
    const title = '🖤🦍 樂天女孩 2026 年度全新單曲《緋紅之夜》MV 震撼釋出！';
    const hook = '「百鬼夜的狩獵場，這迷戀無法抵擋～」樂天女孩首度挑戰 J-POP 魅惑曲風，今晚被我攻略！立即觀賞 MV 與完整歌詞：';
    const favText = favGirls.length > 0
      ? `✨ 我推的女孩：${favGirls.map(g => `#${g.number} ${g.name}`).join(' ')}`
      : '';
    const tags = '#RakutenGirls #樂天女孩 #緋紅之夜 #今晚被我攻略 #2026單曲 #全猿主場';

    return [title, hook, favText, tags].filter(Boolean).join('\n');
  }, [favGirls]);

  // 各社群分享 Intent 網址
  const xShareUrl = useMemo(() => {
    return `https://x.com/intent/post?text=${encodeURIComponent(promoShareText)}&url=${encodeURIComponent(songUrl)}`;
  }, [promoShareText, songUrl]);

  const threadsShareUrl = useMemo(() => {
    return `https://www.threads.net/intent/post?text=${encodeURIComponent(promoShareText)}&url=${encodeURIComponent(songUrl)}`;
  }, [promoShareText, songUrl]);

  const fbShareUrl = useMemo(() => {
    return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(songUrl)}&quote=${encodeURIComponent(promoShareText)}`;
  }, [promoShareText, songUrl]);

  // 複製宣傳文字與連結
  const handleCopyText = async () => {
    try {
      const fullText = `${promoShareText}\n\n🎬 官方 MV 連結：${songUrl}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      onShowToast(t.songToastPromoCopied);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('複製失敗，請手動複製連結');
    }
  };

  // 下載 9:16 Instagram 限動宣傳海報
  const handleDownloadStoryCard = async () => {
    if (!storyCardRef.current) return;
    setIsExporting(true);
    onShowToast('正在生成 9:16 單曲限動海報...');

    try {
      await document.fonts?.ready;
      const dataUrl = await toPng(storyCardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
        backgroundColor: '#140005'
      });

      // 檢查行動裝置是否支援 Web Share API 分享圖檔
      if (navigator.canShare && typeof navigator.share === 'function') {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          const file = new File([blob], 'rkg_2026_single_story.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: RAKUTEN_GIRLS_2026_SONG.title,
              text: promoShareText,
              files: [file]
            });
            onShowToast('已呼叫系統分享面板！');
            return;
          }
        } catch {
          // 若使用者取消分享或瀏覽器拒絕，降級為直接下載
        }
      }

      // 傳統觸發圖片下載
      const link = document.createElement('a');
      link.download = `rkg_2026_single_story_${language}.png`;
      link.href = dataUrl;
      link.click();
      onShowToast(t.songToastStoryDownloaded);
    } catch (err) {
      console.error('Failed to generate story card', err);
      onShowToast('海報生成失敗，請重試');
    } finally {
      setIsExporting(false);
    }
  };

  if (!isOpen) return null;

  // YouTube 預設靜音、自動播放與循環播放參數（需要配合 playlist 參數達成單曲循環）
  const embedSrc = `https://www.youtube-nocookie.com/embed/${RAKUTEN_GIRLS_2026_SONG.youtubeId}?autoplay=1&mute=1&loop=1&playlist=${RAKUTEN_GIRLS_2026_SONG.youtubeId}&enablejsapi=1&rel=0`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#140005] border border-rose-500/40 rounded-3xl p-3 sm:p-5 shadow-2xl text-white flex flex-col my-auto max-h-[96vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-2 sm:pb-2.5 border-b border-rose-500/20 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md flex-shrink-0">
              <Music className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </div>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-black text-amber-200 truncate">
                {t.songModalTitle}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-rose-200/70 font-medium truncate">
                {t.songModalSubtitle}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="關閉彈窗"
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 hover:text-white transition cursor-pointer flex-shrink-0"
          >
            <X className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto pr-1 space-y-2.5 my-2 flex-1 no-scrollbar">
          {/* YouTube Responsive Video Container (預設靜音、自動循環播放，移除任何可能遮擋控制項的覆蓋標籤) */}
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-rose-500/30 shadow-lg flex-shrink-0">
            <iframe
              src={embedSrc}
              title={RAKUTEN_GIRLS_2026_SONG.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          {/* 精簡單行：曲風概念標籤 + 靜音/循環狀態提示 (不遮擋影片) */}
          <div className="flex items-center justify-between text-[11px] text-rose-200/80 px-1 flex-shrink-0">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold text-[11px] sm:text-xs truncate">
              <Sparkles className="w-3 h-3 text-amber-400 flex-shrink-0" />
              <span className="truncate">百鬼夜行 ‧ J-POP 魅惑曲風</span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-300/80 font-medium text-[10px] flex-shrink-0">
              <span className="inline-flex items-center gap-0.5">
                <VolumeX className="w-2.5 h-2.5 text-amber-400" />
                <span>預設靜音</span>
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-0.5">
                <Repeat className="w-2.5 h-2.5 text-amber-400" />
                <span>循環播放</span>
              </span>
            </div>
          </div>

          {/* 社群推廣 Icon 列 (精簡縮小為 Icon 橫列，不佔據大段空間) */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-gradient-to-r from-[#220008] via-[#2f0411] to-[#1a0006] border border-rose-500/30 flex items-center justify-between gap-1.5 shadow-md flex-shrink-0">
            <span className="text-[11px] font-black text-amber-200 hidden sm:inline-flex items-center gap-1 flex-shrink-0 pl-1">
              <Share2 className="w-3.5 h-3.5 text-rose-400" />
              <span>推廣分享</span>
            </span>

            <div className="flex items-center justify-between w-full sm:w-auto sm:justify-end gap-1.5 sm:gap-2">
              {/* Facebook Icon */}
              <a
                href={fbShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="分享至 Facebook"
                aria-label="分享至 Facebook"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[#1877F2]/20 hover:bg-[#1877F2]/40 border border-[#1877F2]/40 text-[#4285F4] hover:text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <FacebookIcon className="w-4 h-4 fill-current" />
              </a>

              {/* Threads Icon */}
              <a
                href={threadsShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="發佈到 Threads"
                aria-label="發佈到 Threads"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <ThreadsIcon className="w-4 h-4 fill-current" />
              </a>

              {/* X (Twitter) Icon */}
              <a
                href={xShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="分享至 X (Twitter)"
                aria-label="分享至 X"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-black/60 hover:bg-black/90 border border-white/30 text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <XIcon className="w-3.5 h-3.5 fill-current" />
              </a>

              {/* Instagram 限動海報產生鈕 */}
              <button
                type="button"
                onClick={handleDownloadStoryCard}
                disabled={isExporting}
                title="下載 9:16 IG 限動海報"
                aria-label="下載 9:16 IG 限動海報"
                className="h-8 sm:h-9 px-2.5 rounded-xl bg-gradient-to-r from-[#833AB4]/30 via-[#FD1D1D]/30 to-[#F77737]/30 hover:from-[#833AB4]/50 hover:to-[#F77737]/50 border border-rose-400/40 text-pink-200 hover:text-white text-[11px] font-bold flex items-center gap-1.5 transition-all hover:scale-105 cursor-pointer"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
                <span className="text-[10px] sm:text-[11px]">{isExporting ? '生成中' : '限動海報'}</span>
              </button>

              <div className="w-[1px] h-4 bg-rose-500/30 mx-0.5" />

              {/* 複製宣傳文案 Icon */}
              <button
                type="button"
                onClick={handleCopyText}
                title="複製宣傳文案"
                aria-label="複製宣傳文案"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white/90 flex items-center justify-center transition-all hover:scale-105 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              {/* 前往 YouTube 官方 MV */}
              <a
                href={songUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="前往 YouTube 觀賞官方 MV"
                aria-label="前往 YouTube 觀賞官方 MV"
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 flex items-center justify-center transition-all hover:scale-105"
              >
                <YouTubeIcon className="w-4 h-4 fill-rose-500" />
              </a>
            </div>
          </div>

          {/* Lyrics Container (沉浸式可滾動歌詞，享有充裕展示高度) */}
          <div className="p-3.5 rounded-2xl bg-black/40 border border-rose-500/20 flex-1 min-h-[180px] flex flex-col">
            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-rose-500/20 flex-shrink-0">
              <span className="text-xs font-black text-amber-200 flex items-center gap-1.5">
                <Music className="w-3.5 h-3.5 text-rose-400" />
                <span>{t.songLyricsTitle}</span>
              </span>
              <span className="text-[10px] text-rose-300/70 font-mono">
                《緋紅之夜》完整歌詞
              </span>
            </div>

            <div className="max-h-60 overflow-y-auto pr-2 space-y-1.5 text-center text-xs text-rose-100/90 leading-relaxed font-medium">
              {RAKUTEN_GIRLS_2026_SONG.lyrics.map((line, idx) => (
                <p
                  key={idx}
                  className={
                    line === ''
                      ? 'h-2'
                      : line.includes('愛～') || line.includes('rakuten') || line.includes('今晚被我攻略')
                      ? 'text-amber-300 font-black text-sm my-1 tracking-wide'
                      : line.includes('百鬼夜') || line.includes('微笑')
                      ? 'text-rose-300 font-extrabold text-[13px]'
                      : 'hover:text-amber-200 transition-colors'
                  }
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Hidden Container for 9:16 IG Stories Card Generation */}
        <div className="absolute -left-[9999px] top-0 pointer-events-none">
          <div
            ref={storyCardRef}
            className="w-[432px] h-[768px] bg-gradient-to-b from-[#1c0007] via-[#2a0510] to-[#0a0003] text-white p-6 flex flex-col justify-between relative overflow-hidden"
          >
            {/* Ambient Background Lights */}
            <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-rose-600/30 blur-3xl" />
            <div className="absolute -left-20 bottom-1/4 w-60 h-60 rounded-full bg-amber-500/20 blur-3xl" />

            {/* Top: Header & Badges */}
            <div className="relative z-10 text-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 text-[#1a0007] text-xs font-black shadow-md tracking-wider mb-2">
                <Music className="w-3.5 h-3.5" />
                <span>2026 全新年度單曲</span>
              </div>
              <h1 className="text-2xl font-black text-white tracking-tight">
                緋紅之夜
              </h1>
              <p className="text-xs text-amber-300 font-bold tracking-widest uppercase mt-0.5">
                Crimson Night • Rakuten Girls Official Single
              </p>
            </div>

            {/* Middle 1: YouTube Cover Visual */}
            <div className="relative z-10 my-auto flex flex-col items-center">
              <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-rose-400/50 shadow-2xl bg-neutral-900 mb-3">
                <img
                  src={`https://img.youtube.com/vi/${RAKUTEN_GIRLS_2026_SONG.youtubeId}/maxresdefault.jpg`}
                  alt="Single Cover"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center shadow-xl border border-white/40">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
                </div>
              </div>

              {/* Lyric Punchline */}
              <div className="text-center px-4 py-2 rounded-2xl bg-black/50 border border-rose-500/30 backdrop-blur-md">
                <p className="text-xs font-bold text-rose-200">
                  「百鬼夜的狩獵場，這迷戀無法抵擋」
                </p>
                <p className="text-sm font-black text-amber-300 mt-0.5">
                  只要對上眼 心跳瞬間狂烈 🖤🦍
                </p>
              </div>

              {/* 最愛女孩頭像與背號（依使用者需求新增） */}
              {favGirls.length > 0 && (
                <div className="mt-3 w-full">
                  <div className="flex items-center justify-center gap-1 text-[11px] font-black text-amber-300 mb-1.5">
                    <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                    <span>我推的女孩應援力挺 ({favGirls.length} 位)</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 flex-wrap max-w-full">
                    {favGirls.slice(0, 5).map(g => (
                      <div
                        key={g.name}
                        className="flex flex-col items-center p-1 rounded-xl bg-black/40 border border-amber-500/30 min-w-[56px]"
                      >
                        <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-400 shadow-sm mb-0.5">
                          <img src={g.localPhoto || g.photo} alt={g.name} className="w-full h-full object-cover" />
                          <span className="absolute bottom-0 right-0 bg-amber-500 text-[#1a0007] text-[8px] font-black px-1 rounded-full leading-none py-0.5">
                            #{g.number}
                          </span>
                        </div>
                        <span className="text-[10px] font-extrabold text-white truncate max-w-[54px]">
                          {g.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom: Footer Info & Scan Hint */}
            <div className="relative z-10 pt-3 border-t border-rose-500/30 flex items-center justify-between text-[11px]">
              <div className="flex flex-col">
                <span className="font-black text-amber-200">
                  Rakuten Girls 即時看台班表
                </span>
                <span className="text-[9px] text-rose-200/70 font-mono">
                  mouse170.github.io/rkg_schedule
                </span>
              </div>
              <div className="px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-[10px] font-black text-amber-300">
                #緋紅之夜
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
