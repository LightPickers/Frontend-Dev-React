import PropTypes from "prop-types";
import { toast } from "react-toastify";

import { FavoriteIcon, FavoriteFilledIcon } from "@components/icons";
import {
  useAddProductToWishlistMutation,
  useDeleteWishlistProductMutation,
  useGetWishlistProductsQuery,
} from "@features/wishlist/wishlistApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
import useRequireAuth from "@hooks/useRequireAuth";
import IconActionButton from "@components/IconActionButton";

function FavoriteIconToggler({ productId }) {
  const [addProductToWishlist, { isLoading: isAddingToWishlist }] =
    useAddProductToWishlistMutation();
  const [deleteWishlistProduct, { isLoading: isRemovingFromWishlist }] =
    useDeleteWishlistProductMutation();
  const { data: wishlist, refetch } = useGetWishlistProductsQuery();
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
      toast.success(isFavorited ? "已取消收藏" : "已加入收藏");
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

  // const handleAddToWishlist = async () => {
  //   try {
  //     const favoriteProduct = { product_id: productId };
  //     await addProductToWishlist(favoriteProduct).unwrap();
  //     toast.success(isFavorited ? "已取消收藏" : "已加入收藏");
  //     refetch();
  //   } catch (error) {
  //     // console.error(error);
  //     toast.error(getApiErrorMessage(error, "加入收藏失敗，請稍後再試"));
  //   }
  // };
  // const handleDeleteWishlistProduct = async () => {
  //   const targetIndex = wishlist?.data.findIndex(item => item.Products.id === productId);
  //   const favoriteId = wishlist?.data[targetIndex].id;
  //   try {
  //     await deleteWishlistProduct(favoriteId).unwrap();
  //     toast.success(isFavorited ? "已取消收藏" : "已加入收藏");
  //     refetch();
  //   } catch (error) {
  //     // console.error(error);
  //     toast.error(getApiErrorMessage(error, "取消收藏失敗，請稍後再試"));
  //   }
  // };
  return (
    <>
      <IconActionButton
        isActive={isFavorited}
        isLoading={isLoading}
        icon={<FavoriteIcon title="加入收藏" strokeWidth={1} />}
        activeIcon={<FavoriteFilledIcon title="取消收藏" strokeWidth={1} />}
        onClick={() => requireAuth(handleFavoriteToggle)}
        tooltip={isFavorited ? "取消收藏" : "加入收藏"}
        activeClass="border-danger text-danger"
      />
      {/* {!isLoading ? (
        !isFavorited ? (
          <button
            type="button"
            className="icon-btn"
            disabled={isAddingToWishlist}
            onClick={() => requireAuth(handleAddToWishlist)}
          >
            <FavoriteIcon title="加入收藏" strokeWidth={1} />
          </button>
        ) : (
          <button
            type="button"
            className="icon-btn border-danger text-danger"
            disabled={isRemovingFromWishlist}
            onClick={() => {
              handleDeleteWishlistProduct(productId);
            }}
          >
            <FavoriteFilledIcon title="取消收藏" strokeWidth={1} className="" />
          </button>
        )
      ) : (
        <button className="icon-btn text-gray-400">
          <span className="spinner-border" />
        </button>
      )} */}
    </>
  );
}

FavoriteIconToggler.propTypes = {
  productId: PropTypes.string.isRequired,
};

export default FavoriteIconToggler;
