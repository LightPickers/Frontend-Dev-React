import React from "react";
import PropTypes from "prop-types";

function BrandDropdown({ brand, setBrand }) {
  return (
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
  );
}

BrandDropdown.propTypes = {
  brand: PropTypes.string.isRequired,
  setBrand: PropTypes.func.isRequired,
};

export default BrandDropdown;
