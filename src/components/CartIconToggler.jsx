import { string } from "prop-types";
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

function CartIconToggler({ productId, productName }) {
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const [deleteCartProduct, { isLoading: isRemovingFromCart }] = useDeleteCartProductMutation();
  const userId = useDecodedId();
  const { data: cartList } = useGetCartQuery(userId);
  // console.log({ cartList, productId });
  const requireAuth = useRequireAuth();
  const isInCart = cartList?.data.items.some(item => item.product_id === productId);
  const isLoading = isAddingToCart || isRemovingFromCart;

  const handleToggleIcon = async () => {
    try {
      if (isInCart) {
        const targetIndex = cartList?.data.items.findIndex(item => item.product_id === productId);
        const targetId = cartList?.data.items[targetIndex].id;
        await deleteCartProduct(targetId).unwrap();
      } else {
        await addToCart(productId);
      }
      toast.success(isInCart ? `已成功移除「${productName}」` : `已將「${productName}」加入購物車`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };
  return (
    <IconActionButton
      isActive={isInCart}
      isLoading={isLoading}
      icon={<CartIcon title="加入購物車" strokeWidth={1} />}
      activeIcon={<CartFilledIcon title="取消購買" />}
      onClick={() => requireAuth(handleToggleIcon)}
      tooltip={isInCart ? "取消購買" : "加入購物車"}
      activeColor="info"
    />
  );
}

CartIconToggler.propTypes = {
  productId: string.isRequired,
  productName: string.isRequired,
};

export default CartIconToggler;
