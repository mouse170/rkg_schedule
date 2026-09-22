import { DailyDuty, InningAssignment } from '../types/schedule';
import {
  ZoneAssignment,
  ThemeDayConfig,
  BoothScheduleItem,
  DayPreMatchSchedule,
  AutographSessionRules,
  PreMatchActivityConfig,
  SPICY_COOL_SWEET_THEME_TEMPLATE,
  SPICY_COOL_SWEET_PRE_MATCH_TEMPLATE,
  SPICY_COOL_SWEET_POST_MATCH_TEMPLATE
} from '../templates/themeDays/spicyCoolSweetTheme';

export type {
  ZoneAssignment,
  ThemeDayConfig,
  BoothScheduleItem,
  DayPreMatchSchedule,
  AutographSessionRules,
  PreMatchActivityConfig
};

export const SPICY_COOL_SWEET_THEME: ThemeDayConfig = SPICY_COOL_SWEET_THEME_TEMPLATE;
export const SPICY_COOL_SWEET_PRE_MATCH_ACTIVITIES: PreMatchActivityConfig = SPICY_COOL_SWEET_PRE_MATCH_TEMPLATE;
export const SPICY_COOL_SWEET_PRE_MATCH: PreMatchActivityConfig = SPICY_COOL_SWEET_PRE_MATCH_TEMPLATE;
export const SPICY_COOL_SWEET_POST_MATCH = SPICY_COOL_SWEET_POST_MATCH_TEMPLATE;

/**
 * 判斷指定日期是否為辣酷甜主題日（該主題日已結束，常態恆回傳 false）
 */
export function isSpicyCoolSweetDate(_date: string): boolean {
  return false;
}

/**
 * 取得女孩在指定主題日的專區配置
 */
export function getZoneAssignment(date: string, girlName: string): ZoneAssignment | undefined {
  const clean = date.replace(/（.*?）|\(.*?\)/g, '').trim();
  const list = SPICY_COOL_SWEET_THEME.zoneAssignments[clean];
  if (!list) return undefined;

  const target = girlName.trim().toLowerCase();
  return list.find(a => {
    const name = a.girlName.toLowerCase();
    return name === target || (name === '沈珈妤' && target.includes('珈妤')) || (name === '高橋佳帆' && target.includes('佳帆'));
  });
}

/**
 * 取得 27 位女孩在主題日的賽後表演站位（東區／西區）
 */
export function getPostMatchZone(date: string, girlName: string): '東區' | '西區' | undefined {
  const clean = date.replace(/（.*?）|\(.*?\)/g, '').trim();
  const dayData = SPICY_COOL_SWEET_POST_MATCH[clean];
  if (!dayData) return undefined;

  const target = girlName.trim().toLowerCase();
  const normalize = (name: string) => {
    const n = name.trim().toLowerCase();
    if (n === '禹珠漢') return '禹洙漢';
    if (n === '珈妤') return '沈珈妤';
    if (n.includes('佳帆')) return '高橋佳帆';
    return n;
  };

  const normTarget = normalize(target);
  if (dayData.east.some(g => normalize(g) === normTarget)) return '東區';
  if (dayData.west.some(g => normalize(g) === normTarget)) return '西區';
  return undefined;
}

/**
 * 根據試算表資料與專區配置，豐富化（Enrich）女孩的當日排班
 */
export function enrichDutyWithZone(duty: DailyDuty, date: string, girlName: string): DailyDuty {
  if (!isSpicyCoolSweetDate(date)) return duty;

  const assign = getZoneAssignment(date, girlName);
  const postMatchZone = getPostMatchZone(date, girlName);

  // 1. 1-3 局站位
  const existing13 = duty.innings?.find(i => i.period.includes('1-3'));
  // 2. 7-8 局站位
  const existing78 = duty.innings?.find(i => i.period.includes('7-8'));

  if (assign) {
    // 專區應援女孩：1-3 局與 7-8 局固定在個人看台專區，賽後表演依名單排定
    const zoneLocation = `${assign.zoneCode}專區`;
    const newInnings: InningAssignment[] = [
      { period: '1-3局', location: zoneLocation },
      { period: '7-8局', location: zoneLocation }
    ];

    if (postMatchZone) {
      newInnings.push({ period: '賽後表演', location: postMatchZone });
    }

    return {
      ...duty,
      primaryArea: '專區',
      innings: newInnings
    };
  }

  // 一般看台應援女孩：站位以試算表填入值為主；若尚未公布，標記為待公布（本次主題日無東R、西R，亦無中場表演）
  const loc13 = existing13 && existing13.location.trim().length > 0 && !existing13.location.includes('專區')
    ? existing13.location.trim()
    : '待公布';

  const loc78 = existing78 && existing78.location.trim().length > 0 && !existing78.location.includes('專區')
    ? existing78.location.trim()
    : '待公布';

  const newInnings: InningAssignment[] = [
    { period: '1-3局', location: loc13 },
    { period: '7-8局', location: loc78 }
  ];

  if (postMatchZone) {
    newInnings.push({ period: '賽後表演', location: postMatchZone });
  }

  let primaryArea = duty.primaryArea;
  if (loc13.includes('待公布') && loc78.includes('待公布')) {
    primaryArea = '其他';
  }

  return {
    ...duty,
    primaryArea,
    innings: newInnings
  };
}
