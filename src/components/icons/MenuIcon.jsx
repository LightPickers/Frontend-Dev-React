import classNames from "classnames";
import PropTypes from "prop-types";

// 漢堡選單
function MenuIcon({ size = 24, strokeWidth = 0, title, className, style, ...props }) {
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
        d="M18.7553 16.5196C18.6111 16.3696 18.4205 16.286 18.2222 16.2857H5.77778L5.68678 16.2917C5.48993 16.3175 5.30944 16.4252 5.18221 16.5927C5.05497 16.7602 4.99058 16.975 5.0022 17.1931C5.01382 17.4112 5.10056 17.6162 5.24471 17.7661C5.38886 17.9161 5.57954 17.9998 5.77778 18H18.2222L18.3132 17.994C18.5101 17.9682 18.6906 17.8605 18.8178 17.693C18.945 17.5255 19.0094 17.3107 18.9978 17.0926C18.9862 16.8745 18.8994 16.6696 18.7553 16.5196ZM18.7722 11.3939C18.6263 11.2332 18.4285 11.1429 18.2222 11.1429H5.77778C5.5715 11.1429 5.37367 11.2332 5.22781 11.3939C5.08194 11.5547 5 11.7727 5 12C5 12.2273 5.08194 12.4453 5.22781 12.6061C5.37367 12.7668 5.5715 12.8571 5.77778 12.8571H18.2222C18.4285 12.8571 18.6263 12.7668 18.7722 12.6061C18.9181 12.4453 19 12.2273 19 12C19 11.7727 18.9181 11.5547 18.7722 11.3939ZM18.7722 6.25105C18.6263 6.09031 18.4285 6 18.2222 6H5.77778C5.5715 6 5.37367 6.09031 5.22781 6.25105C5.08194 6.4118 5 6.62981 5 6.85714C5 7.08447 5.08194 7.30249 5.22781 7.46323C5.37367 7.62398 5.5715 7.71429 5.77778 7.71429H18.2222C18.4285 7.71429 18.6263 7.62398 18.7722 7.46323C18.9181 7.30249 19 7.08447 19 6.85714C19 6.62981 18.9181 6.4118 18.7722 6.25105Z"
        fill="currentColor"
      />
    </svg>
  );
}

MenuIcon.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MenuIcon;
