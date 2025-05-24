import classNames from "classnames";
import PropTypes from "prop-types";

function CartFilledIcon({ size = 24, title, className, style, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classNames(className)}
      style={style}
      {...props}
    >
      <title>{title}</title>
      <path d="M3.17 2.67a1.17 1.17 0 0 0 0 2.33h1.37l2.15 10.73a1.17 1.17 0 0 0 1.14.93h11.67a1.17 1.17 0 0 0 1.12-.84l2.33-8.17a1.17 1.17 0 0 0-1.11-1.5H7.16l-.52-2.56a1.17 1.17 0 0 0-1.14-.93H3.17Zm5.25 11.67-.84-4.84h12.66l-1.67 4.84H8.42Zm0 2.17a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Zm10.5 0a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z" />
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
