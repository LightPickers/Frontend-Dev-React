import classNames from "classnames";
import PropTypes from "prop-types";

function ArrowDownIcon({ size = 24, strokeWidth = 0, title, className, style, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={classNames(className)}
      style={style}
      {...props}
    >
      <path
        d="M7.41 8.58997L12 13.17L16.59 8.58997L18 9.99997L12 16L6 9.99997L7.41 8.58997Z"
        fill="currentColor"
      />
    </svg>
  );
}

ArrowDownIcon.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ArrowDownIcon;
