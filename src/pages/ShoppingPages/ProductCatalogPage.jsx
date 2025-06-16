import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useGetProductsQuery } from "@features/products/productApi";
import ProductFilter from "@components/productpage/ProductFilter";
import ProductList from "@components/productpage/ProductList";
import CategoryImage from "@components/productpage/CategoryImage";
import lensImage from "@assets/images/len.png";

function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 從 URL 參數構建 API 查詢參數
  const apiQueryParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: itemsPerPage,
    };

    // 從 URL 參數中取得篩選條件
    const categoryId = searchParams.get("category_id");
    const brandId = searchParams.get("brand_id");
    const conditionId = searchParams.get("condition_id");
    const keyword = searchParams.get("keyword");
    const priceRange = searchParams.get("price_range");

    if (categoryId) params.category_id = categoryId;
    if (brandId) params.brand_id = brandId;
    if (conditionId) params.condition_id = conditionId;
    if (keyword) params.keyword = keyword;
    if (priceRange) params.price_range = priceRange;

    console.log("API Query Params:", params);

    return params;
  }, [searchParams, currentPage, itemsPerPage]);

  const { data: apiResponse = {}, isLoading, isError } = useGetProductsQuery(apiQueryParams);

  const products = useMemo(() => {
    console.log("API Response:", apiResponse);
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }, [apiResponse.data]);

  const totalPages = apiResponse.total_pages || 0;

  // 當篩選條件改變時重置到第一頁
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchParams.get("category_id"),
    searchParams.get("brand_id"),
    searchParams.get("condition_id"),
    searchParams.get("keyword"),
    searchParams.get("price_range"),
  ]);

  const handleFilter = filters => {
    const { brandIds, statusIds, minPrice, maxPrice } = filters;
    const newSearchParams = new URLSearchParams(searchParams);

    // 清除舊的篩選參數
    newSearchParams.delete("brand_id");
    newSearchParams.delete("condition_id");
    newSearchParams.delete("price_range");
    newSearchParams.delete("page"); // 重置頁數

    // 設置新的篩選參數 - 使用 ID 而不是名稱
    if (brandIds && brandIds.length > 0) {
      // 目前後端只支援單一品牌，取第一個
      newSearchParams.set("brand_id", brandIds[0]);
    }

    if (statusIds && statusIds.length > 0) {
      // 目前後端只支援單一狀態，取第一個
      newSearchParams.set("condition_id", statusIds[0]);
    }

    if (minPrice !== null && maxPrice !== null) {
      newSearchParams.set("price_range", JSON.stringify([minPrice, maxPrice]));
    }

    setSearchParams(newSearchParams);
    setCurrentPage(1); // 重置到第一頁
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    // 可選：將頁數加入 URL 參數
    const newSearchParams = new URLSearchParams(searchParams);
    if (page > 1) {
      newSearchParams.set("page", page.toString());
    } else {
      newSearchParams.delete("page");
    }
    setSearchParams(newSearchParams);
  };

  // 從 URL 參數中獲取初始頁數
  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      const pageNumber = parseInt(pageParam, 10);
      if (pageNumber > 0) {
        setCurrentPage(pageNumber);
      }
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="alert alert-danger" role="alert">
          Failed to load products. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="product-catalog-page">
      <div className="container">
        {/* Category Image */}
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
          <ProductFilter
            onFilter={handleFilter}
            initialBrandId={searchParams.get("brand_id")}
            initialConditionId={searchParams.get("condition_id")}
          />
        </div>
      </div>

      {/* ProductList */}
      <div className="product-list-wrapper">
        <div className="container">
          {products.length === 0 ? (
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
            <ProductList product={products} />
          )}
        </div>

        {/* 分頁功能 - 只有當有商品且總頁數大於1時才顯示 */}
        {products.length > 0 && totalPages > 1 && (
          <div className="container">
            <div className="pagination-container text-center mt-4">
              <nav aria-label="商品列表分頁">
                <ul className="pagination justify-content-center">
                  {/* 上一頁按鈕 */}
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      aria-label="上一頁"
                    >
                      &lt;
                    </button>
                  </li>

                  {/* 頁碼按鈕 - 智慧顯示 */}
                  {(() => {
                    const maxVisiblePages = 10;
                    const pages = [];

                    if (totalPages <= maxVisiblePages) {
                      // 如果總頁數不超過最大顯示頁數，顯示所有頁碼
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      // 智慧顯示頁碼
                      const halfVisible = Math.floor(maxVisiblePages / 2);
                      let startPage = Math.max(1, currentPage - halfVisible);
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

                      // 調整起始頁，確保顯示足夠的頁碼
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                      }
                    }

                    return pages.map(pageNumber => (
                      <li
                        key={pageNumber}
                        className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNumber)}
                          aria-label={`第 ${pageNumber} 頁`}
                          aria-current={currentPage === pageNumber ? "page" : undefined}
                        >
                          {pageNumber}
                        </button>
                      </li>
                    ));
                  })()}

                  {/* 下一頁按鈕 */}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      aria-label="下一頁"
                    >
                      &gt;
                    </button>
                  </li>
                </ul>
              </nav>

              {/* 分頁資訊 */}
              <div className="pagination-info mt-2">
                <small className="text-muted">
                  第 {currentPage} 頁，共 {totalPages} 頁
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCatalogPage;
