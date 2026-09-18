import { DailyDuty, InningAssignment } from '../types/schedule';

export interface ZoneAssignment {
  zoneCode: string; // e.g. "東下I", "西上D"
  deck: '東下' | '西下' | '東上' | '西上';
  section: string; // e.g. "I區", "B區"
  name: string; // e.g. "東下I_廉世彬區"
  ticketType: string; // e.g. "熱區 (全票500/半票400)", "視野區 (全票450/半票350)"
  girlName: string;
}

export interface ThemeDayConfig {
  themeName: string;
  subTitle: string;
  description: string;
  ruleTitle: string;
  ruleContent: string;
  scheduleDates: string[]; // ["9/19", "9/20"]
  zoneAssignments: Record<string, ZoneAssignment[]>; // date -> assignments
}

export const SPICY_COOL_SWEET_THEME: ThemeDayConfig = {
  themeName: '辣酷甜主題日',
  subTitle: '看台專區與各區寵粉應援盛典',
  description: 'Rakuten Girls 年度重磅主題日！各大專屬看台特區全程寵粉應援，帶來最具熱力的球場應援體驗！',
  ruleTitle: '辣酷甜主題日專區應援規則',
  ruleContent: '本週為特別主題日，專區女孩於第 1、2、3、7、8 局全程在指定個人專屬看台區域寵粉應援；一般看台女孩依東、西、大樂區輪替安排（本次主題日無東R、西R站位，亦無中場表演）。',
  scheduleDates: ['9/19', '9/20'],
  zoneAssignments: {
    '9/19': [
      // 東下一壘熱區 (內野下層)
      { zoneCode: '東下I', deck: '東下', section: 'I區', name: '東下I_廉世彬區', ticketType: '熱區 (全票500/半票400)', girlName: '廉世彬' },
      { zoneCode: '東下J', deck: '東下', section: 'J區', name: '東下J_高佳彬區', ticketType: '熱區 (全票500/半票400)', girlName: '高佳彬' },
      { zoneCode: '東下K', deck: '東下', section: 'K區', name: '東下K_金佳垠區', ticketType: '熱區 (全票500/半票400)', girlName: '金佳垠' },
      { zoneCode: '東下L', deck: '東下', section: 'L區', name: '東下L_禹菡區', ticketType: '熱區 (全票500/半票400)', girlName: '禹菡' },
      { zoneCode: '東下M', deck: '東下', section: 'M區', name: '東下M_穎樂區', ticketType: '熱區 (全票500/半票400)', girlName: '穎樂' },
      // 西下三壘熱區 (內野下層)
      { zoneCode: '西下I', deck: '西下', section: 'I區', name: '西下I_岱縈區', ticketType: '熱區 (全票500/半票400)', girlName: '岱縈' },
      { zoneCode: '西下J', deck: '西下', section: 'J區', name: '西下J_高橋佳帆區', ticketType: '熱區 (全票500/半票400)', girlName: '高橋佳帆' },
      { zoneCode: '西下K', deck: '西下', section: 'K區', name: '西下K_彭彭區', ticketType: '熱區 (全票500/半票400)', girlName: '彭彭' },
      // 東上二樓視野區 (內野上層)
      { zoneCode: '東上B', deck: '東上', section: 'B區', name: '東上B_沈珈妤區', ticketType: '視野區 (全票450/半票350)', girlName: '沈珈妤' },
      { zoneCode: '東上C', deck: '東上', section: 'C區', name: '東上C_孟潔區', ticketType: '視野區 (全票450/半票350)', girlName: '孟潔' },
      { zoneCode: '東上D', deck: '東上', section: 'D區', name: '東上D_宋宋區', ticketType: '視野區 (全票450/半票350)', girlName: '宋宋' },
      // 西上二樓視野區 (內野上層)
      { zoneCode: '西上B', deck: '西上', section: 'B區', name: '西上B_曲曲區', ticketType: '視野區 (全票450/半票350)', girlName: '曲曲' },
      { zoneCode: '西上C', deck: '西上', section: 'C區', name: '西上C_熊霓區', ticketType: '視野區 (全票450/半票350)', girlName: '熊霓' },
      { zoneCode: '西上D', deck: '西上', section: 'D區', name: '西上D_崔荷潾區', ticketType: '視野區 (全票450/半票350)', girlName: '崔荷潾' }
    ],
    '9/20': [
      // 東下一壘熱區 (內野下層)
      { zoneCode: '東下I', deck: '東下', section: 'I區', name: '東下I_河智媛區', ticketType: '熱區 (全票500/半票400)', girlName: '河智媛' },
      { zoneCode: '東下J', deck: '東下', section: 'J區', name: '東下J_筠熹區', ticketType: '熱區 (全票500/半票400)', girlName: '筠熹' },
      { zoneCode: '東下K', deck: '東下', section: 'K區', name: '東下K_禹洙漢區', ticketType: '熱區 (全票500/半票400)', girlName: '禹洙漢' },
      { zoneCode: '東下L', deck: '東下', section: 'L區', name: '東下L_貝佳頤區', ticketType: '熱區 (全票500/半票400)', girlName: '貝佳頤' },
      { zoneCode: '東下M', deck: '東下', section: 'M區', name: '東下M_卉妮區', ticketType: '熱區 (全票500/半票400)', girlName: '卉妮' },
      // 西下三壘熱區 (內野下層)
      { zoneCode: '西下I', deck: '西下', section: 'I區', name: '西下I_若潼區', ticketType: '熱區 (全票500/半票400)', girlName: '若潼' },
      { zoneCode: '西下J', deck: '西下', section: 'J區', name: '西下J_Mika區', ticketType: '熱區 (全票500/半票400)', girlName: 'Mika' },
      { zoneCode: '西下K', deck: '西下', section: 'K區', name: '西下K_笑笑區', ticketType: '熱區 (全票500/半票400)', girlName: '笑笑' },
      // 東上二樓視野區 (內野上層)
      { zoneCode: '東上B', deck: '東上', section: 'B區', name: '東上B_溫妮區', ticketType: '視野區 (全票450/半票350)', girlName: '溫妮' },
      { zoneCode: '東上C', deck: '東上', section: 'C區', name: '東上C_言梓璇區', ticketType: '視野區 (全票450/半票350)', girlName: '言梓璇' },
      { zoneCode: '東上D', deck: '東上', section: 'D區', name: '東上D_Kira區', ticketType: '視野區 (全票450/半票350)', girlName: 'Kira' },
      // 西上二樓視野區 (內野上層)
      { zoneCode: '西上B', deck: '西上', section: 'B區', name: '西上B_琳妲區', ticketType: '視野區 (全票450/半票350)', girlName: '琳妲' },
      { zoneCode: '西上C', deck: '西上', section: 'C區', name: '西上C_穆又甯區', ticketType: '視野區 (全票450/半票350)', girlName: '穆又甯' }
    ]
  }
};

