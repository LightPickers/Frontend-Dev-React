import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useMemo } from "react";

import { useGetUserProfileQuery } from "@/features/users/userApi";
import { useGetCartQuery } from "@/features/cart/cartApi";
import { useGetCouponsQuery } from "@/features/coupons/couponApi";
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

  // 取得優惠券資料
  const { data: couponsData } = useGetCouponsQuery({ page: 1, per: 9999 });
  const coupons = couponsData?.data || [];

  const defaultDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toISOString().split("T")[0];
  }, []);

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

  const matchedCoupon = useMemo(() => {
    const code = checkoutForm.couponCode?.trim().toLowerCase();
    if (!code) return null;
    return coupons.find(coupon => coupon.code.toLowerCase() === code);
  }, [checkoutForm.couponCode, coupons]);

  const discountAmount = matchedCoupon
    ? subtotal - Math.round((subtotal / 10) * matchedCoupon.discount)
    : 0;

  const finalTotal = subtotal + shipping - discountAmount;

  if (isLoading) return <p>載入中...</p>;

  return (
    <>
      <div className="pt-4">
        <div className="bg-gray-100 py-10 py-lg-20">
          <section
            className="container d-flex flex-column gap-10"
            style={{ letterSpacing: "0.09em" }}
          >
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
                <li className="breadcrumb-item active">
                  <Link to="/checkout/confirmation/test-id">訂單確認</Link>
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
              <div className="line"></div>
              <div className="step">
                <H5Primary className="circle">4</H5Primary>
                <div className="step-label">
                  訂單
                  <br className="d-block d-lg-none" />
                  完成
                </div>
              </div>
            </div>
            <div className="d-flex flex-column gap-11 gap-lg-7">
              {/* 訂單內容 */}
              <div className="cart-contents d-flex flex-column gap-9 py-lg-8">
                <div className="d-flex flex-column gap-3">
                  <H3Primary className="text-gray-600 fs-1">確認訂單內容</H3Primary>
                  <div className="divider-line"></div>
                </div>
                <table
                  className="table cart-table align-middle text-nowrap px-5"
                  style={{ tableLayout: "fixed", width: "100%" }}
                >
                  <thead className="cart-table-head">
                    <tr>
                      <th scope="col" style={{ paddingLeft: "0px", width: "526px" }}>
                        <p className="text-start text-gray-600">商品資訊</p>
                      </th>
                      <th scope="col">
                        <p>價格</p>
                      </th>
                      <th scope="col">
                        <p>數量</p>
                      </th>
                      <th scope="col" style={{ paddingRight: "0px", width: "306px" }}>
                        <p>總計</p>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="cart-table-body">
                    {cartItems.map((item, index) => {
                      const isLast = index === cartItems.length - 1;
                      return (
                        <tr key={item.id}>
                          <td
                            style={{ paddingLeft: "0", width: "526px" }}
                            className={isLast ? "cart-item-last" : ""}
                          >
                            <div className="d-flex align-items-center gap-3 p-3">
                              <img
                                // 先放假圖 要改回去item.primary_image
                                src={"https://fakeimg.pl/60"}
                                alt={item.name}
                                className="rounded-1"
                                width="60"
                              />
                              <div>
                                <p
                                  className="fs-5 text-gray-600"
                                  style={{ letterSpacing: "0.1em" }}
                                >
                                  {item.name}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className={isLast ? "cart-item-last" : ""}>
                            <div className="d-flex justify-content-end align-items-center p-3 gap-1">
                              <div className="text-gray-400">NT$</div>
                              <div
                                className="fs-5 fw-bold text-gray-500"
                                style={{ letterSpacing: "0.1em" }}
                              >
                                {item.price_at_time.toLocaleString()}
                              </div>
                            </div>
                          </td>
                          <td
                            className={
                              isLast
                                ? "cart-item-last text-end text-gray-500 px-5 py-3 gap-3"
                                : "text-end text-gray-500 px-5 py-3 gap-3"
                            }
                          >
                            {item.quantity}
                          </td>
                          <td
                            className={isLast ? "cart-item-last" : ""}
                            style={{ paddingRight: "0px", width: "306px" }}
                          >
                            <div className="d-flex justify-content-end align-items-center p-3 gap-1">
                              <div className="text-gray-400">NT$</div>
                              <div
                                className="fs-5 fw-bold text-gray-500"
                                style={{ letterSpacing: "0.1em" }}
                              >
                                {item.total_price.toLocaleString()}
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="cart-table-foot">
                    <tr>
                      <td colSpan="3">
                        <p className="text-end fw-bold text-gray-500 py-3 pe-7">商品合計</p>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end align-items-center gap-1">
                          <div className="text-gray-400">NT$</div>
                          <div
                            className="fs-5 fw-bold text-gray-500"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            {subtotal.toLocaleString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <p className="text-end fw-bold text-gray-500 py-3 pe-7">運費</p>
                      </td>
                      <td>
                        <div className="d-flex justify-content-end align-items-center gap-1">
                          <div className="text-gray-400">NT$</div>
                          <div
                            className="fs-5 fw-bold text-gray-500"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            {shipping}
                          </div>
                        </div>
                      </td>
                    </tr>
                    {matchedCoupon && (
                      <tr>
                        <td colSpan="3">
                          <p className="text-end fw-bold text-gray-500 py-3 pe-7">優惠券折扣</p>
                        </td>
                        <td>
                          <div className="d-flex justify-content-end align-items-center gap-1">
                            <div className="text-gray-400">- NT$</div>
                            <div
                              className="fs-5 fw-bold text-danger"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              {discountAmount.toLocaleString()}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                    <tr className="bg-primary-200">
                      <td colSpan="3" className="rounded-start">
                        <p className="text-end fw-bold text-primary-1000 fs-5 py-3 pe-7">總計</p>
                      </td>
                      <td className="rounded-end">
                        <div className="d-flex justify-content-end align-items-center gap-1">
                          <div className="text-primary-800">NT$</div>
                          <div
                            className="fs-5 fw-bold text-primary-1000"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            {finalTotal.toLocaleString()}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
                <div className="cart-table-mobile" style={{ letterSpacing: "0.1em" }}>
                  <div className="d-flex flex-column gap-4">
                    {cartItems.map(item => (
                      <div className="d-flex flex-row gap-3" key={item.id}>
                        <img className="rounded-1" src="https://fakeimg.pl/90" alt={item.name} />
                        <div className="d-flex flex-column gap-3 w-100">
                          <div className="text-gray-600 h-75 text-multiline-truncate">
                            {item.name}
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="d-flex align-items-center gap-1">
                              <div className="text-gray-400">NT$</div>
                              <div
                                className="text-gray-500 fs-5 fw-bold"
                                style={{ letterSpacing: "0.1em" }}
                              >
                                {item.price_at_time.toLocaleString()}
                              </div>
                            </div>
                            <div className="d-flex align-items-center gap-1">
                              <div className="text-gray-400">x</div>
                              <div
                                className="text-gray-500 fs-5 fw-bold"
                                style={{ letterSpacing: "0.1em" }}
                              >
                                {item.quantity}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="divider-line"></div>
                  <div className="d-flex flex-column gap-2">
                    <div className="d-flex align-items-center justify-content-between px-2 py-1">
                      <div className="fw-bold text-gray-500">商品合計</div>
                      <div className="d-flex align-items-center gap-1">
                        <div className="text-gray-400">NT$</div>
                        <div
                          className="text-gray-500 fs-5 fw-bold"
                          style={{ letterSpacing: "0.1em" }}
                        >
                          {subtotal.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-between px-2 py-1">
                      <div className="fw-bold text-gray-500">運費</div>
                      <div className="d-flex align-items-center gap-1">
                        <div className="text-gray-400">NT$</div>
                        <div
                          className="text-gray-500 fs-5 fw-bold"
                          style={{ letterSpacing: "0.1em" }}
                        >
                          {shipping.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    {matchedCoupon && (
                      <div className="d-flex align-items-center justify-content-between px-2 py-1">
                        <div className="fw-bold text-gray-500">優惠券折扣</div>
                        <div>
                          <div className="d-flex align-items-center gap-1">
                            <div className="text-gray-400">- NT$</div>
                            <div
                              className="text-danger fs-5 fw-bold"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              {discountAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="bg-primary-200 d-flex align-items-center justify-content-between px-2 py-3 rounded-1">
                      <div
                        className="text-primary-1000 fw-bold fs-5"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        總計
                      </div>
                      <div className="d-flex align-items-center gap-1">
                        <div className="text-gray-400">NT$</div>
                        <div
                          className="text-primary-1000 fs-5 fw-bold"
                          style={{ letterSpacing: "0.1em" }}
                        >
                          {finalTotal.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 出貨資訊 */}
              <div className="py-lg-8">
                <div className="d-flex flex-column gap-6 gap-lg-9">
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <H3Primary className="text-gray-600 fs-1">確認出貨內容</H3Primary>
                      <div className="px-2 py-1">
                        <Link className="text-primary-800 fw-bold text-decoration-underline">
                          關於退貨...
                        </Link>
                      </div>
                    </div>
                    <div className="divider-line"></div>
                  </div>
                  <table className="table shipping-information-table  align-middle text-nowrap bg-transparent">
                    <tbody>
                      <tr>
                        <th scope="row" className="py-3">
                          購買者
                        </th>
                        <td className="py-3 d-flex flex-column gap-1">
                          <div className="fw-bold">{userInfo.name}</div>
                          <div>
                            地址：
                            {userInfo.address_zipcode}
                            {userInfo.address_district}
                            {userInfo.address_detail}
                          </div>
                          <div>電話：{userInfo.phone}</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3">
                          寄送方式
                        </th>
                        <td className="py-3">{checkoutForm.shippingMethod}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3">
                          收件者
                        </th>
                        <td className="py-3 d-flex flex-column gap-1">
                          <div className="fw-bold">{userInfo.name}</div>
                          <div>
                            地址：
                            {userInfo.address_zipcode}
                            {userInfo.address_district}
                            {userInfo.address_detail}
                          </div>
                          <div>電話：{userInfo.phone}</div>
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3">
                          付款方式
                        </th>
                        <td className="py-3">{checkoutForm.paymentMethod}</td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3">
                          希望配送日期
                        </th>
                        <td className="py-3">
                          {checkoutForm.deliveryDate === defaultDate
                            ? "無希望日"
                            : checkoutForm.deliveryDate}
                        </td>
                      </tr>
                      <tr>
                        <th scope="row" className="py-3 border-0">
                          到貨時間
                        </th>
                        <td className="py-3 border-0">{checkoutForm.deliveryTime}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="shipping-information-table-mobile">
                    <div className="d-flex flex-column gap-3">
                      <div
                        className="text-gray-500 fs-5 fw-bold"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        購買者
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div className="text-gray-500 fw-bold">{userInfo.name}</div>
                        <div className="text-gray-500">
                          地址：
                          {userInfo.address_zipcode}
                          {userInfo.address_district}
                          {userInfo.address_detail}
                        </div>
                        <div className="text-gray-500">電話：{userInfo.phone}</div>
                      </div>
                    </div>
                    <div className="divider-line"></div>
                    <div className="d-flex flex-column gap-3">
                      <div
                        className="text-gray-500 fs-5 fw-bold"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        寄送方式
                      </div>
                      <div className="text-gray-500">{checkoutForm.shippingMethod}</div>
                    </div>
                    <div className="divider-line"></div>
                    <div className="d-flex flex-column gap-3">
                      <div
                        className="text-gray-500 fs-5 fw-bold"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        購買者
                      </div>
                      <div className="d-flex flex-column gap-1">
                        <div className="text-gray-500 fw-bold">{userInfo.name}</div>
                        <div className="text-gray-500">
                          地址：
                          {userInfo.address_zipcode}
                          {userInfo.address_district}
                          {userInfo.address_detail}
                        </div>
                        <div className="text-gray-500">電話：{userInfo.phone}</div>
                      </div>
                    </div>
                    <div className="divider-line"></div>
                    <div className="d-flex flex-column gap-3">
                      <div
                        className="text-gray-500 fs-5 fw-bold"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        付款方式
                      </div>
                      <div className="text-gray-500">{checkoutForm.paymentMethod}</div>
                    </div>
                    <div className="divider-line"></div>
                    <div className="d-flex flex-column gap-3">
                      <div
                        className="text-gray-500 fs-5 fw-bold"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        希望配送日期
                      </div>
                      <div className="text-gray-500">{checkoutForm.deliveryDate}</div>
                    </div>
                    <div className="divider-line"></div>
                    <div className="d-flex flex-column gap-3">
                      <div
                        className="text-gray-500 fs-5 fw-bold"
                        style={{ letterSpacing: "0.1em" }}
                      >
                        到貨時間
                      </div>
                      <div className="text-gray-500">{checkoutForm.deliveryTime}</div>
                    </div>
                  </div>
                </div>
              </div>
              {/* 操作按鈕 */}
              <div className="d-flex justify-content-end align-items-center gap-4 gap-lg-6">
                <div className="cart-button px-2 px-lg-3 py-1 py-lg-2">
                  <Link to="/cart" className="fs-lg-5 fw-bold text-gray-500">
                    返回購物車
                  </Link>
                </div>
                <BtnPrimary
                  className="cart-button"
                  type="button"
                  onClick={handleCreateOrder}
                  disabled={isCreating}
                >
                  {isCreating ? "建立中..." : "訂單內容確認"}
                </BtnPrimary>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default OrderConfirmationPage;
