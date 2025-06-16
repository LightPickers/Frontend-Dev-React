import React from "react";
import PropTypes from "prop-types";

// 使用 public 目錄的圖片，避免路徑解析問題
const categoryImages = {
  lens: "/images/category/lens.png",
  camera: "/images/category/camera.png",
  accessories: "/images/category/accessories.png",
  fuselage: "/images/category/fuselage.png",
  default: "/images/category/default.png",
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

  console.log(`CategoryImage: Rendering category "${category}" with image "${imageSrc}"`);

  return (
    <div className="category-image-wrapper">
      <img
        src={imageSrc}
        alt={`${displayName}類別`}
        className="category-image"
        onLoad={() => {
          console.log(`✅ Image loaded successfully: ${imageSrc}`);
        }}
        onError={e => {
          console.error(`❌ Failed to load image: ${imageSrc}`);
          console.error(`Full URL attempted: ${window.location.origin}${imageSrc}`);

          // 如果不是默認圖片，則切換到默認圖片
          if (e.target.src !== `${window.location.origin}${categoryImages.default}`) {
            console.log(`🔄 Falling back to default image: ${categoryImages.default}`);
            e.target.src = categoryImages.default;
            e.target.alt = `${categoryDisplayNames.default}類別`;
          } else {
            // 如果連默認圖片都載入失敗，顯示佔位內容
            console.error("❌ Even default image failed to load, showing placeholder");
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
