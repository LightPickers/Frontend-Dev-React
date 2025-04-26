import classNames from "classnames";
import PropTypes from "prop-types";

function Button({ text, size = "medium", className, disabled = false, onClick }) {
  const classes = classNames("btn-custom", size, className);
  return (
    <>
      <button className={classes} disabled={disabled} onClick={onClick}>
        {text}
      </button>
    </>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired, // 必填、字串
  className: PropTypes.string,
  onClick: PropTypes.func, // 函式
  size: PropTypes.oneOf(["small", "medium", "large", "cta"]), // 四值擇一
  disabled: PropTypes.bool, // 布林值
};

Button.defaultProps = {
  size: "medium",
  disabled: false,
  onClick: () => {},
};

export default Button;
