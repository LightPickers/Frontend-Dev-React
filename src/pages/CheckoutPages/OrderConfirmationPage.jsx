import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetUserProfileQuery } from "@/features/users/userApi";
import { useGetCartQuery, useDeleteCartProductMutation } from "@/features/cart/cartApi";
import { useCreateNewOrderMutation } from "@/features/orders/orderApi";
import { BtnPrimary } from "@/components/Buttons";
import { H3Primary, H5Primary } from "@/components/Headings";

// 4-2 訂單確認頁面
function OrderConfirmationPage() {
  const checkoutForm = useSelector(state => state.checkoutPage);

  const navigate = useNavigate();

  // 取得購物車資料
  const { data, isLoading } = useGetCartQuery();

  // 取得會員資料
  const { data: userData, isLoading: isUserLoading } = useGetUserProfileQuery();
  const userInfo = userData?.data?.user;

  // 新增訂單
  const [createNewOrder, { isLoading: isCreating }] = useCreateNewOrderMutation();

  // 取得token
  const token = useSelector(state => state.auth.token);

  const handleCreateOrder = async () => {
    const cartIds = cartItems.map(item => item.id);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE}/orders`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart_ids: cartIds }),
      });

      const htmlForm = await res.text(); // <-- ❗ 這裡不能用 .json()
      document.open();
      document.write(htmlForm);
      document.close();
    } catch (err) {
      console.error("建立訂單失敗", err);
      alert("建立訂單失敗，請稍後再試");
    }
  };

  // 小計、運費、總計計算
  const cartItems = data?.data?.items || [];
  const subtotal = data?.data?.amount || 0;
  const shipping = 60;
  const total = subtotal + shipping;

  if (isLoading) return <p>載入中...</p>;

  return (
    <>
      <div className="bg-gray-100">
        <section className="container py-20">
          {/* 麵包屑 */}
          <nav aria-label="breadcrumb" className="mb-10">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <Link to="/">首頁</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/cart">購物車</Link>
              </li>
              <li className="breadcrumb-item">
                <Link to="/checkout">填寫訂單資料</Link>
              </li>
              <li className="breadcrumb-item active">
                <Link to="/checkout/confirmation/test-id">確認訂單內容</Link>
              </li>
            </ol>
          </nav>
          {/* 步驟進度條 */}
          <div className="step-background px-2 px-md-8 py-4 py-md-11 mb-10">
            <div className="checkout-steps d-flex justify-content-center text-center ">
              <div className="step active">
                <H5Primary className="circle">1</H5Primary>
                <div className="step-label">確認購物車內容</div>
              </div>
              <div className="line active"></div>
              <div className="step active">
                <H5Primary className="circle">2</H5Primary>
                <div className="step-label">填寫訂單資料</div>
              </div>
              <div className="line active"></div>
              <div className="step active">
                <H5Primary className="circle">3</H5Primary>
                <div className="step-label">確認訂單內容</div>
              </div>
              <div className="line"></div>
              <div className="step">
                <H5Primary className="circle">4</H5Primary>
                <div className="step-label">訂單完成</div>
              </div>
            </div>
          </div>

          {/* 訂單內容 */}
          <div className="cart-contents py-8">
            <H3Primary className="mb-9 heading-border pb-3">確認訂單內容</H3Primary>
            <table className="table cart-table align-middle text-nowrap">
              <thead className="cart-table-head">
                <tr>
                  <th scope="col">
                    <p className="text-start text-gray-600">商品資訊</p>
                  </th>
                  <th scope="col">
                    <p className="text-end text-gray-600">價格</p>
                  </th>
                  <th scope="col">
                    <p className="text-end text-gray-600">數量</p>
                  </th>
                  <th scope="col">
                    <p className="text-end text-gray-600">總計</p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => {
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-4">
                          <img
                            // 先放假圖 要改回去item.primary_image
                            src={"https://fakeimg.pl/60"}
                            alt={item.name}
                            className="img-thumbnail"
                            width="60"
                          />
                          <div>
                            <p className="fs-5 text-gray-600">{item.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end align-items-center gap-1">
                          <div className="text-gray-400">NT$</div>
                          <div className="fs-5 fw-bold text-gray-500">
                            {item.price_at_time.toLocaleString()}
                          </div>
                        </div>
                      </td>
                      <td className="text-end text-gray-500 gap-3">{item.quantity}</td>
                      <td>
                        <div className="d-flex justify-content-end align-items-center gap-1">
                          <div className="text-gray-400">NT$</div>
                          <div className="fs-5 fw-bold text-gray-500">
                            {item.total_price.toLocaleString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr className="gap-11">
                  <td colSpan="3" className="text-end fw-bold text-gray-500">
                    商品合計
                  </td>
                  <td>
                    <div className="d-flex justify-content-end align-items-center gap-1">
                      <div className="text-gray-400">NT$</div>
                      <div className="fs-5 fw-bold text-gray-500">{subtotal.toLocaleString()}</div>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td colSpan="3" className="text-end fw-bold text-gray-500">
                    運費
                  </td>
                  <td>
                    <div className="d-flex justify-content-end align-items-center gap-1">
                      <div className="text-gray-400">NT$</div>
                      <div className="fs-5 fw-bold text-gray-500">{shipping}</div>
                    </div>
                  </td>
                </tr>
                <tr className="bg-primary-200">
                  <td colSpan="3" className="rounded-start text-end fw-bold fs-5 text-primary-1000">
                    總計
                  </td>
                  <td className="rounded-end">
                    <div className="d-flex justify-content-end align-items-center gap-1">
                      <div className="text-primary-800">NT$</div>
                      <div className="fs-5 fw-bold text-primary-1000">{total.toLocaleString()}</div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 出貨資訊 */}
          <div className="py-8 mb-7">
            <H3Primary className="heading-border pb-3 mb-9">確認出貨內容</H3Primary>
            <table className="table shipping-information-table  align-middle text-nowrap bg-transparent px-5">
              <tbody>
                <tr>
                  <th
                    scope="row"
                    className="fs-5 fw-bold text-gray-500 py-3"
                    style={{ width: "304px" }}
                  >
                    購買者
                  </th>
                  <td className="py-3 d-flex flex-column gap-2">
                    <div className="fw-bold text-gray-500">{userInfo.name}</div>
                    <div className="text-gray-500">
                      {userInfo.address_zipcode}
                      {userInfo.address_district}
                      {userInfo.address_detail}
                    </div>
                    <div className="text-gray-500">{userInfo.phone}</div>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    寄送方式
                  </th>
                  <td className="py-3 text-gray-500">{checkoutForm.shippingMethod}</td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    收件者
                  </th>
                  <td className="py-3 d-flex flex-column gap-2">
                    <div className="fw-bold text-gray-500">{userInfo.name}</div>
                    <div className="text-gray-500">
                      {userInfo.address_zipcode}
                      {userInfo.address_district}
                      {userInfo.address_detail}
                    </div>
                    <div className="text-gray-500">{userInfo.phone}</div>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    付款方式
                  </th>
                  <td className="py-3 text-gray-500">{checkoutForm.paymentMethod}</td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    希望配送日期
                  </th>
                  <td className="py-3 text-gray-500">{checkoutForm.deliveryDate}</td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3 border-0">
                    到貨時間
                  </th>
                  <td className="py-3 text-gray-500 border-0">{checkoutForm.deliveryTime}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 操作按鈕 */}
          <div className="d-flex justify-content-end align-items-center gap-8">
            <div className="px-3 py-2">
              <Link to="/cart" className="fs-5 fw-bold text-gray-500">
                返回購物車
              </Link>
            </div>
            <BtnPrimary as="button" onClick={handleCreateOrder} disabled={isCreating}>
              {isCreating ? "建立中..." : "訂單內容確認"}
            </BtnPrimary>
          </div>
        </section>
      </div>
    </>
  );
}

export default OrderConfirmationPage;
