import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo } from "react";
import { toast } from "react-toastify";

import { useGetUserProfileQuery } from "@/features/users/userApi";
import { useGetCartQuery } from "@/features/cart/cartApi";
import { useGetCouponsQuery } from "@/features/coupons/couponApi";
import { useCreateNewOrderMutation } from "@/features/orders/orderApi";
import { BtnPrimary } from "@/components/Buttons";
import { H3Primary, H5Primary } from "@/components/Headings";
import { InfoAlert } from "@/components/Alerts";
import PageLoader from "@/components/loaders/PageLoader";
import { showLoading, hideLoading } from "@features/loading/loadingSlice";

// 4-2 訂單確認頁面
function OrderConfirmationPage() {
  const checkoutForm = useSelector(state => state.checkoutPage);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 取得購物車資料
  const { data, isLoading: isCartLoading } = useGetCartQuery();

  // 取得會員資料
  const { data: userData, isLoading: isUserLoading } = useGetUserProfileQuery();
  const userInfo = userData?.data?.user;

  // 檢查會員資料是否有填寫地址與電話，沒有就導向編輯頁面
  useEffect(() => {
    if (!isUserLoading && userInfo) {
      const { phone, address_city, address_district, address_detail, address_zipcode } = userInfo;

      const isMissingAddress =
        !address_city || !address_district || !address_detail || !address_zipcode;
      const isMissingPhone = !phone;

      if (isMissingAddress || isMissingPhone) {
        InfoAlert({
          title: "資料不完整",
          text: "請先填寫完整的收件地址與聯絡電話",
        }).then(result => {
          if (result.isConfirmed) {
            navigate("/account/profile/settings", { replace: true });
          }
        });
      }
    }
  }, [isUserLoading, userInfo, navigate]);

  // 取得優惠券資料
  const { data: couponsData } = useGetCouponsQuery({ page: 1, per: 9999 });
  // const coupons = couponsData?.data || [];
  const coupons = useMemo(() => {
    return couponsData?.data || [];
  }, [couponsData?.data]);

  const defaultDate = useMemo(() => {
    const date = new Date();
    date.setDate(date.getDate() + 4);
    return date.toISOString().split("T")[0];
  }, []);

  // 新增訂單
  const [createNewOrder, { isLoading: isCreating }] = useCreateNewOrderMutation();

  // 取得token
  const token = useSelector(state => state.auth.token);

  // 退貨流程說明彈窗
  const showReturnInfo = () => {
    InfoAlert({
      title: "退貨流程說明",
      html: `
        <ol style="text-align: left; padding-left: 1.5em; list-style: decimal;">
          <li>完成訂單後，如需退貨，請聯繫客服。</li>
          <li>客服審核後將提供退貨方式與寄件地址。</li>
          <li>請於指定時間內寄回商品並保留寄件證明。</li>
          <li>驗收無誤後，我們將進行退款或換貨。</li>
        </ol>
      `,
    });
  };

  const handleCreateOrder = async () => {
    const cartIds = cartItems.map(item => item.id);

    try {
      dispatch(showLoading({ text: "訂單建立中，請稍候..." }));

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
  const cartItems = useMemo(() => data?.data?.items || [], [data]);
  const subtotal = data?.data?.amount || 0;
  const shipping = 60;

  useEffect(() => {
    if (!isCartLoading && Array.isArray(cartItems) && cartItems.length === 0) {
      toast.info("購物車是空的，請先選購商品", { toastId: "order-cart-empty" });
      navigate("/products", { replace: true });
    }
  }, [cartItems, isCartLoading, navigate]);

  // 檢查購物車是否有下架商品
  useEffect(() => {
    if (!isCartLoading && cartItems.some(item => item.is_available === false)) {
      navigate("/cart", { replace: true });
    }
  }, [cartItems, isCartLoading, navigate]);

  const matchedCoupon = useMemo(() => {
    const code = checkoutForm.couponCode?.trim().toLowerCase();
    if (!code) return null;
    return coupons.find(coupon => coupon.code.toLowerCase() === code);
  }, [checkoutForm.couponCode, coupons]);

  const discountAmount = matchedCoupon
    ? subtotal - Math.round((subtotal / 10) * matchedCoupon.discount)
    : 0;

  const finalTotal = subtotal + shipping - discountAmount;

  const isDataReady = !isUserLoading && !isCartLoading && !!userInfo;

  useEffect(() => {
    if (isDataReady) {
      dispatch(hideLoading());
    }
  }, [isDataReady, dispatch]);

  if (!isDataReady) return null;

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
                <li className="breadcrumb-item active">訂單確認</li>
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
                                className="rounded-1"
                                src={item.primary_image}
                                alt={item.name}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  flexShrink: 0,
                                }}
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
                        <img
                          className="rounded-1"
                          src={item.primary_image}
                          alt={item.name}
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            flexShrink: 0,
                          }}
                        />
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
              <div className="d-flex flex-column gap-11 gap-lg-7">
                <div className="d-flex flex-column gap-6 gap-lg-9 py-lg-8">
                  {/* 標頭 */}
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center gap-3">
                      <H3Primary className="text-gray-600 fs-1">確認出貨內容</H3Primary>
                      <div className="px-2 py-1">
                        <button
                          type="button"
                          className="text-primary-800 fw-bold text-decoration-underline border-0 bg-transparent p-0"
                          onClick={showReturnInfo}
                        >
                          關於退貨...
                        </button>
                      </div>
                    </div>
                    <div className="divider-line"></div>
                  </div>
                  <div className="row m-0">
                    <div className="d-flex flex-column gap-3  px-2 px-lg-5 text-gray-500">
                      {/* 購買者資訊 */}
                      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4 py-lg-3">
                        <div className="col-12 col-lg-5">
                          <div
                            className="text-gray-500 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            購買者
                          </div>
                        </div>
                        <div className="col-12 col-lg-7">
                          <div className="d-flex flex-column gap-1">
                            <div className="text-gray-500 fw-bold">{userInfo?.name}</div>
                            {/* <div className="text-gray-500">
                              地址：{userInfo.address_zipcode}
                              {userInfo.address_district}
                              {userInfo.address_detail}
                            </div>
                            <div className="text-gray-500">電話：{userInfo.phone}</div> */}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="divider-line"></div>
                      </div>

                      {/* 寄送方式 */}
                      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4 py-lg-3">
                        <div className="col-12 col-lg-5">
                          <div
                            className="text-gray-500 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            寄送方式
                          </div>
                        </div>
                        <div className="col-12 col-lg-7">
                          <div>
                            {checkoutForm.shippingMethod === "home_delivery" ? "宅配到府" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="divider-line"></div>
                      </div>

                      {/* 收件者 */}
                      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4 py-lg-3">
                        <div className="col-12 col-lg-5">
                          <div
                            className="text-gray-500 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            收件者
                          </div>
                        </div>
                        <div className="col-12 col-lg-7">
                          <div className="d-flex flex-column gap-1">
                            <div className="text-gray-500 fw-bold">{userInfo?.name}</div>
                            <div className="text-gray-500">
                              地址：{userInfo?.address_zipcode}
                              {userInfo?.address_district}
                              {userInfo?.address_detail}
                            </div>
                            <div className="text-gray-500">電話：{userInfo?.phone}</div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="divider-line"></div>
                      </div>

                      {/* 付款方式 */}
                      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4 py-lg-3">
                        <div className="col-12 col-lg-5">
                          <div
                            className="text-gray-500 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            付款方式
                          </div>
                        </div>
                        <div className="col-12 col-lg-7">
                          <div className="text-gray-500">
                            {checkoutForm.paymentMethod === "credit_card" ? "信用卡付款" : ""}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="divider-line"></div>
                      </div>

                      {/* 希望配送日期 */}
                      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4 py-lg-3">
                        <div className="col-12 col-lg-5">
                          <div
                            className="text-gray-500 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            希望配送日期
                          </div>
                        </div>
                        <div className="col-12 col-lg-7">
                          <div className="text-gray-500">
                            {checkoutForm.deliveryDate === "none"
                              ? "無希望日"
                              : `${checkoutForm.deliveryDate}（${new Date(checkoutForm.deliveryDate).toLocaleDateString("zh-TW", { weekday: "short" })}）`}
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="divider-line"></div>
                      </div>

                      {/* 到貨時間 */}
                      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4 py-lg-3">
                        <div className="col-12 col-lg-5">
                          <div
                            className="text-gray-500 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            到貨時間
                          </div>
                        </div>
                        <div className="col-12 col-lg-7">
                          <div className="text-gray-500">{checkoutForm.deliveryTime}</div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="divider-line"></div>
                      </div>
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
