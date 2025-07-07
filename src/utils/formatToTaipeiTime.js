/**
 * 將 UTC 時間字串轉換為台北時間格式化字串
 * @param {string} utcString - UTC 時間字串（例如：2025-07-06T07:42:14.480Z）
 * @param {Intl.DateTimeFormatOptions} [options] - 可選的格式化設定，覆蓋預設設定
 * @returns {string} - 格式化後的台北時間字串
 */
export function formatToTaipeiTime(utcString, options = {}) {
  if (!utcString) return;
  const date = new Date(utcString);

  const defaultOptions = {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 預設使用 24 小時制
    ...options,
  };

  return new Intl.DateTimeFormat("zh-TW", defaultOptions).format(date);
}

export function formatToTaipeiDate(utcString) {
  return formatToTaipeiTime(utcString, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: undefined,
    minute: undefined,
    second: undefined,
  });
}
