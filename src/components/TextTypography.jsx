import classNames from "classnames";
import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";

// Base component
function TextBase({ as: Component = "span", className, children, disabled = false, ...rest }) {
  const isLink =
    Component === "a" || Component?.displayName === "Link" || Component?.displayName === "NavLink";
  const baseClass = "text-sans";
  const linkClass = isLink ? "link-text" : "";
  const disabledClass = disabled ? "is-disabled" : "";

  if (Component === NavLink) {
    return (
      <NavLink
        {...rest}
        className={({ isActive }) =>
          classNames(baseClass, linkClass, className, disabledClass, { "is-active": isActive })
        }
      >
        {children}
      </NavLink>
    );
  }

  return (
    <Component
      {...rest}
      className={classNames(baseClass, linkClass, className, disabledClass)}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
    >
      {children}
    </Component>
  );
}

TextBase.propTypes = {
  as: PropTypes.elementType, // 也支援 React 元件
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
  disabled: PropTypes.bool,
};

export default TextBase;

// Named variants
export function TextLarge({ className, ...props }) {
  return <TextBase {...props} className={classNames("text-l", className)} />;
}
TextLarge.propTypes = TextBase.propTypes;

export function TextMedium({ className, ...props }) {
  return <TextBase {...props} className={classNames("text-m", className)} />;
}
TextMedium.propTypes = TextBase.propTypes;

export function TextSmall({ className, ...props }) {
  return <TextBase {...props} className={classNames("text-s", className)} />;
}
TextSmall.propTypes = TextBase.propTypes;

export function LabelText({ className, ...props }) {
  return <TextBase {...props} className={classNames("label", className)} />;
}
LabelText.propTypes = TextBase.propTypes;

TextBase.displayName = "TextBase";
TextLarge.displayName = "TextLarge";
TextMedium.displayName = "TextMedium";
TextSmall.displayName = "TextSmall";
LabelText.displayName = "LabelText";
