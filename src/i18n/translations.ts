export type Language = 'zh-TW' | 'ja' | 'ko';

export interface Translations {
  // Navigation & Header
  appTitle: string;
  appSubtitle: string;
  tabInstagram: string;
  tabSchedule: string;
  stadiumGuideBtn: string;
  refreshBtn: string;
  themeToggle: string;

  // Banner
  bannerTitle: string;
  bannerBadge: string;
  bannerDesc: string;

  // DataSource Banner
  dataConnected: string;
  dataConnecting: string;
  googleSheetLink: string;
  officialRosterLink: string;
  officialIgLink: string;

  // Instagram Directory
  igBannerTitle: string;
  igBannerBadge: string;
  igBannerDesc: string;
  followTeamIg: string;
  searchPlaceholder: string;
  filterAll: string;
  filterTaiwan: string;
  filterForeign: string;
  filterKorean: string;
  filterLocal: string;
  filterFavorites: string;
  openIg: string;
  copyAccount: string;
  copied: string;
  koreanCheerleader: string;
  badgeKorean: string;
  badgeJapanese: string;
  badgeTaiwan: string;
  copyKoreanName: string;
  copiedKoreanName: string;
  copyJapaneseName: string;
  copiedJapaneseName: string;

  // FilterBar & Areas
  areaAll: string;
  areaEast: string;
  areaWest: string;
  areaSpecial: string;
  areaOnDuty: string;
  filterPeriod13: string;
  filterPeriod78: string;
  filterPeriodMid: string;
  filterPeriodPost: string;
  groupTitleEast: string;
  groupTitleWest: string;
  groupTitleSpecial: string;
  groupTitleMid: string;
  groupTitleMidEast: string;
  groupTitleMidWest: string;
  groupTitleMidStage: string;
  groupTitlePostEast: string;
  groupTitlePostWest: string;
  groupTitlePost: string;
  groupTitleOffDuty: string;
  groupTitleOnDutySection: string;
  groupTitleFavOnDuty: string;
  groupTitleFavOffDuty: string;
  noMidPerformance: string;
  searchSchedulePlaceholder: string;
  filterCountSummary: string;
  noMatchTitle: string;
  noMatchDesc: string;
  resetFilters: string;

  // Seat Perspective Mode
  filterModeInning: string;
  filterModeSeat: string;
  seatViewMode: string;
  seatEastZone: string;
  seatWestZone: string;
  seatEastRZone: string;
  seatWestRZone: string;
  seatDaLeZone: string;
  seatEastZoneShort: string;
  seatWestZoneShort: string;
  seatSpecialZone: string;
  seatSpecialZoneShort: string;
  seatDaLeZoneShort: string;
  seatEastRZoneShort: string;
  seatWestRZoneShort: string;
  seatViewBannerDesc: string;
  groupTitleSeat13: string;
  groupTitleSeatMid: string;
  groupTitleSeat78: string;
  groupTitleSeatAllMatch: string;

  // Inning & Duties
  period13: string;
  periodMid: string;
  period78: string;
  zoneEast: string;
  zoneWest: string;
  zoneSpecial: string;
  zoneEastR: string;
  zoneWestR: string;
  zoneDaLe: string;
  primaryArea: string;
  dutyCount: string;
  gameEvent: string;
  onDuty: string;
  offDuty: string;
  onDutyToday: string;
  locationTBD: string;
  viewSchedule: string;
  todayScheduleBannerTitle: string;
  todayScheduleBannerBadge: string;
  todayScheduleBannerDesc: string;
  todayScheduleAlertTitle: string;

  // Stadium Guide Modal
  guideModalTitle: string;
  guideModalSubtitle: string;
  outfieldDirection: string;
  westCheerZone: string;
  westCheerDesc: string;
  westCheerSeats: string;
  eastCheerZone: string;
  eastCheerDesc: string;
  eastCheerSeats: string;
  infield: string;
  homePlate: string;
  rotationRuleTitle: string;
  rotationRuleContent: string;
  rStageRuleTitle: string;
  rStageRuleContent: string;
  daLeRuleTitle: string;
  daLeRuleContent: string;
  closeGuide: string;

  // Girl Detail Drawer
  profileArchive: string;
  teamAffiliation: string;
  dutyHistory: string;
  noDutyNotice: string;
  fanKnowledgeTitle: string;
  fanKnowledgeEast: string;
  fanKnowledgeWest: string;
  fanKnowledgeMid: string;
  shareSchedule: string;
  copiedSchedule: string;
  shareTextTitle: string;
  shareTextGirl: string;
  shareTextSchedule: string;
  shareTextNoDuty: string;
  shareTextLearnMore: string;

  // Paired Stage Animation
  pairedStageBadge: string;
  pairedPartnerHint: string;

  // Matrix View
  matrixViewTitle: string;
  matrixAllSeason: string;
  matrixAllSeasonTitle: string;
  matrixAllSeasonDesc: string;
  matrixCornerHeader: string;
  matrixFavTop: string;
  matrixSubTitle: string;
  matrixThemeBadge: string;
  matrixUnassignedNotice: string;
  matrixAllAssignedNotice: string;
  matrixScrollTip: string;
  deckEastLower: string;
  deckWestLower: string;
  deckEastUpper: string;
  deckWestUpper: string;

  // Share Schedule Modal
  shareModalTitle: string;
  shareModalSubtitle: string;
  shareCardTheme: string;
  shareThemeLight: string;
  shareThemeDark: string;
  shareCopyLink: string;
  shareCopiedLink: string;
  shareDownloadCard: string;
  shareGenerating: string;
  shareAllSeasonTitle: string;
  shareThemeDayHighlight: string;
  shareAllSeasonHighlight: string;
  shareStadiumName: string;
  shareZoneSubtitle: string;
  shareMyFavoritesCount: string;
  shareLiveSeatComparison: string;
  shareAllDayZone: string;
  sharePostMatch: string;
  sharePeriod13: string;
  sharePeriod78: string;
  sharePeriodMid: string;
  shareFooterTitle: string;
  shareFooterSubtitle: string;
  shareLimitWarning: string;
  shareLimitBtnDisabled: string;
  shareModeSingle: string;
  shareModeAll: string;
  shareToastCopied: string;
  shareToastDownloadSuccess: string;
  shareToastGenerating: string;
  shareToastFailed: string;
  shareAdjustFavTitle: string;
  shareAdjustFavTip: string;
  shareAdjustCurrentCount: string;
  shareAdjustSuccess: string;
  shareDateScope: string;
  shareExportCurrentPeriod: string;
  shareExportSpecificDate: string;
  shareNoFavoritesTitle: string;
  shareNoFavoritesDesc: string;
  shareGoToIgDirectory: string;
  shareNoFavoritesBtn: string;
  shareToX: string;
  shareToThreads: string;
  shareTweetHeadline: string;
  shareTweetHashtags: string;

