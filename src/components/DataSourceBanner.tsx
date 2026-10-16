import React, { useMemo } from 'react';
import { ExternalLink, Database, Info, CheckCircle2, AlertCircle, Clock, Music } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { ScheduleDataset } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';

interface DataSourceBannerProps {
  schedule: ScheduleDataset;
  selectedDate: string;
  onOpenSongModal?: () => void;
  isOffSeason?: boolean;
}

export const DataSourceBanner: React.FC<DataSourceBannerProps> = ({
  schedule,
  selectedDate,
  onOpenSongModal,
  isOffSeason = false,
}) => {
  const { t } = useLanguage();
  const isLive = schedule.isLive;
  const lastUpdated = schedule.lastUpdated;

  const roster = (selectedDate && schedule.dailyRosterMap[selectedDate]) || [];
  const onDutyCount = roster.length;

  // 驗證試算表出勤女孩之班表安排狀態（排班完整度驗證，取代無實質意義之東/西區人數統計）
  const stats = useMemo(() => {
    if (!selectedDate || roster.length === 0) {
      return null;
    }

    const assignedGirls: string[] = [];
    const pendingGirls: string[] = [];

    roster.forEach(duty => {
      // 判定女孩是否已安排具體站位（排除空白、待公布、待定、未安排或純休息）
      const hasAssignedStation = duty.innings.some(i => {
        const loc = i.location.trim();
        return (
          loc.length > 0 &&
          !loc.includes('待公布') &&
          !loc.includes('待公佈') &&
          !loc.includes('待定') &&
          !loc.includes('未安排') &&
          loc !== '休息' &&
          loc !== '休'
        );
      });

      if (hasAssignedStation) {
        assignedGirls.push(duty.girlName);
      } else {
        pendingGirls.push(duty.girlName);
      }
    });

    const assignedCount = assignedGirls.length;
    const pendingCount = pendingGirls.length;
    const allAssigned = assignedCount === onDutyCount && onDutyCount > 0;

    return {
      onDutyCount,
      assignedCount,
      pendingCount,
      allAssigned,
      assignedGirls,
      pendingGirls,
    };
  }, [selectedDate, roster, onDutyCount]);

  return (
    <div className="bg-pink-100/60 dark:bg-[#120104] px-3 sm:px-4 py-2 text-sm text-gray-800 dark:text-amber-200 transition-colors overflow-x-hidden">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2 overflow-x-hidden">
        {/* Left: 連線指示燈與數據驗證指標（休賽季呈現轉會期公告） */}
        {isOffSeason ? (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 min-w-0 text-[13px] sm:text-sm">
            <div className="inline-flex items-center gap-1.5 font-bold flex-shrink-0">
              <span className="h-2 w-2 rounded-full bg-rose-600 dark:bg-amber-400 flex-shrink-0" />
              <span className="text-rose-800 dark:text-amber-300 font-extrabold whitespace-nowrap">
                {t.offSeasonStatus}
              </span>
            </div>

            <span className="text-pink-300 dark:text-amber-500/30">|</span>

            <div className="inline-flex items-center gap-1 font-medium text-gray-700 dark:text-amber-100 min-w-0">
              <span className="truncate">{t.offSeasonStatusDesc}</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 min-w-0 text-[13px] sm:text-sm">
            {/* 連線狀態 */}
            <div className="inline-flex items-center gap-1.5 font-bold flex-shrink-0">
              {isLive ? (
                <>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 flex-shrink-0" />
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold whitespace-nowrap">
                    {t.liveOnline}
                  </span>
                </>
              ) : (
                <>
                  <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <span className="text-amber-700 dark:text-amber-400 font-bold whitespace-nowrap">
                    {t.offlineCache}
                  </span>
                </>
              )}
            </div>

            <span className="text-pink-300 dark:text-amber-500/30">|</span>

            {/* 當日上班人數或當期狀態 */}
            <div className="inline-flex items-center gap-1 font-medium whitespace-nowrap flex-shrink-0">
              {schedule.dates.length === 0 ? (
                <span className="font-bold text-amber-700 dark:text-amber-300">
                  {t.updatingSchedule}
                </span>
              ) : (
                <>
                  <span className="text-gray-600 dark:text-gray-400">當日出勤</span>
                  <span className="font-extrabold text-rose-700 dark:text-amber-300">
                    {onDutyCount > 0 ? `${onDutyCount} 位` : '尚無排程'}
                  </span>
                </>
              )}
            </div>

            {/* 班表站位排定驗證狀態 */}
            {stats && onDutyCount > 0 && (
              <>
                <span className="text-pink-300 dark:text-amber-500/30">·</span>
                <div className="inline-flex items-center whitespace-nowrap flex-shrink-0">
                  {stats.allAssigned ? (
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-bold text-[13px]"
                      title={`全數女孩均已完成排班 (${stats.assignedCount}/${stats.onDutyCount})`}
                    >
                      <CheckCircle2 className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      <span>{t.allStationsAssigned}</span>
                    </div>
                  ) : stats.assignedCount > 0 ? (
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 font-bold text-[13px] cursor-help"
                      title={`待公布名單：${stats.pendingGirls.join('、')}`}
                    >
                      <AlertCircle className="w-3 h-3 text-amber-600 flex-shrink-0" />
                      <span>
                        已排定 <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">{stats.assignedCount}</strong> 位
                      </span>
                      <span className="text-amber-400 dark:text-amber-600">‧</span>
                      <span>
                        待公布 <strong className="text-rose-700 dark:text-rose-400 font-extrabold">{stats.pendingCount}</strong> 位
                      </span>
                    </div>
                  ) : (
                    <div
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 font-bold text-[13px] cursor-help"
                      title={`尚未公布站位名單：${stats.pendingGirls.join('、')}`}
                    >
                      <Clock className="w-3 h-3 text-rose-600 dark:text-rose-400 flex-shrink-0" />
                      <span>{t.stationsPending}</span>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* 更新時間 */}
            {lastUpdated && (
              <>
                <span className="text-pink-300 dark:text-amber-500/30 hidden md:inline">|</span>
                <span className="text-[13px] text-gray-600 dark:text-gray-400 whitespace-nowrap hidden md:inline">
                  {t.lastUpdatedLabel.replace('{time}', lastUpdated)}
                </span>
              </>
            )}
          </div>
        )}

        {/* Right: 外部資料來源與 26 年單曲按鈕 */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:ml-auto">
          {onOpenSongModal && (
            <button
              type="button"
              onClick={onOpenSongModal}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[13px] font-black text-[#1a0007] bg-[#c59b27] hover:bg-[#d8ab2e] transition-colors active:scale-95 cursor-pointer"
              title="觀看 2026 樂天女孩年度單曲《緋紅之夜》MV 與完整歌詞"
            >
              <Music className="w-3 h-3 text-[#1a0007] fill-[#1a0007]" />
              <span>26年單曲緋紅之夜</span>
            </button>
          )}

          <a
            href="https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] font-semibold text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-950/50 bg-white/80 dark:bg-[#1f030a] transition-colors"
            title={t.googleSheetLink}
          >
            <Database className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
            <span>試算表</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-50" />
          </a>

          <a
            href="https://monkeys.rakuten.com.tw/girls"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] font-semibold text-rose-800 dark:text-pink-300 hover:bg-rose-100 dark:hover:bg-rose-950/50 bg-white/80 dark:bg-[#1f030a] transition-colors"
            title={t.officialRosterLink}
          >
            <Info className="w-3 h-3 text-rose-700 dark:text-pink-400" />
            <span>官方名冊</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-50" />
          </a>

          <a
            href="https://www.instagram.com/rakutengirls/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[13px] font-semibold text-slate-800 dark:text-amber-200 hover:bg-pink-100 dark:hover:bg-[#2e050e] bg-white/80 dark:bg-[#1f030a] transition-colors"
            title={t.officialIgLink}
          >
            <InstagramIcon className="w-3 h-3 text-rose-600 dark:text-amber-400" />
            <span>官方 IG</span>
            <ExternalLink className="w-2.5 h-2.5 opacity-50" />
          </a>
        </div>
      </div>
    </div>
  );
};
