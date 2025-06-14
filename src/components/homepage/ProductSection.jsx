import {
  useGetFeaturedProductsQuery,
  useGetLatestProductsQuery,
} from "@features/products/productApi";
import ProductShowcase from "@components/homepage/ProductShowcase";

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
        <ProductShowcase
          title={"精選商品"}
          products={featuredProductList}
          isLoading={isGettingTheFeatured}
        />
      </div>

      {/* 最新商品 */}
      <div className="bg-white">
        <ProductShowcase
          title={"最新商品"}
          products={latestProducList}
          isLoading={isGettingTheLatest}
        />
      </div>
    </>
  );
}

export default ProductSection;
