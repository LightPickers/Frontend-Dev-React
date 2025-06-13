import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetOrdersQuery, useLazyGetOrderByIdQuery } from "@/features/orders/orderApi";
import { H3Primary, H3Secondary } from "@/components/Headings";

function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  // modal 控制
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [triggerGetOrderById, { data: selectedOrderData, isFetching: isFetchingOrder }] =
    useLazyGetOrderByIdQuery();

  const handleViewOrder = async orderId => {
    console.log("觸發查看訂單", orderId);
    setSelectedOrderId(orderId);
    //triggerGetOrderById(orderId);
    const result = await triggerGetOrderById(orderId);
    console.log("查詢結果：", result);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
  };

  const { data: response, isLoading, isError } = useGetOrdersQuery();
  const orders = response?.data ?? [];

  const countAll = orders.length;
  const countPaid = orders.filter(o => o.status === "paid").length;
  const countCanceled = orders.filter(o => o.status === "canceled").length;
  const countPending = orders.filter(o => o.status === "pending").length;
  console.log("取得訂單：", orders);

  const filteredOrders = orders
    //狀態篩選
    .filter(order => activeTab === "all" || order.status === activeTab)
    //文字篩選
    .filter(
      order => order.id.toLowerCase().includes(searchTerm.toLowerCase())
      //暫時沒有回傳商品名稱，先備註
      //order.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (isError) {
    return (
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <div className="text-center text-danger py-5">
                <p className="mb-3 fs-5">載入訂單資料時發生錯誤</p>
                <button
                  className="btn btn-outline-primary"
                  onClick={() => window.location.reload()}
                >
                  重新載入
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <h4 className="mb-5 py-2 mb-md-0">訂單資訊</h4>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">載入中...</p>
                </div>
              ) : (
                <>
                  {/* 切換按鈕區 */}
                  <div className="d-flex gap-4 border-bottom mb-4">
                    {[
                      { key: "all", label: "全部", count: countAll },
                      { key: "pending", label: "處理中", count: countPending },
                      { key: "paid", label: "已完成", count: countPaid },
                      // { key: "canceled", label: "已取消", count: countCanceled },
                      //目前沒有取消訂單功能
                    ].map(tab => (
                      <button
                        key={tab.key}
                        className={`btn btn-link px-0 ${activeTab === tab.key ? "fw-bold" : "text-muted"}`}
                        style={activeTab === tab.key ? { color: "#8BB0B7" } : {}}
                        onClick={() => setActiveTab(tab.key)}
                      >
                        {tab.label} <sup>{tab.count}</sup>
                      </button>
                    ))}
                  </div>

                  {/* search space */}
                  <div className="mb-4">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="搜尋訂單編號"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>

                  {/* 表頭欄位名稱 */}
                  <div
                    className="row text-muted px-2 mb-2 py-2 bg-light"
                    style={{ backgroundColor: "#F2F2F2", fontSize: "0.9rem" }}
                  >
                    <div className="col-6 col-lg-2">訂單成立日期</div>
                    <div className="col-6 col-lg-3">訂單編號</div>
                    {/* <div className="col-6 col-lg-3">購入商品</div> */}
                    <div className="col-6 col-lg-2 text-center">總金額</div>
                    <div className="col-6 col-lg-2 text-center">付款方式</div>
                    <div className="col-6 col-lg-1 ">狀態</div>
                    <div className="col-6 col-lg-2 text-center">操作</div>
                  </div>

                  {/* 訂單內容 */}
                  {filteredOrders.length === 0 ? (
                    <div className="text-center text-muted py-5 w-100">
                      <p className="mb-3 fs-5">查無符合條件的訂單</p>
                      <Link to="/" className="btn btn-outline-secondary">
                        前往首頁探索商品
                      </Link>
                    </div>
                  ) : (
                    filteredOrders.map(order => (
                      <div
                        key={order.id}
                        className="row align-items-center px-2 py-3 border-bottom"
                        style={{ fontSize: "0.95rem" }}
                      >
                        <div className="col-6 col-lg-2">
                          {new Date(order.created_at).toLocaleDateString("zh-TW")}
                        </div>
                        <div className="col-6 col-lg-3 text-truncate">{order.id}</div>
                        {/* 暫無商品名稱欄<div className="col-6 col-lg-3">{order.Product.name}</div> */}
                        <div className="col-6 col-lg-2 text-center">
                          NT$ {order.amount?.toLocaleString()}
                        </div>
                        <div className="col-6 col-lg-2 text-center">
                          {order.payment_method === "credit_card"
                            ? "信用卡"
                            : order.payment_method === "bank_transfer"
                              ? "銀行轉帳"
                              : order.payment_method || "未知"}
                        </div>
                        <div className="col-6 col-lg-1">
                          {order.status === "paid" ? (
                            <span className="text-muted">已完成</span>
                          ) : order.status === "canceled" ? (
                            <span className="text-muted">已取消</span>
                          ) : (
                            <span className="text-muted">處理中</span>
                          )}
                        </div>
                        <div className="col-6 col-lg-2">
                          <Link
                            className="btn btn-link p-0 text-decoration-underline mx-auto d-block"
                            style={{
                              color: "#4A6465",
                            }}
                            onMouseOver={e => (e.currentTarget.style.color = "#8BB0B7")}
                            onMouseOut={e => (e.currentTarget.style.color = "#4A6465")}
                            onClick={() => handleViewOrder(order.id)}
                          >
                            查看訂單
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                  {filteredOrders.length > 0 && (
                    <div className="text-center text-muted py-4 " style={{ fontSize: "0.9rem" }}>
                      沒有更多訂單資料
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedOrderId && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">訂單明細</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {isFetchingOrder ? (
                  <p>載入中...</p>
                ) : (
                  (() => {
                    const order = selectedOrderData?.order;
                    const items = selectedOrderData?.order_items;

                    if (!order) {
                      return <p className="text-muted">找不到訂單資料</p>;
                    }

                    return (
                      <>
                        {/* 訂單資訊表格 */}
                        <table
                          className="table table-bordered h6"
                          //style={{ borderColor: "#5B5B5B" }}
                        >
                          <tbody>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                訂單成立日期
                              </th>
                              <td>{new Date(order.created_at).toLocaleString("zh-TW")}</td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                訂單編號
                              </th>
                              <td>{order.id}</td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                訂單狀態
                              </th>
                              <td>
                                {order.status === "paid"
                                  ? "已完成"
                                  : order.status === "canceled"
                                    ? "已取消"
                                    : "處理中"}
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                收件地址
                              </th>
                              <td>
                                <p>{order.user_name} 先生/小姐</p>
                                <p>
                                  地址：{order.user_address_zipcode} {order.user_address_detail}
                                </p>
                                <p>電話：{order.user_phone}</p>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                寄送方式
                              </th>
                              <td>
                                {order.shipping_method === "home_delivery"
                                  ? "宅配到府"
                                  : order.shipping_method || "待確認"}
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                付款方式
                              </th>
                              <td>
                                {order.payment_method === "credit_card"
                                  ? "信用卡"
                                  : order.payment_method === "bank_transfer"
                                    ? "銀行轉帳"
                                    : order.payment_method || "待確認"}
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                希望配送日期
                              </th>
                              <td>{new Date(order.desired_date).toLocaleDateString("zh-TW")}</td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }} className="h6">
                                購物清單
                              </th>
                              <td>
                                {items && items.length > 0 ? (
                                  items.map(item => (
                                    <div
                                      key={item.id}
                                      className="mb-3 border-bottom pb-2 d-flex align-items-center"
                                      style={{ gap: "1rem" }} // 間距
                                    >
                                      <img
                                        src={item.primary_image}
                                        alt={item.name}
                                        style={{
                                          width: "150px",
                                          height: "auto",
                                          flexShrink: 0,
                                          borderRadius: "12px",
                                        }}
                                      />
                                      <div
                                        style={{
                                          display: "flex",
                                          flexDirection: "column",
                                          justifyContent: "center",
                                          height: "100px",
                                          flex: 1,
                                        }}
                                      >
                                        <p style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
                                          {item.name}
                                        </p>
                                        <p style={{ margin: 0 }}>
                                          NT$ {Number(item.price).toLocaleString()} / 數量：
                                          {item.quantity}
                                        </p>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <p className="text-muted">無商品資料</p>
                                )}
                                <div>
                                  <p>總計：NT$ {Number(order.amount).toLocaleString()}</p>
                                  <p>
                                    折扣券折扣總額：NT$
                                    {Number(order.discount_price).toLocaleString()}
                                  </p>

                                  <p style={{ marginTop: "0.75rem" }}>
                                    支付總額：NT$ {Number(order.final_amount).toLocaleString()}
                                  </p>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default OrderHistoryPage;
