import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

import { H5Secondary } from "@components/Headings";
import { TextSmall, TextLarge, LabelText } from "@components/TextTypography";
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

  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation(); // ✅ 加入購物車 hook

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
    <div className="card wishlist-card h-100 shadow-sm border-0 position-relative overflow-hidden">
      {/* 商品圖 */}
      <div className="position-relative">
        <img
          src={primary_image || "https://fakeimg.pl/300/"}
          alt={name}
          className="card-img-top object-fit-cover"
          style={{ height: "200px", transition: "transform 0.3s" }}
        />
        {/* 放大與查看按鈕 */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{ opacity: 0, transition: "opacity 0.3s", backgroundColor: "rgba(0,0,0,0.3)" }}
        >
          <Link to={`/products/${id}`} className="btn btn-light rounded-circle">
            <SearchIcon />
          </Link>
        </div>

        {/* 機況 */}
        <LabelText className="position-absolute top-0 start-0 m-2 bg-secondary text-white px-2 py-1 rounded small">
          {condition}
        </LabelText>
      </div>

      {/* 內容 */}
      <div className="card-body d-flex flex-column justify-content-between">
        {/* 名稱 */}
        <div className="line-clamp-2 mb-2" style={{ minHeight: "48px" }}>
          <H5Secondary isBold={false} className="text-gray-700">
            {name}
          </H5Secondary>
        </div>

        {/* 價格 */}
        <TextSmall as="del" className="text-gray-400">
          NT$ {formatPrice(original_price, false)}
        </TextSmall>
        <TextLarge className="text-gray-800">NT$ {formatPrice(selling_price, false)}</TextLarge>

        {/* 按鈕*/}
        <div className="d-flex justify-content-end align-items-center gap-2 mt-3">
          {/*  加入購物車 */}
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={handleAddToCart}
            disabled={isAddingToCart}
          >
            <CartIcon />
          </button>

          {/* 取消收藏 */}
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={handleDeleteWishlistProduct}
            disabled={isRemovingFromWishlist}
          >
            <FavoriteFilledIcon />
          </button>
        </div>
      </div>

      {/* hover */}
      <style>{`
        .wishlist-card:hover img {
          transform: scale(1.05);
        }
        .wishlist-card:hover .position-absolute.top-0.start-0.w-100.h-100 {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

WishlistCard.propTypes = {
  product: PropTypes.object.isRequired,
};

export default WishlistCard;
