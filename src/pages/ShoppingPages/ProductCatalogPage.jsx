import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { useGetProductsQuery } from "@features/products/productApi";
import ProductFilter from "@components/productpage/ProductFilter";
import ProductList from "@components/productpage/ProductList";
import CategoryImage from "@components/productpage/CategoryImage";
import lensImage from "@assets/images/len.png";

function ProductCatalogPage() {
  const [searchParams] = useSearchParams();
  const queryParams = Object.fromEntries(searchParams.entries());
  const { data: apiResponse = {}, isLoading, isError } = useGetProductsQuery(queryParams);
  const allProducts = React.useMemo(
    () => (Array.isArray(apiResponse.data) ? apiResponse.data : []),
    [apiResponse.data]
  );
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const category = "lens";

  useEffect(() => {
    if (!isLoading && !isError) {
      if (allProducts.length > 0) setFilteredProducts(allProducts);
    }
  }, [apiResponse, allProducts, isLoading, isError]);

  const handleFilter = filters => {
    const { brands, statuses, minPrice, maxPrice } = filters;

    const filtered = allProducts.filter(product => {
      // 品牌篩選：如果沒有選擇品牌或產品品牌在選擇的品牌列表中
      const matchesBrand = !brands || brands.length === 0 || brands.includes(product.brand);

      // 狀態篩選：如果沒有選擇狀態或產品狀態在選擇的狀態列表中
      const matchesStatus =
        !statuses || statuses.length === 0 || statuses.includes(product.condition);

      // 價格比較
      const matchesPrice =
        (!minPrice || product.selling_price >= minPrice) &&
        (!maxPrice || product.selling_price <= maxPrice);

      return matchesBrand && matchesStatus && matchesPrice;
    });

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Failed to load products. Please try again later.</div>;
  }

  return (
    <div className="product-catalog-page">
      <div className="container">
        {/* Category Image */}
        {/*<CategoryImage category={category} />*/}
        <div className="category-image-wrapper text-center mb-4">
          <img
            src={lensImage}
            alt="lens category"
            className="category-image"
            style={{ width: "100%", height: "auto" }}
            onError={e => {
              console.error("Failed to load lens image");
              e.target.style.display = "none";
            }}
          />
        </div>

        {/* ProductFilter */}
        <div className="filter-area">
          <ProductFilter onFilter={handleFilter} />
        </div>
      </div>

      {/* ProductList */}
      <div className="product-list-wrapper">
        <div className="container">
          {filteredProducts.length === 0 ? (
            // 無符合商品的顯示
            <div className="no-products-found">
              <div className="text-center py-5">
                <h4 className="mb-3">無符合商品</h4>
                <p className="text-muted">
                  很抱歉，沒有找到符合您篩選條件的商品。
                  <br />
                  請嘗試調整篩選條件或瀏覽其他商品。
                </p>
              </div>
            </div>
          ) : (
            <ProductList product={paginatedProducts} />
          )}
        </div>

        {/* 只有當有商品時才顯示分頁 */}
        {filteredProducts.length > 0 && (
          <div className="container">
            {/* Pagination */}
            <div className="pagination-container text-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                    >
                      &lt;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li
                      key={index}
                      className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setCurrentPage(index + 1)}>
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                    >
                      &gt;
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCatalogPage;
