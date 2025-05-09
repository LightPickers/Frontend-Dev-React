import { Link } from "react-router-dom";

import CarouselBanner from "@/components/CarouselBanner";

function HomePage() {
  return (
    <>
      {/* 輪播橫幅 */}
      <section className="container">
        <CarouselBanner />
      </section>
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
