import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function PaymentStatusSkeleton() {
  return (
    <div className="d-flex flex-column align-items-center justify-content-center gap-15">
      {/* 標題骨架 */}
      <Skeleton width={180} height={48} baseColor="#bbb" highlightColor="#ddd" />

      {/* 感謝文字骨架（橫向兩句） */}
      <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-0 align-items-center justify-content-center">
        <Skeleton width={140} height={32} baseColor="#bbb" highlightColor="#ddd" />
        <Skeleton width={140} height={32} baseColor="#bbb" highlightColor="#ddd" />
      </div>

      {/* 訂單編號骨架 */}
      <Skeleton width={180} height={20} baseColor="#bbb" highlightColor="#ddd" />

      {/* 返回按鈕骨架 */}
      <Skeleton width={200} height={50} borderRadius={8} baseColor="#bbb" highlightColor="#ddd" />
    </div>
  );
}

export default PaymentStatusSkeleton;
