import { number, string } from "prop-types";

import { StarFilledIcon, StarIcon } from "@components/icons";

function RatingStars({ id, rating }) {
  const totalStars = 5;
  const filledStars = Number(rating);
  return (
    <div className="review-rating">
      {Array.from({ length: totalStars }).map((_, index) => {
        const Icon = index < filledStars ? StarFilledIcon : StarIcon;
        return <Icon className="text-gray-600" key={`${id}-star-${index}`} />;
      })}
    </div>
  );
}

RatingStars.propTypes = {
  id: string.isRequired,
  rating: number.isRequired,
};
export default RatingStars;
