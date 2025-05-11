import classNames from "classnames";
import PropTypes from "prop-types";

function CartIcon({ size = 24, strokeWidth = 0, title, className, style, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={classNames(className)}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      style={style}
      {...props}
    >
      <title>{title}</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M3.16667 2.66663C2.52233 2.66663 2 3.18896 2 3.83329C2 4.47762 2.52233 4.99996 3.16667 4.99996H4.54356L6.68932 15.7288C6.79839 16.2741 7.2772 16.6666 7.83333 16.6666H19.5C20.0209 16.6666 20.4787 16.3213 20.6218 15.8205L22.9551 7.6538C23.0557 7.30179 22.9852 6.923 22.7647 6.63073C22.5443 6.33846 22.1994 6.16662 21.8333 6.16662H7.15643L6.64401 3.60449C6.53494 3.05916 6.05613 2.66663 5.5 2.66663H3.16667ZM8.78977 14.3333L7.6231 8.49996H20.2866L18.62 14.3333H8.78977ZM8.41666 21.3333C9.38315 21.3333 10.1667 20.5497 10.1667 19.5833C10.1667 18.6168 9.38315 17.8333 8.41666 17.8333C7.45016 17.8333 6.66666 18.6168 6.66666 19.5833C6.66666 20.5497 7.45016 21.3333 8.41666 21.3333ZM18.9167 21.3333C19.8832 21.3333 20.6667 20.5497 20.6667 19.5833C20.6667 18.6168 19.8832 17.8333 18.9167 17.8333C17.9502 17.8333 17.1667 18.6168 17.1667 19.5833C17.1667 20.5497 17.9502 21.3333 18.9167 21.3333Z"
        fill="currentColor"
      />
    </svg>
  );
}

CartIcon.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CartIcon;
