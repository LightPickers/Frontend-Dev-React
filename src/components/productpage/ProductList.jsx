import React from "react";
import PropTypes from "prop-types";
import ProductCard from "@components/homepage/ProductCard";
import MobileProductCard from "@components/homepage/MobileProductCard";
import useBreakpoint from "@hooks/useBreakpoints"; // 引入 useBreakpoint

function ProductList({ product }) {
  // 使用 useBreakpoint 判斷螢幕寬度是否大於 991px
  const isLgUp = useBreakpoint("lgUp"); // lgUp 表示 992px 及以上

  return (
    <div className="product-grid-container">
      <div className="row">
        {product &&
          product.map(item => (
            <div
              key={item.id}
              className={
                isLgUp
                  ? "col-lg-4 col-xl-3 d-flex justify-content-center" // 992px 以上，大螢幕佈局
                  : "col-12 col-375-6 col-sm-6 col-md-4 d-flex justify-content-center" // 991px 以下，小螢幕佈局
              }
            >
              <div className={isLgUp ? "product-card-wrapper" : ""}>
                {isLgUp ? (
                  <ProductCard product={item} /> // 992px 以上使用 ProductCard
                ) : (
                  <MobileProductCard product={item} /> // 991px 以下使用 MobileProductCard
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
};

export default ProductList;
