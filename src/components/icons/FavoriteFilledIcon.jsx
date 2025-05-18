import classNames from "classnames";
import PropTypes from "prop-types";

function FavoriteFilledIcon({ size = 24, strokeWidth = 0, title, className, style, ...props }) {
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
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.20036 4.99063C4.34567 3.84506 5.86258 3.14637 7.47759 3.02054C9.09259 2.89471 10.6994 3.35002 12.0083 4.30438C13.3913 3.3038 15.1001 2.86022 16.7951 3.06181C18.4901 3.2634 20.0473 4.09539 21.157 5.39242C22.2667 6.68945 22.8477 8.35655 22.7846 10.0623C22.7215 11.7681 22.0188 13.3877 20.8163 14.5992L14.4102 21.0053C13.7731 21.6422 12.9092 22 12.0083 22C11.1075 22 10.2435 21.6422 9.60647 21.0053L3.20036 14.6004C1.92624 13.3261 1.21045 11.598 1.21045 9.79606C1.21045 7.99411 1.92624 6.26483 3.20036 4.99063Z"
        fill="currentColor"
      />
    </svg>
  );
}

FavoriteFilledIcon.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FavoriteFilledIcon;
