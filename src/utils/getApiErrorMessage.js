// 傳入收到 error、自定義預設錯誤訊息
export function getApiErrorMessage(error, fallbackMessage = "發生錯誤，請稍後再試") {
  const data = error?.data;
  if (!data) return fallbackMessage;

  if (typeof data.message === "object" && data.message !== null) {
    const messages = Object.values(data.message);
    if (messages.length > 0) return messages.join("；");
  }

  if (typeof data.message === "string") return data.message;

  return fallbackMessage;
}
