import Arrow from "@assets/icons/arrow.svg?react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { TextLarge } from "@components/TextTypography";
import { H2Primary } from "@components/Headings";
import ProductCarousel from "@components/homepage/ProductCarousel";

function ProductShowcase({ title, products }) {
  return (
    <>
      <section className="container py-20">
        <H2Primary className="heading-em-dash">{title}</H2Primary>
        <ProductCarousel products={products} />
        <div className="my-2">
          <TextLarge
            as={Link}
            to="/products"
            className="d-flex align-items-center justify-content-end"
          >
            查看更多
            <Arrow width={44} height={16} className="ms-3" />
          </TextLarge>
        </div>
      </section>
    </>
  );
}

ProductShowcase.propTypes = {
  title: PropTypes.string.isRequired,
  products: PropTypes.array.isRequired,
};

export default ProductShowcase;
