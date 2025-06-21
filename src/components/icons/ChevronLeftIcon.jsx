import classNames from "classnames";
import PropTypes from "prop-types";

function ChevronLeftIcon({ size = 24, strokeWidth = 0, title, className, style, ...props }) {
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
      <path d="M15.41 7.41L14 6L8 12L14 18L15.41 16.59L10.83 12L15.41 7.41Z" fill="currentColor" />
    </svg>
  );
}

ChevronLeftIcon.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ChevronLeftIcon;
