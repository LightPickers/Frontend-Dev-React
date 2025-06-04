import { array } from "prop-types";
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";

function ProductGalleryCarousel({ gallery }) {
  const productImages = gallery;
  console.log({ productImages });
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  return (
    <div className="product-gallery">
      {/* 大圖 */}
      <Swiper
        modules={[Navigation, Thumbs]}
        navigation
        thumbs={{ swiper: thumbsSwiper }}
        className="mb-3"
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={index} className="swiper-slide-main">
            <img src={image} alt={`Product ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 縮圖 */}
      <Swiper
        modules={[Thumbs]}
        watchSlidesProgress
        slidesPerView={5}
        spaceBetween={12}
        onSwiper={setThumbsSwiper}
        // className="thumbs-swiper"
      >
        {productImages.map((image, index) => (
          <SwiperSlide key={index} className="swiper-slide-thumb">
            <img src={image} alt={`Thumb ${index + 1}`} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

ProductGalleryCarousel.propTypes = {
  gallery: array.isRequired,
};

export default ProductGalleryCarousel;
