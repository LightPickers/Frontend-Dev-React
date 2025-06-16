import { array, bool } from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";

import ProductCard from "@components/homepage/ProductCard";
import MobileProductCard from "@components/homepage/MobileProductCard";
import ProductCardSkeleton from "@/components/loaders/ProductCardSkeleton";
import useBreakpoint from "@hooks/useBreakpoints";

function ProductCarousel({ products, isLoading }) {
  const isMdUp = useBreakpoint("mdUp");
  const swiperBreakpoints = {
    // for breakpoint 375px
    360: {
      slidesPerView: 2,
      spaceBetween: 16,
    },
    460: {
      slidesPerView: 2.3,
      spaceBetween: 16,
    },
    530: {
      slidesPerView: 2.6,
      spaceBetween: 16,
    },
    576: {
      slidesPerView: 3.3,
      spaceBetween: 20,
    },
    720: {
      slidesPerView: 3.5,
      spaceBetween: 24,
    },
    // 768 => 換大卡片
    768: {
      slidesPerView: 2.5,
      spaceBetween: 24,
    },
    992: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
    1200: {
      slidesPerView: 3.3,
      spaceBetween: 24,
    },
    1400: {
      slidesPerView: 4.2,
      spaceBetween: 24,
    },
  };

  if (isLoading) {
    return (
      <Swiper
        className="mb-10 py-2"
        spaceBetween={12}
        slidesPerView={1}
        breakpoints={swiperBreakpoints}
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <SwiperSlide key={`skeleton-${i}`}>
            <ProductCardSkeleton />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return (
    <Swiper
      className="mb-10 py-2"
      spaceBetween={12}
      slidesPerView={1}
      autoHeight={false}
      breakpoints={swiperBreakpoints}
    >
      {products.map(product => (
        <SwiperSlide key={product.id}>
          {isMdUp ? <ProductCard product={product} /> : <MobileProductCard product={product} />}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

ProductCarousel.propTypes = {
  products: array.isRequired,
  isLoading: bool.isRequired,
};

export default ProductCarousel;
