// 傳入 price => number
// withSymbol => bool (需不需要貨幣符號)

export function formatPrice(price, withSymbol = true) {
  if (withSymbol) {
    const formatted = price.toLocaleString("zh-TW", {
      style: "currency",
      currency: "TWD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });

    return formatted.replace("NT$", "NT$ ");
  } else {
    return price.toLocaleString("zh-TW", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
}
