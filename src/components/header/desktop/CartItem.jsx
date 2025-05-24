import { object } from "prop-types";
import { toast } from "react-toastify";

import { H6Secondary } from "@components/Headings";
import { TextSmall } from "@components/TextTypography";
import { formatPrice } from "@utils/formatPrice";
import { CloseIcon } from "@components/icons";
import { useDeleteCartProductMutation } from "@features/cart/cartApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

function CartItem({ item }) {
  const { id: productId, primary_image, name, total_price } = item;
  const [deleteCartProduct, { isLoading: isDeletingProduct }] = useDeleteCartProductMutation();
  const handleDelete = async id => {
    try {
      await deleteCartProduct(id).unwrap();
      toast.success(`已成功刪除「${name}」`);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "刪除產品失敗，請稍後再試"));
    }
  };
  return (
    <li className="dropdown-product d-flex align-items-center gap-3">
      <img src={primary_image} alt={name} className="product-img" loading="lazy" />
      <div className="product-info text-truncate">
        <H6Secondary isBold={false} className="text-truncate">
          {name}
        </H6Secondary>
        <TextSmall>
          {typeof total_price === "number" ? `NT$ ${formatPrice(total_price, false)}` : "N/A"}
        </TextSmall>
      </div>
      <button
        type="button"
        className="btn btn-sm delete-btn"
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          handleDelete(productId);
        }}
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
        disabled={isDeletingProduct}
      >
        {!isDeletingProduct ? (
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

CartItem.propTypes = {
  item: object.isRequired,
};

export default CartItem;
