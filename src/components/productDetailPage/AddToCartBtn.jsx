import { skipToken } from "@reduxjs/toolkit/query";
import { string } from "prop-types";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import classNames from "classnames";

import { useAddToCartMutation, useGetCartQuery } from "@features/cart/cartApi";
import useDecodedId from "@hooks/useDecodedId";
import useRequireAuth from "@hooks/useRequireAuth";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
import { BtnPrimary } from "@components/Buttons";

function AddToCartBtn({ id, name, className }) {
  const [AddToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const userId = useDecodedId();
  const requireAuth = useRequireAuth();
  const { data: cartList } = useGetCartQuery(userId ? userId : skipToken);
  const isInCart = cartList?.data.items.some(item => item.product_id === id);

  const handleAddToCart = async () => {
    try {
      await AddToCart(id).unwrap();
      toast.success(`已將「${name}」加入購物車`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isInCart) {
    return (
      <BtnPrimary className={classNames(className)} as={Link} to="/cart" size="large">
        查看購物車
      </BtnPrimary>
    );
  }

  return (
    <BtnPrimary
      size="large"
      className={classNames(className)}
      onClick={() => requireAuth(handleAddToCart)}
      disabled={isAddingToCart}
    >
      {!isAddingToCart ? "加入購物車" : "放入購物車中…"}
    </BtnPrimary>
  );
}

AddToCartBtn.propTypes = {
  id: string.isRequired,
  name: string.isRequired,
  className: string.isRequired,
};

export default AddToCartBtn;
