import classNames from "classnames";
import PropTypes from "prop-types";
import React from "react";

const SearchIcon = ({ size = 24, className, style, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    fill="currentColor"
    viewBox="0 0 24 24"
    className={classNames(className)}
    style={style}
    {...props}
  >
    <path d="M10 2a8 8 0 105.293 14.293l4.707 4.707 1.414-1.414-4.707-4.707A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
  </svg>
);

SearchIcon.propTypes = {
  size: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SearchIcon;
