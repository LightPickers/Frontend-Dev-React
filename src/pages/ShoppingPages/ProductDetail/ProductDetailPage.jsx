import { useParams, Outlet } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";

import { useLazyGetProductByIdQuery } from "@features/products/productApi";
import {
  H3Primary,
  H4Primary,
  H5Primary,
  H5Secondary,
  H6Primary,
  H6Secondary,
} from "@components/Headings";
import { TextLarge, TextMedium } from "@components/TextTypography";
import { productDetailTestData } from "@data/productDetailTestData";
import ProductGalleryCarousel from "@components/productDetailPage/ProductGalleryCarousel";
import { formatPrice } from "@utils/formatPrice";
import { BtnPrimary } from "@components/Buttons";
import ProductContentNav from "@/components/productDetailPage/ProductContentNav";

function ProductDetailPage() {
  // const { productId } = useParams();
  // const [triggerGetProductById, { data: getProductResponse }] = useLazyGetProductByIdQuery();

  // const fetchProduct = useCallback(async () => {
  //   if (productId) {
  //     try {
  //       await triggerGetProductById(productId).unwrap();
  //     } catch (err) {
  //       console.error("載入產品失敗:", err);
  //     }
  //   }
  // }, [productId, triggerGetProductById]);

  // useEffect(() => {
  //   fetchProduct();
  // }, [fetchProduct]);
  // console.log({ getProductResponse });

  // const { data = {}, imageCount = 0, imageList = [] } = getProductResponse ?? {};
  const { data = {}, imageCount = 0, imageList = [] } = productDetailTestData ?? {};
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
  console.log({ data }, { productImages });
  return (
    <div className="product-detail py-20 d-flex flex-column gap-10">
      <nav>
        <div className="container">
          {/* 麵包屑 */}
          <H6Secondary isBold={false}>我是麵包屑</H6Secondary>
        </div>
      </nav>
      <main>
        <div className="container">
          <div className="row d-flex">
            {/* 左邊側欄 */}
            <aside className="col-lg-2">
              <TextLarge>我是側欄</TextLarge>
            </aside>

            {/* 主要區域 */}
            <section className="col-lg-10">
              <div className="row product-section mb-10">
                {/* 圖片區域 */}
                <section className="col-md-6 product-images">
                  <div className="image-container">
                    {imageCount === 0 && (
                      // 單圖模式
                      <div className="single-image-setting border border-gray-200">
                        <img src={primary_image} alt={name} className="image-fluid" />
                      </div>
                    )}
                    {imageCount > 0 && (
                      // 多圖模式
                      <ProductGalleryCarousel gallery={productImages} />
                    )}
                  </div>
                </section>
                {/* 主要資訊 */}
                <section className="col-md-6 product-info d-flex flex-column justify-content-between align-items-start pb-13">
                  <div className="d-flex flex-column gap-3">
                    <TextMedium className="tag-for-condition">{Conditions.name}</TextMedium>
                    <H3Primary>{name}</H3Primary>
                    <ul className="product-feature-list text-gray-500">
                      {summary.map((point, index) => (
                        <li key={index}>
                          <H5Secondary isBold={false} className="lh-base">
                            {point}
                          </H5Secondary>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="d-flex flex-column gap-8">
                    {/* 價格 */}
                    <div className="d-flex align-items-end gap-4">
                      <div className="text-gray-400 d-flex gap-1 align-items-end">
                        <H6Primary className="lh-base">$</H6Primary>
                        <H5Primary className="line-through lh-base">
                          {formatPrice(original_price, false)}
                        </H5Primary>
                      </div>
                      <div className="text-primary-800 d-flex align-items-end gap-1">
                        <H4Primary>$</H4Primary>
                        <H3Primary>{formatPrice(selling_price, false)}</H3Primary>
                      </div>
                    </div>

                    {/* CTA */}
                    <div className="d-flex gap-5">
                      <BtnPrimary size="large">加入購物車</BtnPrimary>
                      <BtnPrimary size="large">加入我的最愛</BtnPrimary>
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
