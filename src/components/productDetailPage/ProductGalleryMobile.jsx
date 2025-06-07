import { useRef } from "react";
import { array } from "prop-types";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeftIcon, ChevronRightIcon } from "@components/icons";

function ProductGalleryMobile({ gallery }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  return (
    <div className="product-gallery d-md-none d-block">
      <Swiper
        modules={[Navigation]}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        onBeforeInit={swiper => {
          swiper.params.navigation.prevEl = prevRef.current;
          swiper.params.navigation.nextEl = nextRef.current;
        }}
      >
        {gallery.map((image, index) => (
          <SwiperSlide key={index} className="swiper-slide-main">
            <img src={image} alt={`Product ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
      <button ref={prevRef} className="swiper-mobile-navigation-prev">
        <ChevronLeftIcon />
      </button>
      <button ref={nextRef} className="swiper-mobile-navigation-next">
        <ChevronRightIcon />
      </button>
    </div>
  );
}

ProductGalleryMobile.propTypes = {
  gallery: array.isRequired,
};

export default ProductGalleryMobile;
