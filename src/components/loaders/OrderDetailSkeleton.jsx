import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function OrderDetailSkeleton() {
  return (
    <>
      {/* 桌機版 Table 格式 */}
      <table className="order-detail-table d-none d-lg-table table table-bordered">
        <tbody>
          {[...Array(7)].map((_, i) => (
            <tr key={i}>
              <th style={{ backgroundColor: "#D4D4D4", width: "200px" }}>
                <Skeleton width={100} height={20} />
              </th>
              <td className="modal-td-content ps-5">
                <Skeleton count={1} height={20} />
              </td>
            </tr>
          ))}

          {/* 商品清單 */}
          <tr>
            <th style={{ backgroundColor: "#D4D4D4" }}>
              <Skeleton width={100} height={20} />
            </th>
            <td className="modal-td-content py-3 ps-5">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="pb-3 d-flex align-items-center" style={{ gap: "1rem" }}>
                  <Skeleton width={100} height={100} borderRadius={12} />
                  <div className="flex-grow-1">
                    <Skeleton width={"80%"} height={20} />
                    <Skeleton width={"60%"} height={16} />
                  </div>
                </div>
              ))}
            </td>
          </tr>

          {/* 金額資訊 */}
          <tr>
            <th style={{ backgroundColor: "#D4D4D4" }}>
              <Skeleton width={100} height={20} />
            </th>
            <td className="modal-td-content ps-5">
              <div className="d-flex flex-column gap-2">
                <Skeleton width={"50%"} height={16} />
                <Skeleton width={"50%"} height={16} />
                <Skeleton width={"50%"} height={16} />
                <div className="divider-line" />
                <Skeleton width={"60%"} height={18} />
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 手機版區塊 */}
      <div className="order-detail-mobile d-block d-lg-none d-flex flex-column gap-4 pe-0">
        {[...Array(7)].map((_, i) => (
          <div key={i} className="d-flex flex-column gap-3 pb-2 border-bottom">
            <Skeleton width={100} height={20} />
            <Skeleton width={"60%"} height={18} />
          </div>
        ))}

        {/* 商品清單 */}
        <div className="d-flex flex-column gap-3 pb-2 border-bottom">
          <Skeleton width={100} height={20} />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="d-flex align-items-center gap-3">
              <Skeleton width={80} height={80} borderRadius={10} />
              <div className="flex-grow-1">
                <Skeleton width={"80%"} height={20} />
                <Skeleton width={"60%"} height={16} />
              </div>
            </div>
          ))}
        </div>

        {/* 金額資訊 */}
        <div className="d-flex flex-column gap-3 pb-2 border-bottom">
          <Skeleton width={100} height={20} />
          <Skeleton width={"50%"} height={16} />
          <Skeleton width={"50%"} height={16} />
          <Skeleton width={"50%"} height={16} />
          <div className="divider-line" />
          <Skeleton width={"60%"} height={18} />
        </div>
      </div>
    </>
  );
}

export default OrderDetailSkeleton;