export interface BoothScheduleItem {
  timeSlot: string; // e.g. "15:10-15:30"
  boothName: string; // e.g. "財團法人保險安定基金"
  girls: string[]; // e.g. ["言梓璇", "貝佳頤"]
}

export interface DayPreMatchSchedule {
  date: string;
  weekday: string;
  ticketTime: string;
  admissionTime: string;
  gameStartTime: string;
  autographGirls: string[];
  boothEvents: BoothScheduleItem[];
}

export interface AutographSessionRules {
  title: string;
  dates: string[];
  location: string;
  checkInTime: string;
  capacity: number;
  startTime: string;
  notes: string[];
}

export interface PreMatchActivityConfig {
  autographRules: AutographSessionRules;
  days: Record<string, DayPreMatchSchedule>;
  boothMapLegend: {
    side: '三壘側 (GATE W 側)' | '一壘側 (GATE E 側)';
    booths: { number: number; name: string }[];
  }[];
}

export const SPICY_COOL_SWEET_PRE_MATCH: PreMatchActivityConfig = {
  autographRules: {
    title: '女孩簽名會',
    dates: ['9/19 (六)', '9/20 (日)'],
    location: '三壘側 GATE W 女孩簽名會專用排隊區 (包含金猿亦請在此排隊入場)',
    checkInTime: '14:40',
    capacity: 100,
    startTime: '15:10',
    notes: [
      '14:40 開始檢查單曲簽名本並發放號碼牌',
      '單曲簽名本及本人均需在場，一人限一本',
      '名額限制：每日 100 名',
      '領完號碼牌並驗票後，請直接至三壘側簽名區帳篷依序等候',
      '15:10 正式開始簽名',
      '本活動嚴格限簽單曲簽名本'
    ]
  },
  days: {
    '9/19': {
      date: '9/19',
      weekday: '六',
      ticketTime: '15:00',
      admissionTime: '15:00',
      gameStartTime: '17:05',
      autographGirls: [
        '廉世彬', '高佳彬', '金佳垠', '禹菡', '穎樂', '岱縈', '高橋佳帆',
        '彭彭', '沈珈妤', '孟潔', '宋宋', '曲曲', '熊霓', '崔荷潾'
      ],
      boothEvents: [
        {
          timeSlot: '15:10-15:30',
          boothName: '財團法人保險安定基金',
          girls: ['言梓璇', '貝佳頤']
        },
        {
          timeSlot: '15:30-15:50',
          boothName: 'Flexii (飛來速)',
          girls: ['筠熹', 'Mika']
        },
        {
          timeSlot: '15:50-16:10',
          boothName: '昇恆昌',
          girls: ['笑笑', '琳妲']
        },
        {
          timeSlot: '16:10-16:30',
          boothName: '浪LIVE',
          girls: ['金佳垠', '高佳彬']
        }
      ]
    },
    '9/20': {
      date: '9/20',
      weekday: '日',
      ticketTime: '15:00',
      admissionTime: '15:00',
      gameStartTime: '17:05',
      autographGirls: [
        '河智媛', '筠熹', '禹洙漢', '貝佳頤', '卉妮', '若潼', 'Mika',
        '笑笑', '溫妮', '言梓璇', 'Kira', '琳妲', '穆又甯'
      ],
      boothEvents: [
        {
          timeSlot: '15:10-15:30',
          boothName: '光泉',
          girls: ['岱縈', '禹菡']
        },
        {
          timeSlot: '15:30-15:50',
          boothName: 'Flexii (飛來速)',
          girls: ['穎樂', '宋宋']
        },
        {
          timeSlot: '15:50-16:10',
          boothName: '昇恆昌',
          girls: ['廉世彬', '高橋佳帆']
        }
      ]
    }
  },
  boothMapLegend: [
    {
      side: '三壘側 (GATE W 側)',
      booths: [
        { number: 1, name: '三得利 健益多' },
        { number: 2, name: '美商大都會人壽' },
        { number: 3, name: 'Flexii (飛來速)' },
        { number: 4, name: '保險安定基金' },
        { number: 5, name: '光泉' },
        { number: 6, name: '浪LIVE' },
        { number: 7, name: '昇恆昌' }
      ]
    },
    {
      side: '一壘側 (GATE E 側)',
      booths: [
        { number: 8, name: '樂天桃園棒球場服務台' },
        { number: 9, name: '樂天市場' },
        { number: 10, name: '樂天信用卡' },
        { number: 11, name: '樂天國際商業銀行' }
      ]
    }
  ]
};

/**
 * 判斷指定日期是否為辣酷甜主題日
 */
export function isSpicyCoolSweetDate(date: string): boolean {
  if (!date) return false;
  const clean = date.replace(/（.*?）|\(.*?\)/g, '').trim();
  return SPICY_COOL_SWEET_THEME.scheduleDates.includes(clean);
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

// 賽後表演名單（僅限出席主題日之 27 位女孩，其餘非 27 人員排除）
export const SPICY_COOL_SWEET_POST_MATCH: Record<string, { east: string[]; west: string[] }> = {
  '9/19': {
    east: ['曲曲', '溫妮', '禹菡', '穆又甯', '琳妲'],
    west: ['熊霓', '笑笑', '彭彭', '高橋佳帆']
  },
  '9/20': {
    east: ['Kira', '言梓璇', '廉世彬', '高佳彬', '金佳垠'],
    west: ['沈珈妤', 'Mika', '河智媛', '禹洙漢']
  }
};

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
