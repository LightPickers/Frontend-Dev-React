import { useLayoutEffect } from "react";

const useBodyScrollLock = (isLocked = true) => {
  useLayoutEffect(() => {
    if (!isLocked) return;

    // 記錄原始滾動位置和樣式
    const originalScrollY = window.scrollY;
    const originalOverflow = document.body.style.overflow;
    const originalPosition = document.body.style.position;
    const originalTop = document.body.style.top;
    const originalWidth = document.body.style.width;

    // 鎖定滾動
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.top = `-${originalScrollY}px`;
    document.body.style.width = "100%";

    // 清理函數：恢復原始狀態
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.position = originalPosition;
      document.body.style.top = originalTop;
      document.body.style.width = originalWidth;

      // 恢復滾動位置
      // window.scrollTo(0, originalScrollY);

      window.scrollTo({
        top: originalScrollY,
        left: 0,
        behavior: "instant", // 瞬間滾動，無動畫
      });
    };
  }, [isLocked]);
};

export default useBodyScrollLock;
