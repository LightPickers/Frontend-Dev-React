import { Link, useNavigate } from "react-router-dom";

import { useGetCartQuery, useDeleteCartProductMutation } from "@/features/cart/cartApi";
import { BtnPrimary } from "@/components/Buttons";
import { H3Primary, H5Primary } from "@/components/Headings";

function CartPage() {
  const navigate = useNavigate();

  // 取得購物車資料
  const { data, isLoading } = useGetCartQuery();
  const [deleteCartProduct] = useDeleteCartProductMutation();

  // 小計、運費、總計計算
  const cartItems = data?.data?.items || [];
  const subtotal = data?.data?.amount || 0;
  const shipping = 60;
  const total = subtotal + shipping;

  // 刪除品項
  const handleDelete = async id => {
    const confirmDelete = window.confirm("確定要刪除此商品嗎？");

    if (!confirmDelete) return;
    try {
      await deleteCartProduct(id).unwrap();
    } catch (err) {
      console.error("刪除失敗", err);
    }
  };
  // 按下前往結帳手續按鈕
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("購物車沒有商品，請先加入商品");
      return; // 阻止導頁
    }
    navigate("/checkout"); // 有商品才導到結帳頁
  };

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
                        <div className="d-flex justify-content-between">
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="btn btn-sm btn-outline-danger ms-11"
                            title="刪除"
                          >
                            刪除
                          </button>
                          <div className="d-flex justify-content-end align-items-center gap-1">
                            <div className="text-gray-400">NT$</div>
                            <div className="fs-5 fw-bold text-gray-500">
                              {item.total_price.toLocaleString()}
                            </div>
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
                    <p>商品合計</p>
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
                    <p>運費</p>
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
                    <p>總計</p>
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

          {/* 操作按鈕 */}
          <div className="d-flex justify-content-end align-items-center gap-8">
            <div className="px-3 py-2">
              <Link to="/" className="fs-5 fw-bold text-gray-500">
                繼續購物
              </Link>
            </div>
            <BtnPrimary onClick={handleCheckout}>前往結帳手續</BtnPrimary>
          </div>
        </section>
      </div>
    </>
  );
}

export default CartPage;
