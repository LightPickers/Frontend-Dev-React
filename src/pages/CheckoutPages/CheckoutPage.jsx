import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { BtnPrimary } from "@/components/Buttons";
import { H3Primary, H5Primary } from "@/components/Headings";

const shippingInfo = {
  name: "王大明",
  phone: "0912-345678",
  email: "example123@gmail.com",
  address: "台北市大安區信義路三段10號",
  paymentMethod: "信用卡付款",
  deliveryDate: "無指定",
  deliveryTime: "無指定",
};

// 4-1 結帳頁面
function CheckoutPage() {
  const [deliveryDates, setDeliveryDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState("none");
  const [couponCode, setCouponCode] = useState("");

  useEffect(() => {
    const dates = [];
    const today = new Date();

    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const value = date.toISOString().split("T")[0]; // YYYY-MM-DD
      const weekday = date.toLocaleDateString("zh-TW", { weekday: "short" });
      const label = `${value}（${weekday}）`;

      dates.push({ value, label });
    }

    setDeliveryDates(dates);
  }, []);

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
                    <div className="fw-bold text-gray-500">{shippingInfo.name}</div>
                    <div className="text-gray-500">{shippingInfo.email}</div>
                    <div className="text-gray-500">{shippingInfo.address}</div>
                    <div className="text-gray-500">{shippingInfo.phone}</div>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    寄送方式
                  </th>
                  <td className="py-3 text-gray-500">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="shippingMethod"
                        id="shipping-home"
                      />
                      <label class="form-check-label" for="shipping-home">
                        宅配到府
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    收件者
                  </th>
                  <td className="py-3 d-flex flex-column gap-2">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="recipient"
                        id="recipient-default"
                      />
                      <label class="form-check-label" for="recipient-default">
                        <div className="fw-bold text-gray-500">{shippingInfo.name}</div>
                        <div className="text-gray-500">{shippingInfo.address}</div>
                        <div className="text-gray-500">{shippingInfo.phone}</div>
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    付款方式
                  </th>
                  <td className="py-3 text-gray-500">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="paymentMethod"
                        id="payment-credit"
                      />
                      <label class="form-check-label" for="payment-credit">
                        信用卡付款
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    希望配送日期
                  </th>
                  <td className="py-3">
                    <select
                      className="form-select w-auto text-gray-500"
                      value={selectedDate}
                      onChange={e => setSelectedDate(e.target.value)}
                      name="deliveryDate"
                    >
                      <option value="none">無希望日</option>
                      {deliveryDates.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3">
                    到貨時間
                  </th>
                  <td className="py-3 text-gray-500">
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="deliveryTime"
                        id="delivery-anytime"
                      />
                      <label class="form-check-label" for="delivery-anytime">
                        無希望時間
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="deliveryTime"
                        id="delivery-morning"
                      />
                      <label class="form-check-label" for="delivery-morning">
                        13點前
                      </label>
                    </div>
                    <div class="form-check">
                      <input
                        class="form-check-input"
                        type="radio"
                        name="deliveryTime"
                        id="delivery-morning"
                      />
                      <label class="form-check-label" for="delivery-morning">
                        14點～18點
                      </label>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th scope="row" className="fs-5 fw-bold text-gray-500 py-3 border-0">
                    使用優惠券
                  </th>
                  <td className="py-3 border-0">
                    <input
                      type="text"
                      className="form-control w-auto text-gray-500"
                      placeholder="請輸入優惠碼"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      name="couponCode"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 操作按鈕 */}
          <div className="d-flex justify-content-end align-items-center gap-8">
            <div className="px-3 py-2">
              <Link to="/" className="fs-5 fw-bold text-gray-500">
                回到購物車
              </Link>
            </div>
            <BtnPrimary as={Link} to="/checkout">
              確認訂單內容
            </BtnPrimary>
          </div>
        </section>
      </div>
    </>
  );
}

export default CheckoutPage;
