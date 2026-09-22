
/**
 * 專區看台席位配置介面
 */
export interface ZoneAssignment {
  zoneCode: string; // 例如："東下I", "西上D"
  deck: '東下' | '西下' | '東上' | '西上';
  section: string; // 例如："I區", "B區"
  name: string; // 例如："東下I_廉世彬區"
  ticketType: string; // 例如："熱區 (全票500/半票400)", "視野區 (全票450/半票350)"
  girlName: string;
}

/**
 * 主題日設定架構樣板介面
 */
export interface ThemeDayConfig {
  themeId: string;
  themeName: string;
  subTitle: string;
  description: string;
  ruleTitle: string;
  ruleContent: string;
  scheduleDates: string[]; // 例如：["9/19", "9/20"]
  zoneAssignments: Record<string, ZoneAssignment[]>; // date -> assignments
}

export interface BoothScheduleItem {
  timeSlot: string; // 例如："15:10-15:30"
  boothName: string; // 例如："財團法人保險安定基金"
  girls: string[]; // 例如：["言梓璇", "貝佳頤"]
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
    side: string;
    booths: { number: number; name: string }[];
  }[];
}

/**
 * 辣酷甜主題日完整資料樣板（Spicy Cool Sweet Theme Template）
 * 開發環境封存樣板，以利後續各大主題日調用與參考
 */
export const SPICY_COOL_SWEET_THEME_TEMPLATE: ThemeDayConfig = {
  themeId: 'spicy_cool_sweet_2026',
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

/**
 * 賽前活動與攤位導覽樣板配置
 */
export const SPICY_COOL_SWEET_PRE_MATCH_TEMPLATE: PreMatchActivityConfig = {
  autographRules: {
    title: '女孩簽名會規範',
    dates: ['9/19', '9/20'],
    location: '三壘側 GATE W 女孩簽名會專用排隊區（金猿亦請在此排隊）',
    checkInTime: '14:40',
    capacity: 100,
    startTime: '15:10',
    notes: [
      '14:40 開始檢查單曲簽名本並發放號碼牌（單曲簽名本及本人均需在場，一人一本）',
      '人數上限：每日 100 名（領完號碼牌驗票後，請至三壘側簽名區帳篷依序等候）',
      '15:10 正式開始簽名',
      '限簽單曲簽名本'
    ]
  },
  days: {
    '9/19': {
      date: '9/19',
      weekday: '六',
      ticketTime: '14:30',
      admissionTime: '15:00',
      gameStartTime: '17:05',
      autographGirls: [
        '廉世彬', '高佳彬', '金佳垠', '禹菡', '穎樂', '岱縈', '高橋佳帆',
        '彭彭', '沈珈妤', '孟潔', '宋宋', '曲曲', '熊霓', '崔荷潾'
      ],
      boothEvents: [
        { timeSlot: '15:10-15:30', boothName: '財團法人保險安定基金', girls: ['言梓璇', '貝佳頤'] },
        { timeSlot: '15:20-15:40', boothName: '泰山仙草蜜', girls: ['河智媛', '禹洙漢'] },
        { timeSlot: '15:30-15:50', boothName: '一家人', girls: ['Mika', '笑笑'] },
        { timeSlot: '15:40-16:00', boothName: '台酒生技', girls: ['溫妮', '若潼'] },
        { timeSlot: '15:50-16:10', boothName: '愛戀花草', girls: ['琳妲', '穆又甯'] }
      ]
    },
    '9/20': {
      date: '9/20',
      weekday: '日',
      ticketTime: '14:30',
      admissionTime: '15:00',
      gameStartTime: '17:05',
      autographGirls: [
        '河智媛', '筠熹', '禹洙漢', '貝佳頤', '卉妮', '若潼', 'Mika',
        '笑笑', '溫妮', '言梓璇', 'Kira', '琳妲', '穆又甯'
      ],
      boothEvents: [
        { timeSlot: '15:10-15:30', boothName: '財團法人保險安定基金', girls: ['沈珈妤', '崔荷潾'] },
        { timeSlot: '15:20-15:40', boothName: '泰山仙草蜜', girls: ['廉世彬', '高佳彬', '金佳垠'] },
        { timeSlot: '15:30-15:50', boothName: '一家人', girls: ['高橋佳帆', '彭彭'] },
        { timeSlot: '15:40-16:00', boothName: '台酒生技', girls: ['岱縈', '穎樂'] },
        { timeSlot: '15:50-16:10', boothName: '愛戀花草', girls: ['曲曲', '熊霓'] }
      ]
    }
  },
  boothMapLegend: [
    {
      side: '三壘側 (GATE W 側)',
      booths: [
        { number: 1, name: '泰山仙草蜜' },
        { number: 2, name: '一家人' },
        { number: 3, name: '台酒生技' },
        { number: 4, name: '財團法人保險安定基金' },
        { number: 5, name: '愛戀花草' },
        { number: 6, name: '簽名會現場帳篷' },
        { number: 7, name: '球團官方應援商品部' }
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
 * 賽後表演名單樣板
 */
export const SPICY_COOL_SWEET_POST_MATCH_TEMPLATE: Record<string, { east: string[]; west: string[] }> = {
  '9/19': {
    east: ['曲曲', '溫妮', '禹菡', '穆又甯', '琳妲'],
    west: ['熊霓', '笑笑', '彭彭', '高橋佳帆']
  },
  '9/20': {
    east: ['Kira', '言梓璇', '廉世彬', '高佳彬', '金佳垠'],
    west: ['沈珈妤', 'Mika', '河智媛', '禹洙漢']
  }
};
