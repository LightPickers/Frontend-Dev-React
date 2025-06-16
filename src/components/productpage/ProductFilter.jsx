import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

import {
  useGetProductBrandsQuery,
  useGetProductConditionsQuery,
} from "@features/products/productApi";

function ProductFilter({ onFilter, initialBrandId, initialConditionId }) {
  // 改為陣列來支援多選
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");

  // 控制下拉選單顯示狀態
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);

  // 建立 refs 來追蹤下拉選單元素
  const brandDropdownRef = useRef(null);
  const statusDropdownRef = useRef(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = event => {
      // 檢查品牌下拉選單
      if (brandDropdownRef.current && !brandDropdownRef.current.contains(event.target)) {
        setShowBrandDropdown(false);
      }

      // 檢查狀態下拉選單
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target)) {
        setShowStatusDropdown(false);
      }
    };

    // 添加事件監聽器
    document.addEventListener("mousedown", handleClickOutside);

    // 清理函數，移除事件監聽器
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 關閉其他下拉選單的函數
  const closeOtherDropdowns = excludeDropdown => {
    if (excludeDropdown !== "brand") {
      setShowBrandDropdown(false);
    }
    if (excludeDropdown !== "status") {
      setShowStatusDropdown(false);
    }
  };

  // ...existing API calls and data processing...

  const {
    data: brandsResponse = {},
    isLoading: brandsLoading,
    error: brandsError,
    isSuccess: brandsSuccess,
  } = useGetProductBrandsQuery();

  const {
    data: conditionsResponse = {},
    isLoading: conditionsLoading,
    error: conditionsError,
    isSuccess: conditionsSuccess,
  } = useGetProductConditionsQuery();

  const brandOptions = React.useMemo(() => {
    console.log("Processing brand options:", brandsResponse);

    if (brandsResponse?.data && Array.isArray(brandsResponse.data)) {
      console.log("Found brands in data field:", brandsResponse.data);
      return brandsResponse.data;
    }
    if (Array.isArray(brandsResponse)) {
      console.log("Brands response is direct array:", brandsResponse);
      return brandsResponse;
    }
    if (brandsResponse?.brands && Array.isArray(brandsResponse.brands)) {
      console.log("Found brands in brands field:", brandsResponse.brands);
      return brandsResponse.brands;
    }

    console.log("No valid brand data found, returning empty array");
    return [];
  }, [brandsResponse]);

  const statusOptions = React.useMemo(() => {
    console.log("Processing status options:", conditionsResponse);

    if (conditionsResponse?.data && Array.isArray(conditionsResponse.data)) {
      console.log("Found conditions in data field:", conditionsResponse.data);
      return conditionsResponse.data;
    }
    if (Array.isArray(conditionsResponse)) {
      console.log("Conditions response is direct array:", conditionsResponse);
      return conditionsResponse;
    }
    if (conditionsResponse?.conditions && Array.isArray(conditionsResponse.conditions)) {
      console.log("Found conditions in conditions field:", conditionsResponse.conditions);
      return conditionsResponse.conditions;
    }

    console.log("No valid condition data found, returning empty array");
    return [];
  }, [conditionsResponse]);

  // 根據初始參數設定選擇狀態
  useEffect(() => {
    if (initialBrandId && brandOptions.length > 0) {
      console.log("Setting initial brand:", initialBrandId);
      const brandExists = brandOptions.some(brand => brand.id === initialBrandId);
      if (brandExists && !selectedBrands.includes(initialBrandId)) {
        setSelectedBrands([initialBrandId]);
      }
    }
  }, [initialBrandId, brandOptions]);

  useEffect(() => {
    if (initialConditionId && statusOptions.length > 0) {
      console.log("Setting initial condition:", initialConditionId);
      const conditionExists = statusOptions.some(condition => condition.id === initialConditionId);
      if (conditionExists && !selectedStatuses.includes(initialConditionId)) {
        setSelectedStatuses([initialConditionId]);
      }
    }
  }, [initialConditionId, statusOptions]);

  // 處理品牌下拉選單切換
  const handleBrandDropdownToggle = () => {
    closeOtherDropdowns("brand");
    setShowBrandDropdown(!showBrandDropdown);
  };

  // 處理狀態下拉選單切換
  const handleStatusDropdownToggle = () => {
    closeOtherDropdowns("status");
    setShowStatusDropdown(!showStatusDropdown);
  };

  // 處理品牌選擇
  const handleBrandSelect = brandId => {
    console.log("Brand selected:", brandId);
    setSelectedBrands(prev => {
      const newSelected = prev.includes(brandId)
        ? prev.filter(id => id !== brandId)
        : [...prev, brandId];

      setTimeout(() => {
        triggerFilter(newSelected, selectedStatuses);
      }, 0);

      return newSelected;
    });
  };

  // 處理狀態選擇
  const handleStatusSelect = statusId => {
    console.log("Status selected:", statusId);
    setSelectedStatuses(prev => {
      const newSelected = prev.includes(statusId)
        ? prev.filter(id => id !== statusId)
        : [...prev, statusId];

      setTimeout(() => {
        triggerFilter(selectedBrands, newSelected);
      }, 0);

      return newSelected;
    });
  };

  // 觸發篩選的輔助函數
  const triggerFilter = (brands, statuses) => {
    const selectedBrandIds = brands;
    const selectedStatusIds = statuses;

    console.log("Triggering filter with:", {
      brandIds: selectedBrandIds,
      statusIds: selectedStatusIds,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });

    onFilter({
      brandIds: selectedBrandIds,
      statusIds: selectedStatusIds,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });
  };

  // 清除所有品牌選擇
  const clearAllBrands = () => {
    setSelectedBrands([]);
    setTimeout(() => {
      triggerFilter([], selectedStatuses);
    }, 0);
  };

  // 清除所有狀態選擇
  const clearAllStatuses = () => {
    setSelectedStatuses([]);
    setTimeout(() => {
      triggerFilter(selectedBrands, []);
    }, 0);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (minPrice && maxPrice && Number(maxPrice) < Number(minPrice)) {
      setError("上限金額不可小於起始金額");
      return;
    }
    setError("");

    triggerFilter(selectedBrands, selectedStatuses);
  };

  const handleMinPriceChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMinPrice(value);
    }
  };

  const handleMaxPriceChange = e => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMaxPrice(value);
    }
  };

  // 生成品牌顯示文字 - 支援響應式顯示
  const getBrandDisplayText = () => {
    if (selectedBrands.length === 0) {
      return (
        <div className="button-content">
          <span className="placeholder-text">所有品牌</span>
        </div>
      );
    }

    const selectedBrandNames = selectedBrands
      .map(brandId => {
        const brand = brandOptions.find(b => b.id === brandId);
        return brand?.name;
      })
      .filter(Boolean);

    if (selectedBrandNames.length === 0) {
      return (
        <div className="button-content">
          <span className="placeholder-text">所有品牌</span>
        </div>
      );
    }

    // 根據選擇數量決定顯示方式
    const maxDisplayCount = 3; // 最多顯示3個標籤

    if (selectedBrandNames.length <= maxDisplayCount) {
      return (
        <div className="button-content">
          <div className="selected-tags-container">
            {selectedBrandNames.map((name, index) => (
              <span key={index} className="selected-tag">
                {name}
              </span>
            ))}
          </div>
        </div>
      );
    } else {
      // 顯示前2個標籤加上數量指示器
      const displayNames = selectedBrandNames.slice(0, 2);
      const remainingCount = selectedBrandNames.length - 2;

      return (
        <div className="button-content">
          <div className="selected-tags-container">
            {displayNames.map((name, index) => (
              <span key={index} className="selected-tag">
                {name}
              </span>
            ))}
            <span className="more-indicator">+{remainingCount}</span>
          </div>
        </div>
      );
    }
  };

  // 生成狀態顯示文字 - 同樣邏輯
  const getStatusDisplayText = () => {
    if (selectedStatuses.length === 0) {
      return (
        <div className="button-content">
          <span className="placeholder-text">所有狀態</span>
        </div>
      );
    }

    const selectedStatusNames = selectedStatuses
      .map(statusId => {
        const status = statusOptions.find(s => s.id === statusId);
        return status?.name;
      })
      .filter(Boolean);

    if (selectedStatusNames.length === 0) {
      return (
        <div className="button-content">
          <span className="placeholder-text">所有狀態</span>
        </div>
      );
    }

    const maxDisplayCount = 3;

    if (selectedStatusNames.length <= maxDisplayCount) {
      return (
        <div className="button-content">
          <div className="selected-tags-container">
            {selectedStatusNames.map((name, index) => (
              <span key={index} className="selected-tag">
                {name}
              </span>
            ))}
          </div>
        </div>
      );
    } else {
      const displayNames = selectedStatusNames.slice(0, 2);
      const remainingCount = selectedStatusNames.length - 2;

      return (
        <div className="button-content">
          <div className="selected-tags-container">
            {displayNames.map((name, index) => (
              <span key={index} className="selected-tag">
                {name}
              </span>
            ))}
            <span className="more-indicator">+{remainingCount}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <form className="product-filter mb-4" onSubmit={handleSubmit}>
      <div className="row g-3">
        {/* 品牌多選下拉選單 */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="brand" className="form-label">
            品牌
          </label>
          <div className="custom-dropdown" ref={brandDropdownRef}>
            <button
              className="btn w-100 custom-dropdown-button"
              type="button"
              onClick={handleBrandDropdownToggle}
            >
              {getBrandDisplayText()}
              <i
                className={`fas fa-chevron-${showBrandDropdown ? "up" : "down"} dropdown-arrow`}
              ></i>
            </button>
            {showBrandDropdown && (
              <div className="custom-dropdown-menu show">
                <div
                  className="dropdown-item py-2 px-3 border-bottom"
                  onClick={clearAllBrands}
                  style={{ cursor: "pointer" }}
                >
                  <strong>清除所有選擇</strong>
                </div>
                {brandOptions.length === 0 ? (
                  <div className="dropdown-item py-2 px-3 text-muted">
                    <em>沒有可用的品牌選項</em>
                  </div>
                ) : (
                  brandOptions.map(brandOption => (
                    <div
                      key={brandOption.id}
                      className={`dropdown-item ${selectedBrands.includes(brandOption.id) ? "selected" : ""}`}
                      onClick={() => handleBrandSelect(brandOption.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {selectedBrands.includes(brandOption.id) ? (
                        <span>{brandOption.name}</span>
                      ) : (
                        brandOption.name
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* 狀態多選下拉選單 */}
        <div className="col-12 col-md-6 col-lg-3">
          <label htmlFor="status" className="form-label">
            商品狀態
          </label>
          <div className="custom-dropdown" ref={statusDropdownRef}>
            <button
              className="btn w-100 custom-dropdown-button"
              type="button"
              onClick={handleStatusDropdownToggle}
            >
              {getStatusDisplayText()}
              <i
                className={`fas fa-chevron-${showStatusDropdown ? "up" : "down"} dropdown-arrow`}
              ></i>
            </button>
            {showStatusDropdown && (
              <div className="custom-dropdown-menu show">
                <div
                  className="dropdown-item py-2 px-3 border-bottom"
                  onClick={clearAllStatuses}
                  style={{ cursor: "pointer" }}
                >
                  <strong>清除所有選擇</strong>
                </div>
                {statusOptions.length === 0 ? (
                  <div className="dropdown-item py-2 px-3 text-muted">
                    <em>沒有可用的狀態選項</em>
                  </div>
                ) : (
                  statusOptions.map(statusOption => (
                    <div
                      key={statusOption.id}
                      className={`dropdown-item ${selectedStatuses.includes(statusOption.id) ? "selected" : ""}`}
                      onClick={() => handleStatusSelect(statusOption.id)}
                      style={{ cursor: "pointer" }}
                    >
                      {selectedStatuses.includes(statusOption.id) ? (
                        <span>{statusOption.name}</span>
                      ) : (
                        statusOption.name
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>

        {/* 金額範圍 */}
        <div className="col-12 col-md-8 col-lg-4">
          <label className="form-label">金額</label>
          <div className="d-flex align-items-center">
            <input
              type="text"
              id="minPrice"
              className="form-control"
              placeholder="起始金額"
              value={minPrice}
              onChange={handleMinPriceChange}
            />
            <span className="mx-2">—</span>
            <input
              type="text"
              id="maxPrice"
              className="form-control"
              placeholder="上限金額"
              value={maxPrice}
              onChange={handleMaxPriceChange}
            />
          </div>
          {error && <div className="text-danger mt-1">{error}</div>}
        </div>

        {/* 搜尋按鈕 */}
        <div className="col-12 col-md-4 col-lg-2 d-flex align-items-end">
          <button type="submit" className="btn btn-search w-100">
            搜尋
          </button>
        </div>
      </div>
    </form>
  );
}

ProductFilter.propTypes = {
  onFilter: PropTypes.func.isRequired,
  initialBrandId: PropTypes.string,
  initialConditionId: PropTypes.string,
};

export default ProductFilter;
