import { Link } from "react-router-dom";

import CarouselBanner from "@components/homepage/CarouselBanner";
import ProductSection from "@components/homepage/ProductSection";
import FeaturedCategories from "@components/homepage/FeaturedCategories";
import WhyUsSection from "@components/homepage/WhyUsSection";
import BeSalerSection from "@components/homepage/BeSalerSection";

function HomePage() {
  return (
    <>
      {/* 輪播橫幅 */}
      <CarouselBanner />

      {/* 商品區塊 */}
      <ProductSection />

      {/* 矚目類別 */}
      <FeaturedCategories />

      {/* 為什麼選擇我們 */}
      <WhyUsSection />

      {/* CTA */}
      <BeSalerSection />
    </>
  );
}

export default HomePage;
