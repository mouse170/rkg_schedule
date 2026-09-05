# Rakuten Girls 樂天女孩即時上班班表 💖

專為台灣樂天桃猿棒球隊專屬啦啦隊 **Rakuten Girls（樂天女孩）** 打造的即時排班與應援席位查詢系統。

線上展示網址：[https://mouse170.github.io/rkg_schedule/](https://mouse170.github.io/rkg_schedule/)

---

## 🌸 核心特色

1. **Stitch 設計系統（Idol Bloom 風格）**：
   - 採用日系偶像粉嫩漸層配色（`#FF69B4` / `#AC2471`）搭配樂天經典酒紅（`#890022`）。
   - 圓角高保真卡片與柔光陰影，凸顯女孩元氣魅力。
2. **Google 試算表秒級即時同步**：
   - 前端直接串接公開 Google Sheets CSV，管理員於試算表更新排班後，點擊「同步最新班表」即可秒級顯示最新班表。
3. **全體 27 位現役應援成員高解析肖像與官方 IG 完整對應**：
   - 包含現役人氣成員與韓籍外援（河智媛、廉世彬、禹洙漢、高佳彬、金佳垠等）。
   - 卡片與個人抽屜皆附有 100% 驗證之官方 Instagram 帳號與跳轉連結。
4. **細緻應援局數與東／西區站位**：
   - 清楚標示 1-3 局、中場表演與 7-8 局的「東區（一壘側）」或「西區（三壘側）」站位。
   - 附有桃園棒球場席位導覽互動視窗。
5. **愛心收藏與快速過濾**：
   - 支援將喜愛女孩加入最愛（自動保存於瀏覽器 LocalStorage），最愛成員優先置頂。
   - 支援姓名、背號即時搜尋，以及依出勤日期、東／西區快速篩選。
6. **GitHub Actions 一鍵自動部署**：
   - 包含自動化 CI/CD Workflow，push 至 `main` 分支即自動建置並發布至 GitHub Pages。

---

## 🔗 資料來源

- **即時班表來源**：[Google 試算表（即時更新）](https://docs.google.com/spreadsheets/d/110lr6vJ48T8_IdnUhJPI-aMk4O_-0fvvrmZmwPhu8fo/edit?usp=sharing)
- **女孩名冊與官方肖像**：[樂天桃猿官方網站 Rakuten Monkeys](https://monkeys.rakuten.com.tw/girls)
- **官方社群**：[Rakuten Girls 官方 Instagram](https://www.instagram.com/rakutengirls/)

---

## 🛠️ 本地開發與建置

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

## 🚀 GitHub Pages 部署設定說明

1. 將本專案 push 到遠端儲存庫 `https://github.com/mouse170/rkg_schedule.git`：
   ```bash
   git add .
   git commit -m "feat: 樂天女孩即時上班班表系統完整實作與肖像圖資整合"
   git branch -M main
   git remote add origin https://github.com/mouse170/rkg_schedule.git
   git push -u origin main
   ```
2. 前往 GitHub 儲存庫的 **Settings** -> **Pages**：
   - 在 **Build and deployment** 下方的 **Source** 選擇 **GitHub Actions**。
3. 日後每次 push 至 `main` 分支，GitHub Actions 都會自動建置並發布至 `https://mouse170.github.io/rkg_schedule/`。
