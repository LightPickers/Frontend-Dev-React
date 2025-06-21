import classNames from "classnames";
import PropTypes from "prop-types";
import { createElement } from "react";

const createHeadingComponent = (tag, baseClass) => {
  const Heading = ({ children, className, isBold = true }) => {
    const classes = classNames(baseClass, className, {
      "fw-bold": isBold === true,
      "fw-normal": isBold === false,
    });
    const newElement = createElement(tag, { className: classes }, children); // tag, prop, children
    return newElement;
  };
  Heading.propTypes = {
    children: PropTypes.string.isRequired,
    className: PropTypes.string,
    isBold: PropTypes.bool,
  };
  return Heading;
};

// 生產元件
const headingTags = ["h1", "h2", "h3", "h4", "h5", "h6"];
const headingVariants = {
  Primary: "heading-serif",
  Secondary: "heading-sans",
};

const headings = {};

headingTags.forEach(tag => {
  Object.entries(headingVariants).forEach(([variant, fontClass]) => {
    const componentName = `${tag.toUpperCase()}${variant}`;
    const baseClass = `${tag} ${fontClass}`;
    headings[componentName] = createHeadingComponent(tag, baseClass);
  });
});

// 導出所有組件
export const {
  H1Primary,
  H2Primary,
  H3Primary,
  H4Primary,
  H5Primary,
  H6Primary,
  H1Secondary,
  H2Secondary,
  H3Secondary,
  H4Secondary,
  H5Secondary,
  H6Secondary,
} = headings;
