import Papa from 'papaparse';
import { ScheduleDataset, DailyDuty, InningAssignment } from '../types/schedule';
import { findGirlByName } from '../data/girlsRoster';
import { enrichDutyWithZone } from '../data/spicyCoolSweetData';
import { isPastDate } from '../utils/dateUtils';

export const SHEET_CSV_BASE_URL = 'https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/export?format=csv';
export const SHEET_GIDS = ['735466597'];
export const SHEET_CSV_URL = `${SHEET_CSV_BASE_URL}&gid=${SHEET_GIDS[0]}`;

interface TableBlock {
  date: string;
  startCol: number;
  endCol: number;
  numberCol: number;
  nameCol: number;
  inningCols: { colIndex: number; period: string }[];
}

export function parseSheetCsv(csvText: string): ScheduleDataset {
  const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: true });
  const rows = parsed.data;

  if (!rows || rows.length < 2) {
    return {
      dates: [],
      girlsScheduleMap: {},
      dailyRosterMap: {},
      lastUpdated: new Date().toLocaleTimeString('zh-TW'),
      isLive: false,
    };
  }

  // 1. Locate the header row containing '背號' and '女孩' (or '姓名')
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const row = rows[i];
    if (row.some(c => c.includes('背號')) && row.some(c => c.includes('女孩') || c.includes('姓名'))) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) {
    console.warn('Could not find header row with 背號 and 女孩');
    headerRowIndex = 1;
  }

  const headerRow = rows[headerRowIndex];

  // Search backward from headerRowIndex to find the row containing dates
  let dateRowIndex = -1;
  for (let i = headerRowIndex - 1; i >= 0; i--) {
    const row = rows[i];
    if (row && row.some(c => (c || '').trim().match(/\d{1,2}\/\d{1,2}/))) {
      dateRowIndex = i;
      break;
    }
  }
  const dateRow = dateRowIndex !== -1 ? rows[dateRowIndex] : (rows[headerRowIndex - 1] || []);

  // 2. Locate each game table by finding '背號' occurrences in the header row
  const tableStarts: number[] = [];
  for (let c = 0; c < headerRow.length; c++) {
    if (headerRow[c].trim() === '背號') {
      tableStarts.push(c);
    }
  }

  const tables: TableBlock[] = [];
  for (let t = 0; t < tableStarts.length; t++) {
    const start = tableStarts[t];
    const end = (t + 1 < tableStarts.length) ? tableStarts[t + 1] : headerRow.length;

    // Search for match date in the date row within or adjacent to this block's columns
    let date = '';
    for (let c = start; c < end; c++) {
      const match = (dateRow[c] || '').trim().match(/(\d{1,2}\/\d{1,2})/);
      if (match) {
        date = match[1];
        break;
      }
    }

    // Fallback if date cell wasn't directly within range
    if (!date) {
      date = `第 ${t + 1} 場`;
    }

    let numberCol = start;
    let nameCol = -1;
    const inningCols: { colIndex: number; period: string }[] = [];

    for (let c = start; c < end; c++) {
      const h = (headerRow[c] || '').trim();
      if (h === '女孩' || h === '姓名') {
        nameCol = c;
      } else if (h && h !== '背號' && !h.includes('分隔線')) {
        let period = h;
        if (h.toUpperCase() === 'IF' || h.includes('中場')) {
          period = '第5局中場';
        }
        inningCols.push({ colIndex: c, period });
      }
    }

    if (nameCol === -1) {
      nameCol = start + 1;
    }

    tables.push({
      date,
      startCol: start,
      endCol: end,
      numberCol,
      nameCol,
      inningCols
    });
  }

  const dates = tables.map(t => t.date);
  const girlsScheduleMap: Record<string, DailyDuty[]> = {};
  const dailyRosterMap: Record<string, DailyDuty[]> = {};

  dates.forEach(d => {
    dailyRosterMap[d] = [];
  });

  const summaryKeywords = ['東', '西', '東R', '西R', '大樂', '女孩', '姓名', '小計', '合計'];

  // 3. Parse duty rows for each table
  for (const table of tables) {
    for (let r = headerRowIndex + 1; r < rows.length; r++) {
      const row = rows[r];
      if (!row || row.length === 0) continue;

      const rawName = (row[table.nameCol] || '').trim();
      const rawNumber = (row[table.numberCol] || '').trim();

      // Skip summary, footer, or separator rows
      if (
        !rawName ||
        summaryKeywords.includes(rawName) ||
        rawName.includes('分隔線') ||
        !isNaN(Number(rawName))
      ) {
        continue;
      }

      // Collect inning assignments
      const innings: InningAssignment[] = [];
      let eastCount = 0;
      let westCount = 0;
      let eastRCount = 0;
      let westRCount = 0;
      let daleCount = 0;
      let specialCount = 0;

      for (const inningCol of table.inningCols) {
        const val = (row[inningCol.colIndex] || '').trim();
        if (val) {
          innings.push({
            period: inningCol.period,
            location: val
          });
          if (val === '東R' || val.includes('東R')) eastRCount++;
          else if (val === '西R' || val.includes('西R')) westRCount++;
          else if (val.includes('大樂')) daleCount++;
          else if (val.includes('專區')) specialCount++;
          else if (val.includes('東')) eastCount++;
          else if (val.includes('西')) westCount++;
        }
      }

      let primaryArea: DailyDuty['primaryArea'] = '其他';
      if (daleCount > 0 && daleCount >= eastCount && daleCount >= westCount) {
        primaryArea = '大樂';
      } else if (eastRCount > 0 && eastRCount >= eastCount) {
        primaryArea = '東R';
      } else if (westRCount > 0 && westRCount >= westCount) {
        primaryArea = '西R';
      } else if (specialCount > 0) {
        primaryArea = '專區';
      } else if (eastCount > westCount) {
        primaryArea = '東區';
      } else if (westCount > eastCount) {
        primaryArea = '西區';
      } else if (eastCount > 0 && eastCount === westCount) {
        primaryArea = '全區';
      }

      // Resolve official girl profile to normalize name and number (e.g. KIRA -> Kira, MIKA -> Mika, 珈妤 -> 沈珈妤)
      const officialGirl = findGirlByName(rawName);
      const canonicalName = officialGirl ? officialGirl.name : (rawName === '珈妤' ? '沈珈妤' : rawName);
      const canonicalNumber = officialGirl ? officialGirl.number : rawNumber;

      const duty: DailyDuty = enrichDutyWithZone({
        date: table.date,
        girlName: canonicalName,
        number: canonicalNumber,
        innings,
        primaryArea
      }, table.date, canonicalName);

      // Add to daily roster
      dailyRosterMap[table.date].push(duty);

      // Key into girlsScheduleMap using canonical name
      if (!girlsScheduleMap[canonicalName]) {
        girlsScheduleMap[canonicalName] = [];
      }
      if (!girlsScheduleMap[canonicalName].some(d => d.date === table.date)) {
        girlsScheduleMap[canonicalName].push(duty);
      }
    }
  }

  return {
    dates,
    girlsScheduleMap,
    dailyRosterMap,
    lastUpdated: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    isLive: true
  };
}

