// 4-3 付款結果頁面
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

import { useGetPaidOrderByIdQuery } from "@/features/orders/orderApi";
import { useGetCartQuery, useDeleteCartMutation } from "@/features/cart/cartApi";
import { BtnPrimary } from "@/components/Buttons";
import { H1Primary, H2Primary, H3Primary, H5Primary } from "@/components/Headings";
import { TextLarge, TextMedium } from "@/components/TextTypography";
import PageLoader from "@/components/loaders/PageLoader";

function OrderStatusPage() {
  // 取得訂單資料
  const { orderId } = useParams();
  const { data: orderData, isLoading: isOrderLoading, error } = useGetPaidOrderByIdQuery(orderId);
  const [showLoading, setShowLoading] = useState(false);

  const { data: cartData } = useGetCartQuery();

  const [deleteCart] = useDeleteCartMutation();

  const navigate = useNavigate();

  useEffect(() => {
    // 當訂單狀態為已付款時
    if (orderData?.data?.status === "paid") {
      // 清除 checkoutForm 暫存
      localStorage.removeItem("checkoutForm");
    }
  }, [orderData, cartData, deleteCart]);

  useEffect(() => {
    let timer;

    if (isOrderLoading) {
      timer = setTimeout(() => setShowLoading(true), 1000);
    } else {
      setShowLoading(false);
      clearTimeout(timer);
    }
    return () => clearTimeout(timer);
  }, [isOrderLoading]);

  if (isOrderLoading) return <PageLoader text="正在確認您的付款狀態，請稍後..." />;
  if (error || !orderData?.data)
    return (
      <div className="d-flex flex-column align-items-center gap-5 py-20">
        <TextLarge className="text-danger fs-2">查無訂單資訊</TextLarge>

        <TextLarge>請重新嘗試或聯繫客服</TextLarge>
      </div>
    );

  const status = orderData.data.status;
  const orderNumber = orderData.data.merchant_order_no;

  return (
    <>
      <div className="pt-4">
        <div className="bg-gray-100 py-10 py-lg-20">
          <div className="container d-flex flex-column gap-12">
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
            {status === "paid" ? (
              <div className="d-flex flex-column align-items-center gap-15">
                <H1Primary className="fs-1">付款成功！</H1Primary>
                <div className="d-flex flex-column flex-sm-row gap-3 gap-sm-0">
                  <TextLarge className="text-gray-500 fs-2">感謝您的購買，</TextLarge>
                  <TextLarge className="text-gray-500 fs-2">敬請再度光臨。</TextLarge>
                </div>
                <TextMedium>（訂單編號：{orderNumber}）</TextMedium>

                <BtnPrimary
                  size="cta"
                  type="button"
                  className="fs-4 px-11 py-3"
                  onClick={() => navigate("/")}
                >
                  回到首頁
                </BtnPrimary>
              </div>
            ) : (
              <div className="d-flex flex-column align-items-center gap-15">
                <H2Primary>付款失敗！</H2Primary>

                <TextLarge className="text-danger fs-2">尚未完成付款</TextLarge>

                <TextLarge>請重新嘗試或聯繫客服</TextLarge>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderStatusPage;
