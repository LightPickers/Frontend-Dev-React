import React from "react";
import PropTypes from "prop-types";

function StatusDropdown({ status, setStatus }) {
  return (
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
  );
}

StatusDropdown.propTypes = {
  status: PropTypes.string.isRequired,
  setStatus: PropTypes.func.isRequired,
};

export default StatusDropdown;
