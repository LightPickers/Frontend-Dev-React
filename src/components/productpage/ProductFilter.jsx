import React, { useState } from "react";
import PropTypes from "prop-types";

const brandOptions = [
  { value: "測試Fuji", label: "Fuji" },
  { value: "測試Canon", label: "Canon" },
  { value: "測試Sony", label: "Sony" },
];

const statusOptions = [
  { value: "測試九成新", label: "九成新" },
  { value: "測試極佳", label: "極佳" },
  { value: "測試堪用", label: "堪用" },
  { value: "測試良好", label: "良好" },
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
        <div className="col-md-3">
          <label htmlFor="brand" className="form-label">
            品牌
          </label>
          <select
            id="brand"
            className="form-select dropdown-select"
            value={brand}
            onChange={e => setBrand(e.target.value)}
          >
            <option value="">所有品牌</option>
            <option value="測試Fuji">Fuji</option>
            <option value="測試Canon">Canon</option>
            <option value="測試Sony">Sony</option>
          </select>
        </div>
        <div className="col-md-3">
          <label htmlFor="status" className="form-label">
            商品狀態
          </label>
          <select
            id="status"
            className="form-select dropdown-select"
            value={status}
            onChange={e => setStatus(e.target.value)}
          >
            <option value="">所有狀態</option>
            <option value="測試九成新">九成新</option>
            <option value="測試極佳">極佳</option>
            <option value="測試堪用">堪用</option>
            <option value="測試良好">良好</option>
          </select>
        </div>
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
