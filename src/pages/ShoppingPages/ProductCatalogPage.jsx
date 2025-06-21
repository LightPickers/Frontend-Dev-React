import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";

import { useGetProductsQuery } from "@features/products/productApi";
import ProductFilter from "@components/productpage/ProductFilter";
import ProductList from "@components/productpage/ProductList";
import CategoryImage from "@components/productpage/CategoryImage";
import useBreakpoint from "@hooks/useBreakpoints";
import { getCurrentCategoryInfo } from "@utils/CategoryImageUtils";
import PageLoader from "@components/loaders/PageLoader";

function ProductCatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [isFiltering, setIsFiltering] = useState(false); // 新增狀態
  const itemsPerPage = 20;

  const isXlUp = useBreakpoint("xlUp");

  // 獲取當前類別資訊
  const categoryInfo = getCurrentCategoryInfo(searchParams);

  // 提取搜尋參數為變數 - 包含多選參數
  const categoryId = searchParams.get("category_id");
  const brandId = searchParams.get("brand_id");
  const brandIds = searchParams.get("brand_ids");
  const conditionId = searchParams.get("condition_id");
  const conditionIds = searchParams.get("condition_ids");
  const keyword = searchParams.get("keyword");
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const priceRange = searchParams.get("price_range");

  // 計算初始品牌和條件 IDs
  const initialBrandIds = useMemo(() => {
    if (brandIds) {
      return brandIds;
    } else if (brandId) {
      // 將單選轉換為多選格式
      return brandId;
    }
    return null;
  }, [brandIds, brandId]);

  const initialConditionIds = useMemo(() => {
    if (conditionIds) {
      return conditionIds;
    } else if (conditionId) {
      // 將單選轉換為多選格式
      return conditionId;
    }
    return null;
  }, [conditionIds, conditionId]);

  // 從 URL 參數構建 API 查詢參數 - 統一使用多選參數
  const apiQueryParams = useMemo(() => {
    const params = {
      page: currentPage,
      page_size: itemsPerPage,
    };

    if (categoryId) params.category_id = categoryId;

    // 統一使用 brand_ids 參數 (同時支援單選和多選)
    if (brandIds) {
      params.brand_ids = brandIds;
    } else if (brandId) {
      params.brand_ids = brandId; // 將單選值作為多選參數傳遞
    }

    // 統一使用 condition_ids 參數 (同時支援單選和多選)
    if (conditionIds) {
      params.condition_ids = conditionIds;
    } else if (conditionId) {
      params.condition_ids = conditionId; // 將單選值作為多選參數傳遞
    }

    if (keyword) params.keyword = keyword;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (priceRange) params.price_range = priceRange;

    return params;
  }, [
    currentPage,
    itemsPerPage,
    categoryId,
    brandIds,
    brandId,
    conditionIds,
    conditionId,
    keyword,
    minPrice,
    maxPrice,
    priceRange,
  ]);

  const { data: apiResponse = {}, isLoading, isError } = useGetProductsQuery(apiQueryParams);

  const products = useMemo(() => {
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }, [apiResponse]);

  const totalPages = apiResponse.total_pages || 0;

  // 當篩選條件改變時重置到第一頁 - 更新依賴項
  useEffect(() => {
    setCurrentPage(1);
  }, [categoryId, brandIds, conditionIds, keyword, minPrice, maxPrice, priceRange]);

  const handleFilter = async filters => {
    const { brand_ids, condition_ids, minPrice, maxPrice } = filters;
    const newSearchParams = new URLSearchParams(searchParams);

    // 清除舊的篩選參數
    newSearchParams.delete("brand_id");
    newSearchParams.delete("condition_id");
    newSearchParams.delete("brand_ids");
    newSearchParams.delete("condition_ids");
    newSearchParams.delete("min_price");
    newSearchParams.delete("max_price");
    newSearchParams.delete("price_range");
    newSearchParams.delete("page");
    newSearchParams.delete("keyword");

    // 設置新的多選參數
    if (brand_ids) {
      newSearchParams.set("brand_ids", brand_ids);
    }

    if (condition_ids) {
      newSearchParams.set("condition_ids", condition_ids);
    }

    // 設置價格範圍參數
    if (minPrice !== null && minPrice !== undefined) {
      newSearchParams.set("min_price", minPrice.toString());
    }
    if (maxPrice !== null && maxPrice !== undefined) {
      newSearchParams.set("max_price", maxPrice.toString());
    }

    setIsFiltering(true); // 顯示 PageLoader
    setSearchParams(newSearchParams);
    setCurrentPage(1);

    // 確保 PageLoader 至少顯示 800ms
    const minimumLoadingTime = new Promise(resolve => setTimeout(resolve, 800));

    try {
      await minimumLoadingTime;
    } finally {
      setIsFiltering(false); // 隱藏 PageLoader
    }
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
    <>
      <PageLoader loading={isLoading || isFiltering} text="載入商品列表中" />
      <div className="product-catalog-page">
        {/* Category Image - 集中在中間，緊貼 Header */}
        <div className="category-image-wrapper">
          <CategoryImage category={categoryInfo.categoryName} />
        </div>

        {/* 篩選器區域 */}
        <div className="filter-area-wrapper">
          <div className="container-lg">
            <div className="filter-area">
              <ProductFilter
                onFilter={handleFilter}
                initialBrandIds={initialBrandIds}
                initialConditionIds={initialConditionIds}
              />
            </div>
          </div>
        </div>

        {/* 商品列表 */}
        <div className="product-list-wrapper">
          <div className="container-lg">
            {/* 麵包屑 */}
            <nav aria-label="breadcrumb" className="mb-3">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">首頁</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/products">商品列表</Link>
                </li>
                {categoryInfo.displayName && (
                  <li className="breadcrumb-item active" aria-current="page">
                    {categoryInfo.displayName}
                  </li>
                )}
                {keyword && (
                  <li className="breadcrumb-item active" aria-current="page">
                    搜尋：{keyword}
                  </li>
                )}
              </ol>
            </nav>

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
              <ProductList product={products} useMobileCard={!isXlUp} />
            )}
          </div>

          {/* 分頁 */}
          {products.length > 0 && totalPages > 1 && (
            <div className="container-lg">
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
                        onClick={() =>
                          currentPage < totalPages && handlePageChange(currentPage + 1)
                        }
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
    </>
  );
}

export default ProductCatalogPage;
