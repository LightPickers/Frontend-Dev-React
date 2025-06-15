import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductDetailSkeleton() {
  return (
    <div className="product-detail py-20 d-flex flex-column gap-10">
      {/* 麵包屑骨架 */}
      <div className="container-lg container-fluid">
        <Skeleton height={24} width={"50%"} />
      </div>

      <main>
        <div className="container-lg container-fluid">
          <div className="row d-flex">
            {/* 左側欄位骨架 */}
            <div className="col-lg-2 d-lg-block d-none">
              <div className="d-flex flex-column gap-3">
                <Skeleton height={20} width={"60%"} />
                <Skeleton height={20} width={"80%"} />
                <Skeleton height={20} width={"50%"} />
                <Skeleton height={20} width={"60%"} />
                <Skeleton height={20} width={"80%"} />
                <Skeleton height={20} width={"50%"} />
                <Skeleton height={20} width={"60%"} />
                <Skeleton height={20} width={"80%"} />
                <Skeleton height={20} width={"50%"} />
              </div>
            </div>

            {/* 主要內容 */}
            <section className="col-lg-10">
              <div className="row product-section mb-10">
                {/* 商品圖片骨架 */}
                <section className="col-md-6 product-images">
                  <div className="image-container">
                    <Skeleton height={400} />
                  </div>
                </section>

                {/* 商品資訊骨架 */}
                <section className="col-md-6 d-flex flex-column justify-content-between align-items-start pb-lg-13 pb-0 gap-8">
                  {/* 摘要區塊 */}
                  <div className="d-flex flex-column gap-3 mt-md-0 mt-6 w-100">
                    <Skeleton height={24} width={"30%"} />
                    <Skeleton height={36} width={"80%"} />
                    <Skeleton count={3} height={24} width={"100%"} />
                  </div>

                  {/* 價格與按鈕骨架 */}
                  <div className="d-flex flex-column gap-md-6 gap-4 w-100">
                    <div className="d-flex align-items-end gap-4">
                      <Skeleton height={32} width={100} />
                      <Skeleton height={40} width={160} />
                    </div>
                    <div className="d-flex gap-4">
                      <Skeleton height={40} width={160} />
                      <Skeleton height={40} width={160} />
                    </div>
                  </div>
                </section>
              </div>

              {/* 分頁導覽與內容骨架 */}
              <div className="d-flex flex-column gap-md-5 gap-3">
                <Skeleton height={36} width={"40%"} />
                <Skeleton count={8} height={18} width={"100%"} />
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default ProductDetailSkeleton;
