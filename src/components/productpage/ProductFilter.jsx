import React, { useState } from "react";
import PropTypes from "prop-types";

const brandOptions = [
  { id: 1, value: "測試Fuji", name: "Fuji" },
  { id: 2, value: "測試Canon", name: "Canon" },
  { id: 3, value: "測試Sony", name: "Sony" },
];

const statusOptions = [
  { id: 1, value: "測試九成新", name: "九成新" },
  { id: 2, value: "測試極佳", name: "極佳" },
  { id: 3, value: "測試堪用", name: "堪用" },
  { id: 4, value: "測試良好", name: "良好" },
];

function ProductFilter({ onFilter }) {
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (Number(maxPrice) < Number(minPrice)) {
      setError("上限金額不可小於起始金額");
      return;
    }
    setError("");
    onFilter({ brand, status, minPrice: Number(minPrice), maxPrice: Number(maxPrice) });
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

  return (
    <form className="product-filter mb-4" onSubmit={handleSubmit}>
      <div className="row">
        {/* 品牌下拉選單 */}
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
            >
              {brand ? brandOptions.find(b => b.value === brand)?.name || "選擇品牌" : "所有品牌"}
            </button>
            <ul
              className="dropdown-menu custom-dropdown-menu w-100"
              aria-labelledby="brandDropdown"
            >
              <li className="dropdown-item py-1 px-2" onClick={() => setBrand("")}>
                所有品牌
              </li>
              {brandOptions.map(brand => (
                <li
                  key={brand.id}
                  className="dropdown-item py-1 px-2"
                  onClick={() => setBrand(brand.value)}
                >
                  {brand.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

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
            >
              {status
                ? statusOptions.find(s => s.value === status)?.name || "選擇狀態"
                : "所有狀態"}
            </button>
            <ul
              className="dropdown-menu custom-dropdown-menu w-100"
              aria-labelledby="statusDropdown"
            >
              <li className="dropdown-item py-1 px-2" onClick={() => setStatus("")}>
                所有狀態
              </li>
              {statusOptions.map(status => (
                <li
                  key={status.id}
                  className="dropdown-item py-1 px-2"
                  onClick={() => setStatus(status.value)}
                >
                  {status.name}
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
