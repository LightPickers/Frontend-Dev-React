const APP_BASE = import.meta.env.VITE_APP_BASE;
const IMAGE_BASE = `${APP_BASE}homepage/features`;

export const WHY_US_REASONS = [
  {
    id: "why_us_reason_01",
    title: "貨源可信，杜絕詐騙",
    description: "賣家申請審核通過後，拾光堂堅決親自收貨，杜絕一切詐騙可能性。",
    images: { image_lg: `${IMAGE_BASE}/feature-1.png`, image_sm: `${IMAGE_BASE}/feature-1-sm.png` },
  },
  {
    id: "why_us_reason_02",
    title: "機況透明，眼見為憑",
    description:
      "任何商品都會依新舊程度分類，您不只可以在頁面看見詳盡的機況描述，也歡迎親自到店查看。",
    images: { image_lg: `${IMAGE_BASE}/feature-2.png`, image_sm: `${IMAGE_BASE}/feature-2-sm.png` },
  },
  {
    id: "why_us_reason_03",
    title: "分期付款，減輕負擔",
    description: "凡下單 3,000 元以上，您便享有最高 6 個月的 0 利率分期，減輕您的買機負擔。",
    images: { image_lg: `${IMAGE_BASE}/feature-3.png`, image_sm: `${IMAGE_BASE}/feature-3-sm.png` },
  },
  {
    id: "why_us_reason_04",
    title: "半年保固，終生服務",
    description:
      "只要是從拾光堂下單的商品，無論新舊，都享有半年的保固期，有任何疑難雜症都歡迎聯絡我們詢問。",
    images: { image_lg: `${IMAGE_BASE}/feature-4.png`, image_sm: `${IMAGE_BASE}/feature-4-sm.png` },
  },
];
