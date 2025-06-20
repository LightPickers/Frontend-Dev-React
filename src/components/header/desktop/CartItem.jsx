import { object } from "prop-types";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { useDispatch } from "react-redux";

import { H6Secondary } from "@components/Headings";
import { TextSmall } from "@components/TextTypography";
import { formatPrice } from "@utils/formatPrice";
import { CloseIcon } from "@components/icons";
import { useDeleteCartProductMutation } from "@features/cart/cartApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
// import { showLoading } from "@features/loading/loadingSlice";
import { ConfirmDialogue, ErrorAlert } from "@/components/Alerts";

function CartItem({ item }) {
  const dispatch = useDispatch();
  const { id: cartId, product_id, primary_image, name, total_price, is_available } = item;
  const [deleteCartProduct, { isLoading: isDeletingProduct }] = useDeleteCartProductMutation();
  const handleDelete = async id => {
    try {
      await deleteCartProduct(id).unwrap();
      toast.success(`已成功刪除「${name}」`);
    } catch (error) {
      ErrorAlert({
        title: `移除「${name}」失敗`,
        text: getApiErrorMessage(error, "請稍後再試"),
      });
    }
  };
  return (
    <li
      className={classNames(
        "dropdown-product",
        "d-flex",
        "align-items-center",
        "gap-3",
        "position-relative",
        {
          "not-available": !is_available,
        }
      )}
    >
      <div className="product-img">
        <img
          src={primary_image}
          alt={name}
          className="w-100 h-100 object-fit-cover"
          loading="lazy"
        />
      </div>
      <div className="product-info text-truncate">
        <H6Secondary isBold={false} className="text-truncate">
          {name}
        </H6Secondary>
        <TextSmall>
          {typeof total_price === "number" ? `NT$ ${formatPrice(total_price, false)}` : "N/A"}
        </TextSmall>
      </div>
      <Link
        to={`/products/${product_id}`}
        className={classNames({ "stretched-link": is_available })}
        // onClick={dispatch(showLoading())}
        title={`查看「${name}」`}
      />
      <button
        type="button"
        className={classNames("btn", "btn-sm", "delete-btn", "ms-auto", {
          "stretched-link": !is_available,
        })}
        // className="btn btn-sm delete-btn ms-auto"
        title={`移除「${name}」`}
        onClick={e => {
          e.stopPropagation();
          e.preventDefault();
          ConfirmDialogue({
            title: "確認刪除？",
            text: `您確定要從購物車移除「${name}」嗎？`,
            action: () => handleDelete(cartId),
          });
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
