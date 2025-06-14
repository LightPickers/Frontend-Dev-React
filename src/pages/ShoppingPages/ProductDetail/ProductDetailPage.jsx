import { useParams, Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { useLazyGetProductByIdQuery } from "@features/products/productApi";
import { H3Primary, H4Primary, H5Primary, H5Secondary, H6Primary } from "@components/Headings";
import { TextMedium } from "@components/TextTypography";
import { formatPrice } from "@utils/formatPrice";
import ProductContentNav from "@components/productDetailPage/ProductContentNav";
import Breadcrumbs from "@components/Breadcrumbs";
import ProductGalleryCarousel from "@components/productDetailPage/ProductGalleryCarousel";
import AddToCartBtn from "@components/productDetailPage/AddToCartBtn";
import AddToWishlistBtn from "@components/productDetailPage/AddToWishlistBtn";
import ProductSidebar from "@components/productDetailPage/ProductSidebar";
import ProductGalleryMobile from "@components/productDetailPage/ProductGalleryMobile";
import ProductDetailSkeleton from "@/components/loading/ProductDetailSkeleton";

function ProductDetailPage() {
  const { productId } = useParams();
  const [triggerGetProductById, { data: getProductResponse, isLoading: isGettingProduct }] =
    useLazyGetProductByIdQuery();

  const fetchProduct = useCallback(async () => {
    if (productId) {
      try {
        await triggerGetProductById(productId).unwrap();
      } catch (err) {
        console.error("載入產品失敗:", err);
      }
    }
  }, [productId, triggerGetProductById]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const { data = {}, imageCount = 0, imageList = [] } = getProductResponse ?? {};

  const {
    id = "",
    name = "",
    primary_image = "",
    original_price = 0,
    selling_price = 0,
    subtitle = "",
    summary = [],
    title = "",
    Brands = {},
    Categories = {},
    Conditions = {},
    description = "",
    hashtags = [],
  } = data ?? {};
  const secondaryImages = imageList?.map(i => i.image);
  const productImages = [primary_image, ...secondaryImages];

  if (isGettingProduct) return <ProductDetailSkeleton />;

  return (
    <div className="product-detail py-20 d-flex flex-column gap-10">
      <Breadcrumbs />
      <main>
        <div className="container-lg container-fluid">
          <div className="row d-flex">
            {/* 左邊側欄 */}
            <ProductSidebar category={Categories.name} categoryId={Categories.id} />

            {/* 主要區域 */}
            <section className="col-lg-10">
              <div className="row product-section mb-10">
                {/* 圖片區域 */}
                <section className="col-md-6 product-images">
                  <div className="image-container">
                    {imageCount === 0 && (
                      // 單圖模式
                      <div className="single-image-setting border border-gray-200">
                        {primary_image && (
                          <img src={primary_image} alt={name} className="image-fluid" />
                        )}
                      </div>
                    )}
                    {imageCount > 0 && (
                      // 多圖模式
                      <>
                        <ProductGalleryCarousel gallery={productImages} />
                        <ProductGalleryMobile gallery={productImages} />
                      </>
                    )}
                  </div>
                </section>

                {/* 右半邊 */}
                <section className="col-md-6 product-info d-flex flex-column justify-content-between align-items-start pb-lg-13 pb-0 gap-8">
                  {/* 摘要 */}
                  <div className="d-flex flex-column gap-3 mt-md-0 mt-6">
                    <TextMedium className="tag-for-condition">{Conditions.name}</TextMedium>
                    <H3Primary className="text-balance">{name}</H3Primary>

                    {summary && Array.isArray(summary) ? (
                      <ul className="product-feature-list text-gray-500 text-balance">
                        {summary.map((point, index) => (
                          <li key={index}>
                            <H5Secondary isBold={false} className="lh-base">
                              {point}
                            </H5Secondary>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <H5Secondary isBold={false} className="lh-base">
                        暫無摘要內容
                      </H5Secondary>
                    )}
                  </div>
                  <div className="d-flex flex-column gap-md-8 gap-6 w-100">
                    {/* 價格 */}
                    <div className="d-flex align-items-end gap-4">
                      {original_price !== 0 && (
                        <div className="text-gray-400 d-flex gap-1 align-items-end">
                          <H6Primary className="lh-base">$</H6Primary>
                          <H5Primary className="line-through lh-base">
                            {formatPrice(original_price, false)}
                          </H5Primary>
                        </div>
                      )}
                      <div className="text-primary-800 d-flex align-items-end gap-1">
                        <H4Primary>$</H4Primary>
                        <H3Primary>{formatPrice(selling_price, false)}</H3Primary>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="d-flex justify-content-between">
                      <AddToCartBtn id={id} name={name} className="product-btn" />
                      <AddToWishlistBtn id={id} name={name} className="product-btn" />
                    </div>
                  </div>
                </section>
              </div>
              <div className="d-flex flex-column gap-md-5 gap-3">
                <ProductContentNav id={id} />

                <Outlet context={{ id, title, subtitle, description, primary_image, hashtags }} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetailPage;
