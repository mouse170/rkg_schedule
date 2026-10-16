import React from 'react';

interface DeskCalendarIconProps {
  className?: string;
  size?: number;
}

/**
 * 依據 Stitch Design 與 Stitch Design Taste 規範設計之立體可愛桌曆向量圖示
 * 具備三角斜立桌上型支架（A-frame Easel）、雙圈金屬裝訂線圈與內嵌心形日程標記
 */
export const DeskCalendarIcon: React.FC<DeskCalendarIconProps> = ({
  className = 'w-4 h-4',
  size = 16,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    {/* 三角立架背板與底座（A-Frame Desk Stand） */}
    <path
      d="M3.5 20L6.2 7H17.8L20.5 20"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 20H22"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />

    {/* 桌曆內頁卡片（Calendar Sheet） */}
    <rect
      x="5.5"
      y="7"
      width="13"
      height="12"
      rx="1.5"
      fill="currentColor"
      fillOpacity="0.18"
      stroke="currentColor"
      strokeWidth="1.6"
    />

    {/* 標題分界線（Header Divider） */}
    <path
      d="M5.5 10.8H18.5"
      stroke="currentColor"
      strokeWidth="1.5"
    />

    {/* 上方裝訂螺旋線圈（Spiral Binding Rings） */}
    <line x1="8" y1="5.2" x2="8" y2="7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="12" y1="5.2" x2="12" y2="7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <line x1="16" y1="5.2" x2="16" y2="7.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />

    {/* 日期格子愛心小亮點（Cute Heart Date Pin） */}
    <path
      d="M12 16.3L10.9 15.2C9.8 14.1 9.4 13.6 9.4 12.9C9.4 12.2 10 11.6 10.7 11.6C11.1 11.6 11.7 11.9 12 12.3C12.3 11.9 12.9 11.6 13.3 11.6C14 11.6 14.6 12.2 14.6 12.9C14.6 13.6 14.2 14.1 13.1 15.2L12 16.3Z"
      fill="currentColor"
    />
  </svg>
);