  // Theme Day & Pre-Match Activities
  themeDayPreMatchBtn: string;
  themeDayStadiumBtn: string;
  preMatchModalTitle: string;
  preMatchModalSubtitle: string;
  tabPreMatchSchedule: string;
  tabBoothMap: string;
  ticketAdmissionTime: string;
  gameStartTimeLabel: string;
  autographTitle: string;
  autographQueueLocation: string;
  autographCheckinNotice: string;
  autographCapacityNotice: string;
  autographStartNotice: string;
  autographSingleBookOnly: string;
  autographLineupTitle: string;
  autographQuotaBadge: string;
  autographMatrixTip: string;
  autographStepCheckin: string;
  autographStepAdmission: string;
  autographStepStart: string;
  boothScheduleTitle: string;
  boothInteractiveTip: string;
  boothMapLegendWest: string;
  boothMapLegendEast: string;
  closePreMatchModal: string;
  boothZoomTip: string;
  boothZoomReset: string;

  // Language Switcher & Footer
  switchLanguage: string;
  vibeCodingNotice: string;
  disclaimerCopyright: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  'zh-TW': {
    appTitle: '樂天女孩班表',
    appSubtitle: 'Rakuten Girls Live Schedule • 成員 IG 目錄與即時應援席位',
    tabInstagram: '成員 IG 目錄',
    tabSchedule: '應援班表',
    stadiumGuideBtn: '席位說明',
    refreshBtn: '重新整理',
    themeToggle: '切換主題風格',

    bannerTitle: 'Rakuten Girls 樂天女孩 2026 班表',
    bannerBadge: '2026 全猿主場 • 應援指南',
    bannerDesc: '掌握女孩每場賽事的 1-3 局、中場表演與 7-8 局應援站位（一壘東區／三壘西區／假日大樂／R 舞台專區）。點擊卡片可查看個別出勤與 Instagram！',

    dataConnected: '即時連線公開 Google 試算表，掌握女孩最新班表資訊',
    dataConnecting: '班表即時同步中...',
    googleSheetLink: 'Google 試算表班表',
    officialRosterLink: 'Rakuten Girls 官方名冊',
    officialIgLink: 'Rakuten Girls 官方IG',

    igBannerTitle: 'Rakuten Girls 官方 Instagram 目錄',
    igBannerBadge: '官方社群名錄 • 隨時追蹤女孩動態',
    igBannerDesc: '收錄樂天女孩的Instagram 帳號，點擊可直接前往個人頁面或一鍵複製帳號標記限時動態。',
    followTeamIg: '追蹤球團官方 IG',
    searchPlaceholder: '搜尋姓名、背號或 IG 帳號...',
    filterAll: '全部',
    filterTaiwan: '台籍',
    filterForeign: '外援',
    filterKorean: '外援',
    filterLocal: '台籍',
    filterFavorites: '最愛',
    openIg: '開啟 IG',
    copyAccount: '帳號',
    copied: '已複製',
    koreanCheerleader: '韓援',
    badgeKorean: '韓援',
    badgeJapanese: '日籍',
    badgeTaiwan: '台籍',
    copyKoreanName: '韓文名',
    copiedKoreanName: '已複製',
    copyJapaneseName: '日文名',
    copiedJapaneseName: '已複製',

    areaAll: '全部女孩',
    areaEast: '一壘東區',
    areaWest: '三壘西區',
    areaSpecial: '假日／專區',
    areaOnDuty: '今日有班',
    filterPeriod13: '1-3 局站位',
    filterPeriod78: '7-8 局站位',
    filterPeriodMid: '中場表演',
    filterPeriodPost: '賽後表演',
    groupTitleEast: '一壘東區站位',
    groupTitleWest: '三壘西區站位',
    groupTitleSpecial: '假日與專區站位 (大樂／R舞台)',
    groupTitleMid: '中場表演女孩',
    groupTitleMidEast: '中場表演 (東區前)',
    groupTitleMidWest: '中場表演 (西區前)',
    groupTitleMidStage: '中場舞應援舞台表演',
    groupTitlePostEast: '賽後表演 (一壘東區)',
    groupTitlePostWest: '賽後表演 (三壘西區)',
    groupTitlePost: '賽後表演女孩',
    groupTitleOffDuty: '未排班／休假女孩',
    groupTitleOnDutySection: '當日應援女孩',
    groupTitleFavOnDuty: '本期有排班最愛女孩',
    groupTitleFavOffDuty: '本期未排班最愛女孩',
    noMidPerformance: '當日無中場表演，實際以官方公告為主。',
    searchSchedulePlaceholder: '搜尋女孩姓名或背號...',
    filterCountSummary: '顯示結果：{count} 位女孩',
    noMatchTitle: '找不到符合條件的女孩',
    noMatchDesc: '請嘗試切換其他日期、清除搜尋文字或重設篩選標籤',
    resetFilters: '重設所有條件',

    filterModeInning: '依比賽局數看',
    filterModeSeat: '依座位視角看',
    seatViewMode: '我的座位視角',
    seatEastZone: '一壘東區 (內野東下 D~F)',
    seatWestZone: '三壘西區 (內野西下 D~F)',
    seatEastRZone: '走道 東R 舞台',
    seatWestRZone: '走道 西R 舞台',
    seatDaLeZone: '大樂放鬆區 / 專區',
    seatEastZoneShort: '一壘東區',
    seatWestZoneShort: '三壘西區',
    seatSpecialZone: '看台專區 (主題日個人專區寵粉應援)',
    seatSpecialZoneShort: '專區應援',
    seatDaLeZoneShort: '大樂專區',
    seatEastRZoneShort: '東R 舞台',
    seatWestRZoneShort: '西R 舞台',
    seatViewBannerDesc: '已鎖定您入座的球場席位！以下為當日輪替出現在您視野前方的女孩與各局數時段：',
    groupTitleSeat13: '1-3 局來到你這區',
    groupTitleSeatMid: '第 5 局下中場舞表演',
    groupTitleSeat78: '7-8 局換側來到你面前',
    groupTitleSeatAllMatch: '全場鎖定此區應援',

    period13: '1-3',
    periodMid: '中場',
    period78: '7-8',
    zoneEast: '東',
    zoneWest: '西',
    zoneSpecial: '專區',
    zoneEastR: '東R',
    zoneWestR: '西R',
    zoneDaLe: '大樂',
    primaryArea: '主要站位',
    dutyCount: '本期出勤 {count} 場',
    gameEvent: '主場賽事',
    onDuty: '上班',
    offDuty: '休假',
    onDutyToday: '今日上班',
    locationTBD: '待公布',
    viewSchedule: '查看完整班表 →',
    todayScheduleBannerTitle: '今日全猿主場 • 樂天女孩即時應援班表',
    todayScheduleBannerBadge: '今日有比賽 • 即時應援進行中',
    todayScheduleBannerDesc: '今天為樂天桃猿主場賽事！掌握女孩 1-3 局、中場表演與 7-8 局的最新站位，進場應援不迷路！',
    todayScheduleAlertTitle: '今日賽事即時應援中',

    guideModalTitle: '樂天桃園棒球場 • 啦啦隊應援席位導覽',
    guideModalSubtitle: 'Taoyuan Baseball Stadium Cheerleading Zones',
    outfieldDirection: '外野方向 (OUTFIELD)',
    westCheerZone: '西區應援席',
    westCheerDesc: '三壘側看台',
    westCheerSeats: '內野西下 D ~ F 區',
    eastCheerZone: '東區應援席',
    eastCheerDesc: '一壘側看台',
    eastCheerSeats: '內野東下 D ~ F 區',
    infield: '內野',
    homePlate: '本壘板 / 尊猿席',
    rotationRuleTitle: '局數輪替原則',
    rotationRuleContent: '女孩通常在 1-3 局站一側，中場（第 5 局下）於應援舞台D、E區中間前表演，7-8 局進行換側應援。',
    rStageRuleTitle: '東R / 西R 舞台',
    rStageRuleContent: '假日或特定主題日在內野走道的 R 舞台，拉近與球迷互動距離。',
    daLeRuleTitle: '大樂區 / 特別專區',
    daLeRuleContent: '假日安排於大樂放鬆席或主題企劃專區進行互動式定點應援。',
    closeGuide: '了解，關閉導覽',

    profileArchive: '個人出勤檔案',
    teamAffiliation: '樂天桃猿棒球隊專屬啦啦隊',
    dutyHistory: '排班紀錄與應援站位',
    noDutyNotice: '目前此月份試算表尚未有站位資訊。',
    fanKnowledgeTitle: '球迷應援小知識',
    fanKnowledgeEast: '內野一壘側應援舞台（東下 D-F 區）。',
    fanKnowledgeWest: '內野三壘側應援舞台（西下 D-F 區）。',
    fanKnowledgeMid: '第 5 局下中場舞表演(以官方公告為主)。',
    shareSchedule: '分享 {name} 的班表資訊',
    copiedSchedule: '已複製班表資訊！',
    shareTextTitle: '【Rakuten Girls 樂天女孩班表】',
    shareTextGirl: '女孩：',
    shareTextSchedule: '【近期排班】',
    shareTextNoDuty: '近期尚無排班紀錄',
    shareTextLearnMore: '掌握更多女孩班表：',

    pairedStageBadge: '✨ {location} 同台配對',
    pairedPartnerHint: '與最愛 {partner} 同時段應援',

    matrixViewTitle: '看台輪替矩陣視圖',
    matrixAllSeason: '全賽季總覽',
    matrixAllSeasonTitle: '全賽季看台輪替矩陣總覽',
    matrixAllSeasonDesc: '依 日期 / 局數 / 區域 / 看台專區 分層速查 • 點擊女孩即刻開啟詳細抽屜',
    matrixCornerHeader: '看台區域 / 局數',
    matrixFavTop: '最愛優先置頂',
    matrixSubTitle: '全猿主場各時段站位二維速查 • 點擊女孩頭像即刻開啟詳細抽屜',
    matrixThemeBadge: '辣酷甜主題日',
    matrixUnassignedNotice: '未安排站位名單（共 {count} 位）：',
    matrixAllAssignedNotice: '當日出勤女孩均已排定站位',
    matrixScrollTip: '左右滑動檢視各局時段 • 點擊女孩頭像即刻開啟詳細抽屜',
    deckEastLower: '一壘東下熱區',
    deckWestLower: '三壘西下熱區',
    deckEastUpper: '一壘東上視野',
    deckWestUpper: '三壘西上視野',
    // Share Schedule Modal
    shareModalTitle: '分享我最愛的女孩班表',
    shareModalSubtitle: '支援 URL 跨裝置同步與 9:16 IG 限動圖卡',
    shareCardTheme: '圖卡風格：',
    shareThemeLight: '亮色甜酷',
    shareThemeDark: '暗色黑曜',
    shareCopyLink: '複製分享連結',
    shareCopiedLink: '已複製連結',
    shareDownloadCard: '下載 9:16 限動圖卡',
    shareGenerating: '生成中...',
    shareAllSeasonTitle: '2026 全猿主場賽季',
    shareThemeDayHighlight: '辣酷甜主題日 ‧ Highlight',
    shareAllSeasonHighlight: '全猿主場 ‧ Highlight',
    shareStadiumName: '樂天桃園棒球場',
    shareZoneSubtitle: '看台專區寵粉應援',
    shareMyFavoritesCount: '我最愛的女孩 ({count} 位)',
    shareLiveSeatComparison: '即時席位對照',
    shareAllDayZone: '全場專區：',
    sharePostMatch: '賽後',
    sharePeriod13: '1-3局：',
    sharePeriod78: '7-8局：',
    sharePeriodMid: '中場：',
    shareFooterTitle: '樂天女孩即時看台班表',
    shareFooterSubtitle: '全猿主場應援席位即時查詢',
    shareLimitWarning: '⚠️ 超過 9:16 限動圖卡上限：目前已選 {count} 位女孩（{mode}最多支援 {max} 位）。為避免圖片超出限制，圖卡下載功能已暫時關閉，請調整最愛名單。',
    shareLimitBtnDisabled: '超過人數上限 (最多 {max} 位)',
    shareModeSingle: '單日',
    shareModeAll: '全賽季跨日',
    shareToastCopied: '我最愛的女孩班表連結已複製到剪貼簿！',
    shareToastDownloadSuccess: '9:16 女孩班表圖卡已下載完成！',
    shareToastGenerating: '正在生成 9:16 高解析圖卡...',
    shareToastFailed: '圖卡生成失敗，請稍後再試',
    shareAdjustFavTitle: '快速調整最愛名單（點擊直接移除）：',
    shareAdjustFavTip: '點擊女孩可直接移出最愛，名單符合上限後即可啟用圖卡下載',
    shareAdjustCurrentCount: '目前已選 {count} 位 / 上限 {max} 位',
    shareAdjustSuccess: '✓ 已符合圖卡人數限制（{count}/{max} 位），現已可生成 9:16 限動圖卡',
    shareDateScope: '匯出範圍：',
    shareExportCurrentPeriod: '當期一次匯出',
    shareExportSpecificDate: '特定日期',
    shareNoFavoritesTitle: '尚未加入最愛女孩',
    shareNoFavoritesDesc: '目前尚未加入任何最愛女孩。請前往「成員 IG 目錄」點擊愛心加入最愛女孩後，再來按分享產生專屬應援圖卡！',
    shareGoToIgDirectory: '前往成員 IG 目錄',
    shareNoFavoritesBtn: '請先加入最愛女孩',
    shareToX: '分享至 X (Twitter)',
    shareToThreads: '分享至 Threads',
    shareTweetHeadline: '⚾ 樂天女孩 Rakuten Girls 2026 即時應援班表！我的專屬追星行程表',
    shareTweetHashtags: '#RakutenGirls #樂天女孩 #全猿主場',

    // Theme Day & Pre-Match Activities
    themeDayPreMatchBtn: '賽前活動資訊',
    themeDayStadiumBtn: '看台配置',
    preMatchModalTitle: '辣酷甜主題日 ‧ 賽前活動與攤位導覽',
    preMatchModalSubtitle: '女孩簽名會規則、兩日攤位出勤行程與外圍位置圖',
    tabPreMatchSchedule: '賽前行程與簽名會',
    tabBoothMap: '攤位分佈與廠商導覽',
    ticketAdmissionTime: '售票／進場時間：',
    gameStartTimeLabel: '開賽時間：',
    autographTitle: '女孩簽名會規範',
    autographQueueLocation: '排隊地點：三壘側 GATE W 女孩簽名會專用排隊區（金猿亦請在此排隊）',
    autographCheckinNotice: '14:40 開始檢查單曲簽名本並發放號碼牌（單曲簽名本及本人均需在場，一人一本）',
    autographCapacityNotice: '人數上限：每日 100 名（領完號碼牌驗票後，請至三壘側簽名區帳篷依序等候）',
    autographStartNotice: '15:10 正式開始簽名',
    autographSingleBookOnly: '限簽單曲簽名本',
    autographLineupTitle: '簽名會出席陣容（共 {count} 位）',
    autographQuotaBadge: '每日限量 100 名額 ‧ 持號碼牌依序簽名',
    autographMatrixTip: '點擊女孩頭像可直接查看個人檔案與出勤班表',
    autographStepCheckin: '14:40 檢查單曲本並發放號碼牌',
    autographStepAdmission: '15:00 驗票進場',
    autographStepStart: '15:10 正式開始簽名（限簽單曲本）',
    boothScheduleTitle: '攤位女孩出席見面行程',
    boothInteractiveTip: '點擊女孩標籤可直接查看女孩個人檔案與出勤班表',
    boothMapLegendWest: '三壘側（GATE W 側）攤位',
    boothMapLegendEast: '一壘側（GATE E 側）攤位',
    closePreMatchModal: '關閉賽前活動說明',
    boothZoomTip: '支援雙指捏合縮放／單指拖曳平移，雙擊快速放大',
    boothZoomReset: '重設大小',

    switchLanguage: '語言切換',
    vibeCodingNotice: '本站為球迷透過 Vibe Coding 開發之非官方應援專案，多語系採用 AI 輔助翻譯，如有翻譯或資訊未盡完善之處敬請見諒。',
    disclaimerCopyright: '本專案由粉絲應援所建立，所有肖像與商標權屬樂天桃猿棒球隊與 Rakuten 所有。班表資料即時連線公開 Google Sheet。'
  },
  'ja': {
    appTitle: '楽天ガールズ応援スケジュール',
    appSubtitle: 'Rakuten Girls Live Schedule • メンバーIG名鑑＆リアルタイム応援座席',
    tabInstagram: 'メンバー IG 名鑑',
    tabSchedule: '応援スケジュール',
    stadiumGuideBtn: '席位説明',
    refreshBtn: '更新',
    themeToggle: 'テーマ切り替え',

    bannerTitle: 'Rakuten Girls 楽天ガールズ 2026 スケジュール',
    bannerBadge: '2026 全猿主場 • 応援ガイド',
    bannerDesc: '各試合における 1〜3回、イニング間パフォーマンス、7〜8回の応援立ち位置（1塁側東エリア／3塁側西エリア／休日特別席／Rステージ）をチェック！カードをタップすると個人の出勤状況と公式Instagramを確認できます。',

    dataConnected: '公開 Google スプレッドシートとリアルタイム連携中',
    dataConnecting: 'スケジュール同期中...',
    googleSheetLink: 'Google スプレッドシート日程表',
    officialRosterLink: 'Rakuten Girls 公式名簿',
    officialIgLink: '球団公式 IG',

    igBannerTitle: 'Rakuten Girls 公式 Instagram 名鑑',
    igBannerBadge: '公式SNS名鑑 • メンバーの最新動向をチェック',
    igBannerDesc: '楽天ガールズのInstagramアカウントを掲載。タップで個人ページへ直接アクセス、またはアカウントIDを1タップでコピーしてストーリーにタグ付けできます。',
    followTeamIg: '球団公式 IG をフォロー',
    searchPlaceholder: '名前、背番号、または IG アカウントで検索...',
    filterAll: 'すべて',
    filterTaiwan: '台湾',
    filterForeign: '外援',
    filterKorean: '外国人メンバー',
    filterLocal: '台湾メンバー',
    filterFavorites: 'お気に入り',
    openIg: 'IG を開く',
    copyAccount: 'ID',
    copied: 'コピー済',
    koreanCheerleader: '韓国応援',
    badgeKorean: '韓援',
    badgeJapanese: '日籍',
    badgeTaiwan: '台籍',
    copyKoreanName: 'ハングル名',
    copiedKoreanName: 'コピー済',
    copyJapaneseName: '日本名',
    copiedJapaneseName: 'コピー済',

    areaAll: '全メンバー',
    areaEast: '1塁側 東エリア',
    areaWest: '3塁側 西エリア',
    areaSpecial: '休日／特別席',
    areaOnDuty: '本日出勤',
    filterPeriod13: '1-3回の位置',
    filterPeriod78: '7-8回の位置',
    filterPeriodMid: 'イニング間',
    filterPeriodPost: '試合後パフォーマンス',
    groupTitleEast: '1塁側 東エリア立ち位置',
    groupTitleWest: '3塁側 西エリア立ち位置',
    groupTitleSpecial: '休日・特別エリア (大楽／Rステージ)',
    groupTitleMid: 'イニング間パフォーマンス',
    groupTitleMidEast: 'イニング間パフォーマンス (東エリア前)',
    groupTitleMidWest: 'イニング間パフォーマンス (西エリア前)',
    groupTitleMidStage: 'イニング間応援ステージパフォーマンス',
    groupTitlePostEast: '試合後パフォーマンス (1塁東側)',
    groupTitlePostWest: '試合後パフォーマンス (3塁西側)',
    groupTitlePost: '試合後パフォーマンスメンバー',
    groupTitleOffDuty: '本日未シフト／休日メンバー',
    groupTitleOnDutySection: '当日応援ガールズ',
    groupTitleFavOnDuty: '今期シフトありお気に入りメンバー',
    groupTitleFavOffDuty: '今期シフトなしお気に入りメンバー',
    noMidPerformance: '当日はイニング間パフォーマンスがございません。詳細は公式発表をご確認ください。',
    searchSchedulePlaceholder: '名前または背番号で検索...',
    filterCountSummary: '表示結果：{count} 名のガールズ',
    noMatchTitle: '該当するメンバーが見つかりません',
    noMatchDesc: '他の日付を選択するか、検索ワード・絞り込み条件を変更してください',
    resetFilters: 'すべての条件をリセット',

    filterModeInning: 'イニング別で見る',
    filterModeSeat: '座席視点で見る',
    seatViewMode: 'マイスポット視点',
    seatEastZone: '1塁側 東エリア (内野東下 D〜F)',
    seatWestZone: '3塁側 西エリア (内野西下 D〜F)',
    seatDaLeZone: '大楽リラックス席／特別区',
    seatEastRZone: '通路 東R ステージ',
    seatWestRZone: '通路 西R ステージ',
    seatEastZoneShort: '1塁側東区',
    seatWestZoneShort: '3塁側西区',
    seatSpecialZone: '応援特区 (テーマデー特区ファンサ応援)',
    seatSpecialZoneShort: '特区応援',
    seatDaLeZoneShort: '大楽特区',
    seatEastRZoneShort: '東R舞台',
    seatWestRZoneShort: '西R舞台',
    seatViewBannerDesc: 'ご着席の球場シートを固定しました！試合中にあなたの視界エリアに登場するメンバーと各回を一覧表示：',
    groupTitleSeat13: '1〜3回に目の前に来るメンバー',
    groupTitleSeatMid: '5回裏 イニング間パフォーマンス',
    groupTitleSeat78: '7〜8回 交代でやって来るメンバー',
    groupTitleSeatAllMatch: '試合中継続して本エリア応援',

    period13: '1-3回',
    periodMid: 'イニング間',
    period78: '7-8回',
    zoneEast: '東',
    zoneWest: '西',
    zoneSpecial: '特区',
    zoneEastR: '東R',
    zoneWestR: '西R',
    zoneDaLe: '大楽',
    primaryArea: '主要立ち位置',
    dutyCount: '今期出勤 {count} 試合',
    gameEvent: 'ホームゲーム',
    onDuty: '出勤',
    offDuty: '休日',
    onDutyToday: '本日出勤',
    locationTBD: '未発表',
    viewSchedule: '詳細スケジュールを見る →',
    todayScheduleBannerTitle: '本日のホームゲーム • 楽天ガールズリアルタイム応援シフト',
    todayScheduleBannerBadge: '本日試合あり • リアルタイム応援中',
    todayScheduleBannerDesc: '本日は楽天モンキーズの主催試合日です！1〜3回、イニング間、7〜8回の最新立ち位置を確認して応援しましょう！',
    todayScheduleAlertTitle: '本日試合開催中・リアルタイム応援シフト',

    guideModalTitle: '楽天桃園野球場 • チア応援シートガイド',
    guideModalSubtitle: 'Taoyuan Baseball Stadium Cheerleading Zones',
    outfieldDirection: '外野方向 (OUTFIELD)',
    westCheerZone: '西エリア応援席',
    westCheerDesc: '3塁側スタンド',
    westCheerSeats: '内野西下 D 〜 F エリア',
    eastCheerZone: '東エリア応援席',
    eastCheerDesc: '1塁側スタンド',
    eastCheerSeats: '内野東下 D 〜 F エリア',
    infield: '内野',
    homePlate: 'ホームベース / 尊猿シート',
    rotationRuleTitle: 'イニング交代ルール',
    rotationRuleContent: 'チアガールは基本的に1〜3回に片側に立ち、イニング間（5回裏終了時）に応援ステージD・E席中間前にてパフォーマンスを実施、7〜8回に反対側へ交代して応援します。',
    rStageRuleTitle: '東R / 西R ステージ',
    rStageRuleContent: '休日や特定テーママッチ時に内野通路のRステージへ展開し、ファンとの距離を縮めます。',
    daLeRuleTitle: '大楽席 / 特別エリア',
    daLeRuleContent: '休日に大楽リラックス席やテーマ企画エリアでインタラクティブな応援を行います。',
    closeGuide: '確認、閉じる',

    profileArchive: '個人出勤プロフィール',
    teamAffiliation: '楽天モンキーズ公式チアリーダー',
    dutyHistory: 'シフト記録＆応援立ち位置',
    noDutyNotice: '現在この月のスプレッドシートには立ち位置情報がありません。',
    fanKnowledgeTitle: '応援のワンポイント豆知識',
    fanKnowledgeEast: '内野1塁側応援ステージ（東下 D-F エリア）。',
    fanKnowledgeWest: '内野3塁側応援ステージ（西下 D-F エリア）。',
    fanKnowledgeMid: '5回裏終了時のイニング間ダンスパフォーマンス（公式発表に準じます）。',
    shareSchedule: '{name} のスケジュールを共有',
    copiedSchedule: 'スケジュール情報をコピーしました！',
    shareTextTitle: '【楽天ガールズ 応援スケジュール】',
    shareTextGirl: 'メンバー：',
    shareTextSchedule: '【直近のシフト】',
    shareTextNoDuty: '直近のシフト情報はありません',
    shareTextLearnMore: 'より詳細なスケジュールはこちら：',

    pairedStageBadge: '✨ {location} 同時出演ペア',
    pairedPartnerHint: 'お気に入り {partner} と同じ回に応援',

    matrixViewTitle: 'スタンド交代マトリックス',
    matrixAllSeason: 'シーズン全体',
    matrixAllSeasonTitle: 'シーズン全日程スタンド交代マトリックス',
    matrixAllSeasonDesc: '日付／イニング／エリア／特別区で階層表示 • タップで詳細表示',
    matrixCornerHeader: 'スタンド席／イニング',
    matrixFavTop: 'お気に入り優先',
    matrixSubTitle: '各回の立ち位置をマトリックスで即座に確認 • タップで詳細表示',
    matrixThemeBadge: 'スパイシークールスイート',
    matrixUnassignedNotice: '立ち位置未定メンバー（計 {count} 名）：',
    matrixAllAssignedNotice: '本日出勤のメンバーはすべて配置完了',
    matrixScrollTip: '横スクロールで各回を確認 • タップで詳細表示',
    deckEastLower: '1塁側東下ホットエリア',
    deckWestLower: '3塁側西下ホットエリア',
    deckEastUpper: '1塁側東上パノラマ席',
    deckWestUpper: '3塁側西上パノラマ席',
    // Share Schedule Modal
    shareModalTitle: 'お気に入りメンバーのスケジュールを共有',
    shareModalSubtitle: 'URL共有＆9:16インスタストーリー画像対応',
    shareCardTheme: 'カードスタイル：',
    shareThemeLight: 'ライトスイート',
    shareThemeDark: 'ダークオブシディアン',
    shareCopyLink: '共有リンクをコピー',
    shareCopiedLink: 'コピー完了',
    shareDownloadCard: '9:16ストーリー画像を保存',
    shareGenerating: '生成中...',
    shareAllSeasonTitle: '2026 全猿ホームシーズン',
    shareThemeDayHighlight: 'スパイシークールスイート ‧ Highlight',
    shareAllSeasonHighlight: '全猿ホーム ‧ Highlight',
    shareStadiumName: '楽天桃園野球場',
    shareZoneSubtitle: '応援特区ファンサ応援',
    shareMyFavoritesCount: 'お気に入りメンバー ({count}名)',
    shareLiveSeatComparison: 'リアルタイム席対照',
    shareAllDayZone: '全試合特区：',
    sharePostMatch: '試合後',
    sharePeriod13: '1-3回：',
    sharePeriod78: '7-8回：',
    sharePeriodMid: 'ハーフタイム：',
    shareFooterTitle: '楽天ガールズ応援スタンドスケジュール',
    shareFooterSubtitle: '全猿ホーム応援席リアルタイム検索',
    shareLimitWarning: '⚠️ 9:16画像の上限超過：現在{count}名を選択中（{mode}上限{max}名）。レイアウト崩れを防ぐため画像保存は無効化されています。',
    shareLimitBtnDisabled: '人数制限超過 (最大{max}名)',
    shareModeSingle: '単日',
    shareModeAll: '全シーズン複数日',
    shareToastCopied: '共有リンクをクリップボードにコピーしました！',
    shareToastDownloadSuccess: '9:16ストーリー画像をダウンロードしました！',
    shareToastGenerating: '9:16高解像度画像を生成中...',
    shareToastFailed: '画像の生成に失敗しました。もう一度お試しください',
    shareAdjustFavTitle: 'お気に入りメンバーのクイック調整（タップして解除）：',
    shareAdjustFavTip: 'タップするとお気に入りから解除され、上限以下になると画像保存が可能になります',
    shareAdjustCurrentCount: '現在 {count}名 / 上限 {max}名',
    shareAdjustSuccess: '✓ 人数制限を満たしました（{count}/{max}名）。9:16画像の生成が可能です',
    shareDateScope: '出力範囲：',
    shareExportCurrentPeriod: '当期一括出力',
    shareExportSpecificDate: '特定日程',
    shareNoFavoritesTitle: 'お気に入りメンバーが未登録です',
    shareNoFavoritesDesc: '現在、お気に入りメンバーが登録されていません。「メンバーIG名鑑」でハートを押してお気に入りを登録してから、共有カードを作成してください！',
    shareGoToIgDirectory: 'メンバー IG 名鑑へ',
    shareNoFavoritesBtn: '先にお気に入りを追加',
    shareToX: 'X でポスト',
    shareToThreads: 'Threads でシェア',
    shareTweetHeadline: '⚾ Rakuten Girls（楽天ガールズ）応援スケジュール！推しメン日程＆席位配置表',
    shareTweetHashtags: '#RakutenGirls #楽天ガールズ #台湾チア #台湾プロ野球 #CPBL',

    // Theme Day & Pre-Match Activities
    themeDayPreMatchBtn: '試合前イベント情報',
    themeDayStadiumBtn: 'スタンド配置',
    preMatchModalTitle: 'スパイシークールスウィート ‧ 試合前イベント＆ブース案内',
    preMatchModalSubtitle: 'ガールズサイン会規定、ブース出演スケジュール、外周ブースマップ',
    tabPreMatchSchedule: '試合前スケジュール＆サイン会',
    tabBoothMap: 'ブース配置＆協賛案内',
    ticketAdmissionTime: 'チケット販売／入場時間：',
    gameStartTimeLabel: '試合開始時間：',
    autographTitle: 'ガールズサイン会レギュレーション',
    autographQueueLocation: '整列場所：三塁側 GATE W サイン会専用整列エリア（ゴールドクラブ会員含む）',
    autographCheckinNotice: '14:40 シングルサイン本確認および整理券配布（本人の同席必須、お一人様1冊限り）',
    autographCapacityNotice: '定員：各日 100 名（整理券受け取り・改札後、三塁側特設テントにて整列）',
    autographStartNotice: '15:10 サイン会開始',
    autographSingleBookOnly: 'シングルサイン本限定',
    autographLineupTitle: 'サイン会出演メンバー（全 {count} 名）',
    autographQuotaBadge: '各日限定 100 名 ‧ 整理券番号順',
    autographMatrixTip: 'アイコンをタップして詳細プロフィールと出勤スケジュールを表示',
    autographStepCheckin: '14:40 サイン本確認および整理券配布',
    autographStepAdmission: '15:00 入場開始',
    autographStepStart: '15:10 サイン会開始（シングル本限定）',
    boothScheduleTitle: 'ブース出演スケジュール',
    boothInteractiveTip: 'ガールズをタップして詳細プロフィールとスケジュールを表示',
    boothMapLegendWest: '三塁側（GATE W 側）ブース',
    boothMapLegendEast: '一塁側（GATE E 側）ブース',
    closePreMatchModal: 'イベント案内を閉じる',
    boothZoomTip: 'ピンチ操作で拡大・縮小、ドラッグで移動、ダブルタップで拡大',
    boothZoomReset: 'リセット',

    switchLanguage: '言語切り替え',
    vibeCodingNotice: '本サイトはファンが Vibe Coding により作成した非公式応援ツールです。多言語表示には AI 補助翻訳を使用しているため、翻訳の不備や誤りがある場合はご容赦ください。',
    disclaimerCopyright: '本プロジェクトはファンによる応援目的で制作されており、すべての肖像権および商標権は楽天モンキーズおよび Rakuten に帰属します。スケジュールデータは公開 Google スプレッドシートから取得しています。'
  },
  'ko': {
    appTitle: '라쿠텐 걸스 근무 일정표',
    appSubtitle: 'Rakuten Girls Live Schedule • 멤버 IG 디렉토리 및 실시간 응원석',
    tabInstagram: '멤버 IG 디렉토리',
    tabSchedule: '응원 일정표',
    stadiumGuideBtn: '좌석 안내',
    refreshBtn: '새로고침',
    themeToggle: '테마 스타일 변경',

    bannerTitle: 'Rakuten Girls 라쿠텐 걸스 2026 일정표',
    bannerBadge: '2026 홈경기 • 응원 가이드',
    bannerDesc: '각 경기별 1~3회, 클리닝 타임 퍼포먼스, 7~8회 응원 위치(1루 동구역 / 3루 서구역 / 주말 특별석 / R 스테이지)를 확인하세요! 카드를 탭하여 개인 출근 기록과 공식 인스타그램을 바로 확인할 수 있습니다.',

    dataConnected: '공개 Google 스프레드시트와 실시간 연동 중',
    dataConnecting: '일정 동기화 중...',
    googleSheetLink: 'Google 스프레드시트 일정표',
    officialRosterLink: 'Rakuten Girls 공식 명단',
    officialIgLink: '구단 공식 IG',

    igBannerTitle: 'Rakuten Girls 공식 Instagram 디렉토리',
    igBannerBadge: '공식 SNS 명단 • 멤버들의 최신 소식을 확인하세요',
    igBannerDesc: '라쿠텐 걸스의 인스타그램 계정을 제공합니다. 탭하여 개인 페이지로 이동하거나 원클릭으로 계정 ID를 복사하여 스토리에 태그할 수 있습니다.',
    followTeamIg: '구단 공식 IG 팔로우',
    searchPlaceholder: '이름, 등번호 또는 IG 계정 검색...',
    filterAll: '전체',
    filterTaiwan: '대만',
    filterForeign: '외국인',
    filterKorean: '외국인 멤버',
    filterLocal: '대만 멤버',
    filterFavorites: '즐겨찾기',
    openIg: 'IG 열기',
    copyAccount: 'ID',
    copied: '복사됨',
    koreanCheerleader: '한국 치어',
    badgeKorean: '韓援',
    badgeJapanese: '日籍',
    badgeTaiwan: '台籍',
    copyKoreanName: '한글 이름',
    copiedKoreanName: '복사됨',
    copyJapaneseName: '일본 이름',
    copiedJapaneseName: '복사됨',

    areaAll: '전체 멤버',
    areaEast: '1루 동구역',
    areaWest: '3루 서구역',
    areaSpecial: '주말／특별구역',
    areaOnDuty: '오늘 출근',
    filterPeriod13: '1-3회 위치',
    filterPeriod78: '7-8회 위치',
    filterPeriodMid: '중간 공연',
    filterPeriodPost: '경기 후 공연',
    groupTitleEast: '1루 동구역 응원 위치',
    groupTitleWest: '3루 서구역 응원 위치',
    groupTitleSpecial: '주말 및 특별구역 (다러／R무대)',
    groupTitleMid: '중간 공연 걸스',
    groupTitleMidEast: '중간 공연 (동구역 앞)',
    groupTitleMidWest: '중간 공연 (서구역 앞)',
    groupTitleMidStage: '중간 댄스 무대 공연',
    groupTitlePostEast: '경기 후 공연 (1루 동측)',
    groupTitlePostWest: '경기 후 공연 (3루 서측)',
    groupTitlePost: '경기 후 공연 멤버',
    groupTitleOffDuty: '미출근／휴무 걸스',
    groupTitleOnDutySection: '당일 응원 걸스',
    groupTitleFavOnDuty: '이번 시즌 출근 일정 있는 최애 걸스',
    groupTitleFavOffDuty: '이번 시즌 일정 없는 최애 걸스',
    noMidPerformance: '당일 중간 공연이 없으며, 실제 일정은 구단 공식 공지를 기준으로 합니다.',
    searchSchedulePlaceholder: '이름 또는 등번호로 검색...',
    filterCountSummary: '검색 결과: {count}명의 걸스',
    noMatchTitle: '해당 조건에 맞는 멤버가 없습니다',
    noMatchDesc: '다른 날짜를 선택하거나 검색어 또는 필터 태그를 재설정해 보세요',
    resetFilters: '모든 조건 초기화',

    filterModeInning: '경기 이닝별 보기',
    filterModeSeat: '내 좌석 시야로 보기',
    seatViewMode: '내 좌석 시야',
    seatEastZone: '1루 동구역 (내야 동하 D~F)',
    seatWestZone: '3루 서구역 (내야 서하 D~F)',
    seatDaLeZone: '다러 릴랙스존 / 특구',
    seatEastRZone: '통로 동R 무대',
    seatWestRZone: '통로 서R 무대',
    seatEastZoneShort: '1루 동구역',
    seatWestZoneShort: '3루 서구역',
    seatSpecialZone: '응원 특구 (테마데이 개인 특구 팬서비스 응원)',
    seatSpecialZoneShort: '특구 응원',
    seatDaLeZoneShort: '다러 특구',
    seatEastRZoneShort: '동R 무대',
    seatWestRZoneShort: '서R 무대',
    seatViewBannerDesc: '착석하신 야구장 구역을 고정했습니다! 경기 중 시야 앞에 등장하는 멤버와 이닝별 일정을 확인하세요:',
    groupTitleSeat13: '1~3회 내 구역 응원 멤버',
    groupTitleSeatMid: '5회말 중간 댄스 공연',
    groupTitleSeat78: '7~8회 교대하여 찾아오는 멤버',
    groupTitleSeatAllMatch: '경기 내내 본 구역 응원',

    period13: '1-3회',
    periodMid: '중간',
    period78: '7-8회',
    zoneEast: '동',
    zoneWest: '서',
    zoneSpecial: '특구',
    zoneEastR: '동R',
    zoneWestR: '서R',
    zoneDaLe: '다러',
    primaryArea: '주요 위치',
    dutyCount: '이번 시즌 {count}경기 출근',
    gameEvent: '홈경기',
    onDuty: '출근',
    offDuty: '휴무',
    onDutyToday: '오늘 출근',
    locationTBD: '미발표',
    viewSchedule: '상세 일정 보기 →',
    todayScheduleBannerTitle: '오늘의 홈경기 • 라쿠텐 걸스 실시간 응원 일정',
    todayScheduleBannerBadge: '오늘 경기 진행 • 실시간 응원 중',
    todayScheduleBannerDesc: '오늘은 라쿠텐 몽키스의 홈경기 날입니다! 1-3회, 중간 공연, 7-8회의 최신 응원 위치를 확인하세요!',
    todayScheduleAlertTitle: '오늘 경기 진행 중 • 실시간 응원 일정',

    guideModalTitle: '라쿠텐 타오위안 야구장 • 치어리더 응원석 안내',
    guideModalSubtitle: 'Taoyuan Baseball Stadium Cheerleading Zones',
    outfieldDirection: '외야 방향 (OUTFIELD)',
    westCheerZone: '서구역 응원석',
    westCheerDesc: '3루 측 스탠드',
    westCheerSeats: '내야 서하 D ~ F 구역',
    eastCheerZone: '동구역 응원석',
    eastCheerDesc: '1루 측 스탠드',
    eastCheerSeats: '내야 동하 D ~ F 구역',
    infield: '내야',
    homePlate: '홈플레이트 / 존원석',
    rotationRuleTitle: '이닝 교대 원칙',
    rotationRuleContent: '치어리더는 보통 1~3회에 한쪽에 서고, 5회말 종료 후 중간 공연은 응원 무대 D, E석 중앙 앞에서 진행하며, 7~8회에 반대편으로 교대 응원합니다.',
    rStageRuleTitle: '동R / 서R 무대',
    rStageRuleContent: '주말 또는 특정 테마 경기일에 내야 통로의 R 무대로 이동하여 팬들과 더욱 가깝게 호흡합니다.',
    daLeRuleTitle: '다러석 / 특별 구역',
    daLeRuleContent: '주말 다러 릴랙스존 또는 테마 기획 구역에서 인터랙티브 응원을 진행합니다.',
    closeGuide: '확인, 안내 닫기',

    profileArchive: '개인 출근 프로필',
    teamAffiliation: '라쿠텐 몽키스 공식 치어리더',
    dutyHistory: '근무 일정 및 응원 위치',
    noDutyNotice: '현재 이번 달 스프레드시트에 응원 위치 정보가 아직 없습니다.',
    fanKnowledgeTitle: '팬을 위한 응원 꿀팁',
    fanKnowledgeEast: '내야 1루 측 응원 무대 (동하 D-F 구역).',
    fanKnowledgeWest: '내야 3루 측 응원 무대 (서하 D-F 구역).',
    fanKnowledgeMid: '5회말 클리닝 타임 댄스 공연(구단 공식 공지 기준).',
    shareSchedule: '{name}의 일정 정보 공유',
    copiedSchedule: '일정 정보가 복사되었습니다!',
    shareTextTitle: '【라쿠텐 걸스 응원 일정표】',
    shareTextGirl: '멤버: ',
    shareTextSchedule: '【최근 응원 일정】',
    shareTextNoDuty: '최근 예정된 출근 일정이 없습니다',
    shareTextLearnMore: '더 많은 멤버 일정 확인하기: ',

    pairedStageBadge: '✨ {location} 동시간 무대 매칭',
    pairedPartnerHint: '최애 {partner}와 같은 시간대 응원',

    matrixViewTitle: '스탠드 로테이션 매트릭스',
    matrixAllSeason: '전체 시즌 보기',
    matrixAllSeasonTitle: '전체 시즌 스탠드 로테이션 매트릭스',
    matrixAllSeasonDesc: '날짜 / 이닝 / 구역 / 전용석 단계별 확인 • 프로필 클릭 시 상세 정보',
    matrixCornerHeader: '스탠드 구역 / 이닝',
    matrixFavTop: '최애 우선 정렬',
    matrixSubTitle: '이닝별 응원 위치 매트릭스 빠른 확인 • 프로필 클릭 시 상세 정보',
    matrixThemeBadge: '스파이시 쿨 스위트 테마데이',
    matrixUnassignedNotice: '위치 미정 명단 (총 {count}명): ',
    matrixAllAssignedNotice: '당일 출근 걸스 위치 배치 완료',
    matrixScrollTip: '좌우로 스크롤하여 이닝별 위치 확인 • 클릭 시 상세 정보',
    deckEastLower: '1루 동하 핫구역',
    deckWestLower: '3루 서하 핫구역',
    deckEastUpper: '1루 동상 시야석',
    deckWestUpper: '3루 서상 시야석',
    // Share Schedule Modal
    shareModalTitle: '내가 가장 좋아하는 치어리더 스케줄 공유',
    shareModalSubtitle: 'URL 공유 및 9:16 인스타 스토리 카드 지원',
    shareCardTheme: '카드 스타일:',
    shareThemeLight: '라이트 스위트',
    shareThemeDark: '다크 옵시디언',
    shareCopyLink: '공유 링크 복사',
    shareCopiedLink: '복사 완료',
    shareDownloadCard: '9:16 스토리 카드 다운로드',
    shareGenerating: '생성 중...',
    shareAllSeasonTitle: '2026 라쿠텐 홈 시즌',
    shareThemeDayHighlight: '핫쿨스윗 테마데이 ‧ Highlight',
    shareAllSeasonHighlight: '전원 홈 ‧ Highlight',
    shareStadiumName: '라쿠텐 타오위안 야구장',
    shareZoneSubtitle: '응원 특구 팬서비스 응원',
    shareMyFavoritesCount: '내가 가장 좋아하는 치어리더 ({count}명)',
    shareLiveSeatComparison: '실시간 좌석 대조',
    shareAllDayZone: '전경기 특구:',
    sharePostMatch: '경기후',
    sharePeriod13: '1-3회:',
    sharePeriod78: '7-8회:',
    sharePeriodMid: '하프타임:',
    shareFooterTitle: '라쿠텐 걸스 실시간 응원단 스케줄',
    shareFooterSubtitle: '전원 홈 응원석 실시간 조회',
    shareLimitWarning: '⚠️ 9:16 카드 용량 초과: 현재 {count}명 선택됨 ({mode} 최대 {max}명 지원). 레이아웃 깨짐을 방지하기 위해 다운로드가 비활성화되었습니다.',
    shareLimitBtnDisabled: '인원 초과 (최대 {max}명)',
    shareModeSingle: '단일 경기',
    shareModeAll: '전 시즌 다일 경기',
    shareToastCopied: '스케줄 링크가 클립보드에 복사되었습니다!',
    shareToastDownloadSuccess: '9:16 스토리 카드가 다운로드되었습니다!',
    shareToastGenerating: '9:16 고해상도 카드 생성 중...',
    shareToastFailed: '카드 생성에 실패했습니다. 잠시 후 다시 시도해주세요',
    shareAdjustFavTitle: '최애 멤버 빠른 조정 (탭하여 제외):',
    shareAdjustFavTip: '멤버를 탭하여 즐겨찾기에서 제외하면, 상한 충족 시 카드 다운로드가 활성화됩니다',
    shareAdjustCurrentCount: '현재 {count}명 / 상한 {max}명',
    shareAdjustSuccess: '✓ 인원 제한을 충족했습니다 ({count}/{max}명). 이제 9:16 카드 다운로드가 가능합니다',
    shareDateScope: '내보내기 범위:',
    shareExportCurrentPeriod: '당기 일괄 내보내기',
    shareExportSpecificDate: '특정 날짜',
    shareNoFavoritesTitle: '최애 멤버가 등록되지 않았습니다',
    shareNoFavoritesDesc: '현재 추가된 최애 멤버가 없습니다. 「멤버 IG 디렉토리」에서 하트를 눌러 최애 멤버를 추가한 후 전용 응원 카드를 생성해 보세요!',
    shareGoToIgDirectory: '멤버 IG 디렉토리로 이동',
    shareNoFavoritesBtn: '최애 멤버를 먼저 추가하세요',
    shareToX: 'X에 공유',
    shareToThreads: 'Threads에 공유',
    shareTweetHeadline: '⚾ 라쿠텐 걸스（Rakuten Girls）2026 응원 일정표! 나의 최애 멤버 출근 스케줄',
    shareTweetHashtags: '#RakutenGirls #라쿠텐걸스 #대만치어리더 #치어리더 #CPBL',

    // Theme Day & Pre-Match Activities
    themeDayPreMatchBtn: '경기 전 이벤트 정보',
    themeDayStadiumBtn: '관중석 배치',
    preMatchModalTitle: '스파이시 쿨 스위트 ‧ 경기 전 이벤트 및 부스 안내',
    preMatchModalSubtitle: '치어리더 팬사인회 규칙, 부스 출연 스케줄, 야구장 외곽 부스 맵',
    tabPreMatchSchedule: '경기 전 스케줄 & 사인회',
    tabBoothMap: '부스 배치 & 기업 안내',
    ticketAdmissionTime: '티켓 판매／입장 시간：',
    gameStartTimeLabel: '경기 시작 시간：',
    autographTitle: '치어리더 팬사인회 안내 규정',
    autographQueueLocation: '대기 장소: 3루측 GATE W 사인회 전용 대기 구역 (골드 멤버 포함)',
    autographCheckinNotice: '14:40 싱글 사인북 확인 및 번호표 배부 (본인 및 사인북 지참 필수, 1인 1권 한정)',
    autographCapacityNotice: '정원: 일일 100명 (번호표 수령 및 검표 후 3루측 텐트에서 순차 대기)',
    autographStartNotice: '15:10 팬사인회 공식 시작',
    autographSingleBookOnly: '싱글 사인북 전용 사인',
    autographLineupTitle: '팬사인회 참석 멤버（총 {count}명）',
    autographQuotaBadge: '일일 100명 한정 ‧ 번호표 순차 서명',
    autographMatrixTip: '치어리더를 탭하여 상세 프로필과 출근 스케줄을 확인하세요',
    autographStepCheckin: '14:40 싱글 사인북 확인 및 번호표 배부',
    autographStepAdmission: '15:00 입장 시작',
    autographStepStart: '15:10 팬사인회 시작（사인북 한정）',
    boothScheduleTitle: '부스 치어리더 출연 스케줄',
    boothInteractiveTip: '치어리더를 탭하여 상세 프로필과 스케줄을 확인하세요',
    boothMapLegendWest: '3루측 (GATE W 방면) 부스',
    boothMapLegendEast: '1루측 (GATE E 방면) 부스',
    closePreMatchModal: '이벤트 안내 닫기',
    boothZoomTip: '두 손가락 핀치 확대/축소, 드래그 이동, 더블 탭 확대 지원',
    boothZoomReset: '초기화',

    switchLanguage: '언어 변경',
    vibeCodingNotice: '본 사이트는 팬이 Vibe Coding으로 개발한 비공식 응원 프로젝트입니다. 다국어는 AI 보조 번역을 적용하였으므로 번역상의 오류가 있을 수 있으니 양해 부탁드립니다.',
    disclaimerCopyright: '본 프로젝트는 팬 응원 목적으로 제작되었으며 모든 초상권 및 상표권은 라쿠텐 몽키스와 Rakuten에 있습니다. 일정 데이터는 공개 Google 스프레드시트와 실시간 연동됩니다.'
  }
};
