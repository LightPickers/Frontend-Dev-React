import { useState } from "react";
import { Link } from "react-router-dom";

import "../../assets/pages/accountPage/orderHistory.scss";
import Breadcrumbs from "@/components/Breadcrumbs";
import { useGetOrdersQuery, useLazyGetOrderByIdQuery } from "@/features/orders/orderApi";
import {
  H3Primary,
  H3Secondary,
  H4Primary,
  H5Primary,
  H5Secondary,
  H6Primary,
  H6Secondary,
} from "@/components/Headings";
import { TextMedium } from "@/components/TextTypography";

function OrderHistoryPage() {
  const [hoveredTab, setHoveredTab] = useState(null);
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
        <Breadcrumbs />
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <div className="text-center text-danger py-5">
                <TextMedium className="mb-3">載入訂單資料時發生錯誤</TextMedium>
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
        <Breadcrumbs />
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <H4Primary className="mb-5 py-2 mb-md-0">訂單資訊</H4Primary>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <TextMedium className="mt-2 text-muted">載入中...</TextMedium>
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
                    style={{ backgroundColor: "#F2F2F2" }}
                  >
                    <div className="col-6 col-lg-2">
                      <H6Secondary className="text-muted">訂單成立日期</H6Secondary>
                    </div>
                    <div className="col-6 col-lg-2 text-center">
                      <H6Secondary className="text-muted">訂單編號</H6Secondary>
                    </div>
                    <div className="col-6 col-lg-2 text-center">
                      <H6Secondary className="text-muted">總金額</H6Secondary>
                    </div>
                    <div className="col-6 col-lg-2 text-center">
                      <H6Secondary className="text-muted">付款方式</H6Secondary>
                    </div>
                    <div className="col-6 col-lg-2 text-center">
                      <H6Secondary className="text-muted">狀態</H6Secondary>
                    </div>
                    <div className="col-6 col-lg-2 text-center">
                      <H6Secondary className="text-muted">操作</H6Secondary>
                    </div>
                  </div>

                  {/* 訂單內容 */}
                  {filteredOrders.length === 0 ? (
                    <div className="text-center text-muted py-5 w-100">
                      <TextMedium className="mb-3">查無符合條件的訂單</TextMedium>
                      <div>
                        <Link to="/" className="btn btn-outline-secondary">
                          前往首頁探索商品
                        </Link>
                      </div>
                    </div>
                  ) : (
                    filteredOrders.map(order => (
                      <div
                        key={order.id}
                        className="row align-items-center px-2 py-3 border-bottom"
                      >
                        <div className="col-6 col-lg-2">
                          <TextMedium>
                            {new Date(order.created_at).toLocaleDateString("zh-TW")}
                          </TextMedium>
                        </div>
                        <div className="col-6 col-lg-2 text-truncate">
                          <TextMedium>{order.id}</TextMedium>
                        </div>
                        <div className="col-6 col-lg-2 text-center">
                          <TextMedium>NT$ {order.amount?.toLocaleString()}</TextMedium>
                        </div>
                        <div className="col-6 col-lg-2 text-center">
                          <TextMedium>
                            {order.payment_method === "credit_card"
                              ? "信用卡"
                              : order.payment_method === "bank_transfer"
                                ? "銀行轉帳"
                                : order.payment_method || "未知"}
                          </TextMedium>
                        </div>
                        <div className="col-6 col-lg-2 text-center">
                          <TextMedium className="text-muted">
                            {order.status === "paid"
                              ? "已完成"
                              : order.status === "canceled"
                                ? "已取消"
                                : "處理中"}
                          </TextMedium>
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
                    <div className="text-center text-muted py-4">
                      <H6Secondary className="text-muted">沒有更多訂單資料</H6Secondary>
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
                <H5Primary className="modal-title">訂單明細</H5Primary>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                {isFetchingOrder ? (
                  <TextMedium>載入中...</TextMedium>
                ) : (
                  (() => {
                    const order = selectedOrderData?.order;
                    const items = selectedOrderData?.order_items;

                    if (!order) {
                      return <TextMedium className="text-muted">找不到訂單資料</TextMedium>;
                    }

                    return (
                      <>
                        {/* 訂單資訊表格 */}
                        <table className="table table-bordered">
                          <tbody>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>訂單成立日期</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                <TextMedium>
                                  {new Date(order.created_at).toLocaleString("zh-TW")}
                                </TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>訂單編號</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                <TextMedium>{order.id}</TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>訂單狀態</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                <TextMedium>
                                  {order.status === "paid"
                                    ? "已完成"
                                    : order.status === "canceled"
                                      ? "已取消"
                                      : "處理中"}
                                </TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>收件地址</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                <div>
                                  <TextMedium>{order.user_name} 先生/小姐</TextMedium>
                                </div>
                                <div>
                                  <TextMedium>
                                    地址：{order.user_address_zipcode} {order.user_address_detail}
                                  </TextMedium>
                                </div>
                                <div>
                                  <TextMedium>電話：{order.user_phone}</TextMedium>
                                </div>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>寄送方式</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                <TextMedium>
                                  {order.shipping_method === "home_delivery"
                                    ? "宅配到府"
                                    : order.shipping_method || "待確認"}
                                </TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>付款方式</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                <TextMedium>
                                  {order.payment_method === "credit_card"
                                    ? "信用卡"
                                    : order.payment_method === "bank_transfer"
                                      ? "銀行轉帳"
                                      : order.payment_method || "待確認"}
                                </TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>希望配送日期</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                <TextMedium>
                                  {order.desired_date
                                    ? new Date(order.desired_date).toLocaleDateString("zh-TW")
                                    : "未指定"}
                                </TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>購物清單</H6Primary>
                              </th>
                              <td className="modal-td-content">
                                {items && items.length > 0 ? (
                                  items.map(item => (
                                    <div
                                      key={item.id}
                                      className="mb-3 border-bottom pb-2 d-flex align-items-center"
                                      style={{ gap: "1rem" }}
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
                                        <TextMedium style={{ margin: "0 0 4px 0" }}>
                                          {item.name}
                                        </TextMedium>
                                        <TextMedium style={{ margin: 0 }}>
                                          NT$ {Number(item.price).toLocaleString()} / 數量：
                                          {item.quantity}
                                        </TextMedium>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <TextMedium className="text-muted">無商品資料</TextMedium>
                                )}
                                <div>
                                  <div>
                                    <TextMedium>
                                      總計：NT$ {Number(order.amount).toLocaleString()}
                                    </TextMedium>
                                  </div>
                                  <div>
                                    <TextMedium>
                                      折扣券折扣總額：NT$
                                      {Number(order.discount_price).toLocaleString()}
                                    </TextMedium>
                                  </div>
                                  <div style={{ marginTop: " 0.75rem" }}>
                                    <TextMedium>
                                      支付總額：NT$ {Number(order.final_amount).toLocaleString()}
                                    </TextMedium>
                                  </div>
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
