import React, { useState, useEffect } from "react";

import { useGetProductsQuery } from "@features/products/productApi";
import ProductFilter from "@components/productpage/ProductFilter";
import ProductList from "@components/productpage/ProductList";
import CategoryImage from "@components/productpage/CategoryImage";

function ProductCatalogPage() {
  const { data: apiResponse = {}, isLoading, isError } = useGetProductsQuery();
  const allProducts = React.useMemo(
    () => (Array.isArray(apiResponse.data) ? apiResponse.data : []),
    [apiResponse.data]
  );
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const category = "lens"; // 替換為實際的 category 值

  useEffect(() => {
    if (!isLoading && !isError) {
      console.log("API Response:", apiResponse);
      setFilteredProducts(allProducts);
    }
  }, [apiResponse, allProducts, isLoading, isError]);

  const handleFilter = filters => {
    const { brand, status, minPrice, maxPrice } = filters;
    const filtered = allProducts.filter(product => {
      const matchesBrand = !brand || product.brand === brand;
      const matchesStatus = !status || product.condition === status;
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
        <CategoryImage category={category} />

        {/* ProductFilter */}
        <div className="filter-area">
          <ProductFilter onFilter={handleFilter} />
        </div>
      </div>

      {/* ProductList */}
      <div className="product-list-wrapper">
        <div className="container">
          <ProductList products={paginatedProducts} />
        </div>

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
      </div>
    </div>
  );
}

export default ProductCatalogPage;
