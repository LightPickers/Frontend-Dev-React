import {
  useGetFeaturedProductsQuery,
  useGetLatestProductsQuery,
} from "@features/products/productApi";
import ProductShowcase from "@components/homepage/ProductShowcase";
import { TextMedium } from "@components/TextTypography";

function ProductSection() {
  const { data: featuredProductData, isLoading: isGettingTheFeatured } =
    useGetFeaturedProductsQuery();
  const { data: latestProductData, isLoading: isGettingTheLatest } = useGetLatestProductsQuery();
  const featuredProductList = featuredProductData?.data ?? [];
  const latestProducList = latestProductData?.data ?? [];

  return (
    <>
      {/* 精選產品 */}
      <div className="bg-gray-100">
        {!isGettingTheFeatured ? (
          <ProductShowcase title={"精選商品"} products={featuredProductList} />
        ) : (
          <TextMedium as="p" className="d-flex justify-content-center align-items-center py-10">
            正在載入中……
          </TextMedium>
        )}
      </div>

      {/* 最新商品 */}
      <div className="bg-white">
        {!isGettingTheLatest ? (
          <ProductShowcase title={"最新商品"} products={latestProducList} />
        ) : (
          <TextMedium as="p" className="d-flex justify-content-center align-items-center py-10">
            正在載入中……
          </TextMedium>
        )}
      </div>
    </>
  );
}

export default ProductSection;
