import { Link } from "react-router-dom";

import CarouselBanner from "@components/homepage/CarouselBanner";
import ProductSection from "@/components/homepage/ProductSection";

function HomePage() {
  return (
    <>
      {/* 輪播橫幅 */}
      <CarouselBanner />

      {/* 商品區塊 */}
      <ProductSection />

      <div className="container">
        <Link className="text-sans text-m d-block" to="/account/profile/settings">
          進入會員中心（驗證登入）
        </Link>
        <Link className="text-sans text-m d-block" to="/register">
          註冊
        </Link>
      </div>
    </>
  );
}

export default HomePage;
