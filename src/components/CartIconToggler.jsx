import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { CartIcon, CartFilledIcon } from "@components/icons";
import {
  useAddToCartMutation,
  useDeleteCartProductMutation,
  useGetCartQuery,
} from "@features/cart/cartApi";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import useRequireAuth from "@hooks/useRequireAuth";
import IconActionButton from "@components/IconActionButton";
import useDecodedId from "@hooks/useDecodedId";

function CartIconToggler({ productId }) {
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [deleteCartProduct, { isLoading: isRemovingFromCart }] = useDeleteCartProductMutation();
  const userId = useDecodedId();
  const { data: cartList } = useGetCartQuery(userId);
  console.log({ cartList, productId });
  const requireAuth = useRequireAuth();
  const isWaitingToBuy = cartList?.data.items.some(item => item.id === productId);
  const isLoading = isAddingToCart || isRemovingFromCart;

  const handleToggleIcon = async () => {
    try {
      if (isWaitingToBuy) {
        const targetIndex = cartList?.data.items.findIndex(item => item.id === productId);
        const targetId = cartList?.data.items[targetIndex].id;
        await deleteCartProduct(targetId).unwrap();
      } else {
        await addToCart(productId);
      }
      toast.success(isWaitingToBuy ? "已在購物車移除" : "已加入購物車");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };
  return (
    <IconActionButton
      isActive={isWaitingToBuy}
      isLoading={isLoading}
      icon={<CartIcon title="加入購物車" strokeWidth={1} />}
      activeIcon={<CartFilledIcon title="在購物車移除商品" strokeWidth={1} />}
      onClick={() => requireAuth(handleToggleIcon)}
      tooltip={isWaitingToBuy ? "在購物車移除商品" : "加入購物車"}
      activeClass="border-success text-success"
    />
    // <button className="icon-btn">
    //   <CartIcon title="放入購物車" strokeWidth={1} />
    // </button>
  );
}

CartIconToggler.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default CartIconToggler;
