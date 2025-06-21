import { string } from "prop-types";
import { toast } from "react-toastify";
import { skipToken } from "@reduxjs/toolkit/query";

import { FavoriteIcon, FavoriteFilledIcon } from "@components/icons";
import {
  useAddProductToWishlistMutation,
  useDeleteWishlistProductMutation,
  useGetWishlistProductsQuery,
} from "@features/wishlist/wishlistApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
import useRequireAuth from "@hooks/useRequireAuth";
import IconActionButton from "@components/IconActionButton";
import useDecodedId from "@hooks/useDecodedId";

function FavoriteIconToggler({ productId, productName }) {
  const userId = useDecodedId();
  const [addProductToWishlist, { isLoading: isAddingToWishlist }] =
    useAddProductToWishlistMutation();
  const [deleteWishlistProduct, { isLoading: isRemovingFromWishlist }] =
    useDeleteWishlistProductMutation();
  const { data: wishlist, refetch } = useGetWishlistProductsQuery(userId ? undefined : skipToken);
  // console.log({ wishlist });
  const requireAuth = useRequireAuth();
  const isFavorited = wishlist?.data.some(item => item.Products.id === productId);
  const isLoading = isAddingToWishlist || isRemovingFromWishlist;

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorited) {
        const targetIndex = wishlist?.data.findIndex(item => item.Products.id === productId);
        const favoriteId = wishlist?.data[targetIndex].id;
        await deleteWishlistProduct(favoriteId).unwrap();
      } else {
        await addProductToWishlist({ product_id: productId }).unwrap();
      }
      toast.success(
        isFavorited ? `已取消收藏「${productName}」` : `已將「${productName}」加入收藏`
      );
      refetch();
    } catch (error) {
      toast.error(
        getApiErrorMessage(
          error,
          `${isFavorited ? "取消收藏失敗，請稍後再試" : "加入收藏失敗，請稍後再試"}`
        )
      );
    }
  };

  return (
    <>
      <IconActionButton
        isActive={isFavorited}
        isLoading={isLoading}
        icon={<FavoriteIcon title="加入收藏" strokeWidth={1} />}
        activeIcon={<FavoriteFilledIcon title="取消收藏" strokeWidth={1} />}
        onClick={() => requireAuth(handleFavoriteToggle)}
        tooltip={isFavorited ? "取消收藏" : "加入收藏"}
        activeColor="danger"
      />
    </>
  );
}

FavoriteIconToggler.propTypes = {
  productId: string.isRequired,
  productName: string.isRequired,
};

export default FavoriteIconToggler;
