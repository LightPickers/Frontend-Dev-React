import { skipToken } from "@reduxjs/toolkit/query";
import { string } from "prop-types";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import classNames from "classnames";

import {
  useAddProductToWishlistMutation,
  useGetWishlistProductsQuery,
} from "@features/wishlist/wishlistApi";
import useDecodedId from "@hooks/useDecodedId";
import { BtnPrimary } from "@components/Buttons";
import useRequireAuth from "@hooks/useRequireAuth";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

function AddToWishlistBtn({ id, name, className }) {
  const userId = useDecodedId();
  const [addProductToWishlist, { isLoading: isAddingToWishlist }] =
    useAddProductToWishlistMutation();
  const { data: wishlist } = useGetWishlistProductsQuery(userId ? undefined : skipToken);
  const requireAuth = useRequireAuth();
  const isFavorited = wishlist?.data.some(item => item.Products.id === id);

  const handleAddToWishlist = async () => {
    try {
      await addProductToWishlist({ product_id: id }).unwrap();
      toast.success(`已將「${name}」加入收藏`);
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  if (isFavorited) {
    return (
      <BtnPrimary
        as={Link}
        className={classNames(className)}
        to="/account/profile/wishlists"
        size="large"
      >
        查看收藏清單
      </BtnPrimary>
    );
  }

  return (
    <BtnPrimary
      size="large"
      className={classNames(className)}
      onClick={() => requireAuth(handleAddToWishlist)}
      disabled={isAddingToWishlist}
    >
      {!isAddingToWishlist ? "加入收藏" : "放入收藏中…"}
    </BtnPrimary>
  );
}

AddToWishlistBtn.propTypes = {
  id: string.isRequired,
  name: string.isRequired,
  className: string.isRequired,
};

export default AddToWishlistBtn;
