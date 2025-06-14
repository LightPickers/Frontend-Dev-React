import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Link } from "react-router-dom";

import { H1Primary } from "@components/Headings";
import SearchIcon from "@components/icons/SearchIcon";
import getBannerCarouselPics from "@data/bannerCarouselPics";
import useBreakpoint from "@/hooks/useBreakpoints";
import BannerSearchBar from "@/components/homepage/BannerSearchBar";

const BANNER_SLIDES = getBannerCarouselPics();
const BACKGROUND_GRADIENT =
  "linear-gradient(270deg, rgba(0, 0, 0, 0) 5.98%, rgba(0, 0, 0, 0.2) 76.12%)";

function CarouselBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef(null);
  const autoplayTimeoutRef = useRef(null);
  const isMdUp = useBreakpoint("mdUp");

  const handleInteraction = () => {
    if (swiperRef.current?.autoplay) {
      // 確認 autoplay 已停止
      swiperRef.current.autoplay.stop();
    }

    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current);
    }

    // 設定恢復 autoplay
    autoplayTimeoutRef.current = setTimeout(() => {
      swiperRef.current?.autoplay?.start();
    }, 10000);
  };

  return (
    <>
      <div className="bg-white">
        <section className="carousel-banner-container container-xl container-fluid">
          <Swiper
            modules={[Pagination, Autoplay, EffectFade]}
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            pagination={{
              el: ".external-pagination",
              clickable: true,
              renderBullet: (index, className) => {
                return `<span class="${className} carousel-banner-bullet"></span>`;
              },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: true }}
            onSwiper={swiper => {
              swiperRef.current = swiper;
            }}
            onTouchEnd={handleInteraction}
            onSlideChange={swiper => {
              setActiveIndex(swiper.activeIndex);
              handleInteraction();
            }}
            className="swiper-container"
          >
            {BANNER_SLIDES.map(slide => {
              const { id, images, element } = slide;
              const { forLargeScreen: lgImage, forSmallScreen: smImage } = images;
              const { title, text, type } = element;

              const carouselImage = isMdUp ? lgImage : smImage;
              const imageTexts = title.split("，");

              return (
                <SwiperSlide key={id}>
                  {/* 背景 */}
                  <div
                    className="slide-container"
                    style={{
                      backgroundImage: `${BACKGROUND_GRADIENT}, url(${carouselImage})`,
                    }}
                  >
                    <div className="content-wrapper">
                      {/* 文字 */}
                      <div className="text-content text-white">
                        <H1Primary className="mb-2 mb-lg-1">{imageTexts[0]}</H1Primary>
                        <H1Primary>{imageTexts[1]}</H1Primary>
                      </div>
                      <div>
                        {/* 按鈕 */}
                        {type === "button" && (
                          <Link
                            to="/sell"
                            role="button"
                            className="d-block text-center btn-custom-secondary"
                          >
                            {text}
                          </Link>
                        )}
                        {/* 搜尋框 */}
                        {type === "search" && <BannerSearchBar text={text} />}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="external-pagination mt-md-12 mt-6 text-center"></div>
        </section>
      </div>
    </>
  );
}

export default CarouselBanner;
