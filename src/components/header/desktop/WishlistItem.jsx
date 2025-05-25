import { object, bool, func } from "prop-types";

import { formatPrice } from "@utils/formatPrice";
import { H6Secondary } from "@components/Headings";
import { TextMedium, TextSmall } from "@components/TextTypography";
import { CloseIcon } from "@components/icons";

function WishlistItem({
  item,
  checked,
  onCheckChange,
  onDelete,
  isDeleting,
  isAddedToCart = false,
  isCheckboxDisabled = false,
}) {
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
    e.stopPropagation();
    e.preventDefault();

    onDelete(wishItemId);

    // 防止任何後續事件處理
    return false;
  };

  const handleCheckboxChange = e => {
    e.stopPropagation();
    if (isCheckboxDisabled) return;
    onCheckChange(wishItemId, productId, e.target.checked);
  };

  const handleItemClick = e => {
    // 阻止點擊項目時的事件冒泡
    e.stopPropagation();
  };

  const handleCheckboxClick = e => {
    e.stopPropagation();
    // 如果禁用則阻止預設行為
    if (isCheckboxDisabled) {
      e.preventDefault();
    }
  };

  return (
    <li className="dropdown-product d-flex align-items-center gap-3" onClick={handleItemClick}>
      <input
        type="checkbox"
        className={`form-check-input ${isCheckboxDisabled ? "disabled" : ""}`}
        checked={checked}
        onChange={handleCheckboxChange}
        onClick={handleCheckboxClick}
        disabled={isCheckboxDisabled}
        id={wishItemId}
        style={{
          cursor: isCheckboxDisabled ? "not-allowed" : "pointer",
          opacity: isCheckboxDisabled ? 0.6 : 1,
        }}
      />
      <label
        htmlFor={wishItemId}
        className={`d-flex align-items-center gap-3 flex-grow-1 ${
          isCheckboxDisabled ? "disabled-label" : ""
        }`}
        style={{
          cursor: isCheckboxDisabled ? "not-allowed" : "pointer",
        }}
      >
        <img
          src={primary_image}
          alt={name}
          className="product-img"
          // className={`product-img ${isAddedToCart ? "added-to-cart-img" : ""}`}
          loading="lazy"
          style={{
            opacity: isAddedToCart ? 0.7 : 1,
          }}
        />
        <div className="product-info text-truncate">
          <H6Secondary
            isBold={false}
            className={`text-truncate ${isAddedToCart ? "text-muted" : ""}`}
          >
            {name}
          </H6Secondary>
          <TextSmall className={isAddedToCart ? "text-muted" : ""}>
            {typeof selling_price === "number" ? `NT$ ${formatPrice(selling_price, false)}` : "N/A"}
          </TextSmall>
          {isAddedToCart && <TextSmall className="text-success fw-medium">已加入購物車</TextSmall>}
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
  isAddedToCart: bool.isRequired,
  isCheckboxDisabled: bool.isRequired,
};

export default WishlistItem;
