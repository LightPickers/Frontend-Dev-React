import { useState, useCallback, useEffect, useRef } from "react";

/**
 * 自定義 Hook 用於管理 dropdown 的位置和顯示狀態
 * @param {Object} options - 配置選項
 * @param {number} options.offset - dropdown 與觸發元素的距離，默認 8px
 * @param {number} options.boundary - 與視窗邊界的安全距離，默認 20px
 * @param {boolean} options.autoUpdate - 是否自動監聽視窗變化，默認 true
 * @param {string} options.placement - 預設位置 'bottom' | 'top' | 'left' | 'right'，默認 'bottom'
 * @param {string} options.alignment - 對齊方式 'start' | 'center' | 'end'，默認 'start'
 * @returns {Object} dropdown 相關的狀態和方法
 */
export const useDropdownPosition = (options = {}) => {
  const {
    offset = 8,
    boundary = 20,
    autoUpdate = true,
    placement = "bottom",
    alignment = "start",
  } = options;

  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);
  const updateTimeoutRef = useRef(null);

  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({});

  /**
   * 計算 dropdown 的最佳位置
   */
  const calculatePosition = useCallback(() => {
    if (!triggerRef.current || !dropdownRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const dropdownRect = dropdownRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let newPosition = {};
    let finalPlacement = placement;
    let finalAlignment = alignment;

    // 檢查垂直空間並決定最終位置
    const spaceBelow = viewport.height - triggerRect.bottom;
    const spaceAbove = triggerRect.top;
    const spaceLeft = triggerRect.left;
    const spaceRight = viewport.width - triggerRect.right;

    // 垂直位置邏輯
    if (placement === "bottom" || placement === "top") {
      if (placement === "bottom") {
        // 檢查下方是否有足夠空間
        if (
          spaceBelow < dropdownRect.height + boundary &&
          spaceAbove > dropdownRect.height + boundary
        ) {
          finalPlacement = "top";
        }
      } else if (placement === "top") {
        // 檢查上方是否有足夠空間
        if (
          spaceAbove < dropdownRect.height + boundary &&
          spaceBelow > dropdownRect.height + boundary
        ) {
          finalPlacement = "bottom";
        }
      }

      // 設置垂直位置
      if (finalPlacement === "bottom") {
        newPosition.top = triggerRect.bottom + offset;
        newPosition.bottom = "auto";
      } else {
        newPosition.bottom = viewport.height - triggerRect.top + offset;
        newPosition.top = "auto";
      }

      // 水平對齊
      if (alignment === "start") {
        newPosition.left = triggerRect.left;
        newPosition.right = "auto";

        // 檢查右邊界溢出
        if (triggerRect.left + dropdownRect.width > viewport.width - boundary) {
          finalAlignment = "end";
          newPosition.right = viewport.width - triggerRect.right;
          newPosition.left = "auto";
        }
      } else if (alignment === "end") {
        newPosition.right = viewport.width - triggerRect.right;
        newPosition.left = "auto";

        // 檢查左邊界溢出
        if (triggerRect.right - dropdownRect.width < boundary) {
          finalAlignment = "start";
          newPosition.left = triggerRect.left;
          newPosition.right = "auto";
        }
      } else if (alignment === "center") {
        const centerLeft = triggerRect.left + (triggerRect.width - dropdownRect.width) / 2;

        if (centerLeft < boundary) {
          // 太靠左，改為左對齊
          newPosition.left = boundary;
          newPosition.right = "auto";
        } else if (centerLeft + dropdownRect.width > viewport.width - boundary) {
          // 太靠右，改為右對齊
          newPosition.right = boundary;
          newPosition.left = "auto";
        } else {
          newPosition.left = centerLeft;
          newPosition.right = "auto";
        }
      }
    }

    // 水平位置邏輯 (left/right placement)
    else if (placement === "left" || placement === "right") {
      if (placement === "right") {
        if (
          spaceRight < dropdownRect.width + boundary &&
          spaceLeft > dropdownRect.width + boundary
        ) {
          finalPlacement = "left";
        }
      } else if (placement === "left") {
        if (
          spaceLeft < dropdownRect.width + boundary &&
          spaceRight > dropdownRect.width + boundary
        ) {
          finalPlacement = "right";
        }
      }

      // 設置水平位置
      if (finalPlacement === "right") {
        newPosition.left = triggerRect.right + offset;
        newPosition.right = "auto";
      } else {
        newPosition.right = viewport.width - triggerRect.left + offset;
        newPosition.left = "auto";
      }

      // 垂直對齊
      if (alignment === "start") {
        newPosition.top = triggerRect.top;
        newPosition.bottom = "auto";

        if (triggerRect.top + dropdownRect.height > viewport.height - boundary) {
          finalAlignment = "end";
          newPosition.bottom = viewport.height - triggerRect.bottom;
          newPosition.top = "auto";
        }
      } else if (alignment === "end") {
        newPosition.bottom = viewport.height - triggerRect.bottom;
        newPosition.top = "auto";

        if (triggerRect.bottom - dropdownRect.height < boundary) {
          finalAlignment = "start";
          newPosition.top = triggerRect.top;
          newPosition.bottom = "auto";
        }
      } else if (alignment === "center") {
        const centerTop = triggerRect.top + (triggerRect.height - dropdownRect.height) / 2;

        if (centerTop < boundary) {
          newPosition.top = boundary;
          newPosition.bottom = "auto";
        } else if (centerTop + dropdownRect.height > viewport.height - boundary) {
          newPosition.bottom = boundary;
          newPosition.top = "auto";
        } else {
          newPosition.top = centerTop;
          newPosition.bottom = "auto";
        }
      }
    }

    // 添加 z-index 和基本樣式
    newPosition.position = "fixed";
    newPosition.zIndex = 1050;

    setPosition(newPosition);
  }, [offset, boundary, placement, alignment]);

  /**
   * 延遲更新位置，避免頻繁計算
   */
  const scheduleUpdate = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(calculatePosition, 0);
  }, [calculatePosition]);

  /**
   * 打開 dropdown
   */
  const open = useCallback(() => {
    setIsOpen(true);
  }, []);

  /**
   * 關閉 dropdown
   */
  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * 切換 dropdown 狀態
   */
  const toggle = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  // 監聽 dropdown 開啟狀態和自動更新設置
  useEffect(() => {
    if (isOpen && autoUpdate) {
      // 初始計算
      scheduleUpdate();

      // 監聽視窗變化
      const handleResize = () => scheduleUpdate();
      const handleScroll = () => scheduleUpdate();

      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);

      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
        if (updateTimeoutRef.current) {
          clearTimeout(updateTimeoutRef.current);
        }
      };
    }
  }, [isOpen, autoUpdate, scheduleUpdate]);

  // 手動更新位置
  const updatePosition = useCallback(() => {
    if (isOpen) {
      scheduleUpdate();
    }
  }, [isOpen, scheduleUpdate]);

  return {
    // refs
    triggerRef,
    dropdownRef,

    // 狀態
    isOpen,
    position,

    // 方法
    open,
    close,
    toggle,
    updatePosition,
  };
};
