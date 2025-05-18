import React from "react";
import PropTypes from "prop-types";

import ProductCard from "@components/productpage/ProductCard";

function ProductList({ products }) {
  return (
    <section className="product-grid-container container">
      <div className="row">
        {products.map((product, index) => (
          <div key={product?.id || index} className="col-6 col-md-4 col-lg-3 mb-4">
            {product ? (
              <ProductCard
                name={product.name}
                condition={product.condition}
                original_price={product.original_price}
                selling_price={product.selling_price}
                imageUrl={product.imageUrl}
                tag={product.tag}
              />
            ) : (
              <div>Invalid product data</div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
ProductList.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ProductList;
