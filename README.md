# Rakuten Girls 樂天女孩即時上班班表

專為台灣樂天桃猿棒球隊專屬啦啦隊 **Rakuten Girls（樂天女孩）** 打造的即時排班與應援席位查詢系統。

線上展示網址：[https://mouse170.github.io/rkg_schedule/](https://mouse170.github.io/rkg_schedule/)

---

## 核心特色

1. **首頁預設應援班表與智慧日期感應**：
   - 進入網站預設顯示「當日應援」主場班表，若當日有賽事將以醒目火焰徽章優先標註「今日上班」。
   - 非當日賽事自動以週為單位換算相對時間標記（明天、後天、本週幾、下週幾）。
2. **三語系國際化支援（繁體中文、日本語、한국어）**：
   - 支援語系即時切換，包含所有導覽、局數站位（東 / 西 / 大樂 / 專區）、球場席位小知識與分享文案。
3. **OLED 純黑深色模式（Dark Mode）**：
   - 支援淺色（Idol Bloom 粉嫩風格）與 OLED 純黑高對比暗色模式，夜間賽事與球場現場觀看省電不刺眼。
4. **Google 試算表多頁籤即時同步**：
   - 前端直連 Google Sheets 多工作表（支援月份排班表與待定名冊），支援大小寫正規化（如 KIRA、MIKA）與「站位待公布」名單。
5. **全體 27 位現役應援成員肖像與官方 IG 完整對應**：
   - 收錄全體 27 位現役成員與外援女孩（河智媛、廉世彬、禹洙漢、高佳彬、金佳垠等）。
   - 附有成員國籍徽章、隊長/副隊長標籤、官方 Instagram 帳號、日韓文譯名一鍵複製。
6. **細緻應援局數、球場導覽與「我的座位視角」模式**：
   - 依局數清楚標示 1-3 局、第 5 局下中場舞、7-8 局的「東區（一壘側）」或「西區（三壘側）」站位。
   - **Stitch 雙模式緊湊型分段控制（Dual-Mode Segmented Control）**：將「依比賽局數看」與「依座位視角看」收納為專屬分段切換，篩選膠囊改為單行流暢滑動軌道（Single-row Chip Rail），手機端垂直高度節省超過 60%，女孩卡片首屏即見。
   - **我的座位視角模式**：球迷可直接選擇入座區域（一壘東區、三壘西區、大樂放鬆區、走道東R舞台、走道西R舞台），自動篩選整場球賽中所有會來到該視野前方的女孩，並依「1-3局來到你這區」、「第5局下中場舞」、「7-8局換側來到你面前」時間軸結構化排列，卡片自動以金色聚焦外框高亮對應局數膠囊。
   - 內建桃園樂天棒球場（Rakuten Taoyuan Baseball Stadium）內野席位導覽與換邊規則指南，球場地圖支援直接點擊分區立即切換席位視角。
7. **愛心收藏、微型狀態列與快速過濾**：
   - 整合微型資訊列（Micro-metadata Bar），即時反應用戶篩選結果與出勤總數，並支援一鍵快速重設所有條件。
   - 支援最愛女孩本機收藏（LocalStorage），最愛清單內自動維持「有班成員優先置頂」邏輯。
   - 支援依姓名背號即時搜尋（附快速清空按鈕）、東區/西區/專區/全天數篩選。
   - **特殊專區（東R／西R／大樂）同時段同台配對動態**：當有 2 位（含）以上最愛女孩在同一場次之相同時段分配在相同特殊站位時，卡片自動觸發 Stitch 粉金呼吸流光動畫（`animate-paired-shimmer`）、浮動「✨ 同台」徽章，並支援雙向 Hover 心跳連鎖反饋。
8. **社群預覽與隱私無 Cookie 流量分析**：
   - 整合符合 LINE、Threads、Telegram、Facebook、X (Twitter) 規範之 1200x630 Open Graph 高相容性大圖卡片（中心安全區設計，兼顧橫幅大卡與 1:1 正方形縮圖）。
   - 整合極輕量、無 Cookie 之 Cloudflare Web Analytics 流量分析。
9. **GitHub Actions 自動化 CI/CD**：
   - push 至 `main` 分支自動觸發建置並部署至 GitHub Pages。

---

## 資料來源

- **即時班表來源**：[Google 試算表（即時更新）](https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing)
- **女孩名冊與官方肖像**：[樂天桃猿官方網站 Rakuten Monkeys](https://monkeys.rakuten.com.tw/girls)
- **官方社群**：[Rakuten Girls 官方 Instagram](https://www.instagram.com/rakutengirls/)

---

## 本地開發與建置

```bash
# 1. 安裝依賴套件
npm install

# 2. 啟動本機開發伺服器
npm run dev

# 3. 建置生產環境產物
npm run build

# 4. 本機預覽建置產物
npm run preview
```

---

## GitHub Pages 部署設定

1. 將本專案推送至 GitHub 儲存庫 `https://github.com/mouse170/rkg_schedule.git`。
2. 於 GitHub 儲存庫 **Settings** -> **Pages**：
   - 在 **Build and deployment** 下方的 **Source** 選擇 **GitHub Actions**。
3. 日後每次 push 至 `main` 分支，GitHub Actions 都會自動完成建置並發布至 `https://mouse170.github.io/rkg_schedule/`。

