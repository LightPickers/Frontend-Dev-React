import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

import { useGetProductsQuery } from "@features/products/productApi";
import ProductFilter from "@components/productpage/ProductFilter";
import ProductList from "@components/productpage/ProductList";
import CategoryImage from "@components/productpage/CategoryImage";
import { getCurrentCategoryInfo } from "@utils/CategoryImageUtils";

function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 獲取當前類別資訊
  const categoryInfo = getCurrentCategoryInfo(searchParams);

  // 從 URL 參數構建 API 查詢參數
  const apiQueryParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: itemsPerPage,
    };

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

    return params;
  }, [searchParams, currentPage, itemsPerPage]);

  const { data: apiResponse = {}, isLoading, isError } = useGetProductsQuery(apiQueryParams);

  const products = useMemo(() => {
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }, [apiResponse]);

  const totalPages = apiResponse.total_pages || 0;

  // 提取搜尋參數為變數
  const categoryId = searchParams.get("category_id");
  const brandId = searchParams.get("brand_id");
  const conditionId = searchParams.get("condition_id");
  const keyword = searchParams.get("keyword");
  const priceRange = searchParams.get("price_range");

  // 當篩選條件改變時重置到第一頁
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, brandId, conditionId, keyword, priceRange]);

  const handleFilter = filters => {
    const { brandIds, statusIds, minPrice, maxPrice } = filters;
    const newSearchParams = new URLSearchParams(searchParams);

    newSearchParams.delete("brand_id");
    newSearchParams.delete("condition_id");
    newSearchParams.delete("price_range");
    newSearchParams.delete("page");

    if (brandIds && brandIds.length > 0) {
      newSearchParams.set("brand_id", brandIds[0]);
    }

    if (statusIds && statusIds.length > 0) {
      newSearchParams.set("condition_id", statusIds[0]);
    }

    if (minPrice !== null && maxPrice !== null) {
      newSearchParams.set("price_range", JSON.stringify([minPrice, maxPrice]));
    }

    setSearchParams(newSearchParams);
    setCurrentPage(1);
  };

  const handlePageChange = page => {
    setCurrentPage(page);
    const newSearchParams = new URLSearchParams(searchParams);
    if (page > 1) {
      newSearchParams.set("page", page.toString());
    } else {
      newSearchParams.delete("page");
    }
    setSearchParams(newSearchParams);
  };

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
      {/* Category Image - 完全貼齊 header，撐滿寬度 */}
      <CategoryImage category={categoryInfo.categoryName} />

      {/* 篩選器區域 - 白色背景，貼齊頁面左右 */}
      <div className="filter-area-wrapper">
        <div className="container">
          <div className="filter-area">
            <ProductFilter
              onFilter={handleFilter}
              initialBrandId={searchParams.get("brand_id")}
              initialConditionId={searchParams.get("condition_id")}
            />
          </div>
        </div>
      </div>

      {/* 商品列表 */}
      <div className="product-list-wrapper">
        <div className="container">
          {products.length === 0 ? (
            <div className="no-products-found">
              <div className="text-center py-5">
                <h4 className="mb-3">無符合{categoryInfo.displayName}商品</h4>
                <p className="text-muted">
                  很抱歉，沒有找到符合您篩選條件的{categoryInfo.displayName}商品。
                  <br />
                  請嘗試調整篩選條件或瀏覽其他商品。
                </p>
              </div>
            </div>
          ) : (
            <ProductList product={products} />
          )}
        </div>

        {/* 分頁 */}
        {products.length > 0 && totalPages > 1 && (
          <div className="container">
            <div className="pagination-container text-center mt-4">
              <nav aria-label="商品列表分頁">
                <ul className="pagination justify-content-center">
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

                  {(() => {
                    const maxVisiblePages = 10;
                    const pages = [];

                    if (totalPages <= maxVisiblePages) {
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(i);
                      }
                    } else {
                      const halfVisible = Math.floor(maxVisiblePages / 2);
                      let startPage = Math.max(1, currentPage - halfVisible);
                      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

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
