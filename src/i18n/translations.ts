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
  filterKorean: string;
  filterLocal: string;
  filterFavorites: string;
  openIg: string;
  copyAccount: string;
  copied: string;
  koreanCheerleader: string;
  copyKoreanName: string;
  copiedKoreanName: string;

  // FilterBar & Areas
  areaAll: string;
  areaEast: string;
  areaWest: string;
  areaSpecial: string;
  areaOnDuty: string;
  searchSchedulePlaceholder: string;
  filterCountSummary: string;
  noMatchTitle: string;
  noMatchDesc: string;
  resetFilters: string;

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
  viewSchedule: string;

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
  fanKnowledgeTitle: string;
  fanKnowledgeEast: string;
  fanKnowledgeWest: string;
  fanKnowledgeMid: string;
  shareSchedule: string;
  copiedSchedule: string;

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
    stadiumGuideBtn: '球場應援席位導覽',
    refreshBtn: '重新整理',
    themeToggle: '切換主題風格',

    bannerTitle: 'Rakuten Girls 樂天女孩 2026 班表',
    bannerBadge: '2026 全猿主場 • 應援指南',
    bannerDesc: '掌握女孩每場賽事的 1-3 局、中場表演與 7-8 局應援站位（一壘東區／三壘西區／假日大樂／R 舞台專區）。點擊卡片可查看個別出勤與 Instagram！',

    dataConnected: '即時連線公開 Google 試算表，掌握女孩最新班表資訊',
    dataConnecting: '班表即時同步中...',
    googleSheetLink: 'Google 試算表班表',
    officialRosterLink: 'Rakuten Girls 官方名冊',
    officialIgLink: '球團官方 IG',

    igBannerTitle: 'Rakuten Girls 官方 Instagram 目錄',
    igBannerBadge: '官方社群名錄 • 隨時追蹤女孩動態',
    igBannerDesc: '收錄全體樂天女孩的官方 Instagram 帳號與最新出勤肖像，點擊可直接前往個人頁面或一鍵複製帳號關注。',
    followTeamIg: '追蹤球團官方 IG',
    searchPlaceholder: '搜尋姓名、背號或 IG 帳號...',
    filterAll: '全部',
    filterKorean: '韓籍外援',
    filterLocal: '本隊成員',
    filterFavorites: '最愛',
    openIg: '開啟 IG',
    copyAccount: '帳號',
    copied: '已複製',
    koreanCheerleader: '韓援',
    copyKoreanName: '韓文名',
    copiedKoreanName: '已複製',

    areaAll: '全部女孩',
    areaEast: '一壘東區',
    areaWest: '三壘西區',
    areaSpecial: '假日／專區',
    areaOnDuty: '今日有班',
    searchSchedulePlaceholder: '搜尋女孩姓名或背號...',
    filterCountSummary: '顯示結果：{count} 位女孩',
    noMatchTitle: '找不到符合條件的女孩',
    noMatchDesc: '請嘗試切換其他日期、清除搜尋文字或重設篩選標籤',
    resetFilters: '重設所有條件',

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
    viewSchedule: '查看完整班表 →',

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
    fanKnowledgeTitle: '球迷應援小知識',
    fanKnowledgeEast: '內野一壘側應援舞台（東下 D-F 區）。',
    fanKnowledgeWest: '內野三壘側應援舞台（西下 D-F 區）。',
    fanKnowledgeMid: '第 5 局下中場舞表演(以官方公告為主)。',
    shareSchedule: '分享 {name} 的班表資訊',
    copiedSchedule: '已複製班表資訊！',

    switchLanguage: '語言切換',
    vibeCodingNotice: '本站為球迷透過 Vibe Coding 開發之非官方應援專案，多語系採用 AI 輔助翻譯，如有翻譯或資訊未盡完善之處敬請見諒。',
    disclaimerCopyright: '本專案由粉絲應援所建立，所有肖像與商標權屬樂天桃猿棒球隊與 Rakuten 所有。班表資料即時連線公開 Google Sheet。'
  },
  'ja': {
    appTitle: '楽天ガールズ応援スケジュール',
    appSubtitle: 'Rakuten Girls Live Schedule • メンバーIG名鑑＆リアルタイム応援座席',
    tabInstagram: 'メンバー IG 名鑑',
    tabSchedule: '応援スケジュール',
    stadiumGuideBtn: '球場応援シートガイド',
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
    igBannerDesc: '楽天ガールズ全メンバーの公式 Instagram アカウントと最新プロフィール写真を掲載。タップで個人ページへ直接アクセス、またはアカウントIDを1タップでコピーできます。',
    followTeamIg: '球団公式 IG をフォロー',
    searchPlaceholder: '名前、背番号、または IG アカウントで検索...',
    filterAll: 'すべて',
    filterKorean: '韓国人メンバー',
    filterLocal: '台湾メンバー',
    filterFavorites: 'お気に入り',
    openIg: 'IG を開く',
    copyAccount: 'ID',
    copied: 'コピー済',
    koreanCheerleader: '韓国応援',
    copyKoreanName: 'ハングル名',
    copiedKoreanName: 'コピー済',

    areaAll: '全メンバー',
    areaEast: '1塁側 東エリア',
    areaWest: '3塁側 西エリア',
    areaSpecial: '休日／特別席',
    areaOnDuty: '本日出勤',
    searchSchedulePlaceholder: '名前または背番号で検索...',
    filterCountSummary: '表示結果：{count} 名のガールズ',
    noMatchTitle: '該当するメンバーが見つかりません',
    noMatchDesc: '他の日付を選択するか、検索ワード・絞り込み条件を変更してください',
    resetFilters: 'すべての条件をリセット',

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
    viewSchedule: '詳細スケジュールを見る →',

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
    fanKnowledgeTitle: '応援のワンポイント豆知識',
    fanKnowledgeEast: '内野1塁側応援ステージ（東下 D-F エリア）。',
    fanKnowledgeWest: '内野3塁側応援ステージ（西下 D-F エリア）。',
    fanKnowledgeMid: '5回裏終了時のイニング間ダンスパフォーマンス（公式発表に準じます）。',
    shareSchedule: '{name} のスケジュールを共有',
    copiedSchedule: 'スケジュール情報をコピーしました！',

    switchLanguage: '言語切り替え',
    vibeCodingNotice: '本サイトはファンが Vibe Coding により作成した非公式応援ツールです。多言語表示には AI 補助翻訳を使用しているため、翻訳の不備や誤りがある場合はご容赦ください。',
    disclaimerCopyright: '本プロジェクトはファンによる応援目的で制作されており、すべての肖像権および商標権は楽天モンキーズおよび Rakuten に帰属します。スケジュールデータは公開 Google スプレッドシートから取得しています。'
  },
  'ko': {
    appTitle: '라쿠텐 걸스 근무 일정표',
    appSubtitle: 'Rakuten Girls Live Schedule • 멤버 IG 디렉토리 및 실시간 응원석',
    tabInstagram: '멤버 IG 디렉토리',
    tabSchedule: '응원 일정표',
    stadiumGuideBtn: '야구장 응원석 안내',
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
    igBannerDesc: '라쿠텐 걸스 전 멤버의 공식 인스타그램 계정과 최신 프로필 사진을 제공합니다. 탭하여 개인 페이지로 이동하거나 원클릭으로 계정 ID를 복사할 수 있습니다.',
    followTeamIg: '구단 공식 IG 팔로우',
    searchPlaceholder: '이름, 등번호 또는 IG 계정 검색...',
    filterAll: '전체',
    filterKorean: '한국인 멤버',
    filterLocal: '대만 멤버',
    filterFavorites: '즐겨찾기',
    openIg: 'IG 열기',
    copyAccount: 'ID',
    copied: '복사됨',
    koreanCheerleader: '한국 치어',
    copyKoreanName: '한글 이름',
    copiedKoreanName: '복사됨',

    areaAll: '전체 멤버',
    areaEast: '1루 동구역',
    areaWest: '3루 서구역',
    areaSpecial: '주말／특별구역',
    areaOnDuty: '오늘 출근',
    searchSchedulePlaceholder: '이름 또는 등번호로 검색...',
    filterCountSummary: '검색 결과: {count}명의 걸스',
    noMatchTitle: '해당 조건에 맞는 멤버가 없습니다',
    noMatchDesc: '다른 날짜를 선택하거나 검색어 또는 필터 태그를 재설정해 보세요',
    resetFilters: '모든 조건 초기화',

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
    viewSchedule: '상세 일정 보기 →',

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
    fanKnowledgeTitle: '팬을 위한 응원 꿀팁',
    fanKnowledgeEast: '내야 1루 측 응원 무대 (동하 D-F 구역).',
    fanKnowledgeWest: '내야 3루 측 응원 무대 (서하 D-F 구역).',
    fanKnowledgeMid: '5회말 클리닝 타임 댄스 공연(구단 공식 공지 기준).',
    shareSchedule: '{name}의 일정 정보 공유',
    copiedSchedule: '일정 정보가 복사되었습니다!',

    switchLanguage: '언어 변경',
    vibeCodingNotice: '본 사이트는 팬이 Vibe Coding으로 개발한 비공식 응원 프로젝트입니다. 다국어는 AI 보조 번역을 적용하였으므로 번역상의 오류가 있을 수 있으니 양해 부탁드립니다.',
    disclaimerCopyright: '본 프로젝트는 팬 응원 목적으로 제작되었으며 모든 초상권 및 상표권은 라쿠텐 몽키스와 Rakuten에 있습니다. 일정 데이터는 공개 Google 스프레드시트와 실시간 연동됩니다.'
  }
};
