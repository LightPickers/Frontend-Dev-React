import React from "react";
import PropTypes from "prop-types";

const BASE_PATH = import.meta.env.VITE_APP_BASE || "/";

// 使用環境變數構建圖片路徑
const categoryImages = {
  lens: `${BASE_PATH}images/category/lens.jpg`,
  camera: `${BASE_PATH}images/category/camera.jpg`,
  accessories: `${BASE_PATH}images/category/accessories.jpg`,
  fuselage: `${BASE_PATH}images/category/fuselage.jpg`,
  default: `${BASE_PATH}images/category/default.jpg`,
};

// 類別名稱的顯示文字映射
const categoryDisplayNames = {
  lens: "鏡頭",
  camera: "相機",
  accessories: "配件",
  fuselage: "機身",
  default: "商品",
};

function CategoryImage({ category }) {
  const imageSrc = categoryImages[category] || categoryImages.default;
  const displayName = categoryDisplayNames[category] || categoryDisplayNames.default;

  return (
    <div className="category-image-wrapper">
      <img
        src={imageSrc}
        alt={`${displayName}類別`}
        className="category-image"
        onError={e => {
          // 如果不是默認圖片，則切換到默認圖片
          if (e.target.src !== `${window.location.origin}${categoryImages.default}`) {
            e.target.src = categoryImages.default;
            e.target.alt = `${categoryDisplayNames.default}類別`;
          } else {
            // 如果連默認圖片都載入失敗，顯示佔位內容
            e.target.style.display = "none";
            e.target.parentElement.innerHTML = `
              <div class="category-placeholder">
                <div class="placeholder-content">
                  <div class="placeholder-icon">📸</div>
                  <div class="placeholder-text">${displayName}類別</div>
                </div>
              </div>
            `;
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
