import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { H5Secondary } from "@components/Headings";
import { TextSmall, TextMedium, TextLarge, LabelText } from "@components/TextTypography";
import { SearchIcon, FavoriteIcon, CartIcon, FavoriteFilledIcon } from "@components/icons";
import { formatPrice } from "@utils/formatPrice";
import {
  useAddProductToWishlistMutation,
  useDeleteWishlistProductMutation,
  useGetWishlistProductsQuery,
} from "@features/wishlist/wishlistApi";
import { useAddToCartMutation } from "@features/cart/cartApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
import useRequireAuth from "@/hooks/useRequireAuth";

function ProductCard({ product }) {
  const { id, name, condition, primary_image, original_price, selling_price } = product;

  const [addProductToWishlist, { isLoading: isAddingToWishlist }] =
    useAddProductToWishlistMutation();
  const [deleteWishlistProduct, { isLoading: isRemovingFromWishlist }] =
    useDeleteWishlistProductMutation();
  const { data: wishlist, refetch } = useGetWishlistProductsQuery();
  console.log({ wishlist });
  const isFavorited = wishlist?.data.some(item => item.Products.id === id);

  const requireAuth = useRequireAuth();

  // const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();
  const isLoading = isAddingToWishlist || isRemovingFromWishlist;
  const handleAddToWishlist = async () => {
    try {
      const favoriteProduct = { product_id: id };
      await addProductToWishlist(favoriteProduct).unwrap();
      toast.success(isFavorited ? "已取消收藏" : "已加入收藏");
      refetch();
    } catch (error) {
      // console.error(error);
      toast.error(getApiErrorMessage(error));
    }
  };
  const handleDeleteWishlistProduct = async () => {
    const targetIndex = wishlist?.data.findIndex(item => item.Products.id === id);
    const favoriteId = wishlist?.data[targetIndex].id;
    try {
      await deleteWishlistProduct(favoriteId).unwrap();
      toast.success(isFavorited ? "已取消收藏" : "已加入收藏");
      refetch();
    } catch (error) {
      // console.error(error);
      toast.error(getApiErrorMessage(error));
    }
  };
  return (
    <main className="card product-card">
      {/* 圖片區域 */}
      <section className="card-image-container">
        {/* 商品主圖 */}
        <img
          src={primary_image || "https://fakeimg.pl/300/"}
          className="product-image object-fit-cover"
          alt={name}
        />

        {/* 機況標籤 */}
        <LabelText className="card-badge mt-5">{condition}</LabelText>

        {/* 懸停按鈕 */}
        <div className="icon-group">
          <Link to={`/products/${id}`} className="icon-btn">
            <SearchIcon title="查看商品" strokeWidth={1} />
          </Link>

          {!isLoading ? (
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
                  handleDeleteWishlistProduct(id);
                }}
              >
                <FavoriteFilledIcon title="取消收藏" strokeWidth={1} className="" />
              </button>
            )
          ) : (
            <span className="spinner-border" />
          )}

          <button className="icon-btn">
            <CartIcon title="放入購物車" strokeWidth={1} />
          </button>
        </div>
      </section>

      <section className="card-body d-flex flex-column gap-1">
        {/* 卡片標題容器 => 限定兩行 */}
        <div
          className="line-clamp-2"
          style={{
            minHeight: "72px",
          }}
        >
          <H5Secondary isBold={false} className="text-gray-600">
            {name}
          </H5Secondary>
        </div>
        <TextSmall as="del" className="card-text text-gray-400">
          {`NT$ ${formatPrice(original_price, false)}`}
        </TextSmall>
        <p className="card-text">
          <TextMedium>NT$ </TextMedium>
          <TextLarge>{formatPrice(selling_price, false)}</TextLarge>
        </p>
      </section>
    </main>
  );
}
ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
export default ProductCard;
