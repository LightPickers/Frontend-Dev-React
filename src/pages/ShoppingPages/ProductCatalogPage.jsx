import React, { useState, useEffect } from "react";

import { useGetProductsQuery } from "@features/products/productApi";
import ProductFilter from "@components/productpage/ProductFilter";
import ProductList from "@components/productpage/ProductList";

function ProductCatalogPage() {
  const { data: apiResponse = {}, isLoading, isError } = useGetProductsQuery();
  const allProducts = Array.isArray(apiResponse.data) ? apiResponse.data : [];
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (!isLoading && !isError) {
      console.log("API Response:", apiResponse);
      setFilteredProducts(allProducts);
    }
  }, [allProducts, isLoading, isError]);

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
        <ProductFilter onFilter={handleFilter} />
        <div className="product-list-wrapper">
          <ProductList products={paginatedProducts} />
          <div className="pagination-container text-center mt-4">
            <nav>
              <ul className="pagination">
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
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCatalogPage;
