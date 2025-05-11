import PropTypes from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";

import ProductCard from "@components/homepage/ProductCard";

function ProductCarousel({ products }) {
  return (
    <Swiper
      className="mb-10"
      spaceBetween={12}
      slidesPerView={1}
      breakpoints={{
        // when window width is >= 375px
        375: {
          slidesPerView: 1.8,
          spaceBetween: 12,
        },
        // when window width is >= 576px
        576: {
          slidesPerView: 1.3,
          spaceBetween: 12,
        },
        // when window width is >= 768px
        768: {
          slidesPerView: 2.2,
          spaceBetween: 16,
        },
        // when window width is >= 992px
        992: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 24,
        },
        1200: {
          slidesPerView: 3.5,
          spaceBetween: 24,
        },
        1400: {
          slidesPerView: 4.2,
          spaceBetween: 24,
        },
      }}
    >
      {products.map(product => (
        <SwiperSlide key={product.id}>
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

ProductCarousel.propTypes = {
  products: PropTypes.array.isRequired,
};

export default ProductCarousel;
