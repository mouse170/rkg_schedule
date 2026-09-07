import { Language } from '../i18n/translations';

export interface RelativeDateInfo {
  isToday: boolean;
  isTomorrow: boolean;
  isDayAfterTomorrow: boolean;
  isThisWeek: boolean;
  isNextWeek: boolean;
  diffDays: number; // targetDate - today (以日為單位)
  weekdayName: string; // e.g. "週一", "月曜日", "월요일"
  badgeText: string; // e.g. "今日應援", "明天 (週二)", "後天 (週三)", "本週五"
  pillSubtitle: string; // e.g. "今天", "明天", "後天", "本週五"
}

/**
 * 解析試算表格式日期字串（例如 "9/7"），結合指定或當前年份返回 Date 物件
 */
export function parseScheduleDate(dateStr: string, baseDate: Date = new Date()): Date | null {
  const m = dateStr.trim().match(/^(\d{1,2})\/(\d{1,2})$/);
  if (!m) return null;
  const month = parseInt(m[1], 10);
  const day = parseInt(m[2], 10);
  const year = baseDate.getFullYear();
  return new Date(year, month - 1, day);
}

/**
 * 計算班表日期相對於基準日（預設今天）的時態資訊與提示文字
 */
export function getRelativeDateInfo(
  dateStr: string,
  lang: Language = 'zh-TW',
  baseDate: Date = new Date()
): RelativeDateInfo {
  const target = parseScheduleDate(dateStr, baseDate);
  if (!target) {
    return {
      isToday: false,
      isTomorrow: false,
      isDayAfterTomorrow: false,
      isThisWeek: false,
      isNextWeek: false,
      diffDays: 999,
      weekdayName: '',
      badgeText: '比賽日',
      pillSubtitle: ''
    };
  }

  const startOfBase = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
  const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());

  const diffTime = startOfTarget.getTime() - startOfBase.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  const dayOfWeek = target.getDay(); // 0: Sun, 1: Mon, ... 6: Sat

  // 各語系星期名稱
  const weekdayNames: Record<Language, string[]> = {
    'zh-TW': ['週日', '週一', '週二', '週三', '週四', '週五', '週六'],
    'ja': ['日曜日', '月曜日', '火曜日', '水曜日', '木曜日', '金曜日', '土曜日'],
    'ko': ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일']
  };

  const weekdayShortNames: Record<Language, string[]> = {
    'zh-TW': ['日', '一', '二', '三', '四', '五', '六'],
    'ja': ['日', '月', '火', '水', '木', '金', '土'],
    'ko': ['일', '월', '화', '수', '목', '금', '토']
  };

  const wFull = (weekdayNames[lang] || weekdayNames['zh-TW'])[dayOfWeek];
  const wShort = (weekdayShortNames[lang] || weekdayShortNames['zh-TW'])[dayOfWeek];

  // 計算週別（以週一為每週首日）
  const baseDayMondayIndex = (startOfBase.getDay() + 6) % 7;
  const mondayOfBase = new Date(startOfBase);
  mondayOfBase.setDate(startOfBase.getDate() - baseDayMondayIndex);

  const sundayOfBase = new Date(mondayOfBase);
  sundayOfBase.setDate(mondayOfBase.getDate() + 6);

  const nextMondayOfBase = new Date(mondayOfBase);
  nextMondayOfBase.setDate(mondayOfBase.getDate() + 7);

  const nextSundayOfBase = new Date(mondayOfBase);
  nextSundayOfBase.setDate(mondayOfBase.getDate() + 13);

  const isThisWeek = startOfTarget >= mondayOfBase && startOfTarget <= sundayOfBase;
  const isNextWeek = startOfTarget >= nextMondayOfBase && startOfTarget <= nextSundayOfBase;

  const isToday = diffDays === 0;
  const isTomorrow = diffDays === 1;
  const isDayAfterTomorrow = diffDays === 2;

  let badgeText = '';
  let pillSubtitle = '';

  if (lang === 'zh-TW') {
    if (isToday) {
      badgeText = '今日應援';
      pillSubtitle = '今天';
    } else if (isTomorrow) {
      badgeText = `明天 (${wFull})`;
      pillSubtitle = '明天';
    } else if (isDayAfterTomorrow) {
      badgeText = `後天 (${wFull})`;
      pillSubtitle = '後天';
    } else if (isThisWeek) {
      badgeText = `本${wFull}`;
      pillSubtitle = `本${wFull}`;
    } else if (isNextWeek) {
      badgeText = `下${wFull}`;
      pillSubtitle = `下${wFull}`;
    } else if (diffDays === -1) {
      badgeText = `昨天 (${wFull})`;
      pillSubtitle = '昨天';
    } else {
      badgeText = wFull;
      pillSubtitle = wFull;
    }
  } else if (lang === 'ja') {
    if (isToday) {
      badgeText = '本日応援';
      pillSubtitle = '本日';
    } else if (isTomorrow) {
      badgeText = `明日 (${wShort})`;
      pillSubtitle = '明日';
    } else if (isDayAfterTomorrow) {
      badgeText = `明後日 (${wShort})`;
      pillSubtitle = '明後日';
    } else if (isThisWeek) {
      badgeText = `今週 (${wShort})`;
      pillSubtitle = `今週(${wShort})`;
    } else if (isNextWeek) {
      badgeText = `来週 (${wShort})`;
      pillSubtitle = `来週(${wShort})`;
    } else {
      badgeText = wFull;
      pillSubtitle = wShort;
    }
  } else {
    // ko
    if (isToday) {
      badgeText = '오늘 응원';
      pillSubtitle = '오늘';
    } else if (isTomorrow) {
      badgeText = `내일 (${wShort})`;
      pillSubtitle = '내일';
    } else if (isDayAfterTomorrow) {
      badgeText = `모레 (${wShort})`;
      pillSubtitle = '모레';
    } else if (isThisWeek) {
      badgeText = `이번 주 (${wShort})`;
      pillSubtitle = `이번주(${wShort})`;
    } else if (isNextWeek) {
      badgeText = `다음 주 (${wShort})`;
      pillSubtitle = `다음주(${wShort})`;
    } else {
      badgeText = wFull;
      pillSubtitle = wShort;
    }
  }

  return {
    isToday,
    isTomorrow,
    isDayAfterTomorrow,
    isThisWeek,
    isNextWeek,
    diffDays,
    weekdayName: wFull,
    badgeText,
    pillSubtitle
  };
}

/**
 * 將試算表中之站位關鍵字（東、西、東R、西R、大樂、專區）依當前語言翻譯
 */
export function translateLocation(rawLocation: string, lang: Language): string {
  if (!rawLocation) return '';
  const trimmed = rawLocation.trim();

  if (lang === 'ja') {
    if (trimmed === '東') return '東';
    if (trimmed === '西') return '西';
    if (trimmed === '東R') return '東R';
    if (trimmed === '西R') return '西R';
    if (trimmed.includes('大樂') || trimmed.includes('大楽')) return '大楽';
    if (trimmed.includes('專區') || trimmed.includes('特区')) return '特区';
    return trimmed;
  }

  if (lang === 'ko') {
    if (trimmed === '東') return '동';
    if (trimmed === '西') return '서';
    if (trimmed === '東R') return '동R';
    if (trimmed === '西R') return '서R';
    if (trimmed.includes('大樂') || trimmed.includes('다러')) return '다러';
    if (trimmed.includes('專區') || trimmed.includes('특구')) return '특구';
    return trimmed;
  }

  // zh-TW
  return trimmed;
}
