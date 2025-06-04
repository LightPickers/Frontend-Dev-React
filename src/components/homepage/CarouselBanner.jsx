import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";

import "swiper/css";
// import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { H1Primary } from "@components/Headings";
import SearchIcon from "@components/icons/SearchIcon";

const APP_BASE = import.meta.env.VITE_APP_BASE;
const BANNER_SLIDES = [
  {
    id: 1,
    backgroundImage: `${APP_BASE}homepage/banner/banner-1.png`,
    title: "探詢菲林，尋覓光影",
    elementType: "button",
    buttonText: "成為賣家",
  },
  {
    id: 2,
    backgroundImage: `${APP_BASE}homepage/banner/banner-2.png`,
    title: "你的珍藏，能是別人的靈光",
    elementType: "search",
    placeholderText: "搜尋商品…",
  },
  {
    id: 3,
    backgroundImage: `${APP_BASE}homepage/banner/banner-3.png`,
    title: "探詢菲林，尋覓光影",
    elementType: "button",
    buttonText: "成為賣家",
  },
  {
    id: 4,
    backgroundImage: `${APP_BASE}homepage/banner/banner-4.png`,
    title: "你的珍藏，能是別人的靈光",
    elementType: "search",
    placeholderText: "搜尋商品…",
  },
];

function CarouselBanner() {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <>
      <div className="bg-white">
        <section className="carousel-banner-container container">
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
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            // effect="fade"
            onSlideChange={swiper => setActiveIndex(swiper.activeIndex)}
            className="swiper-container"
          >
            {BANNER_SLIDES.map(slide => {
              const imageTexts = slide.title.split("，");
              return (
                <SwiperSlide key={slide.id}>
                  {/* 背景 */}
                  <div
                    className="slide-container"
                    style={{
                      backgroundImage: `linear-gradient(270deg, rgba(0, 0, 0, 0) 5.98%, rgba(0, 0, 0, 0.2) 76.12%), url(${slide.backgroundImage})`,
                    }}
                  >
                    <div className="content-wrapper">
                      {/* 文字 */}
                      <div className="text-content text-white">
                        <H1Primary>{imageTexts[0]}</H1Primary>
                        <H1Primary>{imageTexts[1]}</H1Primary>
                      </div>
                      <div>
                        {/* 按鈕 */}
                        {slide.elementType === "button" && (
                          <button type="button" className="btn-custom-secondary">
                            成為賣家
                          </button>
                        )}
                        {/* 搜尋框 */}
                        {slide.elementType === "search" && (
                          <div className="search-input-group mt-3">
                            <input
                              type="text"
                              className="search-input form-control"
                              placeholder={slide.placeholderText}
                              aria-label="Search"
                            />
                            <button className="search-btn btn btn-link" type="button">
                              <SearchIcon className="text-primary-200" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
          <div className="external-pagination mt-12 text-center"></div>
        </section>
      </div>
    </>
  );
}

export default CarouselBanner;
