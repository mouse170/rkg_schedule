import Papa from 'papaparse';
import { ScheduleDataset, DailyDuty, InningAssignment } from '../types/schedule';

export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/export?format=csv';

interface TableBlock {
  date: string;
  startCol: number;
  endCol: number;
  numberCol: number;
  nameCol: number;
  inningCols: { colIndex: number; period: string }[];
}

export function parseSheetCsv(csvText: string): ScheduleDataset {
  const parsed = Papa.parse<string[]>(csvText, { skipEmptyLines: false });
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
  const dateRow = rows[headerRowIndex - 1] || [];

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
        inningCols.push({ colIndex: c, period: h });
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

      for (const inningCol of table.inningCols) {
        const val = (row[inningCol.colIndex] || '').trim();
        if (val) {
          innings.push({
            period: inningCol.period,
            location: val
          });
          if (val.includes('東')) eastCount++;
          if (val.includes('西')) westCount++;
        }
      }

      if (innings.length === 0) continue;

      let primaryArea: DailyDuty['primaryArea'] = '其他';
      if (eastCount > westCount) {
        primaryArea = '東區';
      } else if (westCount > eastCount) {
        primaryArea = '西區';
      } else if (eastCount > 0 && eastCount === westCount) {
        primaryArea = '全區';
      }

      const duty: DailyDuty = {
        date: table.date,
        girlName: rawName,
        number: rawNumber,
        innings,
        primaryArea
      };

      // Add to daily roster
      dailyRosterMap[table.date].push(duty);

      // Normalize name for key (e.g. 珈妤 -> 沈珈妤, 琳妲 -> 琳妲)
      const keyName = rawName === '珈妤' ? '沈珈妤' : rawName;
      if (!girlsScheduleMap[keyName]) {
        girlsScheduleMap[keyName] = [];
      }
      if (!girlsScheduleMap[keyName].some(d => d.date === table.date)) {
        girlsScheduleMap[keyName].push(duty);
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

// Fallback CSV snapshot
const FALLBACK_CSV = `,,9/2,,,,,9/3,,
背號,女孩,1-3,7-8,,背號,女孩,1-3,中場,7-8
3,穆又甯,西,東,我  叫  分  隔  線,3,穆又甯,東,西,西
6,宋宋,東,西,,7,筠熹,東,西,西
7,筠熹,西,東,,10,卉妮,西,東,東
10,卉妮,東,西,,12,穎樂,西,東,東
12,穎樂,西,東,,15,孟潔,東,西,西
15,孟潔,西,東,,17,笑笑,東,西,西
18,熊霓,東,西,,22,河智媛,西,東,東
22,河智媛,東,西,,25,禹洙漢,東,西,西
25,禹洙漢,西,東,,36,禹菡,東,西,西
27,若潼,西,東,,66,岱縈,東,西,西
33,言梓璇,東,西,,67,崔荷潾,西,東,東
66,岱縈,西,東,,77,曲曲,西,東,東
67,崔荷潾,東,西,,87,彭彭,東,西,西
77,曲曲,東,西,,88,珈妤,西,東,東
87,彭彭,西,東,,97,溫妮,西,東,東
88,沈珈妤,東,西,,0,琳妲,西,東,東`;

export async function fetchLiveSchedule(): Promise<ScheduleDataset> {
  try {
    const response = await fetch(`${SHEET_CSV_URL}&t=${Date.now()}`, {
      cache: 'no-store'
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    const csvText = await response.text();
    const dataset = parseSheetCsv(csvText);
    dataset.isLive = true;
    return dataset;
  } catch (err) {
    console.warn('Failed to fetch live sheet, using snapshot fallback:', err);
    const fallback = parseSheetCsv(FALLBACK_CSV);
    fallback.isLive = false;
    return fallback;
  }
}
