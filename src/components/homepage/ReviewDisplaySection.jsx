import { Swiper, SwiperSlide } from "swiper/react";
import { useState } from "react";

import { H2Primary } from "@components/Headings";
import { useGetIndexReviewsQuery } from "@features/review/reviewApi";
import ReviewCard from "@components/homepage/ReviewCard";
import ReviewModal from "@components/homepage/ReviewModal";
import useBootstrapModal from "@hooks/useBootstrapModal";
import ReviewCardSkeleton from "@components/loaders/ReviewCardSkeleton";

const swiperBreakpoints = {
  430: {
    slidesPerView: 1.3,
    spaceBetween: 16,
  },
  600: {
    slidesPerView: 1.8,
    spaceBetween: 20,
  },
  768: {
    slidesPerView: 2,
    spaceBetween: 24,
  },
  992: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
  1200: {
    slidesPerView: 2.5,
    spaceBetween: 24,
  },
  1400: {
    slidesPerView: 3,
    spaceBetween: 24,
  },
};

function ReviewDisplaySection() {
  const { data: getReviewsResponse, isLoading: isGettingReviews } = useGetIndexReviewsQuery();
  const reviews = getReviewsResponse?.data.indexReviews ?? [];

  const { modalRef, show, hide } = useBootstrapModal();
  const [selectedId, setSelectedId] = useState(null);

  const handleOpenModal = review => {
    // 判斷當下選擇的評論、取需要的 ID
    setSelectedId(review.id);
    show();
  };
  return (
    <>
      <section className="container-md container-fluid py-lg-15 py-20">
        <H2Primary className="heading-em-dash mb-md-10 mb-5">用戶回饋</H2Primary>
        {/* 評論輪播 */}
        <Swiper
          className="mb-10 py-2"
          spaceBetween={12}
          slidesPerView={1}
          autoHeight={false}
          breakpoints={swiperBreakpoints}
        >
          {isGettingReviews || !reviews.length
            ? Array.from({ length: 3 }).map((_, idx) => (
                <SwiperSlide key={`skeleton-${idx}`}>
                  <ReviewCardSkeleton />
                </SwiperSlide>
              ))
            : reviews.map(review => (
                <SwiperSlide key={review.id}>
                  <ReviewCard review={review} onOpen={() => handleOpenModal(review)} />
                </SwiperSlide>
              ))}
        </Swiper>
      </section>
      <ReviewModal modalRef={modalRef} reviewId={selectedId} onClose={hide} />
    </>
  );
}

export default ReviewDisplaySection;
