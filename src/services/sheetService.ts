import Papa from 'papaparse';
import { ScheduleDataset, DailyDuty, InningAssignment } from '../types/schedule';

export const SHEET_CSV_URL = 'https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/export?format=csv';

interface ColumnBlock {
  date: string;
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

  // 1. Find the date header row (row containing dates like 9/2, 9/3, etc.)
  let dateRowIndex = -1;
  for (let i = 0; i < Math.min(rows.length, 15); i++) {
    const row = rows[i];
    if (row.some(cell => /\b\d{1,2}\/\d{1,2}\b/.test(cell.trim()))) {
      dateRowIndex = i;
      break;
    }
  }

  if (dateRowIndex === -1) {
    // Default to row 0 if no explicit date pattern found
    dateRowIndex = 0;
  }

  const dateRow = rows[dateRowIndex];
  const headerRow = rows[dateRowIndex + 1] || [];

  // 2. Identify all date column blocks
  const blocks: ColumnBlock[] = [];
  let currentDate = '';
  let currentBlockStart = -1;

  for (let c = 0; c < dateRow.length; c++) {
    const cell = dateRow[c].trim();
    const dateMatch = cell.match(/\b(\d{1,2}\/\d{1,2})\b/);
    if (dateMatch) {
      if (currentDate && currentBlockStart !== -1) {
        // finish previous block
        blocks.push(buildBlock(currentDate, currentBlockStart, c, headerRow));
      }
      currentDate = dateMatch[1];
      currentBlockStart = c;
    }
  }

  if (currentDate && currentBlockStart !== -1) {
    blocks.push(buildBlock(currentDate, currentBlockStart, dateRow.length, headerRow));
  }

  // Helper to build a column block
  function buildBlock(date: string, startCol: number, endCol: number, headers: string[]): ColumnBlock {
    let numberCol = -1;
    let nameCol = -1;
    const inningCols: { colIndex: number; period: string }[] = [];

    for (let col = startCol; col < endCol; col++) {
      const header = (headers[col] || '').trim();
      if (header.includes('背號')) {
        numberCol = col;
      } else if (header.includes('女孩') || header.includes('姓名')) {
        nameCol = col;
      } else if (header.length > 0 && !header.includes('分隔線')) {
        inningCols.push({ colIndex: col, period: header });
      }
    }

    // fallback heuristics if header didn't explicitly say "背號" or "女孩"
    if (nameCol === -1) {
      // Typically the second column in the block
      nameCol = startCol + 1 < endCol ? startCol + 1 : startCol;
    }
    if (numberCol === -1 && nameCol > startCol) {
      numberCol = startCol;
    }

    return { date, numberCol, nameCol, inningCols };
  }

  // 3. Parse duty rows for each block
  const dates: string[] = blocks.map(b => b.date);
  const girlsScheduleMap: Record<string, DailyDuty[]> = {};
  const dailyRosterMap: Record<string, DailyDuty[]> = {};

  dates.forEach(d => {
    dailyRosterMap[d] = [];
  });

  const startDataRow = dateRowIndex + 2;

  for (let r = startDataRow; r < rows.length; r++) {
    const row = rows[r];
    if (!row || row.length === 0) continue;

    for (const block of blocks) {
      const rawName = (row[block.nameCol] || '').trim();
      const rawNumber = block.numberCol !== -1 ? (row[block.numberCol] || '').trim() : '';

      // Skip empty or summary rows (e.g., total counts, "東", "西", "大樂", etc.)
      if (!rawName || rawName === '女孩' || rawName === '東' || rawName === '西' || rawName === '東R' || rawName === '西R' || rawName === '大樂') {
        continue;
      }
      if (!isNaN(Number(rawName))) {
        continue; // numbers only indicate count
      }

      // Collect inning positions
      const innings: InningAssignment[] = [];
      let eastCount = 0;
      let westCount = 0;

      for (const inningCol of block.inningCols) {
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

      let primaryArea: DailyDuty['primaryArea'] = '其他';
      if (eastCount > westCount) {
        primaryArea = '東區';
      } else if (westCount > eastCount) {
        primaryArea = '西區';
      } else if (eastCount > 0 && eastCount === westCount) {
        primaryArea = '全區';
      }

      const duty: DailyDuty = {
        date: block.date,
        girlName: rawName,
        number: rawNumber,
        innings,
        primaryArea
      };

      // Add to daily roster
      if (!dailyRosterMap[block.date]) {
        dailyRosterMap[block.date] = [];
      }
      dailyRosterMap[block.date].push(duty);

      // Normalize name for key (e.g. 珈妤 -> 沈珈妤)
      const keyName = rawName === '珈妤' ? '沈珈妤' : rawName;
      if (!girlsScheduleMap[keyName]) {
        girlsScheduleMap[keyName] = [];
      }
      // avoid duplicates
      if (!girlsScheduleMap[keyName].some(d => d.date === block.date)) {
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

// Initial fallback CSV data from snapshot
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
