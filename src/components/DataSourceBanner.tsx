import React, { useMemo } from 'react';
import { ExternalLink, Database, Info, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { ScheduleDataset } from '../types/schedule';
import { useLanguage } from '../context/LanguageContext';

interface DataSourceBannerProps {
  schedule: ScheduleDataset;
  selectedDate: string;
}

export const DataSourceBanner: React.FC<DataSourceBannerProps> = ({
  schedule,
  selectedDate,
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
    <div className="bg-pink-50/95 dark:bg-[#120104]/95 border-b border-pink-200/80 dark:border-amber-500/20 px-3 sm:px-4 py-1.5 text-xs text-gray-700 dark:text-amber-200/90 transition-colors shadow-xs">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        {/* Left: 連線指示燈與數據驗證指標 */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2.5 min-w-0 text-[11px] sm:text-xs">
          {/* 連線狀態 */}
          <div className="inline-flex items-center gap-1.5 font-bold flex-shrink-0">
            {isLive ? (
              <>
                <span className="flex h-2 w-2 relative flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold whitespace-nowrap">
                  {t.liveOnline}
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">
                  {t.offlineCache}
                </span>
              </>
            )}
          </div>

          <span className="text-pink-300 dark:text-amber-500/30">|</span>

          {/* 當日上班人數或當期狀態 */}
          <div className="inline-flex items-center gap-1 font-medium whitespace-nowrap flex-shrink-0">
            {schedule.dates.length === 0 ? (
              <span className="font-bold text-amber-600 dark:text-amber-300">
                {t.updatingSchedule}
              </span>
            ) : (
              <>
                <span className="text-gray-500 dark:text-gray-400">當日出勤</span>
                <span className="font-extrabold text-rose-600 dark:text-amber-300">
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
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 font-bold text-[10px] sm:text-[11px]"
                    title={`全數女孩均已完成排班 (${stats.assignedCount}/${stats.onDutyCount})`}
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                    <span>{t.allStationsAssigned}</span>
                  </div>
                ) : stats.assignedCount > 0 ? (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800/60 text-amber-800 dark:text-amber-300 font-bold text-[10px] sm:text-[11px] cursor-help"
                    title={`待公布名單：${stats.pendingGirls.join('、')}`}
                  >
                    <AlertCircle className="w-3 h-3 text-amber-500 flex-shrink-0" />
                    <span>
                      已排定 <strong className="text-emerald-600 dark:text-emerald-400 font-extrabold">{stats.assignedCount}</strong> 位
                    </span>
                    <span className="text-amber-400 dark:text-amber-600">‧</span>
                    <span>
                      待公布 <strong className="text-rose-600 dark:text-rose-400 font-extrabold">{stats.pendingCount}</strong> 位
                    </span>
                  </div>
                ) : (
                  <div
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/80 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 font-bold text-[10px] sm:text-[11px] cursor-help"
                    title={`尚未公布站位名單：${stats.pendingGirls.join('、')}`}
                  >
                    <Clock className="w-3 h-3 text-rose-500 dark:text-rose-400 flex-shrink-0" />
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
              <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap hidden md:inline">
                {t.lastUpdatedLabel.replace('{time}', lastUpdated)}
              </span>
            </>
          )}
        </div>

        {/* Right: 外部資料來源微圖示 */}
        <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0 ml-auto">
          <a
            href="https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100/60 dark:hover:bg-emerald-950/50 bg-white/70 dark:bg-[#1f030a] border border-emerald-200/80 dark:border-emerald-500/30 transition shadow-xs"
            title={t.googleSheetLink}
          >
            <Database className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
            <span>試算表</span>
            <ExternalLink className="w-2 h-2 opacity-50" />
          </a>

          <a
            href="https://monkeys.rakuten.com.tw/girls"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-rose-700 dark:text-pink-300 hover:bg-rose-100/60 dark:hover:bg-rose-950/50 bg-white/70 dark:bg-[#1f030a] border border-rose-200/80 dark:border-rose-500/30 transition shadow-xs"
            title={t.officialRosterLink}
          >
            <Info className="w-2.5 h-2.5 text-rose-600 dark:text-pink-400" />
            <span>官方名冊</span>
            <ExternalLink className="w-2 h-2 opacity-50" />
          </a>

          <a
            href="https://www.instagram.com/rakutengirls/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] sm:text-[11px] font-semibold text-purple-700 dark:text-purple-300 hover:bg-purple-100/60 dark:hover:bg-purple-950/50 bg-white/70 dark:bg-[#1f030a] border border-purple-200/80 dark:border-purple-500/30 transition shadow-xs"
            title={t.officialIgLink}
          >
            <InstagramIcon className="w-2.5 h-2.5 text-purple-600 dark:text-purple-400" />
            <span>官方 IG</span>
            <ExternalLink className="w-2 h-2 opacity-50" />
          </a>
        </div>
      </div>
    </div>
  );
};
