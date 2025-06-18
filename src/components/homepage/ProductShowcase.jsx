import { Link } from "react-router-dom";
import PropTypes, { array, bool, string } from "prop-types";

import { TextLarge } from "@components/TextTypography";
import { H2Primary } from "@components/Headings";
import ProductCarousel from "@components/homepage/ProductCarousel";
import { HeadingToArrowIcon } from "@components/icons";

function ProductShowcase({ title, products, isLoading }) {
  return (
    <>
      <section className="container-md container-fluid py-20 py-md-15">
        {/* 區塊標題 */}
        <H2Primary className="heading-em-dash mb-md-10 mb-5">{title}</H2Primary>
        {/* 卡片輪播 */}
        <ProductCarousel products={products} isLoading={isLoading} />
        {/* 查看更多 */}
        <div className="d-flex align-items-center justify-content-end">
          <TextLarge
            as={Link}
            to="/products"
            title="前往商品頁面"
            className="py-2 d-flex align-items-center fw-md-5 fw-6 link-hover"
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
  title: string.isRequired,
  products: array.isRequired,
  isLoading: bool.isRequired,
};

export default ProductShowcase;
