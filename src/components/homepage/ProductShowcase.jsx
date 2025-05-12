import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import { TextLarge } from "@components/TextTypography";
import { H2Primary } from "@components/Headings";
import ProductCarousel from "@components/homepage/ProductCarousel";
import { HeadingToArrowIcon } from "@components/icons";

function ProductShowcase({ title, products }) {
  return (
    <>
      <section className="container py-20">
        {/* 區塊標題 */}
        <H2Primary className="heading-em-dash mb-10">{title}</H2Primary>
        {/* 卡片輪播 */}
        <ProductCarousel products={products} />
        {/* 查看更多 */}
        <div className="my-2 d-flex align-items-center justify-content-end">
          <TextLarge
            as={Link}
            to="/products"
            title="前往商品頁面"
            className="d-flex align-items-center"
          >
            查看更多
            <HeadingToArrowIcon size={44} title="前往商品頁面" className="ms-3" />
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
