import { Link, useNavigate } from "react-router-dom";

import { BtnPrimary } from "@/components/Buttons";
import { H3Primary, H5Primary } from "@/components/Headings";

function CartPage() {
  // 假資料
  const cartItems = [
    {
      id: 1,
      name: "商品一",
      image: "https://fakeimg.pl/60",
      price: 19000,
      qty: 1,
    },
    {
      id: 2,
      name: "商品二",
      image: "https://fakeimg.pl/60",
      price: 20000,
      qty: 1,
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const shipping = 60;
  const total = subtotal + shipping;

  const navigate = useNavigate();
  const handleConfirm = () => {
    // 這裡可以接後端 API 發送訂單
    navigate("/checkout/success");
  };

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
              <li className="breadcrumb-item active">
                <Link to="/cart">購物車</Link>
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
              <div className="line"></div>
              <div className="step">
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

          {/* 訂單內容 */}
          <div className="cart-contents py-8">
            <H3Primary className="mb-9 heading-border pb-3">確認訂單內容</H3Primary>
            <table className="table cart-table align-middle text-nowrap">
              <thead className="table-head">
                <tr>
                  <th className="text-start text-gray-600 px-3 py-2" scope="col">
                    商品資訊
                  </th>
                  <th className="text-end text-gray-600 px-3 py-2" scope="col">
                    價格
                  </th>
                  <th className="text-end text-gray-600 px-3 py-2" scope="col">
                    數量
                  </th>
                  <th className="text-end text-gray-600 px-3 py-2" scope="col">
                    總計
                  </th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <div className="d-flex align-items-center gap-4">
                        <img
                          src={item.image}
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
                          {item.price.toLocaleString()}
                        </div>
                      </div>
                    </td>
                    <td className="text-end text-gray-500">{item.qty}</td>
                    <td>
                      <div className="d-flex justify-content-end align-items-center gap-1">
                        <div className="text-gray-400">NT$</div>
                        <div className="fs-5 fw-bold text-gray-500">
                          {(item.price * item.qty).toLocaleString()}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <tr className="bg-primary-200 rounded-1">
                  <td colSpan="3" className="rounded-1 text-end fw-bold fs-5 text-primary-1000">
                    總計
                  </td>
                  <td className="rounded-1">
                    <div className="d-flex justify-content-end align-items-center gap-1">
                      <div className="text-primary-800">NT$</div>
                      <div className="fs-5 fw-bold text-primary-1000">{total.toLocaleString()}</div>
                    </div>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* 操作按鈕 */}
          <div className="d-flex justify-content-end align-items-center gap-8">
            <div className="px-3 py-2">
              <Link to="/" className="fs-5 fw-bold text-gray-500">
                繼續購物
              </Link>
            </div>
            <BtnPrimary as={Link} to="/checkout">
              前往結帳手續
            </BtnPrimary>
          </div>
        </section>
      </div>
    </>
  );
}

export default CartPage;
