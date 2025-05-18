import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";

import { BtnPrimary } from "@/components/Buttons";
import { H3Primary, H5Primary } from "@/components/Headings";
import { useGetUserProfileQuery } from "@/features/users/userApi";
import { useGetCouponsQuery } from "@/features/coupons/couponApi";
import { useConfirmOrderInfoMutation } from "@/features/cart/cartApi";
import { getCheckoutSchema } from "@schemas/cart/checkoutSchema";
import { setCheckoutField, resetCheckoutForm } from "@/features/cart/checkoutPageSlice";

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
  const coupons = couponsData?.data || [];
  const safeCoupons = useMemo(() => (Array.isArray(coupons) ? coupons : []), [coupons]);

  const schema = useMemo(() => getCheckoutSchema(safeCoupons), [safeCoupons]); // react-hook-form 初始化

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onBlur",
    defaultValues: checkoutForm,
  });

  // 監聽表單改變同步 redux + localStorage
  useEffect(() => {
    const subscription = watch((value, { name }) => {
      if (name) {
        dispatch(setCheckoutField({ name, value: value[name] }));
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, dispatch]);

  // 計算可選配送日期（三天後開始連續七天）
  const [deliveryDates, setDeliveryDates] = useState([]);

  useEffect(() => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i + 2);

      const value = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const weekday = date.toLocaleDateString("zh-TW", { weekday: "short" });
      const label = `${value}（${weekday}）`;

      dates.push({ value, label });
    }

    setDeliveryDates(dates);
  }, []);

  const [confirmOrderInfo, { isLoading: isSubmitting }] = useConfirmOrderInfoMutation();

  const onSubmit = async formData => {
    const matchedCoupon = coupons.find(
      c => c.code.toLowerCase() === formData.couponCode.trim().toLowerCase()
    );

    if (formData.couponCode && !matchedCoupon) {
      alert("優惠碼無效，請重新輸入");
      return;
    }

    // 整理要送出的資料
    const payload = {
      shipping_method: formData.shippingMethod,
      recipient: formData.recipient,
      payment_method: formData.paymentMethod,
      desired_date: formData.deliveryDate || "noPreference",
      deliveryTime: formData.deliveryTime,
      coupon_code: formData.couponCode || null,
    };

    try {
      await confirmOrderInfo(payload).unwrap();
      // dispatch(resetCheckoutForm()); //付款成功再清除
      navigate("/checkout/confirmation");
    } catch (err) {
      alert("訂單送出失敗，請稍後再試");
    }
  };

  if (isLoading || !couponsData) return <div className="text-center py-10">載入中...</div>;
  if (error || !userInfo)
    return <div className="text-center py-10 text-danger">載入會員資料失敗</div>;

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
              <li className="breadcrumb-item active">
                <Link to="/checkout">填寫訂單資料</Link>
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
              <div className="line"></div>
              <div className="step">
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

          {/* 出貨資訊 */}
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="py-8 mb-7">
              <H3Primary className="heading-border pb-3 mb-9">填寫訂單資料</H3Primary>
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
                      <div className="text-gray-500">{userInfo.email}</div>
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
                    <td className="py-3 text-gray-500">
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
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                      收件者
                    </th>
                    <td className="py-3">
                      <div className="form-check d-flex align-items-center gap-2 flex-wrap">
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
                          <div className="">{userInfo.phone}</div>
                        </label>
                        {errors.recipient && (
                          <p className="invalid-feedback m-0">{errors.recipient.message}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                      付款方式
                    </th>
                    <td className="py-3 text-gray-500">
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
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                      希望配送日期
                    </th>
                    <td className="py-3">
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
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                      到貨時間
                    </th>
                    <td className="py-3 text-gray-500">
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
                          value="8點～13點前"
                          id="delivery-morning"
                        />
                        <label className="form-check-label" htmlFor="delivery-morning">
                          8點~13點前
                        </label>
                      </div>
                      <div className="form-check">
                        <input
                          {...register("deliveryTime")}
                          className={`form-check-input ${errors.deliveryTime ? "is-invalid" : ""}`}
                          type="radio"
                          value="14點～18點"
                          id="delivery-afternoon"
                        />
                        <label className="form-check-label" htmlFor="delivery-afternoon">
                          14點～18點
                        </label>
                        {errors.deliveryTime && (
                          <p className="invalid-feedback">{errors.deliveryTime.message}</p>
                        )}
                      </div>
                    </td>
                  </tr>
                  <tr>
                    <th scope="row" className="fs-5 fw-bold text-gray-500 py-3 border-0">
                      使用優惠券
                    </th>
                    <td className="py-3 border-0">
                      <input
                        {...register("couponCode")}
                        type="text"
                        className={`form-control w-auto text-gray-500 ${errors.couponCode ? "is-invalid" : ""}`}
                        placeholder="請輸入優惠碼"
                      />
                      {errors.couponCode && (
                        <p className="invalid-feedback">{errors.couponCode.message}</p>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* 操作按鈕 */}
            <div className="d-flex justify-content-end align-items-center gap-8">
              <div className="px-3 py-2">
                <Link to="/cart" className="fs-5 fw-bold text-gray-500">
                  回到購物車
                </Link>
              </div>
              <BtnPrimary type="submit">確認訂單內容</BtnPrimary>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}

export default CheckoutPage;
