import { object } from "prop-types";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { H6Secondary } from "@components/Headings";
import { TextSmall, TextMedium, LabelText } from "@components/TextTypography";
import { formatPrice } from "@utils/formatPrice";
import { showLoading } from "@features/loading/loadingSlice";

function MobileProductCard({ product }) {
  const { id, name, condition, primary_image, original_price, selling_price } = product;
  const dispatch = useDispatch();

  return (
    <main className="mobile-product-card">
      <section className="img-container">
        <img src={primary_image} alt={name} />
        <LabelText className="card-badge mt-3">{condition}</LabelText>
      </section>
      <section className="card-content d-flex flex-column gap-2">
        <H6Secondary isBold={false} className="text-balance line-clamp-2">
          {name}
        </H6Secondary>
        <div className="product-price mt-auto">
          <TextSmall className="line-through text-gray-400">{`NT$ ${formatPrice(original_price, false)}`}</TextSmall>
          <p className="d-flex align-items-end gap-1 text-primary-1000">
            <TextSmall>NT$</TextSmall>
            <TextMedium>{formatPrice(selling_price, false)}</TextMedium>
          </p>
        </div>
      </section>
      <Link
        to={`/products/${id}`}
        className="stretched-link"
        title={`前往查看 ${name}`}
        onClick={() => {
          dispatch(showLoading());
        }}
      />
    </main>
  );
}

MobileProductCard.propTypes = {
  product: object.isRequired,
};

export default MobileProductCard;
