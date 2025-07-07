import { bool, number, string } from "prop-types";
import { useState } from "react";

import { ThumbsUpFilledIcon, ThumbsUpIcon } from "@components/icons";
import { TextMedium } from "@components/TextTypography";
import { useSetReviewLikedMutation, useSetReviewUnlikedMutation } from "@features/review/reviewApi";
import { ErrorAlert } from "@components/Alerts";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

function LikeButton({ is_liked, likes_count, reviewId }) {
  const [isLiked, setIsLiked] = useState(is_liked);
  const [totalLikes, setTotalLikes] = useState(likes_count);
  const [animate, setAnimate] = useState(false);

  const [setReviewLiked, { isLoading: isSettingLiked }] = useSetReviewLikedMutation();
  const [setReviewUnliked, { isLoading: isSettingUnliked }] = useSetReviewUnlikedMutation();

  const toggleLike = async () => {
    setAnimate(true);
    setTimeout(() => setAnimate(false), 300);

    try {
      if (!isLiked) {
        setIsLiked(true);
        setTotalLikes(prev => prev + 1);
        await setReviewLiked(reviewId).unwrap();
      } else {
        setIsLiked(false);
        setTotalLikes(prev => prev - 1);
        await setReviewUnliked(reviewId).unwrap();
      }
    } catch (error) {
      setIsLiked(is_liked);
      setTotalLikes(likes_count);
      ErrorAlert({ text: getApiErrorMessage(error) });
    }
  };
  return (
    <button
      type="button"
      onClick={toggleLike}
      disabled={isSettingLiked || isSettingUnliked}
      className="p-2 like-btn btn outline-none border-0 shadow-none d-flex align-items-center gap-2"
    >
      <div
        className={`d-flex justify-content-center align-items-center like-icon ${animate ? "animate" : ""}`}
      >
        {!isLiked ? <ThumbsUpIcon size={28} /> : <ThumbsUpFilledIcon size={28} />}
      </div>
      <TextMedium as="p" className="fw-normal text-primary-1000">
        {totalLikes}
      </TextMedium>
    </button>
  );
}

LikeButton.propTypes = {
  reviewId: string.isRequired,
  is_liked: bool.isRequired,
  likes_count: number.isRequired,
};

export default LikeButton;
