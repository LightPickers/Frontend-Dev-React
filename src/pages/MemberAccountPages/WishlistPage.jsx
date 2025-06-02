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

  const { data: userData, error: userError, isLoading: userLoading } = useGetUserProfileQuery();
  const user = userData?.data?.user;

  return (
    <div style={{ backgroundColor: "#f1f3f5", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">
        <div className="row g-4">
          {/* 左側欄位 */}
          <div className="col-lg-3">
            <div className="bg-white rounded shadow-sm p-4">
              <div className="text-center">
                <img
                  src={
                    user?.photo
                      ? user.photo
                      : "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop"
                  }
                  alt="會員照片"
                  className="rounded-circle mb-2"
                  width={80}
                  height={80}
                />
                <div>{user?.name || "未登入"}</div>
                <div>{user?.email || "無法取的您的電子郵件"}</div>
              </div>
              <hr />
              <ul className="list-unstyled mb-0">
                <li>
                  <a
                    href="#"
                    className="text-decoration-none d-block py-2 text-secondary"
                    style={{ color: "#495057" }}
                  >
                    我的帳戶
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-decoration-none d-block py-2 text-secondary"
                    style={{ color: "#495057" }}
                  >
                    訂單資訊
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="fw-bold text-decoration-none d-block py-2"
                    style={{ color: "#8BB0B7" }}
                  >
                    收藏資訊
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* 右側內容 */}
          <div className="col-lg-9">
            <div className="bg-white rounded shadow-sm p-4">
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
                {wishlist.map(product => (
                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-6" key={product.id}>
                    <WishlistCard product={product} />
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* 右側內容 end */}
        </div>
      </div>
    </div>
  );
}

export default WishlistPage;
