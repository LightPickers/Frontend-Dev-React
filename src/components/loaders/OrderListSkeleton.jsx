import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function OrderListSkeleton() {
  return (
    <>
      {/* 篩選按鈕區 */}
      <div className="d-flex gap-4 pb-2 border-bottom mb-4 flex-wrap">
        {[...Array(4)].map((_, idx) => (
          <Skeleton key={idx} width={60} height={24} />
        ))}
      </div>

      {/* 搜尋欄位 */}
      <div className="mb-4">
        <Skeleton height={38} />
      </div>

      {/* 桌機版 */}
      <div className="d-none d-lg-block">
        {/* 表頭 */}
        <div className="row text-muted px-2 mb-2 py-2 bg-light">
          <div className="col-6 col-lg-3 ps-7">
            <Skeleton width={100} height={20} />
          </div>
          <div className="col-6 col-lg-2 text-center">
            <Skeleton width={80} height={20} />
          </div>
          <div className="col-6 col-lg-3 text-center">
            <Skeleton width={100} height={20} />
          </div>
          <div className="col-6 col-lg-2 text-center">
            <Skeleton width={60} height={20} />
          </div>
          <div className="col-6 col-lg-2 text-center">
            <Skeleton width={60} height={20} />
          </div>
        </div>

        {/* 訂單資料骨架 */}
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="row align-items-center px-2 py-3 border-bottom">
            <div className="col-6 col-lg-3 ps-7">
              <Skeleton width={120} height={16} />
            </div>
            <div className="col-6 col-lg-2 text-center">
              <Skeleton width={100} height={16} />
            </div>
            <div className="col-6 col-lg-3 text-center">
              <Skeleton width={80} height={16} />
            </div>
            <div className="col-6 col-lg-2 text-center">
              <Skeleton width={60} height={16} />
            </div>
            <div className="col-6 col-lg-2 text-center">
              <Skeleton width={100} height={16} count={2} style={{ marginBottom: "0.5rem" }} />
            </div>
          </div>
        ))}
      </div>

      {/* 手機版 */}
      <div className="d-lg-none">
        {[...Array(3)].map((_, idx) => (
          <div key={idx} className="card mb-3 p-3 shadow-sm">
            <Skeleton width={"60%"} height={16} className="mb-2" />
            <Skeleton width={"40%"} height={16} className="mb-2" />
            <Skeleton width={"80%"} height={16} className="mb-2" />
            <Skeleton width={"30%"} height={16} />
          </div>
        ))}
      </div>
    </>
  );
}

export default OrderListSkeleton;
