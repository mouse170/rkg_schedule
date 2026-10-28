import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 1. Read girls roster
const raw = fs.readFileSync('src/data/girlsRoster.ts', 'utf-8');
const lines = raw.split('\n');
const girls = [];
let current = null;

for (const line of lines) {
  if (line.includes('{')) current = {};
  if (current) {
    const idM = line.match(/"id":\s*"([^"]+)"/);
    if (idM) current.id = idM[1];
    const nameM = line.match(/"name":\s*"([^"]+)"/);
    if (nameM) current.name = nameM[1];
    const numM = line.match(/"number":\s*"([^"]+)"/);
    if (numM) current.number = numM[1];
    const coverM = line.match(/"localCalendarCover":\s*"([^"]+)"/);
    if (coverM) current.localCalendarCover = coverM[1];
    const innerM = line.match(/"localCalendarInner":\s*"([^"]+)"/);
    if (innerM) current.localCalendarInner = innerM[1];

    if (line.includes('}') && current.id && current.name) {
      girls.push(current);
      current = null;
    }
  }
}

function toBase64(relPath) {
  const fullPath = path.resolve('public', relPath.replace(/^\.?\//, '').replace(/^public\//, ''));
  if (fs.existsSync(fullPath)) {
    const buf = fs.readFileSync(fullPath);
    return `data:image/jpeg;base64,${buf.toString('base64')}`;
  }
  return '';
}

// Target main girls: 貝佳頤 (id: 423, #8) & Kira (id: 339, #19)
const beijiayi = girls.find(g => g.id === '423') || { name: '貝佳頤', number: '8' };
const kira = girls.find(g => g.id === '339') || { name: 'Kira', number: '19' };

// Avatars for bottom strip: Prioritize 貝佳頤 & Kira, then others
const stripGirls = [
  beijiayi,
  kira,
  girls.find(g => g.id === '253'), // 宋宋
  girls.find(g => g.id === '431'), // 河智媛
  girls.find(g => g.id === '94'),  // 琳妲
  girls.find(g => g.id === '331'), // 高橋佳帆
  girls.find(g => g.id === '422'), // 岱縈
  girls.find(g => g.id === '244'), // 若潼
  girls.find(g => g.id === '335'), // 嘎琳
  girls.find(g => g.id === '91'),  // 孟潔
].filter(Boolean);

const deskCalendarSvg = `
<svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M3.5 20L6.2 7H17.8L20.5 20" stroke="#3b000d" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M2 20H22" stroke="#3b000d" stroke-width="2.2" stroke-linecap="round"/>
  <rect x="5.5" y="7" width="13" height="12" rx="1.5" fill="#3b000d" fill-opacity="0.18" stroke="#3b000d" stroke-width="1.8"/>
  <path d="M8 5V9M16 5V9M12 5V9" stroke="#3b000d" stroke-width="2" stroke-linecap="round"/>
  <circle cx="12" cy="13.5" r="2.2" fill="#890022"/>
</svg>
`;

// HTML template centered around 貝佳頤 & Kira
const html = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
  <meta charset="utf-8">
  <title>2027 RKG Calendar OG - 貝佳頤 & Kira 特輯</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Noto+Serif+TC:wght@600;700;900&family=Noto+Sans+TC:wght@400;500;700;900&display=swap');

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      background-color: #170105;
      background-image: 
        radial-gradient(circle at 80% 40%, #540316 0%, #2f020b 48%, #140105 100%),
        radial-gradient(circle at 12% 85%, rgba(137, 0, 34, 0.45) 0%, transparent 55%);
      font-family: 'Noto Sans TC', sans-serif;
      position: relative;
      color: #fff;
    }

    /* Luxury Golden Deco Borders */
    .outer-border {
      position: absolute;
      top: 14px;
      left: 14px;
      right: 14px;
      bottom: 14px;
      border: 1.5px solid rgba(229, 192, 123, 0.4);
      pointer-events: none;
    }

    .inner-border {
      position: absolute;
      top: 20px;
      left: 20px;
      right: 20px;
      bottom: 20px;
      border: 1px solid rgba(229, 192, 123, 0.18);
      pointer-events: none;
    }

    /* Corner Ornaments */
    .corner {
      position: absolute;
      width: 16px;
      height: 16px;
      border-color: #f7d070;
      pointer-events: none;
    }
    .c-tl { top: 12px; left: 12px; border-top: 3px solid #f7d070; border-left: 3px solid #f7d070; }
    .c-tr { top: 12px; right: 12px; border-top: 3px solid #f7d070; border-right: 3px solid #f7d070; }
    .c-bl { bottom: 12px; left: 12px; border-bottom: 3px solid #f7d070; border-left: 3px solid #f7d070; }
    .c-br { bottom: 12px; right: 12px; border-bottom: 3px solid #f7d070; border-right: 3px solid #f7d070; }

    /* Background Ambient Rays & Soft Glow */
    .bg-glow-right {
      position: absolute;
      right: 50px;
      top: 50px;
      width: 600px;
      height: 520px;
      background: radial-gradient(ellipse at center, rgba(255, 192, 203, 0.14) 0%, rgba(137, 0, 34, 0.38) 45%, transparent 75%);
      filter: blur(40px);
      pointer-events: none;
    }

    /* Left Editorial Column */
    .left-col {
      position: absolute;
      top: 48px;
      left: 60px;
      width: 530px;
      z-index: 10;
      display: flex;
      flex-direction: column;
    }

    .badge-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
    }

    .badge-collection {
      padding: 6px 14px;
      background: rgba(137, 0, 34, 0.7);
      border: 1px solid rgba(247, 208, 112, 0.65);
      border-radius: 999px;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #fce38a;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4);
    }

    .badge-edition {
      font-size: 13px;
      font-weight: 600;
      color: rgba(255, 230, 235, 0.75);
      letter-spacing: 1px;
    }

    .title-2027 {
      font-family: 'Cinzel', serif;
      font-size: 80px;
      font-weight: 900;
      line-height: 0.92;
      letter-spacing: 3px;
      background: linear-gradient(135deg, #ffffff 0%, #fde68a 35%, #d4af37 70%, #fce38a 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 4px 14px rgba(0,0,0,0.8));
    }

    .title-rakuten {
      font-family: 'Cinzel', serif;
      font-size: 40px;
      font-weight: 800;
      letter-spacing: 3px;
      color: #ffffff;
      margin-top: 4px;
      text-shadow: 0 2px 10px rgba(0,0,0,0.7);
    }

    .title-chinese {
      font-family: 'Noto Serif TC', serif;
      font-size: 42px;
      font-weight: 900;
      letter-spacing: 2.5px;
      background: linear-gradient(180deg, #ffffff 0%, #ffd9e2 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 4px;
      text-shadow: 0 4px 12px rgba(0,0,0,0.6);
    }

    .lead-tagline {
      margin-top: 14px;
      font-size: 17px;
      font-weight: 600;
      color: #f7d070;
      letter-spacing: 0.8px;
      display: flex;
      align-items: center;
      gap: 8px;
      white-space: nowrap;
    }

    .pills-bar {
      display: flex;
      gap: 10px;
      margin-top: 20px;
    }
    .pill-item {
      padding: 7px 14px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.22);
      border-radius: 8px;
      font-size: 13.5px;
      font-weight: 600;
      color: #f5f5f5;
    }

    .action-row {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 24px;
    }

    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 12px 28px;
      background: linear-gradient(135deg, #fde68a 0%, #e6b83b 50%, #b8861b 100%);
      border-radius: 999px;
      color: #3b000d;
      font-size: 18px;
      font-weight: 900;
      letter-spacing: 1.5px;
      box-shadow: 0 8px 24px rgba(230, 184, 59, 0.4), 0 2px 6px rgba(0,0,0,0.5);
      border: 1.5px solid #fff5cc;
    }

    .cta-subtext {
      font-size: 14px;
      font-weight: 500;
      color: rgba(255, 235, 240, 0.75);
      letter-spacing: 0.8px;
    }

    .roster-summary {
      margin-top: 22px;
      font-size: 13.5px;
      color: rgba(255, 255, 255, 0.65);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .dot-live {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: #22c55e;
      box-shadow: 0 0 10px #22c55e;
    }

    .avatar-stack {
      display: flex;
      align-items: center;
    }
    .stack-img {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1.5px solid #e5c07b;
      margin-left: -9px;
      object-fit: cover;
      box-shadow: 0 2px 5px rgba(0,0,0,0.6);
      background: #333;
    }
    .stack-img:first-child {
      margin-left: 0;
      border: 2px solid #f7d070;
      transform: scale(1.1);
      z-index: 2;
    }
    .stack-img:nth-child(2) {
      border: 2px solid #f7d070;
      transform: scale(1.08);
      z-index: 1;
    }

    /* Right Showcase Stage: 貝佳頤 & Kira 雙主視覺展演 */
    .right-stage {
      position: absolute;
      top: 0;
      right: 0;
      width: 620px;
      height: 630px;
    }

    /* Desk Calendar Container 1: Kira No.19 (Top/Back, 官方 2027 睡衣草莓封面) */
    .stage-item-back {
      position: absolute;
      top: 36px;
      right: 42px;
      width: 470px;
      height: 275px;
      border-radius: 16px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 
        0 24px 50px rgba(0,0,0,0.85),
        0 0 0 1.5px rgba(255, 255, 255, 0.25);
      transform: rotate(4.5deg);
      filter: brightness(0.95);
      z-index: 2;
    }

    .stage-item-back .cropper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Crop Kira's 2027 physical desk calendar (focusing on Kira + Neon Pink 2027) */
    .stage-item-back img {
      position: absolute;
      width: 100%;
      top: -30%;
      left: 0;
    }

    .tag-back {
      position: absolute;
      top: 12px;
      right: 14px;
      background: linear-gradient(135deg, #890022 0%, #4a0013 100%);
      color: #fce38a;
      border: 1.5px solid rgba(247, 208, 112, 0.85);
      font-size: 12.5px;
      font-weight: 800;
      padding: 4px 12px;
      border-radius: 6px;
      letter-spacing: 1px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
      z-index: 5;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    /* Desk Calendar Container 2: 貝佳頤 No.08 (Front/Main, 官方 2027 泳裝碧綠封面) */
    .stage-item-front {
      position: absolute;
      top: 220px;
      right: 55px;
      width: 495px;
      height: 295px;
      border-radius: 16px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 
        0 32px 70px -10px rgba(0,0,0,0.95),
        0 0 0 2px rgba(247, 208, 112, 0.85),
        0 0 50px rgba(137, 0, 34, 0.6);
      transform: rotate(-3.5deg);
      z-index: 4;
    }

    .stage-item-front .cropper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }

    /* Crop 貝佳頤's 2027 physical desk calendar */
    .stage-item-front img {
      position: absolute;
      width: 100%;
      top: -30%;
      left: 0;
    }

    .tag-front {
      position: absolute;
      bottom: 10px;
      right: 14px;
      background: linear-gradient(135deg, #890022 0%, #4a0013 100%);
      color: #fce38a;
      border: 1.5px solid rgba(247, 208, 112, 0.85);
      font-size: 13px;
      font-weight: 900;
      padding: 5px 12px;
      border-radius: 6px;
      letter-spacing: 1px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.6);
      z-index: 5;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    /* Desk Calendar Container 3: 貝佳頤 No.08 內頁寫真 (Left Wing Accent) */
    .stage-item-left {
      position: absolute;
      top: 130px;
      right: 380px;
      width: 215px;
      height: 250px;
      border-radius: 14px;
      overflow: hidden;
      background: #ffffff;
      box-shadow: 
        0 20px 42px rgba(0,0,0,0.8),
        0 0 0 1px rgba(255, 255, 255, 0.22);
      transform: rotate(-10deg);
      filter: brightness(0.9);
      z-index: 3;
    }
    .stage-item-left .cropper {
      width: 100%;
      height: 100%;
      overflow: hidden;
      position: relative;
    }
    .stage-item-left img {
      position: absolute;
      width: 175%;
      top: -14%;
      left: -20%;
    }
    .tag-left {
      position: absolute;
      bottom: 8px;
      left: 10px;
      background: rgba(40, 4, 10, 0.92);
      color: #fce38a;
      font-size: 11px;
      font-weight: 800;
      padding: 3px 8px;
      border-radius: 4px;
      z-index: 5;
    }

    /* Bottom Ground Reflection */
    .stage-ground {
      position: absolute;
      bottom: 40px;
      right: 30px;
      width: 550px;
      height: 40px;
      background: radial-gradient(ellipse at center, rgba(247, 208, 112, 0.35) 0%, rgba(137, 0, 34, 0.45) 45%, transparent 75%);
      filter: blur(16px);
      z-index: 1;
      pointer-events: none;
    }
  </style>
</head>
<body>
  <div class="outer-border"></div>
  <div class="inner-border"></div>
  <div class="corner c-tl"></div>
  <div class="corner c-tr"></div>
  <div class="corner c-bl"></div>
  <div class="corner c-br"></div>
  <div class="bg-glow-right"></div>

  <!-- Left Editorial Column -->
  <div class="left-col">
    <div class="badge-wrap">
      <div class="badge-collection">✦ 2027 CALENDAR COLLECTION ✦</div>
      <div class="badge-edition">官方旗艦限定</div>
    </div>
    
    <div class="title-2027">2027</div>
    <div class="title-rakuten">RAKUTEN GIRLS</div>
    <div class="title-chinese">個人寫真桌曆預購特輯</div>

    <div class="lead-tagline">
      <span>❖</span>
      <span>貝佳頤、Kira 等全系列 27 位女孩專屬典藏・熱烈預購中</span>
    </div>

    <div class="pills-bar">
      <div class="pill-item">雙面寫真翻閱</div>
      <div class="pill-item">厚磅斜立桌曆</div>
      <div class="pill-item">樂天市場限定預購</div>
    </div>

    <div class="action-row">
      <div class="cta-button">
        ${deskCalendarSvg}
        <span>買桌曆</span>
      </div>
      <div class="cta-subtext">
        點擊即刻選購專屬女孩桌曆
      </div>
    </div>

    <div class="roster-summary">
      <span class="dot-live"></span>
      <span>全猿 27 位女孩全員到齊</span>
      <div class="avatar-stack">
        ${stripGirls.map(g => `<img class="stack-img" src="${toBase64(g.localCalendarCover)}" alt="${g.name}">`).join('')}
      </div>
    </div>
  </div>

  <!-- Right Showcase Stage: 貝佳頤 & Kira 雙主視覺 -->
  <div class="right-stage">
    <div class="stage-ground"></div>

    <!-- 1. Left Wing: 貝佳頤 #08 (私服內頁寫真) -->
    <div class="stage-item-left">
      <div class="cropper">
        <img src="${toBase64('photos/calendar_inner_423.jpg')}" alt="貝佳頤 2027 桌曆內頁寫真">
      </div>
      <div class="tag-left">#8 貝佳頤・寫真內頁</div>
    </div>

    <!-- 2. Back Top: Kira #19 (官方封面桌曆) -->
    <div class="stage-item-back">
      <div class="cropper">
        <img src="${toBase64('photos/calendar_339.jpg')}" alt="Kira 2027 官方寫真桌曆">
      </div>
      <div class="tag-back">
        <span>★</span>
        <span>#19 Kira・官方寫真桌曆</span>
      </div>
    </div>

    <!-- 3. Front Main: 貝佳頤 #08 (官方封面桌曆) -->
    <div class="stage-item-front">
      <div class="cropper">
        <img src="${toBase64('photos/calendar_423.jpg')}" alt="貝佳頤 2027 官方寫真桌曆">
      </div>
      <div class="tag-front">
        <span>★</span>
        <span>#8 貝佳頤・官方寫真桌曆</span>
      </div>
    </div>
  </div>
</body>
</html>
`;

const tempHtml = path.resolve('temp_og_calendar_beijiayi_kira.html');
const outPng = path.resolve('public/og-image.png');

fs.writeFileSync(tempHtml, html, 'utf-8');

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const fileUrl = `file:///${tempHtml.replace(/\\/g, '/')}`;
const cmd = `"${edgePath}" --headless --disable-gpu --window-size=1200,630 --screenshot="${outPng}" "${fileUrl}"`;

console.log('Rendering 2027 Calendar OG image (貝佳頤 & Kira) with Edge...');
execSync(cmd, { stdio: 'inherit' });

if (fs.existsSync(outPng)) {
  const stat = fs.statSync(outPng);
  console.log(`Success! OG Image created. Size: ${stat.size} bytes`);
  fs.unlinkSync(tempHtml);
}
