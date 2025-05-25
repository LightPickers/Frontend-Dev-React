import React from "react";
import PropTypes from "prop-types";

import ProductCard from "@components/homepage/ProductCard";

function ProductList({ product }) {
  return (
    <section className="product-grid-container container">
      <div className="row">
        {product.map((product, index) => (
          <div key={product?.id || index} className="col-6 col-md-4 col-lg-3 mb-4">
            {product ? <ProductCard product={product} /> : <div>Invalid product data</div>}
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
