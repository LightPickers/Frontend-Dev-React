import React from "react";
import PropTypes from "prop-types";
import ProductCard from "@components/homepage/ProductCard";
import MobileProductCard from "@components/homepage/MobileProductCard";

function ProductList({ product, useMobileCard = false }) {
  return (
    <div className="product-grid-container">
      <div className="row">
        {product &&
          product.map(item => (
            <div
              key={item.id}
              className={
                useMobileCard
                  ? "col-12 col-375-6 col-sm-4 col-md-3 d-flex justify-content-center"
                  : "col-12 col-375-6 col-md-3 col-lg-3 col-xl-3 d-flex justify-content-center"
              }
            >
              <div className={useMobileCard ? "" : "product-card-wrapper"}>
                {useMobileCard ? (
                  <MobileProductCard product={item} />
                ) : (
                  <ProductCard product={item} />
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}

ProductList.propTypes = {
  product: PropTypes.arrayOf(PropTypes.object).isRequired,
  useMobileCard: PropTypes.bool,
};

export default ProductList;
