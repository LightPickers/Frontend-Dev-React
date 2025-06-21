import { useState, useEffect } from "react";

/**
 * 確保最小載入時間的 Hook
 * @param {boolean} isLoading - API 或其他異步操作的載入狀態
 * @param {number} minTime - 最小載入時間（毫秒），預設 500ms
 * @returns {boolean} 是否應該顯示載入畫面
 */
export function useMinimumLoadingTime(isLoading, minTime = 500) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minTime);

    return () => clearTimeout(timer);
  }, [minTime]); // 只在組件掛載時執行一次

  // 當 API 載入完成且最小時間已過，才停止顯示載入畫面
  return isLoading || !minTimeElapsed;
}

// // v2
// export function useMinimumLoadingTime(isLoading, minTime = 500) {
//   const [minTimeElapsed, setMinTimeElapsed] = useState(false);

//   useEffect(() => {
//     let timer;

//     if (isLoading) {
//       setMinTimeElapsed(false); // 重設
//       timer = setTimeout(() => {
//         setMinTimeElapsed(true);
//       }, minTime);
//     } else {
//       setMinTimeElapsed(false); // 若 loading 停止也重設狀態
//     }

//     return () => clearTimeout(timer);
//   }, [isLoading, minTime]);

//   return isLoading && !minTimeElapsed;
// }

// // v3
// export function useMinimumLoadingTime(isLoading, minTime = 500) {
//   const [minTimeElapsed, setMinTimeElapsed] = useState(false);

//   useEffect(() => {
//     if (isLoading) {
//       setMinTimeElapsed(false); // reset
//       const timer = setTimeout(() => setMinTimeElapsed(true), minTime);
//       return () => clearTimeout(timer);
//     } else {
//       setMinTimeElapsed(false); // loading 已完成，結束 timer
//     }
//   }, [isLoading, minTime]);

//   return isLoading && !minTimeElapsed;
// }

/**
 * 更進階的版本 - 支援數據依賴
 * @param {boolean} isLoading - API 載入狀態
 * @param {any} data - 載入的數據
 * @param {number} minTime - 最小載入時間
 * @returns {boolean} 是否應該顯示載入畫面
 */
export function useMinimumLoadingTimeWithData(isLoading, data, minTime = 500) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [renderReady, setRenderReady] = useState(false);

  // 最小時間控制
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minTime);

    return () => clearTimeout(timer);
  }, [minTime]);

  // 數據載入完成後的渲染準備
  useEffect(() => {
    if (!isLoading && data && minTimeElapsed) {
      // 使用 requestAnimationFrame 確保下一個渲染週期
      const frame = requestAnimationFrame(() => {
        setRenderReady(true);
      });

      return () => cancelAnimationFrame(frame);
    } else if (isLoading) {
      setRenderReady(false);
    }
  }, [isLoading, data, minTimeElapsed]);

  return !renderReady;
}

/**
 * 最靈活的版本 - 支援自定義條件
 * @param {Object} options - 配置選項
 * @param {boolean} options.isLoading - 載入狀態
 * @param {any} options.data - 數據
 * @param {number} options.minTime - 最小載入時間
 * @param {Function} options.readyCondition - 自定義準備條件函數
 * @returns {boolean} 是否應該顯示載入畫面
 */
export function useAdvancedLoadingState({
  isLoading = false,
  data = null,
  minTime = 500,
  readyCondition = data => !!data,
}) {
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const [isReady, setIsReady] = useState(false);

  // 最小時間控制
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, minTime);

    return () => clearTimeout(timer);
  }, [minTime]);

  // 準備狀態檢查
  useEffect(() => {
    if (!isLoading && minTimeElapsed && readyCondition(data)) {
      const timer = setTimeout(() => {
        setIsReady(true);
      }, 50); // 小延遲確保渲染完成

      return () => clearTimeout(timer);
    } else if (isLoading) {
      setIsReady(false);
    }
  }, [isLoading, data, minTimeElapsed, readyCondition]);

  return {
    shouldShowLoading: !isReady,
    minTimeElapsed,
    isReady,
  };
}
