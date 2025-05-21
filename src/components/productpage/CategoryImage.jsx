import React from "react";
import PropTypes from "prop-types";
// import CategoryImage from "../path/to/CategoryImage";

const categoryImages = {
  lens: "/productpage/categoryImage/Confirm.png",
  //camera: "/path/to/camera-image.jpg",
  //accessories: "/path/to/accessories-image.jpg",
  //default: "/path/to/default-image.jpg",
};

function CategoryImage({ category }) {
  const imageSrc = categoryImages[category] || categoryImages.default;

  return (
    <div className="category-image-wrapper text-center mb-4">
      <img src={imageSrc} alt={category} className="category-image" />
    </div>
  );
}

CategoryImage.propTypes = {
  category: PropTypes.string.isRequired,
};

export default CategoryImage;
