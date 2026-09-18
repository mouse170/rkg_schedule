import React, { useMemo } from 'react';
import { ExternalLink, Database, Info } from 'lucide-react';
import { InstagramIcon } from './InstagramIcon';
import { ScheduleDataset } from '../types/schedule';
import { isSpicyCoolSweetDate, getZoneAssignment } from '../data/spicyCoolSweetData';
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
  const isThemeDay = isSpicyCoolSweetDate(selectedDate);

  const stats: (
    | {
        type: 'THEME';
        zoneCount: number;
        generalCount: number;
        eastCount: number;
        westCount: number;
      }
    | {
        type: 'REGULAR';
        assignedCount: number;
        eastCount: number;
        westCount: number;
      }
    | null
  ) = useMemo(() => {
    if (!selectedDate || roster.length === 0) {
      return null;
    }

    if (isThemeDay) {
      let zoneCount = 0;
      let eastCount = 0;
      let westCount = 0;

      roster.forEach(duty => {
        const hasZone = getZoneAssignment(selectedDate, duty.girlName);
        const isZoneLoc = duty.innings.some(i => i.location.includes('專區'));
        if (hasZone || isZoneLoc || duty.primaryArea === '專區') {
          zoneCount++;
        } else {
          const isEast = duty.innings.some(i => i.location.includes('東'));
          const isWest = duty.innings.some(i => i.location.includes('西'));
          if (isEast) eastCount++;
          else if (isWest) westCount++;
        }
      });

      return {
        type: 'THEME' as const,
        zoneCount,
        generalCount: onDutyCount - zoneCount,
        eastCount,
        westCount,
      };
    } else {
      let eastCount = 0;
      let westCount = 0;
      let assignedCount = 0;

      roster.forEach(duty => {
        const hasStation = duty.innings.some(
          i => i.location.trim() && !i.location.includes('待公布') && !i.location.includes('待定')
        );
        if (hasStation) assignedCount++;

        if (duty.primaryArea === '東區' || duty.innings.some(i => i.location.includes('東') && !i.location.includes('東R'))) {
          eastCount++;
        } else if (duty.primaryArea === '西區' || duty.innings.some(i => i.location.includes('西') && !i.location.includes('西R'))) {
          westCount++;
        }
      });

      return {
        type: 'REGULAR' as const,
        assignedCount,
        eastCount,
        westCount,
      };
    }
  }, [selectedDate, roster, isThemeDay, onDutyCount]);

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
                  即時連線
                </span>
              </>
            ) : (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500 flex-shrink-0" />
                <span className="text-amber-600 dark:text-amber-400 font-bold whitespace-nowrap">
                  離線快取
                </span>
              </>
            )}
          </div>

          <span className="text-pink-300 dark:text-amber-500/30">|</span>

          {/* 當日上班人數 */}
          <div className="inline-flex items-center gap-1 font-medium whitespace-nowrap flex-shrink-0">
            <span className="text-gray-500 dark:text-gray-400">當日出勤</span>
            <span className="font-extrabold text-rose-600 dark:text-amber-300">
              {onDutyCount > 0 ? `${onDutyCount} 位` : '尚無排程'}
            </span>
          </div>

          {/* 排位對應統計 */}
          {stats && onDutyCount > 0 && (
            <>
              <span className="text-pink-300 dark:text-amber-500/30">·</span>
              <div className="inline-flex items-center gap-1 text-gray-600 dark:text-amber-100/90 whitespace-nowrap flex-shrink-0">
                {stats.type === 'THEME' ? (
                  <span>
                    專區 <strong className="text-rose-600 dark:text-amber-300 font-extrabold">{stats.zoneCount}</strong> 位
                    <span className="text-pink-300 dark:text-amber-500/40 mx-1">/</span>
                    一般看台 <strong className="text-gray-800 dark:text-white font-bold">{stats.generalCount}</strong> 位
                  </span>
                ) : (
                  <span>
                    東區 <strong className="text-rose-600 dark:text-amber-300 font-extrabold">{stats.eastCount}</strong> 位
                    <span className="text-pink-300 dark:text-amber-500/40 mx-1">/</span>
                    西區 <strong className="text-gray-800 dark:text-white font-bold">{stats.westCount}</strong> 位
                    {stats.assignedCount < onDutyCount && (
                      <span className="text-gray-400 dark:text-gray-500 text-[10px] ml-1">
                        ({stats.assignedCount}/{onDutyCount} 已排定)
                      </span>
                    )}
                  </span>
                )}
              </div>
            </>
          )}

          {/* 更新時間 */}
          {lastUpdated && (
            <>
              <span className="text-pink-300 dark:text-amber-500/30 hidden md:inline">|</span>
              <span className="text-[10px] sm:text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap hidden md:inline">
                更新：{lastUpdated}
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
