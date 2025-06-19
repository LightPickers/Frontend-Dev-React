import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { H5Secondary } from "@components/Headings";
import { TextSmall, TextMedium, TextLarge, LabelText } from "@components/TextTypography";
import { SearchIcon, CartIcon, FavoriteFilledIcon } from "@components/icons";
import { formatPrice } from "@utils/formatPrice";
import {
  useDeleteWishlistProductMutation,
  useGetWishlistProductsQuery,
} from "@features/wishlist/wishlistApi";
import { useAddToCartMutation } from "@features/cart/cartApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

function WishlistCard({ product }) {
  const { id, name, condition, primary_image, original_price, selling_price } = product;

  const [deleteWishlistProduct, { isLoading: isRemovingFromWishlist }] =
    useDeleteWishlistProductMutation();
  const { data: wishlist, refetch } = useGetWishlistProductsQuery();

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  const handleDeleteWishlistProduct = async () => {
    const targetIndex = wishlist?.data.findIndex(item => item.Products.id === id);
    const favoriteId = wishlist?.data[targetIndex]?.id;
    try {
      await deleteWishlistProduct(favoriteId).unwrap();
      toast.success("已取消收藏");
      refetch();
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(id).unwrap();
      toast.success("已加入購物車");
    } catch (error) {
      toast.error(getApiErrorMessage(error));
    }
  };

  return (
    <main className="card product-card h-100 mb-4">
      {/* 圖片區域 */}
      <section className="card-image-container">
        {/* 商品主圖 */}
        <img
          src={primary_image || "https://fakeimg.pl/300/"}
          className="product-image object-fit-cover"
          alt={name}
        />

        {/* 機況標籤/ 後端目前沒回傳 */}
        {/* <LabelText className="card-badge mt-5">{condition}</LabelText> */}

        {/* 懸停按鈕 */}
        <div className="icon-group">
          <Link to={`/products/${id}`} className="icon-btn">
            <SearchIcon title="查看商品" strokeWidth={1} />
          </Link>

          <button
            className="icon-btn"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            title="放入購物車"
          >
            <CartIcon strokeWidth={1} />
          </button>

          <button
            className="icon-btn text-danger"
            onClick={handleDeleteWishlistProduct}
            disabled={isRemovingFromWishlist}
            title="取消收藏"
          >
            <FavoriteFilledIcon strokeWidth={1} />
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

WishlistCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default WishlistCard;
