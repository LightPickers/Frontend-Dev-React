import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";

import { useLazyGetProductByIdQuery } from "@/features/products/productApi";
import { H3Primary, H5Secondary, H6Secondary } from "@/components/Headings";
import { TextLarge, TextMedium } from "@/components/TextTypography";

function ProductDetailPage() {
  const { productId } = useParams();
  const [triggerGetProductById, { data: getProductResponse }] = useLazyGetProductByIdQuery();

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
  console.log({ getProductResponse });

  const { data = {}, imageCount = 0, imageList = [] } = getProductResponse ?? {};
  const {
    id = "",
    name = "",
    primary_image = "",
    selling_price = 0,
    subtitle = "",
    summary = "",
    title = "",
    Brands = {},
    Categories = {},
    Conditions = {},
    description = "",
    hashtags = [],
  } = data ?? {};
  return (
    <>
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
                <div className="row product-intro">
                  {/* 圖片區域 */}
                  <section className="col-md-6 product-images">
                    {imageCount === 0 && (
                      <div className="primary-image border border-gray-200">
                        <img src={primary_image} alt={name} />
                      </div>
                    )}
                  </section>
                  {/* 主要資訊 */}
                  <section className="col-md-6">
                    <TextMedium>{Conditions.name}</TextMedium>
                    <H3Primary>{name}</H3Primary>
                    <H5Secondary isBold={false}>{summary}</H5Secondary>
                  </section>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default ProductDetailPage;
