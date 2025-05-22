// 4-3 付款結果頁面
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { useGetOrderByIdQuery } from "@/features/orders/orderApi";
import { BtnPrimary } from "@/components/Buttons";
import { H2Primary, H2Secondary, H3Primary, H5Primary } from "@/components/Headings";
import { TextLarge, TextSmall } from "@/components/TextTypography";

function OrderStatusPage() {
  const { orderId } = useParams();
  const { data: orderData, isLoading: isOrderLoading, error } = useGetOrderByIdQuery(orderId);
  console.log(orderData);

  if (isOrderLoading) return <p className="text-center py-10">載入中...</p>;
  if (error || !orderData?.order)
    return <p className="text-center py-10 text-danger">查無訂單資訊</p>;

  const status = orderData.order.status;
  const orderNumber = orderData.order.merchant_order_no;

  return (
    <>
      <div className="pt-4">
        <div className="bg-gray-100 py-10 py-lg-20">
          <div className="container d-flex flex-column gap-10">
            {/* 麵包屑 */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">首頁</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/cart">購物車</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/checkout">填寫訂單資料</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/checkout/confirmation/test-id">訂單確認</Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link to="/checkout/confirmation/test-id">訂單完成</Link>
                </li>
              </ol>
            </nav>
            {/* 步驟進度條 */}
            <div className="checkout-steps bg-white rounded-3 d-flex justify-content-center text-center  gap-0 gap-lg-2 px-2 px-lg-8 py-4 py-lg-11">
              <div className="step active">
                <H5Primary className="circle">1</H5Primary>
                <div className="step-label active">
                  確認
                  <br className="d-block d-lg-none" />
                  購物車內容
                </div>
              </div>
              <div className="line active"></div>
              <div className="step active">
                <H5Primary className="circle">2</H5Primary>
                <div className="step-label active">
                  填寫
                  <br className="d-block d-lg-none" />
                  訂單資料
                </div>
              </div>
              <div className="line active"></div>
              <div className="step active">
                <H5Primary className="circle">3</H5Primary>
                <div className="step-label active">
                  確認
                  <br className="d-block d-lg-none" />
                  訂單內容
                </div>
              </div>
              <div className="line active"></div>
              <div className="step active">
                <H5Primary className="circle">4</H5Primary>
                <div className="step-label active">
                  訂單
                  <br className="d-block d-lg-none" />
                  完成
                </div>
              </div>
            </div>
            {status === "已付款" ? (
              <div className="d-flex flex-column align-items-center gap-15">
                <H2Primary className="">付款成功！</H2Primary>

                <TextLarge className="text-gray-500 fs-2">感謝您的購買，敬請再度光臨。</TextLarge>

                <TextSmall>（訂單編號：{orderNumber}）</TextSmall>

                <BtnPrimary size="large" type="button" to="/">
                  回到首頁
                </BtnPrimary>
              </div>
            ) : (
              <>
                <H3Primary className="mb-4">付款失敗！</H3Primary>
                <p className="text-danger">
                  尚未完成付款
                  <br />
                  請重新嘗試或聯繫客服
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderStatusPage;
