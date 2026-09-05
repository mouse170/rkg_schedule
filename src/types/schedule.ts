export interface GirlProfile {
  id: string;
  number: string;
  name: string;
  koreanName?: string;
  photo: string;
  localPhoto: string;
  instagram: string | null;
  instagramHandle: string | null;
  role?: string;
}

export interface InningAssignment {
  period: string; // e.g. "1-3局", "中場", "7-8局"
  location: string; // e.g. "東", "西", "大樂", "東R", "西R", "專區" 等
}

export type CheeringZone = '東區' | '西區' | '全區' | '東R' | '西R' | '大樂' | '專區' | '其他';

export interface DailyDuty {
  date: string; // e.g. "9/2", "9/3"
  girlName: string;
  number: string;
  innings: InningAssignment[];
  primaryArea: CheeringZone;
}

export interface ScheduleDataset {
  dates: string[];
  girlsScheduleMap: Record<string, DailyDuty[]>; // girlName -> duty entries
  dailyRosterMap: Record<string, DailyDuty[]>; // date -> girls on duty
  lastUpdated: string;
  isLive: boolean;
}
