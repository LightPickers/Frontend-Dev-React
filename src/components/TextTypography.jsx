import classNames from "classnames";
import { bool, elementType, node, string } from "prop-types";
import { NavLink } from "react-router-dom";

// Base component
function TextBase({ as: Component = "span", className, children, disabled = false, ...rest }) {
  const isLink =
    Component === "a" ||
    Component === "button" ||
    Component?.displayName === "Link" ||
    Component?.displayName === "NavLink";
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
  as: elementType, // 也支援 React 元件
  className: string,
  children: node.isRequired,
  disabled: bool,
  fluid: bool,
};

export default TextBase;

// Named variants
export function TextLarge({ className, fluid = false, ...props }) {
  return (
    <TextBase {...props} className={classNames(fluid ? "text-l-fluid" : "text-l", className)} />
  );
}
TextLarge.propTypes = TextBase.propTypes;

export function TextMedium({ className, fluid = false, ...props }) {
  return (
    <TextBase {...props} className={classNames(fluid ? "text-m-fluid" : "text-m", className)} />
  );
}
TextMedium.propTypes = TextBase.propTypes;

export function TextSmall({ className, fluid = false, ...props }) {
  return (
    <TextBase {...props} className={classNames(fluid ? "text-s-fluid" : "text-s", className)} />
  );
}
TextSmall.propTypes = TextBase.propTypes;

export function LabelText({ className, fluid = false, ...props }) {
  return <TextBase {...props} className={classNames(fluid ? "label-fluid" : "label", className)} />;
}
LabelText.propTypes = TextBase.propTypes;

TextBase.displayName = "TextBase";
TextLarge.displayName = "TextLarge";
TextMedium.displayName = "TextMedium";
TextSmall.displayName = "TextSmall";
LabelText.displayName = "LabelText";
