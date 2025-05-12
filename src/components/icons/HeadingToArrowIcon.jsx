import classNames from "classnames";
import PropTypes from "prop-types";

function HeadingToArrowIcon({ size = 24, strokeWidth = 0, title, className, style, ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size * (16 / 44)}
      viewBox="0 0 44 16"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      className={classNames(className)}
      style={style}
      {...props}
    >
      <title>{title}</title>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M36.906 9L43.8273 15.105C43.9844 15.2435 44.041 15.4681 43.9693 15.6677C43.8975 15.8674 43.7125 16 43.5056 16H0V14.9825H42.1691L36.2625 9.77257L36.906 9Z"
        fill="currentColor"
      />
    </svg>
  );
}

HeadingToArrowIcon.propTypes = {
  size: PropTypes.number,
  strokeWidth: PropTypes.number,
  title: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default HeadingToArrowIcon;