// Fallback CSV snapshot（9/19 與 9/20 辣酷甜主題日當期即時備份）
const FALLBACK_CSV = `"🦈站位由各家女孩粉絲手動更新,僅供參考,實際站位以現場為主🦈",,,,,,,,,,
,,9/19,,,,,,9/20,,
背號,女孩,1-3,7-8,賽後,,背號,女孩,1-3,7-8,賽後
3,穆又甯,,,東,我  叫  分  隔  線,3,穆又甯,專區,專區,
6,宋宋,專區,專區,,,6,宋宋,,,
7,筠熹,,,,,7,筠熹,專區,專區,
8,貝佳頤,大樂,東,,,8,貝佳頤,專區,專區,
9,高橋佳帆,專區,專區,西,,9,高橋佳帆,,,
10,卉妮,,,,,10,卉妮,專區,專區,
12,穎樂,專區,專區,,,12,穎樂,,,
15,孟潔,專區,專區,,,15,孟潔,西,大樂,
17,笑笑,大樂,西,西,,17,笑笑,專區,專區,
18,熊霓,專區,專區,西,,18,熊霓,,,
19,KIRA,西,大樂,,,19,KIRA,專區,專區,東
20,MIKA,,,,,20,MIKA,專區,專區,西
22,河智媛,西,東,,,22,河智媛,專區,專區,西
24,廉世彬,專區,專區,,,24,廉世彬,西,東,東
25,禹洙漢,東,西,,,25,禹洙漢,專區,專區,西
26,高佳彬,專區,專區,,,26,高佳彬,東,西,東
27,若潼,,,,,27,若潼,專區,專區,
33,言梓璇,西,東,,,33,言梓璇,專區,專區,東
34,金佳垠,專區,專區,,,34,金佳垠,東,西,東
36,禹菡,專區,專區,東,,36,禹菡,西,東,
66,岱縈,專區,專區,,,66,岱縈,西,東,
67,崔荷潾,專區,專區,,,67,崔荷潾,,,
77,曲曲,專區,專區,東,,77,曲曲,東,西,
87,彭彭,專區,專區,西,,87,彭彭,,,
88,沈珈妤,專區,專區,,,88,沈珈妤,,,西
97,溫妮,西,東,東,,97,溫妮,專區,專區,
0,琳妲,,,西,,0,琳妲,專區,專區,`;

