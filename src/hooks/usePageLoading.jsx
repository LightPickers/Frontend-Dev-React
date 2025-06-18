import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  updateLoadingText,
  hideLoading,
  selectLoading,
  showLoading,
} from "@features/loading/loadingSlice";
import { useMinimumLoadingTime } from "@hooks/useMinimunLoadingTime";

export function usePageLoading({
  isLoading,
  message = "載入中…",
  delay = 800,
  dependencyKey,
  minShowTime = 300, // 最小顯示時間，避免閃爍
}) {
  const dispatch = useDispatch();
  const loadingState = useSelector(selectLoading);
  const shouldShowLoading = useMinimumLoadingTime(isLoading, delay);

  // 儲存計時器 ID
  const hideTimeoutRef = useRef(null);
  const showTimeoutRef = useRef(null);
  // 記錄 loading 開始時間，用於計算最小顯示時間
  const loadingStartTimeRef = useRef(null);

  useEffect(() => {
    // 清除所有計時器
    const clearAllTimeouts = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
        showTimeoutRef.current = null;
      }
    };

    clearAllTimeouts();

    // 情況 1: 需要顯示 loading
    if (shouldShowLoading || (!loadingState && isLoading)) {
      if (!loadingState) {
        // 記錄開始時間
        loadingStartTimeRef.current = Date.now();
        dispatch(showLoading());
      }
      dispatch(updateLoadingText(message));
    }

    // 情況 2: 不需要顯示 loading 但目前有顯示
    else if (!shouldShowLoading && loadingState) {
      const hideLoadingWithMinTime = () => {
        const now = Date.now();
        const elapsed = loadingStartTimeRef.current
          ? now - loadingStartTimeRef.current
          : minShowTime;
        const remainingTime = Math.max(0, minShowTime - elapsed);

        hideTimeoutRef.current = setTimeout(() => {
          dispatch(hideLoading());
          dispatch(updateLoadingText(""));
          loadingStartTimeRef.current = null;
        }, remainingTime);
      };

      // 如果 isLoading 為 false，確保最小顯示時間
      if (!isLoading) {
        hideLoadingWithMinTime();
      } else {
        // 使用原本的 delay
        hideTimeoutRef.current = setTimeout(() => {
          dispatch(hideLoading());
          dispatch(updateLoadingText(""));
          loadingStartTimeRef.current = null;
        }, delay);
      }
    }

    // 情況 3: isLoading 為 false 且沒有 loadingState（避免閃爍）
    else if (!isLoading && !loadingState) {
      // 什麼都不做，避免閃爍
    }

    // Cleanup function
    return clearAllTimeouts;
  }, [
    shouldShowLoading,
    loadingState,
    message,
    delay,
    dispatch,
    dependencyKey,
    isLoading,
    minShowTime,
  ]);

  // 組件卸載時的清理
  useEffect(() => {
    return () => {
      // 清除計時器
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (showTimeoutRef.current) {
        clearTimeout(showTimeoutRef.current);
      }

      // 清理狀態（可選，根據您的需求決定是否需要）
      // dispatch(hideLoading());
      // dispatch(updateLoadingText(""));
    };
  }, [dispatch]);
}

// 進階版本：支援更精細的控制
export function usePageLoadingAdvanced({
  isLoading,
  message = "載入中…",
  delay = 800,
  dependencyKey,
  minShowTime = 300,
  forceShow = false, // 強制顯示 loading
  preventFlicker = true, // 防止閃爍
}) {
  const dispatch = useDispatch();
  const loadingState = useSelector(selectLoading);
  const shouldShowLoading = useMinimumLoadingTime(isLoading, delay);

  const hideTimeoutRef = useRef(null);
  const loadingStartTimeRef = useRef(null);
  const isInitialLoadRef = useRef(true);

  useEffect(() => {
    const clearTimeouts = () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    };

    clearTimeouts();

    // 決定是否應該顯示 loading
    const shouldShow = forceShow || shouldShowLoading || (!loadingState && isLoading);

    // 防止閃爍：如果是初次載入且 isLoading 為 false，不顯示
    if (preventFlicker && isInitialLoadRef.current && !isLoading) {
      isInitialLoadRef.current = false;
      return;
    }

    isInitialLoadRef.current = false;

    if (shouldShow && !loadingState) {
      // 顯示 loading
      loadingStartTimeRef.current = Date.now();
      dispatch(showLoading());
      dispatch(updateLoadingText(message));
    } else if (shouldShow && loadingState) {
      // 更新 loading 文字
      dispatch(updateLoadingText(message));
    } else if (!shouldShow && loadingState) {
      // 隱藏 loading，考慮最小顯示時間
      const now = Date.now();
      const elapsed = loadingStartTimeRef.current ? now - loadingStartTimeRef.current : minShowTime;
      const remainingTime = Math.max(0, minShowTime - elapsed);

      hideTimeoutRef.current = setTimeout(() => {
        dispatch(hideLoading());
        dispatch(updateLoadingText(""));
        loadingStartTimeRef.current = null;
      }, remainingTime);
    }

    return clearTimeouts;
  }, [
    shouldShowLoading,
    loadingState,
    message,
    delay,
    dispatch,
    dependencyKey,
    isLoading,
    minShowTime,
    forceShow,
    preventFlicker,
  ]);

  // 組件卸載清理
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, [dispatch]);
}

// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";

// import {
//   updateLoadingText,
//   hideLoading,
//   selectLoading,
//   showLoading,
// } from "@features/loading/loadingSlice";
// import { useMinimumLoadingTime } from "@/hooks/useMinimunLoadingTime";

// export function usePageLoading({ isLoading, message = "載入中…", delay = 800, dependencyKey }) {
//   const dispatch = useDispatch();
//   const loadingState = useSelector(selectLoading);
//   const shouldShowLoading = useMinimumLoadingTime(isLoading, delay);

//   useEffect(() => {
//     if (!loadingState && shouldShowLoading) {
//       dispatch(showLoading());
//       dispatch(updateLoadingText(message));
//     }
//   }, [loadingState, dispatch, shouldShowLoading, message]);

//   useEffect(() => {
//     const timer = () => {
//       setTimeout(() => {
//         dispatch(hideLoading());
//       }, delay);
//     };

//     if (!isLoading) timer();

//     if (shouldShowLoading) {
//       dispatch(updateLoadingText(message));
//     }

//     if (!shouldShowLoading) {
//       dispatch(updateLoadingText(""));
//       dispatch(hideLoading());
//     }

//     return () => {
//       dispatch(updateLoadingText(""));
//       dispatch(hideLoading());
//     };
//   }, [isLoading, delay, shouldShowLoading, dispatch, message, dependencyKey]);
// }
