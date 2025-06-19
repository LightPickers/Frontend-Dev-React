import React, { useState } from "react";
import { createPortal } from "react-dom";
import PropTypes from "prop-types";
import ProductFilter from "./ProductFilter";

function MobileFilterButton({ onFilter, initialBrandIds, initialConditionIds }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
    // 如果打開過濾器，防止背景滾動
    if (!isFilterOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  };

  const handleFilter = filters => {
    onFilter(filters);
    setIsFilterOpen(false);
    document.body.style.overflow = "";
  };

  return (
    <>
      {/* 手機版篩選按鈕 - 移除外框 */}
      <button
        className="mobile-filter-button d-flex align-items-center"
        onClick={toggleFilter}
        aria-label="開啟篩選選項"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="4" y1="7" x2="20" y2="7"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
          <line x1="6" y1="17" x2="18" y2="17"></line>
        </svg>
        <span className="ms-2">篩選</span>
      </button>

      {/* 篩選器彈出視窗 */}
      {isFilterOpen &&
        createPortal(
          <div className="mobile-filter-overlay">
            <div className="mobile-filter-container">
              <div className="mobile-filter-header d-flex justify-content-between align-items-center p-3">
                <h5 className="mb-0">商品篩選</h5>
                <button
                  className="btn-close"
                  onClick={toggleFilter}
                  aria-label="關閉篩選視窗"
                ></button>
              </div>
              <div className="mobile-filter-body p-3">
                <ProductFilter
                  onFilter={handleFilter}
                  initialBrandIds={initialBrandIds}
                  initialConditionIds={initialConditionIds}
                  isMobile={true}
                />
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
MobileFilterButton.propTypes = {
  onFilter: PropTypes.func.isRequired,
  initialBrandIds: PropTypes.array,
  initialConditionIds: PropTypes.array,
};

export default MobileFilterButton;