export async function fetchLiveSchedule(): Promise<ScheduleDataset> {
  try {
    const timestamp = Date.now();
    // 優先抓取發布之主要活頁簿 CSV，並同步檢索當期 GID
    const urlsToFetch = [
      `${SHEET_CSV_BASE_URL}&t=${timestamp}`,
      ...SHEET_GIDS.map(gid => `${SHEET_CSV_BASE_URL}&gid=${gid}&t=${timestamp}`)
    ];

    const fetchPromises = urlsToFetch.map(async (url) => {
      try {
        const response = await fetch(url, { cache: 'no-store' });
        if (!response.ok) return null;
        const csvText = await response.text();
        return parseSheetCsv(csvText);
      } catch {
        return null;
      }
    });

    const results = await Promise.all(fetchPromises);
    const datasets = results.filter((ds): ds is ScheduleDataset => ds !== null && ds.dates.length > 0);

    if (datasets.length === 0) {
      throw new Error('No valid dataset returned from Google Sheets');
    }

    // 合併頁籤之 dates、dailyRosterMap 與 girlsScheduleMap
    const combinedDates: string[] = [];
    const combinedDailyRosterMap: Record<string, DailyDuty[]> = {};
    const combinedGirlsScheduleMap: Record<string, DailyDuty[]> = {};

    datasets.forEach((ds) => {
      // 1. 合併 dates（依出現順序去重）
      ds.dates.forEach((d) => {
        if (!combinedDates.includes(d)) {
          combinedDates.push(d);
        }
        combinedDailyRosterMap[d] = ds.dailyRosterMap[d] || [];
      });

      // 2. 合併 girlsScheduleMap
      Object.entries(ds.girlsScheduleMap).forEach(([name, duties]) => {
        if (!combinedGirlsScheduleMap[name]) {
          combinedGirlsScheduleMap[name] = [];
        }
        duties.forEach((duty) => {
          if (!combinedGirlsScheduleMap[name].some((existing) => existing.date === duty.date)) {
            combinedGirlsScheduleMap[name].push(duty);
          }
        });
      });
    });

    // 嚴格過濾已過期之歷史賽事，只保留當期有效賽事日期
    const activeDates = combinedDates.filter(d => !isPastDate(d));
    const finalDates = activeDates.length > 0 ? activeDates : combinedDates;

    return {
      dates: finalDates,
      girlsScheduleMap: combinedGirlsScheduleMap,
      dailyRosterMap: combinedDailyRosterMap,
      lastUpdated: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      isLive: true
    };
  } catch (err) {
    console.warn('Failed to fetch live sheet, using snapshot fallback:', err);
    const fallback = parseSheetCsv(FALLBACK_CSV);
    fallback.isLive = false;
    const activeDates = fallback.dates.filter(d => !isPastDate(d));
    fallback.dates = activeDates.length > 0 ? activeDates : fallback.dates;
    return fallback;
  }
}
