import classNames from "classnames";
import { func, object } from "prop-types";
import { toast } from "react-toastify";

import { H6Secondary } from "@components/Headings";
import { TextSmall } from "@components/TextTypography";
import { formatPrice } from "@utils/formatPrice";
import { CloseIcon } from "@components/icons";
import { useDeleteWishlistProductMutation } from "@features/wishlist/wishlistApi";
import { ConfirmAlert, ErrorAlert } from "@components/Alerts";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

function FavItem({ item, onCheckChange }) {
  const [deleteWishlistProduct, { isLoading: isDeleting }] = useDeleteWishlistProductMutation();
  const { Products, id: favItemId, is_in_cart: isInCart } = item || {};
  const {
    id: productId,
    name,
    selling_price: price,
    primary_image: image,
    is_available: isAvailable,
    is_deleted: isDeleted,
    is_sold: isSold,
  } = Products || {};
  const itemTitle = isAvailable
    ? isInCart
      ? "此商品已在購物車"
      : "加入購物車"
    : "此商品已無法取得";
  const handleItemClick = e => {
    // 阻止點擊項目時的事件冒泡
    e.stopPropagation();
  };
  const handleCheckboxChange = e => {
    e.stopPropagation();
    // 透過所傳進來的函式，將值傳回去
    onCheckChange(favItemId, productId, name, e.target.checked);
  };
  const handleDelete = async id => {
    try {
      await deleteWishlistProduct(id).unwrap();
      toast.success("刪除成功");
    } catch (error) {
      ErrorAlert({ title: `刪除 ${name} 失敗`, text: getApiErrorMessage(error) });
    }
  };
  const handleDeleteClick = e => {
    e.stopPropagation();
    e.preventDefault();
    handleDelete(favItemId);
  };
  return (
    <li
      className={classNames("dropdown-product", "d-flex align-items-center", "gap-3", {
        "in-cart": isInCart && isAvailable,
      })}
      onClick={handleItemClick}
      title={itemTitle}
    >
      <input type="checkbox" onChange={handleCheckboxChange} id={favItemId} disabled={isInCart} />
      <label
        htmlFor={favItemId}
        className={classNames("d-flex", "align-items-center", "gap-3", "flex-grow-1")}
      >
        <div className="product-img">
          <img src={image} alt={name} loading="lazy" />
        </div>
        <div className="product-info">
          <H6Secondary className="text-truncate" isBold={false}>
            {name}
          </H6Secondary>
          <TextSmall>NT$ ${formatPrice(price, false)}</TextSmall>
        </div>
      </label>
      <button
        type="button"
        className="btn btn-sm delete-btn"
        onClick={handleDeleteClick}
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        disabled={isDeleting}
        style={{ zIndex: 1000 }}
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

FavItem.propTypes = {
  item: object.isRequired,
  onCheckChange: func.isRequired,
};

export default FavItem;
