import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useGetCartQuery, useDeleteCartProductMutation } from "@features/cart/cartApi";
import { BtnPrimary } from "@components/Buttons";
import { CloseIcon } from "@components/icons";
import { H3Primary, H5Primary } from "@components/Headings";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

function CartPage() {
  const navigate = useNavigate();

  // 取得購物車資料
  const { data, isLoading } = useGetCartQuery();
  const [deleteCartProduct] = useDeleteCartProductMutation();

  // 數量、商品合計
  const cartItems = data?.data?.items || [];
  const subtotal = data?.data?.amount || 0;

  const hasDiscontinuedProducts = cartItems.some(item => !item.is_available);
  // 刪除品項
  const handleDelete = async id => {
    const confirmDelete = window.confirm("確定要刪除此商品嗎？");

    if (!confirmDelete) return;
    try {
      await deleteCartProduct(id).unwrap();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "刪除失敗，請稍後再試"));
    }
  };
  // 按下前往結帳手續按鈕
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.warning("購物車沒有商品，請先加入商品");
      return; // 阻止導頁
    }
    if (hasDiscontinuedProducts) {
      toast.warning("購物車中有已下架商品，請先刪除後再前往結帳");
      return;
    }
    navigate("/checkout"); // 有商品才導到結帳頁
  };

  if (isLoading) return <div className="text-center py-10">載入中...</div>;

  return (
    <>
      <div className="pt-4">
        <div className="bg-gray-100 py-20">
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
                <li className="breadcrumb-item active">
                  <Link to="/cart">購物車</Link>
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
              <div className="line"></div>
              <div className="step">
                <H5Primary className="circle">2</H5Primary>
                <div className="step-label">
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

            <div className="d-flex flex-column gap-11 gap-lg-7">
              {/* 訂單內容 */}
              {cartItems.length > 0 ? (
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
                                    {!item.is_available && (
                                      <span className="badge bg-danger ms-2">已下架請移除</span>
                                    )}
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
                              <div className="d-flex justify-content-between ps-11">
                                <BtnPrimary
                                  type="button"
                                  size="small"
                                  className="text-danger border-danger hover:bg-danger-subtle"
                                  onClick={() => handleDelete(item.id)}
                                >
                                  刪除
                                </BtnPrimary>
                                {/* <button
                                onClick={() => handleDelete(item.id)}
                                className="btn btn-sm btn-outline-danger ms-11"
                                title="刪除"
                              >
                                刪除
                              </button> */}
                                <div className="d-flex justify-content-end align-items-center p-3 gap-1">
                                  <div className="text-gray-400">NT$</div>
                                  <div
                                    className="fs-5 fw-bold text-gray-500"
                                    style={{ letterSpacing: "0.1em" }}
                                  >
                                    {item.total_price.toLocaleString()}
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="cart-table-foot">
                      <tr className="bg-primary-200">
                        <td colSpan="3" className="rounded-start">
                          <p className="text-end fw-bold text-primary-1000 fs-5 py-3 pe-7">
                            商品合計
                          </p>
                        </td>
                        <td className="rounded-end">
                          <div className="d-flex justify-content-end align-items-center gap-1">
                            <div className="text-primary-800">NT$</div>
                            <div
                              className="fs-5 fw-bold text-primary-1000"
                              style={{ letterSpacing: "0.1em" }}
                            >
                              {subtotal.toLocaleString()}
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                  <div className="cart-table-mobile" style={{ letterSpacing: "0.1em" }}>
                    <div className="d-flex flex-column gap-4">
                      {cartItems.map(item => (
                        <div key={item.id} className="d-flex flex-row gap-3">
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
                          <div className="d-flex flex-column justify-content-between w-100">
                            <div className="d-flex justify-content-between align-items-center">
                              <div className="text-gray-600 text-multiline-truncate">
                                {item.name}
                                {!item.is_available && (
                                  <span className="badge bg-danger ms-2">已下架請移除</span>
                                )}
                              </div>
                              <button
                                type="button"
                                title="刪除商品"
                                className="icon-btn text-danger border-0 bg-gray-100 pe-0"
                                onClick={() => handleDelete(item.id)}
                                style={{ transition: "transform 0.2s" }}
                                onMouseEnter={e =>
                                  (e.currentTarget.style.transform = "scale(1.25)")
                                }
                                onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                              >
                                <CloseIcon strokeWidth={2.5} />
                              </button>
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
                      <div className="bg-primary-200 d-flex align-items-center justify-content-between px-2 py-3 rounded-1">
                        <div
                          className="text-primary-1000 fw-bold fs-5"
                          style={{ letterSpacing: "0.1em" }}
                        >
                          商品合計
                        </div>
                        <div className="d-flex align-items-center gap-1">
                          <div className="text-gray-400">NT$</div>
                          <div
                            className="text-primary-1000 fs-5 fw-bold"
                            style={{ letterSpacing: "0.1em" }}
                          >
                            {subtotal.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center fw-bold text-gray-500 fs-1 py-10">
                  目前購物車尚無商品
                </div>
              )}

              {/* 操作按鈕 */}
              {cartItems.length > 0 ? (
                <div className="d-flex justify-content-end align-items-center gap-4 gap-lg-6">
                  <div className="cart-button px-2 px-lg-3 py-1 py-lg-2">
                    <Link to="/" className="fs-lg-5 fw-bold text-gray-500">
                      繼續購物
                    </Link>
                  </div>
                  <BtnPrimary
                    className="cart-button"
                    type="button"
                    onClick={handleCheckout}
                    disabled={hasDiscontinuedProducts}
                  >
                    前往結帳手續
                  </BtnPrimary>
                </div>
              ) : (
                <div className="text-center">
                  <BtnPrimary size="large" type="button" onClick={() => navigate("/")}>
                    前往首頁
                  </BtnPrimary>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default CartPage;
