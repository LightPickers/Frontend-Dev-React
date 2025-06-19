import { Link, useLocation } from "react-router-dom";
import { useState, useMemo } from "react";

import { useGetWishlistProductsQuery } from "@/features/wishlist/wishlistApi";
import { useGetUserProfileQuery } from "@/features/users/userApi";
import WishlistCard from "@/components/productpage/WishlistCard";
import { BtnPrimary } from "@/components/Buttons";
import {
  H3Primary,
  H3Secondary,
  H4Primary,
  H5Primary,
  H5Secondary,
  H6Primary,
  H6Secondary,
} from "@/components/Headings";

function mapWishlistData(apiData) {
  if (!apiData || !Array.isArray(apiData.data)) return [];

  return apiData.data.map(item => ({
    id: item.Products.id,
    name: item.Products.name,
    primary_image: item.Products.primary_image,
    liked: true,
    condition: item.Products.condition_name,
    original_price: item.Products.original_price,
    selling_price: item.Products.selling_price,
    created_at: item.created_at,
  }));
}

function WishlistPage() {
  const { data, error, isLoading } = useGetWishlistProductsQuery();
  const wishlist = mapWishlistData(data);

  const { data: userData, error: userError, isLoading: isUserLoading } = useGetUserProfileQuery();
  const user = userData?.data?.user;

  const isPageLoading = isLoading || isUserLoading;
  const location = useLocation();

  const [sortOption, setSortOption] = useState("default");

  const sortedWishlist = useMemo(() => {
    if (!wishlist.length) return [];

    const sorted = [...wishlist];
    switch (sortOption) {
      case "price-high":
        sorted.sort((a, b) => b.selling_price - a.selling_price);
        break;
      case "price-low":
        sorted.sort((a, b) => a.selling_price - b.selling_price);
        break;
      case "newest":
        sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        break;
      case "oldest":
        sorted.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        break;

      default:
        break;
    }

    return sorted;
  }, [wishlist, sortOption]);

  const handleSortChange = e => {
    console.log("目前排序選項：", e.target.value);
    setSortOption(e.target.value);
  };

  if (isPageLoading) {
    return (
      <div className="text-center text-muted py-5">
        <div className="spinner-border text-secondary mb-3" role="status"></div>
        <div>資料載入中，請稍候...</div>
      </div>
    );
  }

  return (
    <>
      {/* 不要再包 container/row/col 或 bg-white，這些 AccountLayout 已經有了 */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-3">
        <h4 className="mb-3 mb-md-0">收藏資訊</h4>
        <select className="form-select w-auto" value={sortOption} onChange={handleSortChange}>
          <option value="default">排序方式：預設</option>
          <option value="price-high">價格（由高到低）</option>
          <option value="price-low">價格（由低到高）</option>
          <option value="newest">上架順序（由新到舊）</option>
          <option value="oldest">上架順序（由舊到新）</option>
        </select>
      </div>
      <hr />
      <div className="row g-4">
        {wishlist.length > 0 ? (
          sortedWishlist.map(product => (
            <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6 col-sm-12" key={product.id}>
              <WishlistCard product={product} />
            </div>
          ))
        ) : (
          <div className="text-center py-5 w-100">
            <H6Secondary className="mb-6">尚未收藏任何商品</H6Secondary>
            <BtnPrimary as={Link} to="/" size="medium">
              前往首頁探索商品
            </BtnPrimary>
          </div>
        )}
      </div>
    </>
  );
}

export default WishlistPage;
