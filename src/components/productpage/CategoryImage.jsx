import React from "react";
import PropTypes from "prop-types";

const categoryImages = {
  lens: "/productcatalogpage/len.png",
  camera: "/productcatalogpage/camera.png",
  accessories: "/productcatalogpage/accessories.png",
  default: "/productcatalogpage/default.png",
};

function CategoryImage({ category }) {
  const imageSrc = categoryImages[category] || categoryImages.default;

  return (
    <div className="category-image-wrapper text-center mb-4">
      <img
        src={imageSrc}
        alt={`${category} category`}
        className="category-image"
        onLoad={() => console.log(`Image loaded: ${imageSrc}`)}
        onError={e => {
          console.error(`Failed to load image: ${imageSrc}`);
          console.error(`Full URL: ${window.location.origin}${imageSrc}`);
          if (e.target.src !== categoryImages.default) {
            e.target.src = categoryImages.default;
          }
        }}
      />
    </div>
  );
}

CategoryImage.propTypes = {
  category: PropTypes.string.isRequired,
};

export default CategoryImage;
