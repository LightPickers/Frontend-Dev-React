import PropTypes from "prop-types";

import { H5Secondary } from "@components/Headings";
function ProductCard({ product }) {
  return (
    <section
      className="d-flex align-items-center"
      style={{
        width: "280px",
        height: "447px",
      }}
    >
      <H5Secondary isBold={false}>{product.name}</H5Secondary>
    </section>
  );
}
ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
};
export default ProductCard;
