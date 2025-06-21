import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { bool, func, string } from "prop-types";
import classNames from "classnames";
import { Link } from "react-router-dom";

import useBodyScrollLock from "@hooks/useBodyScrollLock";
import { CloseIcon } from "@/components/icons";

const SlidingMobileModal = ({ isMenuOpen, closeMenu, path }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // 使用自訂 Hook 鎖定背景滾動
  useBodyScrollLock(isMenuOpen);

  // 處理動畫狀態
  useEffect(() => {
    if (isMenuOpen) {
      setIsVisible(true);
      // 短暫延遲後觸發動畫
      const timer = setTimeout(() => {
        setIsAnimating(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      // 等待動畫完成後隱藏元素
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 300); // 與 CSS transition 時間匹配
      return () => clearTimeout(timer);
    }
  }, [isMenuOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(closeMenu, 300);
  }, [closeMenu]);

  // ESC 鍵關閉功能
  useEffect(() => {
    const handleEscKey = event => {
      if (event.key === "Escape") handleClose();
    };

    if (isMenuOpen) document.addEventListener("keydown", handleEscKey);

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen, handleClose]);

  if (!isVisible) return null;

  return createPortal(
    <div
      className={classNames("mobile-modal-overlay", {
        active: isAnimating,
        // "pointer-events-none": !isMenuOpen,
      })}
      // onClick={closeMenu}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={classNames("mobile-modal-container", {
          "slide-in": isAnimating,
        })}
        onClick={e => e.stopPropagation()}
      >
        {/* modal-header */}
        <div className="mobile-modal-header">
          <Link className="navbar-brand" to="/" onClick={handleClose}>
            <img src={`${path}Logo.svg`} alt="拾光堂 logo" />
          </Link>
          <button className="btn btn-link p-0 text-gray-500" type="button" onClick={handleClose}>
            <CloseIcon size={48} strokeWidth={1.5} />
          </button>
        </div>
        <div className="mobile-modal-body"></div>
      </div>
    </div>,
    document.body
  );
};

SlidingMobileModal.propTypes = {
  isMenuOpen: bool.isRequired,
  closeMenu: func.isRequired,
  path: string.isRequired,
};

export default SlidingMobileModal;
