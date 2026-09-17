import React, { useMemo } from 'react';
import { Heart, Compass, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { GirlProfile, ScheduleDataset, DailyDuty, InningAssignment } from '../types/schedule';
import { isSpicyCoolSweetDate, getZoneAssignment, getPostMatchZone, SPICY_COOL_SWEET_THEME } from '../data/spicyCoolSweetData';
import { getRelativeDateInfo } from '../utils/dateUtils';
import { useLanguage } from '../context/LanguageContext';
import { AreaFilterType } from './FilterBar';

interface MatrixViewProps {
  selectedDate: string;
  allGirls: GirlProfile[];
  schedule: ScheduleDataset;
  favorites: string[];
  onSelectGirl: (girl: GirlProfile) => void;
  onToggleFavorite?: (name: string) => void;
  onSelectDate?: (date: string) => void;
  areaFilter?: AreaFilterType;
  searchQuery?: string;
}

interface AreaRowDef {
  key: string;
  title: string;
  subTitle: string;
  badgeStyle: string;
  matchFn: (loc: string, isZone: boolean) => boolean;
}

interface PeriodColDef {
  key: string;
  title: string;
  subTitle: string;
  badgeStyle: string;
}

const DECK_ORDER: ('東下' | '西下' | '東上' | '西上')[] = ['東下', '西下', '東上', '西上'];

interface DateMatrixTableProps {
  date: string;
  allGirls: GirlProfile[];
  schedule: ScheduleDataset;
  favorites: string[];
  areaFilter: AreaFilterType;
  searchQuery: string;
  onSelectGirl: (girl: GirlProfile) => void;
}

/**
 * 單一日期看台輪替矩陣子元件
 * 依 [日期 / 局數 / 區域 / 看台專區] 完整分層
 */
const SingleDateMatrix: React.FC<DateMatrixTableProps> = ({
  date,
  allGirls,
  schedule,
  favorites,
  areaFilter,
  searchQuery,
  onSelectGirl
}) => {
  const { language, t } = useLanguage();
  const isTheme = isSpicyCoolSweetDate(date);

  // 日期與星期計算
  const dateInfo = getRelativeDateInfo(date, language);
  const weekdayShort = dateInfo?.weekdayName ? dateInfo.weekdayName.replace('週', '').replace('曜日', '') : '';
  const formattedDateText = `${date} (${weekdayShort})`;

  // 看台橫列定義（區域與看台專區）
  const allAreaRows: AreaRowDef[] = [
    {
      key: 'EAST',
      title: t.areaEast,
      subTitle: '內野 1B 一般應援',
      badgeStyle: 'bg-blue-100/80 dark:bg-gradient-to-r dark:from-blue-600/30 dark:to-indigo-600/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-500/40',
      matchFn: (loc, isZone) => !isZone && loc.includes('東') && !loc.includes('東R')
    },
    {
      key: 'WEST',
      title: t.areaWest,
      subTitle: '內野 3B 一般應援',
      badgeStyle: 'bg-emerald-100/80 dark:bg-gradient-to-r dark:from-emerald-600/30 dark:to-teal-600/30 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-500/40',
      matchFn: (loc, isZone) => !isZone && loc.includes('西') && !loc.includes('西R')
    },
    {
      key: 'DALE',
      title: t.zoneDaLe + '區',
      subTitle: '特殊外野熱舞台',
      badgeStyle: 'bg-purple-100/80 dark:bg-gradient-to-r dark:from-purple-600/30 dark:to-pink-600/30 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-500/40',
      matchFn: (loc, isZone) => !isZone && (loc.includes('大樂') || loc.includes('東R') || loc.includes('西R'))
    },
    {
      key: 'ZONE',
      title: '看台專區',
      subTitle: isTheme ? '個人專屬看台貼身' : '特殊企劃／專區',
      badgeStyle: 'bg-amber-100/90 dark:bg-gradient-to-r dark:from-amber-500/30 dark:to-rose-600/30 text-amber-900 dark:text-amber-200 border-amber-400/60 dark:border-amber-400/50 font-black',
      matchFn: (loc, isZone) => isZone || loc.includes('專區') || loc.includes('舞台')
    }
  ];

  // 時段直行定義（局數）
  const allPeriodCols: PeriodColDef[] = isTheme
    ? [
        {
          key: 'P13',
          title: '1-3 局',
          subTitle: '前段專屬攻守',
          badgeStyle: 'text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-950/40'
        },
        {
          key: 'P78',
          title: '7-8 局',
          subTitle: '後段換側熱舞',
          badgeStyle: 'text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/40'
        },
        {
          key: 'POST',
          title: t.filterPeriodPost,
          subTitle: '主題日勝利煙火',
          badgeStyle: 'text-amber-800 dark:text-amber-300 border-amber-400 dark:border-amber-500/30 bg-amber-100/90 dark:bg-amber-950/40 font-black'
        }
      ]
    : [
        {
          key: 'P13',
          title: '1-3 局',
          subTitle: '開場與前段攻守',
          badgeStyle: 'text-sky-700 dark:text-sky-300 border-sky-300 dark:border-sky-500/30 bg-sky-50 dark:bg-sky-950/40'
        },
        {
          key: 'PMID',
          title: '第 5 局',
          subTitle: '中場舞合體演出',
          badgeStyle: 'text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-950/40'
        },
        {
          key: 'P78',
          title: '7-8 局',
          subTitle: '後段換側熱舞',
          badgeStyle: 'text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-950/40'
        }
      ];

  // 依 areaFilter 篩選列與行
  const periodCols = useMemo(() => {
    if (areaFilter === 'PERIOD_POST') {
      return allPeriodCols.filter(col => col.key === 'POST');
    }
    if (areaFilter === 'PERIOD_13') {
      return allPeriodCols.filter(col => col.key === 'P13');
    }
    if (areaFilter === 'PERIOD_78') {
      return allPeriodCols.filter(col => col.key === 'P78');
    }
    if (areaFilter === 'PERIOD_MID') {
      return allPeriodCols.filter(col => col.key === 'PMID');
    }
    return allPeriodCols;
  }, [areaFilter, allPeriodCols]);

  const areaRows = useMemo(() => {
    if (areaFilter === 'PERIOD_POST') {
      return allAreaRows.filter(row => row.key === 'EAST' || row.key === 'WEST');
    }
    if (areaFilter === 'SEAT_EAST') {
      return allAreaRows.filter(row => row.key === 'EAST');
    }
    if (areaFilter === 'SEAT_WEST') {
      return allAreaRows.filter(row => row.key === 'WEST');
    }
    if (areaFilter === 'SEAT_DALE') {
      return allAreaRows.filter(row => row.key === 'DALE');
    }
    return allAreaRows;
  }, [areaFilter, allAreaRows]);

  // 當日出勤女孩
  const dailyGirls = useMemo(() => {
    return allGirls.filter(g => {
      const duties = schedule.girlsScheduleMap[g.name] || [];
      return duties.some(d => d.date === date);
    });
  }, [allGirls, schedule, date]);

  // 當日未安排站位名單
  const unassignedGirls = useMemo(() => {
    return dailyGirls.filter(girl => {
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = girl.name.toLowerCase().includes(q);
        const matchNum = girl.number.includes(q);
        if (!matchName && !matchNum) return false;
      }

      if (areaFilter === 'FAVORITES' && !favorites.includes(girl.name)) {
        return false;
      }

      const duties: DailyDuty[] = schedule.girlsScheduleMap[girl.name] || [];
      const duty = duties.find(d => d.date === date);
      if (!duty) return false;

      // 主題日若有個人專區，視為已有站位
      if (isTheme && getZoneAssignment(date, girl.name)) return false;

      const hasValidStation = duty.innings.some(inn => {
        const loc = (inn.location || '').trim();
        return loc.length > 0 && !loc.includes('待公布') && !loc.includes('未安排') && loc !== '休息';
      });
      return !hasValidStation;
    });
  }, [dailyGirls, schedule, date, isTheme, searchQuery, areaFilter, favorites]);

  // 取得某女孩在特定時段位置
  const getGirlLocationInPeriod = (_girl: GirlProfile, periodKey: string, duty: DailyDuty): string => {
    if (periodKey === 'POST') {
      const postMatch = duty.innings.find((i: InningAssignment) => i.period.includes('賽後'));
      return postMatch?.location || '';
    }
    if (periodKey === 'P13') {
      const inning = duty.innings.find((i: InningAssignment) => i.period.includes('1-3') || i.period.includes('全場'));
      return inning?.location || '';
    }
    if (periodKey === 'PMID') {
      const inning = duty.innings.find((i: InningAssignment) => i.period.includes('中場') || i.period.includes('5'));
      return inning?.location || '';
    }
    if (periodKey === 'P78') {
      const inning = duty.innings.find((i: InningAssignment) => i.period.includes('7-8') || i.period.includes('全場'));
      return inning?.location || '';
    }
    return '';
  };

  // 查詢符合特定 [區域 × 時段] 之女孩陣列
  const getCellGirls = (row: AreaRowDef, col: PeriodColDef): GirlProfile[] => {
    return allGirls.filter(girl => {
      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        const matchName = girl.name.toLowerCase().includes(q);
        const matchNum = girl.number.includes(q);
        if (!matchName && !matchNum) return false;
      }

      if (areaFilter === 'FAVORITES' && !favorites.includes(girl.name)) {
        return false;
      }

      const duties: DailyDuty[] = schedule.girlsScheduleMap[girl.name] || [];
      const duty = duties.find(d => d.date === date);
      if (!duty) return false;

      const zoneAssign = isTheme ? getZoneAssignment(date, girl.name) : undefined;
      const isZone = Boolean(zoneAssign);

      // 若為主題日專區列
      if (isTheme && row.key === 'ZONE') {
        if (col.key === 'POST') return false; // 賽後表演僅分東區、西區
        return isZone;
      }

      // 賽後表演時段特殊判定：主題日僅分東區與西區
      if (col.key === 'POST') {
        if (row.key !== 'EAST' && row.key !== 'WEST') return false;
        const postZone = getPostMatchZone(date, girl.name);
        if (!postZone) return false;
        if (row.key === 'EAST') return postZone.includes('東');
        if (row.key === 'WEST') return postZone.includes('西');
        return false;
      }

      const loc = getGirlLocationInPeriod(girl, col.key, duty);
      if (!loc || loc.includes('待公布') || loc.includes('未安排') || loc === '休息') return false;

      return row.matchFn(loc, isZone);
    }).sort((a, b) => {
      // 最愛優先置頂
      const aFav = favorites.includes(a.name);
      const bFav = favorites.includes(b.name);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;

      // 若為專區列，依看台分區 (東下 -> 西下 -> 東上 -> 西上) 排序
      if (isTheme && row.key === 'ZONE') {
        const aZone = getZoneAssignment(date, a.name);
        const bZone = getZoneAssignment(date, b.name);
        if (aZone && bZone) {
          const aDeckIdx = DECK_ORDER.indexOf(aZone.deck);
          const bDeckIdx = DECK_ORDER.indexOf(bZone.deck);
          if (aDeckIdx !== bDeckIdx) return aDeckIdx - bDeckIdx;
          return aZone.zoneCode.localeCompare(bZone.zoneCode, 'zh-TW');
        }
      }

      return (parseInt(a.number, 10) || 999) - (parseInt(b.number, 10) || 999);
    });
  };

  // 看台專區樓層樣式定義
  const getDeckBadgeStyle = (deck: '東下' | '西下' | '東上' | '西上') => {
    switch (deck) {
      case '東下':
        return {
          title: t.deckEastLower + ' (I~M區)',
          pill: 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-300 border-rose-300/80 dark:border-rose-800/60'
        };
      case '西下':
        return {
          title: t.deckWestLower + ' (I~K區)',
          pill: 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 border-emerald-300/80 dark:border-emerald-800/60'
        };
      case '東上':
        return {
          title: t.deckEastUpper + ' (B~D區)',
          pill: 'bg-sky-100 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-300/80 dark:border-sky-800/60'
        };
      case '西上':
        return {
          title: t.deckWestUpper + ' (B~D區)',
          pill: 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border-purple-300/80 dark:border-purple-800/60'
        };
    }
  };

  return (
    <div
      id={`matrix-date-${date.replace('/', '-')}`}
      className="w-full bg-white dark:bg-[#180206] rounded-2xl border border-rose-200/80 dark:border-amber-500/30 shadow-lg p-3 sm:p-4 mb-4 transition-colors"
    >
      {/* Date Matrix Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 mb-3 border-b border-rose-200/60 dark:border-amber-500/20">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-rose-500 via-rose-600 to-amber-500 text-white flex items-center justify-center font-black text-xs shadow-sm flex-shrink-0">
            <Calendar className="w-4 h-4" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm sm:text-base font-black text-slate-900 dark:text-amber-100">
                {formattedDateText}
              </span>
              {isTheme ? (
                <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-400/50">
                  {t.matrixThemeBadge}
                </span>
              ) : (
                <span className="text-[10px] sm:text-xs font-black px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10">
                  主場賽事
                </span>
              )}
              <span className="text-[11px] font-bold text-rose-700 dark:text-pink-300 bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full border border-rose-200 dark:border-rose-900/50">
                出勤 {dailyGirls.length} 位女孩
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-amber-300/70 mt-0.5">
              {isTheme
                ? '1-3 局與 7-8 局為看台專區貼身應援 • 賽後表演分東區與西區'
                : '1-3 局、中場表演與 7-8 局換側應援輪替'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-xs text-rose-700 dark:text-amber-300/80 bg-rose-50 dark:bg-[#120104] px-2.5 py-1 rounded-xl border border-rose-200 dark:border-amber-500/20 font-bold">
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>{t.matrixFavTop}</span>
        </div>
      </div>

      {/* 2D Scrollable Matrix Table Wrapper */}
      <div className="relative overflow-x-auto no-scrollbar rounded-xl border border-rose-200 dark:border-amber-500/20 bg-[#fffbfc] dark:bg-[#120104]">
        <table className="w-full text-left border-collapse min-w-[580px] sm:min-w-[680px]">
          {/* Table Header: Columns (Periods) */}
          <thead>
            <tr className="border-b border-rose-200 dark:border-amber-500/30 bg-rose-50/70 dark:bg-[#1e0209]">
              {/* Sticky Top-Left Corner Cell */}
              <th className="sticky left-0 z-20 w-28 sm:w-36 p-2.5 sm:p-3 bg-[#fff0f3] dark:bg-[#24040b] backdrop-blur-md border-r border-rose-200 dark:border-amber-500/30 text-[11px] sm:text-xs font-black text-rose-900 dark:text-amber-300 uppercase tracking-wider">
                {t.matrixCornerHeader}
              </th>
              {periodCols.map(col => (
                <th
                  key={col.key}
                  className="p-2.5 sm:p-3 text-center border-r last:border-r-0 border-rose-200/80 dark:border-amber-500/20 min-w-[160px] sm:min-w-[190px]"
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full border ${col.badgeStyle}`}>
                      {col.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-amber-300/60 mt-0.5 font-medium">
                      {col.subTitle}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body: Rows (Areas & Zones) */}
          <tbody>
            {areaRows.map((row, rIdx) => (
              <tr
                key={row.key}
                className={`border-b last:border-b-0 border-rose-100 dark:border-amber-500/20 ${
                  rIdx % 2 === 0 ? 'bg-white dark:bg-[#150105]/70' : 'bg-[#fffafb] dark:bg-[#1b0208]/70'
                }`}
              >
                {/* Sticky Left Column Cell: Area Label */}
                <th className="sticky left-0 z-10 p-2.5 sm:p-3 bg-[#fff0f3] dark:bg-[#1e030a] backdrop-blur-md border-r border-rose-200 dark:border-amber-500/30 align-top">
                  <div className="flex flex-col">
                    <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-black border ${row.badgeStyle} mb-0.5 w-max`}>
                      {row.title}
                    </span>
                    <span className="text-[10px] text-slate-500 dark:text-amber-300/60 font-medium">
                      {row.subTitle}
                    </span>
                  </div>
                </th>

                {/* Data Cells: Cheerleader Chips */}
                {periodCols.map(col => {
                  const cellGirls = getCellGirls(row, col);

                  // 看台專區（ZONE）在 1-3 局與 7-8 局依樓層熱區分組顯示
                  const isThemeZoneCell = isTheme && row.key === 'ZONE' && col.key !== 'POST';

                  return (
                    <td
                      key={col.key}
                      className="p-2 sm:p-2.5 border-r last:border-r-0 border-rose-100 dark:border-amber-500/10 align-top"
                    >
                      {cellGirls.length === 0 ? (
                        <div className="h-10 sm:h-12 flex items-center justify-center text-slate-300 dark:text-amber-500/20 text-xs select-none">
                          —
                        </div>
                      ) : isThemeZoneCell ? (
                        /* 看台專區結構化分層展示 (東下 / 西下 / 東上 / 西上) */
                        <div className="space-y-2.5">
                          {DECK_ORDER.map(deckKey => {
                            const deckGirls = cellGirls.filter(g => {
                              const assign = getZoneAssignment(date, g.name);
                              return assign?.deck === deckKey;
                            });

                            if (deckGirls.length === 0) return null;
                            const deckMeta = getDeckBadgeStyle(deckKey);

                            return (
                              <div key={deckKey} className="space-y-1">
                                {/* Deck Header Badge */}
                                <div className="flex items-center justify-between">
                                  <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md border ${deckMeta.pill}`}>
                                    {deckMeta.title} ({deckGirls.length})
                                  </span>
                                </div>

                                {/* Deck Girls Grid */}
                                <div className="grid grid-cols-2 gap-1.5">
                                  {deckGirls.map(girl => {
                                    const isFav = favorites.includes(girl.name);
                                    const assign = getZoneAssignment(date, girl.name);

                                    return (
                                      <button
                                        key={girl.name}
                                        onClick={() => onSelectGirl(girl)}
                                        className={`group flex items-center gap-1.5 p-1 rounded-xl transition text-left active:scale-95 border ${
                                          isFav
                                            ? 'bg-rose-50 hover:bg-rose-100 dark:bg-gradient-to-r dark:from-rose-950/80 dark:to-pink-950/80 border-rose-300 dark:border-amber-400/60 shadow-sm ring-1 ring-rose-300 dark:ring-amber-400/30'
                                            : 'bg-white hover:bg-rose-50/60 dark:bg-[#26050e]/60 dark:hover:bg-[#380815] border-rose-200/80 dark:border-amber-500/20 shadow-xs'
                                        }`}
                                        title={`${girl.name} (#${girl.number}) - ${assign?.zoneCode || '專區'}`}
                                      >
                                        <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 border border-rose-300 dark:border-amber-400/50 bg-neutral-100 dark:bg-neutral-900">
                                          <img
                                            src={girl.localPhoto || girl.photo}
                                            alt={girl.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                            loading="lazy"
                                          />
                                          {isFav && (
                                            <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                                              <Heart className="w-2.5 h-2.5 text-rose-500 dark:text-rose-300 fill-rose-500 dark:fill-rose-300" />
                                            </div>
                                          )}
                                        </div>

                                        <div className="min-w-0 flex-1 leading-tight">
                                          <div className="flex items-center gap-1">
                                            <span className="text-[9px] font-black text-rose-600 dark:text-amber-400">
                                              #{girl.number}
                                            </span>
                                            <span className="text-[11px] font-bold text-slate-800 dark:text-amber-100 truncate">
                                              {girl.name}
                                            </span>
                                          </div>
                                          {assign && (
                                            <span className="inline-block text-[8px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-1 rounded font-black truncate max-w-full">
                                              {assign.zoneCode}
                                            </span>
                                          )}
                                        </div>
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* 一般區域與賽後表演女孩晶片網格 */
                        <div className="grid grid-cols-2 gap-1.5">
                          {cellGirls.map(girl => {
                            const isFav = favorites.includes(girl.name);
                            const assign = isTheme ? getZoneAssignment(date, girl.name) : null;

                            return (
                              <button
                                key={girl.name}
                                onClick={() => onSelectGirl(girl)}
                                className={`group flex items-center gap-1.5 p-1 rounded-xl transition text-left active:scale-95 border ${
                                  isFav
                                    ? 'bg-rose-50 hover:bg-rose-100 dark:bg-gradient-to-r dark:from-rose-950/80 dark:to-pink-950/80 border-rose-300 dark:border-amber-400/60 shadow-sm ring-1 ring-rose-300 dark:ring-amber-400/30'
                                    : 'bg-white hover:bg-rose-50/60 dark:bg-[#26050e]/60 dark:hover:bg-[#380815] border-rose-200/80 dark:border-amber-500/20 shadow-xs'
                                }`}
                                title={`${girl.name} (#${girl.number})`}
                              >
                                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 border border-rose-300 dark:border-amber-400/50 bg-neutral-100 dark:bg-neutral-900">
                                  <img
                                    src={girl.localPhoto || girl.photo}
                                    alt={girl.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                    loading="lazy"
                                  />
                                  {isFav && (
                                    <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                                      <Heart className="w-2.5 h-2.5 text-rose-500 dark:text-rose-300 fill-rose-500 dark:fill-rose-300" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 leading-tight">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-black text-rose-600 dark:text-amber-400">
                                      #{girl.number}
                                    </span>
                                    <span className="text-[11px] font-bold text-slate-800 dark:text-amber-100 truncate">
                                      {girl.name}
                                    </span>
                                  </div>
                                  {assign && (
                                    <span className="inline-block text-[8px] text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-500/20 px-1 rounded-full font-black truncate max-w-full">
                                      {assign.zoneCode}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Date Footer: Unassigned Notice Bar */}
      <div className="mt-2.5 pt-2.5 border-t border-rose-200/60 dark:border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
        {unassignedGirls.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300/80 dark:border-amber-500/30 text-amber-900 dark:text-amber-200">
            <span className="font-extrabold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>{t.matrixUnassignedNotice.replace('{count}', String(unassignedGirls.length))}</span>
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {unassignedGirls.map(g => (
                <button
                  key={g.name}
                  onClick={() => onSelectGirl(g)}
                  className="px-2 py-0.5 rounded-lg bg-white dark:bg-[#2a050e] border border-amber-300 dark:border-amber-500/40 text-slate-800 dark:text-amber-100 font-black text-[11px] hover:bg-amber-100 dark:hover:bg-[#3a0714] transition shadow-xs"
                  title={`點擊查看 ${g.name} 詳細資訊`}
                >
                  #{g.number} {g.name}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300/60 dark:border-emerald-500/30">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.matrixAllAssignedNotice}</span>
          </div>
        )}

        <p className="text-[11px] text-slate-500 dark:text-amber-300/60">
          {t.matrixScrollTip}
        </p>
      </div>
    </div>
  );
};

export const MatrixView: React.FC<MatrixViewProps> = ({
  selectedDate,
  allGirls,
  schedule,
  favorites,
  onSelectGirl,
  onSelectDate,
  areaFilter = 'ALL',
  searchQuery = ''
}) => {
  const { t } = useLanguage();

  // 計算需要顯示的日期清單
  const displayDates = useMemo(() => {
    if (selectedDate) return [selectedDate];

    // 全賽季檢視：取得未來的有效賽事日期，若無則回傳所有日期
    const validDates = schedule.dates.length > 0
      ? schedule.dates
      : SPICY_COOL_SWEET_THEME.scheduleDates;

    return validDates;
  }, [selectedDate, schedule.dates]);

  const isMultiDate = !selectedDate && displayDates.length > 1;

  // 平滑捲動至指定日期錨點
  const scrollToDate = (date: string) => {
    const el = document.getElementById(`matrix-date-${date.replace('/', '-')}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* 全部日期總覽頂部導覽 Banner */}
      {isMultiDate && (
        <div className="bg-gradient-to-r from-rose-500/10 via-pink-500/10 to-amber-500/10 dark:from-rose-950/30 dark:via-pink-950/30 dark:to-amber-950/30 border border-rose-300/60 dark:border-amber-500/30 rounded-2xl p-3 sm:p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#1a0007] flex items-center justify-center font-black text-sm shadow-md flex-shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-amber-100 tracking-tight flex items-center gap-2">
                  <span>{t.matrixAllSeasonTitle}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-amber-500/20 text-rose-800 dark:text-amber-300 border border-rose-300/80 dark:border-amber-400/50">
                    共 {displayDates.length} 場賽事
                  </span>
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-amber-300/70 mt-0.5">
                  {t.matrixAllSeasonDesc}
                </p>
              </div>
            </div>

            {/* 快速跳轉錨點按鈕 */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 dark:text-amber-300/70 mr-0.5">
                快速前往：
              </span>
              {displayDates.map(d => (
                <button
                  key={d}
                  onClick={() => {
                    if (onSelectDate) onSelectDate(d);
                    else scrollToDate(d);
                  }}
                  className="px-2.5 py-1 rounded-lg text-xs font-black bg-white dark:bg-[#20030a] hover:bg-rose-50 dark:hover:bg-[#300510] text-rose-800 dark:text-amber-200 border border-rose-200 dark:border-amber-500/30 shadow-xs transition active:scale-95 flex items-center gap-1"
                >
                  <Calendar className="w-3 h-3 text-rose-500" />
                  <span>{d}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 逐日渲染各場次之獨立矩陣視圖 */}
      {displayDates.map(date => (
        <SingleDateMatrix
          key={date}
          date={date}
          allGirls={allGirls}
          schedule={schedule}
          favorites={favorites}
          areaFilter={areaFilter}
          searchQuery={searchQuery}
          onSelectGirl={onSelectGirl}
        />
      ))}
    </div>
  );
};
