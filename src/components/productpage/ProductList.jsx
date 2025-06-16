import React from "react";
import PropTypes from "prop-types";

import ProductCard from "@components/homepage/ProductCard";

function ProductList({ product }) {
  return (
    <section className="product-grid-container container">
      <div className="row g-3 g-md-4">
        {product.map((product, index) => (
          <div
            key={product?.id || index}
            className="col-12 col-360-6 col-lg-4 col-xl-3 d-flex justify-content-center"
          >
            <div className="product-card-wrapper">
              {product ? <ProductCard product={product} /> : <div>Invalid product data</div>}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

ProductList.propTypes = {
  product: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProductList;
