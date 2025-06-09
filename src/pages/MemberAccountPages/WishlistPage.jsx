import { Link, useLocation } from "react-router-dom";

import { useGetWishlistProductsQuery } from "@/features/wishlist/wishlistApi";
import { useGetUserProfileQuery } from "@/features/users/userApi";
import { useState, useMemo } from "react";
import WishlistCard from "@/components/productpage/WishlistCard";

function mapWishlistData(apiData) {
  if (!apiData || !Array.isArray(apiData.data)) return [];

  return apiData.data.map(item => ({
    id: item?.product_id,
    name: item?.product_name,
    primary_image: item?.product_primary_image,
    liked: true,
    original_price: item?.product_original_price,
    selling_price: item?.product_selling_price,
    created_at: item?.favorites_created_at,
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
      <div
        style={{
          backgroundColor: "#f1f3f5",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div className="text-center text-muted">
          <div className="spinner-border text-secondary mb-3" role="status"></div>
          <div>資料載入中，請稍候...</div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="row g-4">
        {/* 右側 */}
        <div className="col-lg-12">
          <div className="bg-white rounded  p-4">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
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
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={product.id}>
                    <WishlistCard product={product} />
                  </div>
                ))
              ) : (
                <div className="text-center text-muted py-5 w-100">
                  <p className="mb-3 fs-5">尚未收藏任何商品</p>
                  <Link to="/" className="btn btn-outline-secondary">
                    前往首頁探索商品
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 右側內容 end */}
      </div>
    </div>
  );
}

export default WishlistPage;
