import classNames from "classnames";
import PropTypes from "prop-types";

// Base component
function TextBase({ as: Component = "span", className, children, ...rest }) {
  return (
    <Component className={className} {...rest}>
      {children}
    </Component>
  );
}

TextBase.propTypes = {
  as: PropTypes.elementType, // 也支援 React 元件
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default TextBase;

// Named variants
export function TextLarge({ className, ...props }) {
  return <TextBase {...props} className={classNames("text-sans", "text-l", className)} />;
}
TextLarge.propTypes = TextBase.propTypes;

export function TextMedium({ className, ...props }) {
  return <TextBase {...props} className={classNames("text-sans", "text-m", className)} />;
}
TextMedium.propTypes = TextBase.propTypes;

export function TextSmall({ className, ...props }) {
  return <TextBase {...props} className={classNames("text-sans", "text-s", className)} />;
}
TextSmall.propTypes = TextBase.propTypes;

export function LabelText({ className, ...props }) {
  return <TextBase {...props} className={classNames("text-sans", "label", className)} />;
}
LabelText.propTypes = TextBase.propTypes;

TextBase.displayName = "TextBase";
TextLarge.displayName = "TextLarge";
TextMedium.displayName = "TextMedium";
TextSmall.displayName = "TextSmall";
LabelText.displayName = "LabelText";
