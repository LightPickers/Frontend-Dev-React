import classNames from "classnames";
import PropTypes from "prop-types";

export function BtnPrimary({
  as: Component = "button",
  children,
  type = "button",
  size = "medium",
  className,
  disabled = false,
  onClick = () => {},
  ...rest
}) {
  const classes = classNames("btn-custom-primary", size, className);

  return (
    <Component
      className={classes}
      disabled={disabled}
      onClick={onClick}
      type={Component === "button" ? type : undefined}
      {...rest}
    >
      {children}
    </Component>
  );
}

BtnPrimary.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  size: PropTypes.oneOf(["small", "medium", "large", "cta"]),
  disabled: PropTypes.bool,
};
