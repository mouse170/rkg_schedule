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
  subTitle: '全員出席 ‧ 專區貼身應援盛典',
  description: 'Rakuten Girls 年度重磅主題日！全員女孩盛裝出席，各大專屬看台特區全程貼身應援，帶來最具熱力的球場應援體驗！',
  ruleTitle: '辣酷甜主題日專區應援規則',
  ruleContent: '本週為特別主題日，專區女孩於第 1、2、3、7、8 局全程在指定個人專屬看台區域貼身應援；第 5 局下全體女孩於內野主舞台合體帶來「辣酷甜」震撼開場與中場表演！',
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

/**
 * 根據試算表資料與專區配置，豐富化（Enrich）女孩的當日排班
 */
export function enrichDutyWithZone(duty: DailyDuty, date: string, girlName: string): DailyDuty {
  if (!isSpicyCoolSweetDate(date)) return duty;

  const assign = getZoneAssignment(date, girlName);
  if (assign) {
    // 該女孩為當日專區應援女孩：12378 局在個人專區，第 5 局下為中場主舞台
    const newInnings: InningAssignment[] = [
      { period: '1-3局', location: `${assign.zoneCode}專區` },
      { period: '第5局下', location: '辣酷甜全員主舞台' },
      { period: '7-8局', location: `${assign.zoneCode}專區` }
    ];
    return {
      ...duty,
      innings: newInnings
    };
  }

  // 該女孩當日未被安排在專區，但全員出席：中場舞參加合體表演
  const hasInnings = duty.innings && duty.innings.length > 0;
  if (!hasInnings) {
    return {
      ...duty,
      innings: [
        { period: '第5局下', location: '辣酷甜全員主舞台' }
      ]
    };
  }

  return duty;
}
