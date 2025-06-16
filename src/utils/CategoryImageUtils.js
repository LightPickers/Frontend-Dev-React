// 類別映射工具函數

/**
 * 類別ID到類別名稱的映射表
 * 根據實際的後端API回應調整這些ID
 */
export const CATEGORY_ID_TO_NAME = {
  "5ba5ff07-a140-4d00-9917-4931b9f9bbdd": "lens", // 鏡頭
  "a412867c-844e-4ccd-927c-ab7268b14806": "camera", // 相機
  "73c83e48-4317-4376-8e30-9da2fc35f085": "accessories", // 配件
  "5ba12691-913c-4789-8435-2e36bc269583": "fuselage", // 機身
  "": "default", // 總攬
};

/**
 * 類別名稱到顯示文字的映射表
 */
export const CATEGORY_DISPLAY_NAMES = {
  lens: "鏡頭",
  camera: "相機",
  accessories: "配件",
  fuselage: "機身",
  default: "商品",
};

/**
 * 根據類別ID獲取類別名稱
 * @param {string} categoryId - 類別ID
 * @returns {string} 類別名稱，如果找不到則返回 "default"
 */
export const getCategoryNameById = categoryId => {
  if (!categoryId) return "default";
  return CATEGORY_ID_TO_NAME[categoryId] || "default";
};

/**
 * 根據類別名稱獲取顯示文字
 * @param {string} categoryName - 類別名稱
 * @returns {string} 顯示文字
 */
export const getCategoryDisplayName = categoryName => {
  return CATEGORY_DISPLAY_NAMES[categoryName] || CATEGORY_DISPLAY_NAMES.default;
};

/**
 * 根據URL參數獲取當前類別資訊
 * @param {URLSearchParams} searchParams - URL搜尋參數
 * @returns {Object} 包含 categoryId, categoryName, displayName 的物件
 */
export const getCurrentCategoryInfo = searchParams => {
  const categoryId = searchParams.get("category_id");
  const categoryName = getCategoryNameById(categoryId);
  const displayName = getCategoryDisplayName(categoryName);

  return {
    categoryId,
    categoryName,
    displayName,
  };
};
