import { useState } from "react";

import { useGetWishlistProductsQuery } from "@/features/wishlist/wishlistApi";

import WishlistCard from "@/components/productpage/WishlistCard";

// 假資料
const mockWishlist = [
  {
    id: 1,
    name: "Canon EOS R6",
    condition: "良好",
    primary_image:
      "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?q=80&w=1476&auto=format&fit=crop",
    liked: true,
    original_price: 78000,
    selling_price: 65900,
  },
  {
    id: 2,
    name: "Nikon Z6 II",
    condition: "良好",
    primary_image:
      "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?q=80&w=1476&auto=format&fit=crop",
    liked: true,
    original_price: 72000,
    selling_price: 63500,
  },
  {
    id: 3,
    name: "Sony A7 IV",
    condition: "良好",
    primary_image:
      "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?q=80&w=1476&auto=format&fit=crop",
    liked: true,
    original_price: 82000,
    selling_price: 69800,
  },
  {
    id: 4,
    name: "Fujifilm X-T5",
    condition: "良好",
    primary_image:
      "https://images.unsplash.com/photo-1536632087471-3cf3f2986328?q=80&w=1476&auto=format&fit=crop",
    liked: true,
    original_price: 46000,
    selling_price: 41200,
  },
];

function WishlistPage() {
  const [wishlist, setWishlist] = useState(mockWishlist);
  const { data, error, isLoading } = useGetWishlistProductsQuery();

  console.log("從後端抓到的收藏資料：", data);

  return (
    <div style={{ backgroundColor: "#f1f3f5", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">
        <div className="row g-4">
          {/* 左側欄位 */}
          <div className="col-lg-3">
            <div className="bg-white rounded shadow-sm p-4">
              <div className="text-center">
                <img
                  src="https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop"
                  alt="會員照片"
                  className="rounded-circle mb-2"
                  width={80}
                  height={80}
                />
                <div>王小明</div>
                <div>ss1234@gmail</div>
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
