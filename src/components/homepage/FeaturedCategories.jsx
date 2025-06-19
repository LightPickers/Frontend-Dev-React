import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { H2Primary, H3Primary } from "@components/Headings";
import { BtnPrimary } from "@components/Buttons";
import { useGetFeaturedCategoryQuery } from "@features/products/productApi";

function FeaturedCategories() {
  const { data: getFeaturedCategoryResponse, isLoading: isGettingCategories } =
    useGetFeaturedCategoryQuery();

  const categories = getFeaturedCategoryResponse?.data ?? [];

  // 確保至少顯示 300ms 的 loading 狀態 => 避免閃爍
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowLoading(false);
    }, 300); // 300ms 延遲

    return () => clearTimeout(timer);
  }, [isGettingCategories]);

  const shouldShowSkeleton = isGettingCategories || showLoading;

  // Skeleton 區塊
  const skeletonCards = Array.from({ length: 4 }).map((_, index) => (
    <div className="col-lg-3 col-6" key={`skeleton-${index}`}>
      <main className="category-card d-flex flex-column align-items-center justify-content-between gap-md-7 gap-sm-5 gap-3 pt-md-7 pt-5 pb-md-9 pb-7 fade-in">
        <div className="image-container">
          <Skeleton
            width="100%"
            height="100%"
            style={{
              borderRadius: "50%",
              objectFit: "contain",
            }}
          />
        </div>
        <H3Primary className="text-gray-600 w-75 text-center">
          <Skeleton width="100%" height={24} />
        </H3Primary>
        <div className="d-md-block d-none w-50">
          <Skeleton height={36} borderRadius={4} />
        </div>
        <div className="d-md-none d-block w-75">
          <Skeleton height={28} borderRadius={4} />
        </div>
      </main>
    </div>
  ));

  return (
    <SkeletonTheme baseColor="#e0e0e0" highlightColor="#f5f5f5">
      <div className="bg-gray-100">
        <section className="container-md container-fluid py-lg-30 py-15">
          <H2Primary className="heading-em-dash mb-sm-10 mb-5">矚目類別</H2Primary>
          <div className="row g-6">
            {shouldShowSkeleton
              ? skeletonCards
              : categories.map(category => {
                  const { id, name, image } = category;
                  return (
                    <div className="col-lg-3 col-6" key={id}>
                      <main className="category-card d-flex flex-column align-items-center justify-content-between gap-md-7 gap-sm-5 gap-3 pt-md-7 pt-5 pb-md-9 pb-7 fade-in">
                        <div className="image-container">
                          <img className="category-image" src={image} alt={name} />
                        </div>
                        <H3Primary className="text-gray-600">{name}</H3Primary>
                        <BtnPrimary
                          size="medium"
                          as={Link}
                          className="d-md-block d-none stretched-link"
                          to={`/products?category_id=${id}`}
                        >
                          查看更多
                        </BtnPrimary>
                        <BtnPrimary
                          size="small"
                          as={Link}
                          className="d-md-none d-block stretched-link"
                          to={`/products?category_id=${id}`}
                        >
                          查看更多
                        </BtnPrimary>
                      </main>
                    </div>
                  );
                })}
          </div>
        </section>
      </div>
    </SkeletonTheme>
  );
}

export default FeaturedCategories;
