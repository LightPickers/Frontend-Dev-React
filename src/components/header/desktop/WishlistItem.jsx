import { object, bool, func } from "prop-types";

import { formatPrice } from "@utils/formatPrice";
import { H6Secondary } from "@components/Headings";
import { TextMedium, TextSmall } from "@components/TextTypography";
import { CloseIcon } from "@components/icons";

function WishlistItem({ item, checked, onCheckChange, onDelete, isDeleting }) {
  if (!item || !item.Products) {
    return (
      <li className="d-flex justify-content-center align-items-center py-10">
        <TextMedium as="p">載入中……</TextMedium>
      </li>
    );
  }
  const { id: wishItemId, Products } = item;
  const { id: productId, name, selling_price, primary_image } = Products || {};

  const handleDeleteClick = e => {
    // 阻止所有可能的事件傳播
    e.stopPropagation();
    e.preventDefault();
    // e.stopImmediatePropagation();

    // 呼叫刪除函數
    onDelete(wishItemId);

    // 防止任何後續事件處理
    return false;
  };

  const handleCheckboxChange = e => {
    // 阻止事件冒泡，避免影響 dropdown
    e.stopPropagation();
    onCheckChange(wishItemId, productId, e.target.checked);
  };

  const handleItemClick = e => {
    // 阻止點擊項目時的事件冒泡
    e.stopPropagation();
  };

  return (
    <li className="dropdown-product d-flex align-items-center gap-3" onClick={handleItemClick}>
      <input
        type="checkbox"
        className="form-check-input"
        checked={checked}
        onChange={handleCheckboxChange}
        onClick={e => e.stopPropagation()}
        id={wishItemId}
      />
      <label htmlFor={wishItemId} className="d-flex align-items-center gap-3 flex-grow-1">
        <img src={primary_image} alt={name} className="product-img" loading="lazy" />
        <div className="product-info text-truncate">
          <H6Secondary isBold={false} className="text-truncate">
            {name}
          </H6Secondary>
          <TextSmall>
            {typeof selling_price === "number" ? `NT$ ${formatPrice(selling_price, false)}` : "N/A"}
          </TextSmall>
        </div>
      </label>
      <button
        type="button"
        className="btn btn-sm delete-btn"
        onClick={handleDeleteClick}
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        disabled={isDeleting}
        style={{ zIndex: 9999 }}
      >
        {!isDeleting ? (
          <CloseIcon size={24} />
        ) : (
          <div className="spinner-border spinner-border-sm text-danger" role="status">
            <span className="visually-hidden">移除中...</span>
          </div>
        )}
      </button>
    </li>
  );
}

WishlistItem.propTypes = {
  item: object.isRequired,
  checked: bool.isRequired,
  onCheckChange: func.isRequired,
  onDelete: func.isRequired,
  isDeleting: bool.isRequired,
};

export default WishlistItem;
