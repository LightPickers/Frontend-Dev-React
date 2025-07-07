import { func, object } from "prop-types";

import { TextLarge, TextMedium, TextSmall } from "@components/TextTypography";
import RatingStars from "@components/homepage/RatingStars";
import { useMaskedText } from "@hooks/useMaskedText";
import { formatToTaipeiDate } from "@utils/formatToTaipeiTime";
import { ArrowUpRightIcon, CalendarCheckIcon } from "@components/icons";
import useRequireAuth from "@hooks/useRequireAuth";

const APP_BASE = import.meta.env.VITE_APP_BASE;

function ReviewCard({ review, onOpen }) {
  const { Users: user, Products: product, id, rating, comment, created_at } = review;
  const maskedEmail = useMaskedText(user.email, "email", { random: true });
  const requireAuth = useRequireAuth();

  return (
    <>
      <main
        className="review-card"
        onClick={() => {
          requireAuth(onOpen);
        }}
      >
        <section className="review-card-header">
          <div className="image-container shadow-sm flex-shrink-0">
            <img src={user.photo || `${APP_BASE}icon/default_avatar.svg`} alt="評論者頭貼" />
          </div>
          <div className="d-flex flex-column gap-2 flex-grow-1 overflow-hidden">
            <TextLarge className="user-title text-truncate">{maskedEmail}</TextLarge>
            <TextSmall className="fw-normal user-title text-truncate">{`購買：${product.name}`}</TextSmall>
          </div>
        </section>

        <section className="review-card-body">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <RatingStars id={id} rating={rating} />
          </div>
          <div className="">
            <TextMedium as="p" className="fw-normal text-balance line-clamp-5">
              {comment}
            </TextMedium>
          </div>
        </section>
        <section className="review-card-footer">
          <TextSmall as="p" className="d-flex align-items-center gap-2">
            <CalendarCheckIcon size={20} />
            {formatToTaipeiDate(created_at)}
          </TextSmall>
          <ArrowUpRightIcon className="text-gray-500" />
        </section>
      </main>
    </>
  );
}

ReviewCard.propTypes = {
  review: object.isRequired,
  onOpen: func.isRequired,
};

export default ReviewCard;
