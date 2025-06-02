import { Link, useLocation } from "react-router-dom";
import { useGetWishlistProductsQuery } from "@/features/wishlist/wishlistApi";
import { useGetUserProfileQuery } from "@/features/users/userApi";
import WishlistCard from "@/components/productpage/WishlistCard";

function mapWishlistData(apiData) {
  if (!apiData || !Array.isArray(apiData.data)) return [];

  return apiData.data.map(item => ({
    id: item.Products.id,
    name: item.Products.name,
    primary_image: item.Products.primary_image,
    liked: true,
    original_price: item.Products.original_price, // 目前後端沒提供
    selling_price: item.Products.selling_price,
  }));
}

function WishlistPage() {
  const { data, error, isLoading } = useGetWishlistProductsQuery();
  const wishlist = mapWishlistData(data);

  const { data: userData, error: userError, isLoading: isUserLoading } = useGetUserProfileQuery();
  const user = userData?.data?.user;

  const isPageLoading = isLoading || isUserLoading;
  const location = useLocation();

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
              <select className="form-select w-auto">
                <option>排序方式：預設</option>
                <option>價格（由高到低）</option>
                <option>價格（由低到高）</option>
                <option>上架順序（由新到舊）</option>
                <option>上架順序（由舊到新）</option>
              </select>
            </div>
            <hr />
            <div className="row g-4">
              {wishlist.length > 0 ? (
                wishlist.map(product => (
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
