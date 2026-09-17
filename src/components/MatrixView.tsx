import React from 'react';
import { Heart, Compass } from 'lucide-react';
import { GirlProfile, ScheduleDataset, DailyDuty, InningAssignment } from '../types/schedule';
import { isSpicyCoolSweetDate, getZoneAssignment, getPostMatchZone } from '../data/spicyCoolSweetData';

interface MatrixViewProps {
  selectedDate: string;
  allGirls: GirlProfile[];
  schedule: ScheduleDataset;
  favorites: string[];
  onSelectGirl: (girl: GirlProfile) => void;
  onToggleFavorite?: (name: string) => void;
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

export const MatrixView: React.FC<MatrixViewProps> = ({
  selectedDate,
  allGirls,
  schedule,
  favorites,
  onSelectGirl
}) => {
  const isTheme = Boolean(selectedDate && isSpicyCoolSweetDate(selectedDate));

  // 定義看台橫列（縱軸）
  const areaRows: AreaRowDef[] = [
    {
      key: 'EAST',
      title: '一壘東區',
      subTitle: '內野 1B 應援區',
      badgeStyle: 'bg-gradient-to-r from-blue-600/30 to-indigo-600/30 text-blue-200 border-blue-500/40',
      matchFn: (loc, isZone) => !isZone && loc.includes('東') && !loc.includes('東R')
    },
    {
      key: 'WEST',
      title: '三壘西區',
      subTitle: '內野 3B 應援區',
      badgeStyle: 'bg-gradient-to-r from-emerald-600/30 to-teal-600/30 text-emerald-200 border-emerald-500/40',
      matchFn: (loc, isZone) => !isZone && loc.includes('西') && !loc.includes('西R')
    },
    {
      key: 'DALE',
      title: '大樂區',
      subTitle: '特殊外野熱舞台',
      badgeStyle: 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 text-purple-200 border-purple-500/40',
      matchFn: (loc, isZone) => !isZone && (loc.includes('大樂') || loc.includes('東R') || loc.includes('西R'))
    },
    {
      key: 'ZONE',
      title: '看台專區',
      subTitle: isTheme ? '個人專屬看台貼身' : '特殊專區／合體',
      badgeStyle: 'bg-gradient-to-r from-amber-500/30 to-rose-600/30 text-amber-200 border-amber-400/50 font-black',
      matchFn: (loc, isZone) => isZone || loc.includes('專區') || loc.includes('舞台')
    }
  ];

  // 定義時段縱直行（橫軸）
  const periodCols: PeriodColDef[] = isTheme
    ? [
        {
          key: 'P13',
          title: '1-3 局',
          subTitle: '前段專屬攻守',
          badgeStyle: 'text-sky-300 border-sky-500/30 bg-sky-950/40'
        },
        {
          key: 'P78',
          title: '7-8 局',
          subTitle: '後段換側熱舞',
          badgeStyle: 'text-purple-300 border-purple-500/30 bg-purple-950/40'
        },
        {
          key: 'POST',
          title: '賽後表演',
          subTitle: '主題日勝利煙火',
          badgeStyle: 'text-amber-300 border-amber-500/30 bg-amber-950/40 font-black'
        }
      ]
    : [
        {
          key: 'P13',
          title: '1-3 局',
          subTitle: '開場與前段攻守',
          badgeStyle: 'text-sky-300 border-sky-500/30 bg-sky-950/40'
        },
        {
          key: 'PMID',
          title: '第 5 局',
          subTitle: '中場舞合體演出',
          badgeStyle: 'text-amber-300 border-amber-500/30 bg-amber-950/40'
        },
        {
          key: 'P78',
          title: '7-8 局',
          subTitle: '後段換側熱舞',
          badgeStyle: 'text-purple-300 border-purple-500/30 bg-purple-950/40'
        }
      ];

  // 取得某女孩在特定時段所在之位置字串
  const getGirlLocationInPeriod = (girl: GirlProfile, periodKey: string): string => {
    const duties: DailyDuty[] = schedule.girlsScheduleMap[girl.name] || [];
    const duty = selectedDate ? duties.find((d: DailyDuty) => d.date === selectedDate) : duties[0];
    if (!duty) return '';

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
      const duties: DailyDuty[] = schedule.girlsScheduleMap[girl.name] || [];
      const hasDuty = selectedDate ? duties.some((d: DailyDuty) => d.date === selectedDate) : duties.length > 0;
      if (!hasDuty) return false;

      const isZone = Boolean(selectedDate && getZoneAssignment(selectedDate, girl.name));

      // 若為主題日的專區列
      if (isTheme && row.key === 'ZONE') {
        if (col.key === 'POST') return false; // 賽後表演僅分東區、西區
        return isZone;
      }

      // 賽後表演時段特殊判定
      if (col.key === 'POST') {
        const postZone = selectedDate ? getPostMatchZone(selectedDate, girl.name) : null;
        if (!postZone) return false;
        if (row.key === 'EAST') return postZone.includes('東');
        if (row.key === 'WEST') return postZone.includes('西');
        return false;
      }

      const loc = getGirlLocationInPeriod(girl, col.key);
      if (!loc) return false;

      return row.matchFn(loc, isZone);
    }).sort((a, b) => {
      // 最愛優先置頂，再依背號排序
      const aFav = favorites.includes(a.name);
      const bFav = favorites.includes(b.name);
      if (aFav && !bFav) return -1;
      if (!aFav && bFav) return 1;
      return (parseInt(a.number, 10) || 999) - (parseInt(b.number, 10) || 999);
    });
  };

  return (
    <div className="w-full bg-[#180206] rounded-2xl border border-amber-500/30 shadow-2xl p-2.5 sm:p-4 mb-4 overflow-hidden">
      {/* Matrix Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 text-[#1a0007] flex items-center justify-center font-black text-xs shadow-md">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-extrabold text-amber-200 flex items-center gap-1.5">
              <span>看台輪替矩陣視圖</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/40">
                {selectedDate || '全賽季'}
              </span>
            </h2>
            <p className="text-[11px] text-amber-300/70">
              左右滑動檢視各局時段 • 點擊女孩頭像即刻開啟詳細抽屜
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 text-[11px] text-amber-300/80 bg-[#120104] px-2.5 py-1 rounded-xl border border-amber-500/20">
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
          <span>最愛優先置頂</span>
        </div>
      </div>

      {/* 2D Scrollable Matrix Table Wrapper */}
      <div className="relative overflow-x-auto no-scrollbar rounded-xl border border-amber-500/20 bg-[#120104]">
        <table className="w-full text-left border-collapse min-w-[580px] sm:min-w-[680px]">
          {/* Table Header: Columns (Periods) */}
          <thead>
            <tr className="border-b border-amber-500/30 bg-[#1e0209]">
              {/* Sticky Top-Left Corner Cell */}
              <th className="sticky left-0 z-20 w-28 sm:w-36 p-2.5 sm:p-3 bg-[#24040b] backdrop-blur-md border-r border-amber-500/30 text-[11px] sm:text-xs font-black text-amber-300 uppercase tracking-wider">
                看台區域 / 局數
              </th>
              {periodCols.map(col => (
                <th
                  key={col.key}
                  className={`p-2.5 sm:p-3 text-center border-r last:border-r-0 border-amber-500/20 min-w-[150px] sm:min-w-[180px]`}
                >
                  <div className="flex flex-col items-center">
                    <span className={`text-xs sm:text-sm font-black px-2.5 py-0.5 rounded-full border ${col.badgeStyle}`}>
                      {col.title}
                    </span>
                    <span className="text-[10px] text-amber-300/60 mt-0.5 font-medium">
                      {col.subTitle}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body: Rows (Areas) */}
          <tbody>
            {areaRows.map((row, rIdx) => (
              <tr
                key={row.key}
                className={`border-b last:border-b-0 border-amber-500/20 ${
                  rIdx % 2 === 0 ? 'bg-[#150105]/70' : 'bg-[#1b0208]/70'
                }`}
              >
                {/* Sticky Left Column Cell: Area Label */}
                <th className="sticky left-0 z-10 p-2.5 sm:p-3 bg-[#1e030a] backdrop-blur-md border-r border-amber-500/30 align-top">
                  <div className="flex flex-col">
                    <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-black border ${row.badgeStyle} mb-0.5 w-max`}>
                      {row.title}
                    </span>
                    <span className="text-[10px] text-amber-300/60 font-medium">
                      {row.subTitle}
                    </span>
                  </div>
                </th>

                {/* Data Cells: Cheerleader Chips */}
                {periodCols.map(col => {
                  const girls = getCellGirls(row, col);

                  return (
                    <td
                      key={col.key}
                      className="p-2 sm:p-2.5 border-r last:border-r-0 border-amber-500/10 align-top"
                    >
                      {girls.length === 0 ? (
                        <div className="h-14 flex items-center justify-center text-[10px] text-amber-400/40 italic">
                          未安排站位
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 gap-1.5">
                          {girls.map(girl => {
                            const isFav = favorites.includes(girl.name);
                            const zoneAssign = isTheme ? getZoneAssignment(selectedDate, girl.name) : null;

                            return (
                              <button
                                key={girl.name}
                                onClick={() => onSelectGirl(girl)}
                                className={`group flex items-center gap-1.5 p-1 rounded-xl transition text-left active:scale-95 border ${
                                  isFav
                                    ? 'bg-gradient-to-r from-rose-950/80 to-pink-950/80 border-amber-400/60 shadow-sm shadow-rose-900/30 ring-1 ring-amber-400/30'
                                    : 'bg-[#26050e]/60 hover:bg-[#380815] border-amber-500/20'
                                }`}
                                title={`${girl.name} (#${girl.number}) - 點擊查看詳細資訊`}
                              >
                                {/* Micro Avatar */}
                                <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 border border-amber-400/50 bg-neutral-900">
                                  <img
                                    src={girl.localPhoto || girl.photo}
                                    alt={girl.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                                    loading="lazy"
                                  />
                                  {isFav && (
                                    <div className="absolute inset-0 bg-rose-500/20 flex items-center justify-center">
                                      <Heart className="w-2.5 h-2.5 text-rose-300 fill-rose-300" />
                                    </div>
                                  )}
                                </div>

                                {/* Text info */}
                                <div className="min-w-0 flex-1 leading-tight">
                                  <div className="flex items-center gap-1">
                                    <span className="text-[9px] font-black text-amber-400">
                                      #{girl.number}
                                    </span>
                                    <span className="text-[11px] font-bold text-amber-100 truncate">
                                      {girl.name}
                                    </span>
                                  </div>
                                  {zoneAssign && (
                                    <span className="inline-block text-[8px] text-amber-300 bg-amber-500/20 px-1 rounded-full font-black truncate max-w-full">
                                      {zoneAssign.zoneCode}
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
    </div>
  );
};
