import { any, func, string } from "prop-types";
import { useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useLazyGetReviewByIdQuery } from "@features/review/reviewApi";
import { TextLarge, TextMedium, TextSmall } from "@components/TextTypography";
import { useMaskedText } from "@hooks/useMaskedText";
import RatingStars from "@components/homepage/RatingStars";
import LikeButton from "@components/homepage/LikeButton";
import { formatToTaipeiDate } from "@utils/formatToTaipeiTime";

const APP_BASE = import.meta.env.VITE_APP_BASE;

function ReviewModal({ modalRef, reviewId, onClose }) {
  const [trigger, { data: getReviewResponse, isFetching }] = useLazyGetReviewByIdQuery();

  useEffect(() => {
    if (reviewId) trigger(reviewId);
  }, [reviewId, trigger]);

  const { is_liked, review } = getReviewResponse?.data ?? {};
  const {
    Products: product = {},
    Users: user = {},
    comment = "",
    created_at = "",
    id = "",
    likes_count = 0,
    rating = 0,
    reply = null,
  } = review ?? {};

  const maskedEmail = useMaskedText(user.email, "email", { random: true });

  const isLoading = isFetching || !review;

  return (
    <div ref={modalRef} className="modal fade" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header review-card-header">
            <div className="image-container flex-shrink-0 shadow-sm">
              {isLoading ? (
                <Skeleton circle height={92} width={92} />
              ) : (
                <img src={user.photo || `${APP_BASE}icon/default_avatar.svg`} alt="評論者頭貼" />
              )}
            </div>
            <div className="d-flex flex-column gap-2 flex-grow-1 overflow-hidden">
              <TextLarge className="user-title text-truncate">
                {isLoading ? <Skeleton width="60%" height={24} /> : maskedEmail}
              </TextLarge>
              <TextSmall className="fw-normal text-truncate">
                {isLoading ? <Skeleton width="80%" height={20} /> : `購買：${product.name}`}
              </TextSmall>
            </div>
            <button type="button" className="btn-close" onClick={onClose} />
          </div>

          <div className="modal-body review-card-body" style={{ minHeight: "200px" }}>
            <div className="pt-4 d-flex flex-column justify-content-center align-items-center">
              {isLoading ? (
                <Skeleton width={24} height={24} circle count={5} inline className="me-2" />
              ) : (
                <RatingStars id={id} rating={rating} />
              )}
            </div>
            <div className="d-flex flex-column gap-2 px-4 mt-3">
              <TextMedium as="p" className="fw-normal text-balance">
                {isLoading ? <Skeleton height={24} count={3} /> : comment}
              </TextMedium>
              <TextSmall as="p" className="fw-bolder">
                {isLoading ? <Skeleton height={16} width="40%" /> : formatToTaipeiDate(created_at)}
              </TextSmall>
            </div>
            {reply && !isLoading && (
              <div className="bg-gray-100 p-4 rounded-3 mt-2">
                <TextMedium as="p" className="fw-normal text-balance">
                  {reply}
                </TextMedium>
              </div>
            )}
          </div>

          <div className="modal-footer review-card-footer">
            {isLoading ? (
              <Skeleton width={80} height={36} />
            ) : (
              <LikeButton is_liked={is_liked} likes_count={likes_count} reviewId={id} />
            )}
            <button className="btn btn-secondary border-primary-1000" onClick={onClose}>
              關閉
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

ReviewModal.propTypes = {
  modalRef: any.isRequired,
  onClose: func.isRequired,
  reviewId: string.isRequired,
};

export default ReviewModal;
