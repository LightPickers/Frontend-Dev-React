import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { BtnPrimary } from "@components/Buttons";
import { H3Primary, H5Primary } from "@components/Headings";
import { useGetUserProfileQuery } from "@features/users/userApi";
import { useGetCouponsQuery } from "@features/coupons/couponApi";
import { useConfirmOrderInfoMutation } from "@features/cart/cartApi";
import { getCheckoutSchema } from "@schemas/cart/checkoutSchema";
import {
  setCheckoutField,
  updateDeliveryDate,
  getDefaultDeliveryDate,
} from "@features/cart/checkoutPageSlice";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

// 4-1 結帳頁面
function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 取 redux 裡保存的 checkout form 狀態
  const checkoutForm = useSelector(state => state.checkoutPage);

  //取得使用者資料
  const { data, isLoading, error } = useGetUserProfileQuery();
  const userInfo = data?.data?.user;

  // 取得優惠券資料
  const { data: couponsData } = useGetCouponsQuery({ page: 1, per: 9999 });
  const coupons = useMemo(() => {
    return couponsData?.data || [];
  }, [couponsData?.data]);
  const safeCoupons = useMemo(() => (Array.isArray(coupons) ? coupons : []), [coupons]);

  const schema = useMemo(() => getCheckoutSchema(safeCoupons), [safeCoupons]); // react-hook-form 初始化

  // 計算可選配送日期（三天後開始連續七天）
  const [deliveryDates, setDeliveryDates] = useState([]);
  useEffect(() => {
    const dates = [];
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(today.getDate() + 4);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);

      const value = date.toISOString().split("T")[0];
      const weekday = date.toLocaleDateString("zh-TW", { weekday: "short" });
      const label = `${value}(${weekday})`;

      dates.push({ value, label });
    }

    setDeliveryDates(dates);

    // 檢查並更新過期的配送日期
    dispatch(updateDeliveryDate());
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: checkoutForm,
  });

  const [formInitialized, setFormInitialized] = useState(false); // 追蹤表單初始化狀態

  useEffect(() => {
    if (!formInitialized) {
      reset(checkoutForm);
      setFormInitialized(true);
    }
    if (formInitialized && Object.keys(checkoutForm).length > 0) reset(checkoutForm);
  }, [reset, checkoutForm, formInitialized]);

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        dispatch(setCheckoutField({ name, value: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  const [confirmOrderInfo, { isLoading: isConfirming }] = useConfirmOrderInfoMutation();

  const onSubmit = async formData => {
    const matchedCoupon = coupons.find(
      c => c.code.toLowerCase() === formData.couponCode.trim().toLowerCase()
    );

    if (formData.couponCode && !matchedCoupon) {
      alert("優惠碼無效，請重新輸入");
      return;
    }

    const defaultDate = getDefaultDeliveryDate();

    // 整理要送出的資料
    const payload = {
      shipping_method: formData.shippingMethod,
      recipient: formData.recipient,
      payment_method: formData.paymentMethod,
      desired_date: formData.deliveryDate === "none" ? defaultDate : formData.deliveryDate,
      deliveryTime: formData.deliveryTime,
      coupon_code: formData.couponCode || null,
    };

    try {
      await confirmOrderInfo(payload).unwrap();
      navigate("/checkout/confirmation");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "訂單送出失敗，請稍後再試"));
    }
  };

  if (isLoading || !couponsData) return <div className="text-center py-10">載入中...</div>;
  if (error || !userInfo)
    return <div className="text-center py-10 text-danger">載入會員資料失敗</div>;

  return (
    <>
      <div className="pt-4">
        <div className="bg-gray-100 py-10 py-lg-20">
          <section className="container d-flex flex-column gap-10">
            {/* 麵包屑 */}
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-0">
                <li className="breadcrumb-item">
                  <Link to="/">首頁</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link to="/cart">購物車</Link>
                </li>
                <li className="breadcrumb-item active">
                  <Link to="/checkout">填寫訂單資料</Link>
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
              <div className="line"></div>
              <div className="step">
                <H5Primary className="circle">3</H5Primary>
                <div className="step-label">
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

            {/* 出貨資訊 */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="d-flex flex-column gap-11 gap-lg-7">
                <div className="d-flex flex-column gap-6 gap-lg-9 py-lg-8">
                  {/* 標頭 */}
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
                            <div className="text-gray-500 fw-bold">{userInfo.name}</div>
                            <div className="text-gray-500">
                              地址：{userInfo.address_zipcode}
                              {userInfo.address_district}
                              {userInfo.address_detail}
                            </div>
                            <div className="text-gray-500">電話：{userInfo.phone}</div>
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
                          <div className="form-check">
                            <input
                              {...register("shippingMethod")}
                              className={`form-check-input ${errors.shippingMethod ? "is-invalid" : ""}`}
                              type="radio"
                              value="宅配到府"
                              id="shipping-home"
                            />
                            <label className="form-check-label" htmlFor="shipping-home">
                              宅配到府
                            </label>
                            {errors.shippingMethod && (
                              <p className="invalid-feedback">{errors.shippingMethod.message}</p>
                            )}
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
                            <div
                              className="form-check d-flex align-items-center gap-2 flex-wrap"
                              style={{ position: "relative" }}
                            >
                              <input
                                {...register("recipient")}
                                className={`form-check-input ${errors.recipient ? "is-invalid" : ""}`}
                                type="radio"
                                value="self"
                                id="recipient-default"
                              />
                              <label
                                className={`form-check-label ${errors.recipient ? "is-invalid" : "text-gray-500"}`}
                                htmlFor="recipient-default"
                              >
                                <div className="fw-bold">{userInfo.name}</div>
                                <div>
                                  {userInfo.address_zipcode}
                                  {userInfo.address_district}
                                  {userInfo.address_detail}
                                </div>
                                <div>{userInfo.phone}</div>
                                <div>
                                  <Link
                                    to="/account/profile/settings"
                                    className="text-gray-500 text-decoration-underline"
                                    style={{ position: "absolute", right: "12px", bottom: 0 }}
                                  >
                                    更改收件地址
                                  </Link>
                                </div>
                              </label>
                              {errors.recipient && (
                                <p className="invalid-feedback m-0">{errors.recipient.message}</p>
                              )}
                            </div>
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
                          <div className="form-check">
                            <input
                              {...register("paymentMethod")}
                              className={`form-check-input ${errors.paymentMethod ? "is-invalid" : ""}`}
                              type="radio"
                              value="信用卡付款"
                              id="payment-credit"
                            />
                            <label className="form-check-label" htmlFor="payment-credit">
                              信用卡付款
                            </label>
                            {errors.paymentMethod && (
                              <p className="invalid-feedback">{errors.paymentMethod.message}</p>
                            )}
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
                          <select
                            {...register("deliveryDate")}
                            className={`form-select w-auto text-gray-500 ${errors.deliveryDate ? "is-invalid" : ""}`}
                          >
                            <option value="none">無希望日</option>
                            {deliveryDates.map(({ value, label }) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          {errors.deliveryDate && (
                            <p className="invalid-feedback">{errors.deliveryDate.message}</p>
                          )}
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
                          <div className="d-flex flex-column gap-2">
                            <div className="form-check">
                              <input
                                {...register("deliveryTime")}
                                className={`form-check-input ${errors.deliveryTime ? "is-invalid" : ""}`}
                                type="radio"
                                value="無希望時間"
                                id="delivery-anytime"
                              />
                              <label className="form-check-label" htmlFor="delivery-anytime">
                                無希望時間
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                {...register("deliveryTime")}
                                className={`form-check-input ${errors.deliveryTime ? "is-invalid" : ""}`}
                                type="radio"
                                value="8 點 ~ 13 點前"
                                id="delivery-morning"
                              />
                              <label className="form-check-label" htmlFor="delivery-morning">
                                8 點 ~ 13 點前
                              </label>
                            </div>
                            <div className="form-check">
                              <input
                                {...register("deliveryTime")}
                                className={`form-check-input ${errors.deliveryTime ? "is-invalid" : ""}`}
                                type="radio"
                                value="14 點 ~ 18 點"
                                id="delivery-afternoon"
                              />
                              <label className="form-check-label" htmlFor="delivery-afternoon">
                                14 點 ~ 18 點
                              </label>
                              {errors.deliveryTime && (
                                <p className="invalid-feedback">{errors.deliveryTime.message}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="divider-line"></div>
                      </div>

                      {/* 使用優惠券 */}
                      <div className="d-flex flex-column flex-lg-row align-items-center gap-3 gap-lg-4 py-lg-3">
                        <div className="col-12 col-lg-5">
                          <div
                            className="text-gray-500 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            使用優惠券
                          </div>
                        </div>
                        <div className="col-12 col-lg-7">
                          <input
                            {...register("couponCode")}
                            type="text"
                            className={`form-control w-auto text-gray-500 ${errors.couponCode ? "is-invalid" : ""}`}
                            placeholder="請輸入優惠碼"
                          />
                          {errors.couponCode && (
                            <p className="invalid-feedback">{errors.couponCode.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 操作按鈕 */}
                <div className="d-flex justify-content-end align-items-center gap-4 gap-lg-6">
                  <div className="cart-button px-2 px-lg-3 py-1 py-lg-2">
                    <Link to="/cart" className="fs-lg-5 fw-bold text-gray-500">
                      回到購物車
                    </Link>
                  </div>
                  <BtnPrimary className="cart-button" type="submit" disabled={isConfirming}>
                    確認訂單內容
                  </BtnPrimary>
                </div>
              </div>
            </form>
          </section>
        </div>
      </div>
    </>
  );
}

export default CheckoutPage;
