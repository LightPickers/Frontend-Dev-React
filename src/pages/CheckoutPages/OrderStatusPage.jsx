// 4-3 付款結果頁面
import { useParams } from "react-router-dom";

import { useGetOrderByIdQuery } from "@/features/orders/orderApi";
import { H3Primary } from "@/components/Headings";

function OrderStatusPage() {
  const { orderId } = useParams();
  const { data, isLoading, error } = useGetOrderByIdQuery(orderId);

  if (isLoading) return <p className="text-center py-10">載入中...</p>;
  if (error || !data?.order) return <p className="text-center py-10 text-danger">查無訂單資訊</p>;

  const status = data.order.status;

  return (
    <div className="container py-20 text-center">
      {status === "已付款" ? (
        <>
          <H3Primary className="mb-4">付款成功！</H3Primary>
          <p className="text-success">我們已收到您的付款，感謝您的購買！</p>
        </>
      ) : (
        <>
          <H3Primary className="mb-4">付款失敗！</H3Primary>
          <p className="text-danger">尚未完成付款，請重新嘗試或聯繫客服。</p>
        </>
      )}
    </div>
  );
}

export default OrderStatusPage;
