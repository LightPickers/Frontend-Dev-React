import React, { useState } from "react";
import PropTypes from "prop-types";

import {
  useGetProductBrandsQuery,
  useGetProductConditionsQuery,
} from "@features/products/productApi";

function ProductFilter({ onFilter }) {
  // 改為陣列來支援多選
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");

  const { data: brandsResponse = {}, isLoading: brandsLoading } = useGetProductBrandsQuery();
  const { data: conditionsResponse = {}, isLoading: conditionsLoading } =
    useGetProductConditionsQuery();

  const brandOptions = React.useMemo(() => {
    return Array.isArray(brandsResponse.data) ? brandsResponse.data : [];
  }, [brandsResponse.data]);

  const statusOptions = React.useMemo(() => {
    return Array.isArray(conditionsResponse.data) ? conditionsResponse.data : [];
  }, [conditionsResponse.data]);

  // 處理品牌選擇
  const handleBrandSelect = brandId => {
    setSelectedBrands(prev => {
      if (prev.includes(brandId)) {
        // 如果已選中，則移除
        return prev.filter(id => id !== brandId);
      } else {
        // 如果未選中，則添加
        return [...prev, brandId];
      }
    });
  };

  // 處理狀態選擇
  const handleStatusSelect = statusId => {
    setSelectedStatuses(prev => {
      if (prev.includes(statusId)) {
        return prev.filter(id => id !== statusId);
      } else {
        return [...prev, statusId];
      }
    });
  };

  // 清除所有品牌選擇
  const clearAllBrands = () => {
    setSelectedBrands([]);
  };

  // 清除所有狀態選擇
  const clearAllStatuses = () => {
    setSelectedStatuses([]);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (minPrice && maxPrice && Number(maxPrice) < Number(minPrice)) {
      setError("上限金額不可小於起始金額");
      return;
    }
    setError("");

    // 找到選中的品牌和狀態名稱
    const selectedBrandNames = selectedBrands
      .map(brandId => brandOptions.find(b => b.id === brandId)?.name)
      .filter(Boolean);

    const selectedStatusNames = selectedStatuses
      .map(statusId => statusOptions.find(s => s.id === statusId)?.name)
      .filter(Boolean);

    console.log("Selected brand names:", selectedBrandNames);
    console.log("Selected status names:", selectedStatusNames);

    onFilter({
      brands: selectedBrandNames,
      statuses: selectedStatusNames,
      minPrice: minPrice ? Number(minPrice) : null,
      maxPrice: maxPrice ? Number(maxPrice) : null,
    });
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

  // 生成顯示文字
  const getBrandDisplayText = () => {
    if (selectedBrands.length === 0) return "所有品牌";

    // 顯示已選擇的品牌名稱
    const selectedBrandNames = selectedBrands
      .map(brandId => brandOptions.find(b => b.id === brandId)?.name)
      .filter(Boolean);

    return (
      <div className="d-flex flex-wrap gap-1">
        {selectedBrandNames.map((name, index) => (
          <span key={index} className="selected-tag">
            {name}
          </span>
        ))}
      </div>
    );
  };

  const getStatusDisplayText = () => {
    if (selectedStatuses.length === 0) return "所有狀態";

    // 顯示已選擇的狀態名稱
    const selectedStatusNames = selectedStatuses
      .map(statusId => statusOptions.find(s => s.id === statusId)?.name)
      .filter(Boolean);

    return (
      <div className="d-flex flex-wrap gap-1">
        {selectedStatusNames.map((name, index) => (
          <span key={index} className="selected-tag">
            {name}
          </span>
        ))}
      </div>
    );
  };

  const handleDropdownClick = e => {
    e.stopPropagation();
  };

  return (
    <form className="product-filter mb-4" onSubmit={handleSubmit}>
      <div className="row">
        {/* 品牌多選下拉選單 */}
        <div className="col-md-3">
          <label htmlFor="brand" className="form-label">
            品牌
          </label>
          <div className="dropdown">
            <button
              className="btn w-100 custom-dropdown-button"
              type="button"
              id="brandDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-bs-auto-close="false"
            >
              {getBrandDisplayText()}
            </button>
            <ul
              className="dropdown-menu custom-dropdown-menu w-100"
              aria-labelledby="brandDropdown"
              onClick={handleDropdownClick}
            >
              <li className="dropdown-item py-1 px-2" onClick={clearAllBrands}>
                <strong>清除所有選擇</strong>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              {brandOptions.map(brandOption => (
                <li
                  key={brandOption.id}
                  className={`dropdown-item py-1 px-2 ${selectedBrands.includes(brandOption.id) ? "selected" : ""}`}
                  onClick={e => {
                    e.stopPropagation();
                    handleBrandSelect(brandOption.id);
                  }}
                >
                  {brandOption.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 狀態多選下拉選單 */}
        <div className="col-md-3">
          <label htmlFor="status" className="form-label">
            商品狀態
          </label>
          <div className="dropdown">
            <button
              className="btn w-100 custom-dropdown-button"
              type="button"
              id="statusDropdown"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              data-bs-auto-close="false"
            >
              {getStatusDisplayText()}
            </button>
            <ul
              className="dropdown-menu custom-dropdown-menu w-100"
              aria-labelledby="statusDropdown"
              onClick={handleDropdownClick}
            >
              <li className="dropdown-item py-1 px-2" onClick={clearAllStatuses}>
                <strong>清除所有選擇</strong>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              {statusOptions.map(statusOption => (
                <li
                  key={statusOption.id}
                  className={`dropdown-item py-1 px-2 ${selectedStatuses.includes(statusOption.id) ? "selected" : ""}`}
                  onClick={e => {
                    e.stopPropagation();
                    handleStatusSelect(statusOption.id);
                  }}
                >
                  {statusOption.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 金額範圍 */}
        <div className="col-md-3">
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
        <div className="col-md-2 d-flex align-items-end">
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
};

export default ProductFilter;
