import classNames from "classnames";
import PropTypes from "prop-types";

function CartFilledIcon({ size = 24, title, className, style, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classNames(className)}
      style={style}
      {...props}
    >
      <title>{title}</title>

      {/* 輪子輪廓 */}
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />

      {/* 購物車主體輪廓 */}
      <path d="m2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />

      {/* 購物車內部填滿區域 */}
      <path
        d="M5.12 7h15.43l-1.65 7.43a2 2 0 0 1-1.95 1.57H8.71a2 2 0 0 1-2-1.58L5.12 7z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

CartFilledIcon.propTypes = {
  size: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CartFilledIcon;
