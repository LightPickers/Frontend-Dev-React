import { useState } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import "../../assets/pages/accountPage/orderHistory.scss";
import { ArrowDownIcon } from "@/components/icons";
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
import { BtnPrimary } from "@/components/Buttons";

function OrderHistoryPage() {
  const [hoveredTab, setHoveredTab] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  // modal 控制
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  // 手機版下拉式控制
  const [expandedOrders, setExpandedOrders] = useState(new Set());
  // 儲存已載入的訂單詳細資料
  const [orderDetailsCache, setOrderDetailsCache] = useState({});

  const [triggerGetOrderById, { data: selectedOrderData, isFetching: isFetchingOrder }] =
    useLazyGetOrderByIdQuery();

  const handleViewOrder = async orderId => {
    setSelectedOrderId(orderId);
    const result = await triggerGetOrderById(orderId);
  };

  const closeModal = () => {
    setSelectedOrderId(null);
  };

  // 切換手機版訂單展開/收合
  const toggleOrderExpansion = async orderId => {
    const newExpanded = new Set(expandedOrders);

    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);

      // 如果還沒載入過這個訂單的詳細資料，就載
      if (!orderDetailsCache[orderId]) {
        try {
          const result = await triggerGetOrderById(orderId);
          if (result.data) {
            setOrderDetailsCache(prev => ({
              ...prev,
              [orderId]: result.data,
            }));
          }
        } catch (error) {
          console.error("載入訂單詳細資料失敗:", error);
        }
      }
    }

    setExpandedOrders(newExpanded);
  };

  const { data: response, isLoading, isError } = useGetOrdersQuery();
  const orders = response?.data ?? [];

  const countAll = orders.length;
  const countPaid = orders.filter(o => o.status === "paid").length;
  const countCanceled = orders.filter(o => o.status === "canceled").length;
  const countPending = orders.filter(o => o.status === "pending").length;

  const filteredOrders = orders
    //狀態篩選
    .filter(order => activeTab === "all" || order.status === activeTab)
    //文字篩選
    .filter(
      order =>
        // 如果搜尋框是空的，就直接回傳 true
        !searchTerm ||
        // 進行搜尋文字的比對
        (order.merchant_order_no &&
          order.merchant_order_no.toLowerCase().includes(searchTerm.toLowerCase()))
    );

  if (isError) {
    return (
      <div className="text-center text-danger py-5">
        <TextMedium className="mb-3">載入訂單資料時發生錯誤</TextMedium>
        <BtnPrimary size="medium" onClick={() => window.location.reload()}>
          重新載入
        </BtnPrimary>
      </div>
    );
  }

  // 手機版訂單卡片
  const MobileOrderCard = ({ order }) => {
    const isExpanded = expandedOrders.has(order.id);
    const orderDetails = orderDetailsCache[order.id];
    const items = orderDetails?.order_items || [];

    return (
      <div className="mobile-order-card border rounded mb-3 bg-white overflow-hidden shadow-sm">
        <div
          className="p-3 position-relative d-flex flex-column"
          onClick={() => toggleOrderExpansion(order.id)}
          style={{ cursor: "pointer" }}
        >
          {/* 訂單資訊區塊 */}
          <div className="mb-2">
            <TextMedium
              className=" mb-1"
              style={{ fontSize: "1rem", fontWeight: "600", color: "#212529" }}
            >
              訂單編號：{order.merchant_order_no}
            </TextMedium>
            <br />
            <TextMedium className="text-muted mb-1" style={{ fontSize: "0.75rem" }}>
              成立日期：{new Date(order.created_at).toLocaleDateString("zh-TW")}
            </TextMedium>
          </div>

          {/* 金額+箭頭 */}
          <div className="d-flex justify-content-between align-items-center">
            <TextMedium style={{ fontSize: "0.8rem" }}>
              NT$ {order.amount?.toLocaleString()}
            </TextMedium>

            {/* 展開箭頭 */}
            <div className="d-flex align-items-center">
              <ArrowDownIcon
                size={20}
                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
                style={{
                  color: "#6c757d",
                  transition: "transform 0.2s ease-in-out",
                }}
              />
            </div>
          </div>

          {/* 訂單狀態移到右上角 */}
          <span
            className={`badge position-absolute rounded-pill text-white px-2 py-1 ${
              order.status === "paid"
                ? "bg-success"
                : order.status === "canceled"
                  ? "bg-danger"
                  : "bg-warning text-dark"
            }`}
            style={{
              top: "12px",
              right: "12px",
              fontSize: "0.75rem",
              fontWeight: "500",
            }}
          >
            {order.status === "paid" ? "已完成" : order.status === "canceled" ? "已取消" : "處理中"}
          </span>
        </div>

        {/* 展開時顯示的詳細資訊 */}
        {isExpanded && (
          <div className="border-top p-3">
            {/* 商品預覽 */}
            <div className="mb-3">
              <H6Primary className="mb-3">購物清單</H6Primary>

              {!orderDetails ? (
                // 載入中狀態
                <div className="text-center py-3">
                  <div className="spinner-border spinner-border-sm text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <TextMedium className="mt-2 text-muted small">載入商品資料中...</TextMedium>
                </div>
              ) : items.length > 0 ? (
                // 顯示商品列表
                <div className="product-list">
                  {items.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="d-flex align-items-center p-2 mb-2 bg-light rounded"
                      style={{ gap: "0.75rem" }}
                    >
                      <div className="flex-shrink-0" style={{ width: "60px", height: "60px" }}>
                        {item.primary_image ? (
                          <img
                            src={item.primary_image}
                            alt={item.name}
                            className="w-100 h-100 rounded"
                            style={{ objectFit: "cover" }}
                          />
                        ) : (
                          <div className="w-100 h-100 bg-secondary rounded d-flex align-items-center justify-content-center">
                            <i
                              className="fas fa-image text-white"
                              style={{ fontSize: "1.5rem" }}
                            ></i>
                          </div>
                        )}
                      </div>

                      <div className="flex-grow-1 min-width-0">
                        <TextMedium
                          className="mb-1 text-truncate"
                          style={{ fontSize: "0.875rem", fontWeight: "500" }}
                        >
                          {item.name}
                        </TextMedium>
                        <div className="d-flex justify-content-between align-items-center">
                          <TextMedium className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                            NT$ {Number(item.price).toLocaleString()}
                          </TextMedium>
                          <TextMedium className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>
                            數量：{item.quantity}
                          </TextMedium>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* 總金額資訊 */}
                  <div className="mt-3 p-2 bg-light rounded">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <TextMedium style={{ fontSize: "0.875rem" }}>商品總計：</TextMedium>
                      <TextMedium style={{ fontSize: "0.875rem" }}>
                        NT$ {Number(orderDetails.order.final_amount).toLocaleString()}
                      </TextMedium>
                    </div>
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <TextMedium style={{ fontSize: "0.875rem" }}>運費：</TextMedium>
                      <TextMedium style={{ fontSize: "0.875rem" }}>
                        NT$ {Number(orderDetails.order.shippingFee).toLocaleString()}
                      </TextMedium>
                    </div>

                    {orderDetails.order.discount_price > 0 && (
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <TextMedium className="text-success" style={{ fontSize: "0.875rem" }}>
                          折扣券折扣：
                        </TextMedium>
                        <TextMedium className="text-success" style={{ fontSize: "0.875rem" }}>
                          -NT$ {Number(orderDetails.order.discount_price).toLocaleString()}
                        </TextMedium>
                      </div>
                    )}

                    <div className="d-flex justify-content-between align-items-center border-top pt-2 mt-2">
                      <TextMedium className="fw-bold" style={{ fontSize: "0.9rem" }}>
                        支付總額：
                      </TextMedium>
                      <TextMedium className="fw-bold" style={{ fontSize: "0.9rem" }}>
                        NT$ {Number(orderDetails.order.amount).toLocaleString()}
                      </TextMedium>
                    </div>
                  </div>
                </div>
              ) : (
                // 無商品資料
                <div className="text-center py-3">
                  <TextMedium className="text-muted">無商品資料</TextMedium>
                </div>
              )}
            </div>

            <div className="text-center">
              <BtnPrimary
                size="small"
                className="w-100"
                onClick={e => {
                  e.stopPropagation();
                  handleViewOrder(order.id);
                }}
              >
                查看訂單
              </BtnPrimary>
            </div>
          </div>
        )}
      </div>
    );
  };

  MobileOrderCard.propTypes = {
    order: PropTypes.shape({
      id: PropTypes.string.isRequired,
      merchant_order_no: PropTypes.string,
      status: PropTypes.string.isRequired,
      created_at: PropTypes.string.isRequired,
      amount: PropTypes.number,
      payment_method: PropTypes.string,
      shipping_method: PropTypes.string,
    }).isRequired,
  };

  return (
    <>
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
          <div className="d-flex gap-4 border-bottom mb-4 flex-wrap">
            {[
              { key: "all", label: "全部", count: countAll },
              { key: "pending", label: "處理中", count: countPending },
              { key: "paid", label: "已完成", count: countPaid },
              { key: "canceled", label: "已取消", count: countCanceled },
            ].map(tab => (
              <button
                key={tab.key}
                className={`btn btn-link px-0 flex-shrink-0 ${activeTab === tab.key ? "fw-bold" : "text-muted"}`}
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

          {/* 桌面-大螢幕顯示 */}
          <div className="d-none d-lg-block">
            {/* 表頭欄位名稱 */}
            <div
              className="row text-muted px-2 mb-2 py-2 bg-light"
              style={{ backgroundColor: "#F2F2F2" }}
            >
              <div className="col-6 col-lg-3 ps-7">
                <H6Secondary className="text-muted">訂單成立日期</H6Secondary>
              </div>
              <div className="col-6 col-lg-2 text-center">
                <H6Secondary className="text-muted">訂單編號</H6Secondary>
              </div>
              <div className="col-6 col-lg-3 text-center">
                <H6Secondary className="text-muted">總金額</H6Secondary>
              </div>
              {/* <div className="col-6 col-lg-2 text-center">
                <H6Secondary className="text-muted">付款方式</H6Secondary>
              </div> */}
              <div className="col-6 col-lg-2 text-center">
                <H6Secondary className="text-muted">狀態</H6Secondary>
              </div>
              <div className="col-6 col-lg-2 text-center">
                <H6Secondary className="text-muted">操作</H6Secondary>
              </div>
            </div>

            {/* 桌面-訂單內容 */}
            {filteredOrders.length === 0 ? (
              <div className="text-center py-5 w-100">
                <H6Secondary className="mb-6">查無符合條件的訂單</H6Secondary>
                <BtnPrimary as={Link} to="/" size="medium">
                  前往首頁探索商品
                </BtnPrimary>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="row align-items-center px-2 py-3 border-bottom">
                  <div className="col-6 col-lg-3 ps-7">
                    <TextMedium>
                      {new Date(order.created_at).toLocaleDateString("zh-TW")}
                    </TextMedium>
                  </div>
                  <div className="col-6 col-lg-2 text-center">
                    <TextMedium>{order.merchant_order_no}</TextMedium>
                  </div>
                  <div className="col-6 col-lg-3 text-center">
                    <TextMedium>NT$ {order.amount?.toLocaleString()}</TextMedium>
                  </div>
                  {/* <div className="col-6 col-lg-2 text-center">
                    <TextMedium>
                      {order.payment_method === "credit_card"
                        ? "信用卡"
                        : order.payment_method === "bank_transfer"
                          ? "銀行轉帳"
                          : order.payment_method || "未知"}
                    </TextMedium>
                  </div> */}
                  <div className="col-6 col-lg-2 text-center">
                    <TextMedium className="text-muted">
                      {order.status === "paid"
                        ? "已完成"
                        : order.status === "canceled"
                          ? "已取消"
                          : "處理中"}
                    </TextMedium>
                  </div>
                  <div className="col-6 col-lg-2 text-center">
                    <TextMedium
                      className="text-primary text-decoration-underline cursor-pointer hover-text"
                      onClick={e => {
                        e.stopPropagation();
                        handleViewOrder(order.id);
                      }}
                      style={{ fontSize: "0.875rem", fontWeight: "500" }}
                    >
                      查看訂單
                    </TextMedium>
                  </div>
                </div>
              ))
            )}
            {filteredOrders.length > 0 && (
              <div className="text-center text-muted py-4">
                <H6Secondary className="text-muted">沒有更多訂單資料</H6Secondary>
              </div>
            )}
          </div>

          {/* 手機版卡片式布局 - 只在小螢幕顯示 */}
          <div className="d-lg-none">
            {filteredOrders.length === 0 ? (
              <div className="text-center text-muted py-10 w-100">
                <H6Secondary className="mb-6">查無符合條件的訂單</H6Secondary>
                <div>
                  <BtnPrimary as={Link} to="/" size="small">
                    前往首頁探索商品
                  </BtnPrimary>
                </div>
              </div>
            ) : (
              <>
                {filteredOrders.map(order => (
                  <MobileOrderCard key={order.id} order={order} />
                ))}
                {filteredOrders.length > 0 && (
                  <div className="text-center text-muted py-4">
                    <H6Secondary className="text-muted">沒有更多訂單資料</H6Secondary>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}

      {/* Modal */}
      {selectedOrderId && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <H4Primary className="modal-title fs-1">訂單明細</H4Primary>
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
                        <table className="order-detail-table d-none d-lg-table table table-bordered">
                          <tbody>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>訂單成立日期</H6Primary>
                              </th>
                              <td className="modal-td-content ps-5">
                                <TextMedium>
                                  {new Date(order.created_at).toLocaleString("zh-TW")}
                                </TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>訂單編號</H6Primary>
                              </th>
                              <td className="modal-td-content ps-5">
                                <TextMedium>{order.merchant_order_no}</TextMedium>
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>訂單狀態</H6Primary>
                              </th>
                              <td className="modal-td-content ps-5">
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
                              <td className="modal-td-content ps-5">
                                <div>
                                  <TextMedium>{order.user_name} 先生/小姐</TextMedium>
                                </div>
                                <div>
                                  <TextMedium>
                                    地址：{order.user_address_zipcode} {order.user_address_city}
                                    {order.user_address_district}
                                    {order.user_address_detail}
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
                              <td className="modal-td-content ps-5">
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
                              <td className="modal-td-content ps-5">
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
                              <td className="modal-td-content ps-5">
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
                              <td className="modal-td-content py-3 ps-5">
                                {items && items.length > 0 ? (
                                  items.map(item => (
                                    <div
                                      key={item.id}
                                      className=" pb-3 d-flex align-items-center"
                                      style={{ gap: "1rem" }}
                                    >
                                      <img
                                        src={item.primary_image}
                                        alt={item.name}
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          objectFit: "cover",
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
                              </td>
                            </tr>
                            <tr>
                              <th style={{ backgroundColor: "#D4D4D4" }}>
                                <H6Primary>金額資訊</H6Primary>
                              </th>
                              <td className="modal-td-content ps-5">
                                <div className="d-flex flex-column gap-3">
                                  <div className="d-flex flex-column gap-1">
                                    <TextMedium>
                                      商品總計：NT$ {Number(order.final_amount).toLocaleString()}
                                    </TextMedium>

                                    <TextMedium>
                                      折扣總額：NT$
                                      {Number(order.discount_price).toLocaleString()}
                                    </TextMedium>

                                    <TextMedium>
                                      運費：NT$
                                      {Number(order.shippingFee).toLocaleString()}
                                    </TextMedium>
                                  </div>
                                  <div className="divider-line"></div>
                                  <div>
                                    <TextMedium>
                                      支付總額：NT$ {Number(order.amount).toLocaleString()}
                                    </TextMedium>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        {/* 訂單資訊表格手機版 */}
                        <div className="order-detail-mobile d-block d-lg-none d-flex flex-column gap-4 pe-0">
                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">訂單成立日期</H5Primary>
                            <TextMedium className="fw-normal">
                              {new Date(order.created_at).toLocaleString("zh-TW")}
                            </TextMedium>
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">訂單編號</H5Primary>
                            <TextMedium className="fw-normal">{order.merchant_order_no}</TextMedium>
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">訂單狀態</H5Primary>
                            <TextMedium className="fw-normal">
                              {order.status === "paid"
                                ? "已完成"
                                : order.status === "canceled"
                                  ? "已取消"
                                  : "處理中"}
                            </TextMedium>
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">收件地址</H5Primary>
                            <TextMedium className="fw-normal">
                              {order.user_name} 先生/小姐
                            </TextMedium>
                            <TextMedium className="fw-normal">
                              地址：{order.user_address_zipcode} {order.user_address_city}
                              {order.user_address_district}
                              {order.user_address_detail}
                            </TextMedium>
                            <TextMedium className="fw-normal">電話：{order.user_phone}</TextMedium>
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">寄送方式</H5Primary>
                            <TextMedium className="fw-normal">
                              {order.shipping_method === "home_delivery"
                                ? "宅配到府"
                                : order.shipping_method || "待確認"}
                            </TextMedium>
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">付款方式</H5Primary>
                            <TextMedium className="fw-normal">
                              {order.payment_method === "credit_card"
                                ? "信用卡"
                                : order.payment_method === "bank_transfer"
                                  ? "銀行轉帳"
                                  : order.payment_method || "待確認"}
                            </TextMedium>
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">希望配送日期</H5Primary>
                            <TextMedium className="fw-normal">
                              {order.desired_date
                                ? new Date(order.desired_date).toLocaleDateString("zh-TW")
                                : "未指定"}
                            </TextMedium>
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">購物清單</H5Primary>
                            {items && items.length > 0 ? (
                              items.map(item => (
                                <div key={item.id} className="d-flex align-items-center gap-3">
                                  <img
                                    src={item.primary_image}
                                    alt={item.name}
                                    style={{
                                      width: "80px",
                                      height: "80px",
                                      objectFit: "cover",
                                      borderRadius: "10px",
                                      flexShrink: 0,
                                    }}
                                  />
                                  <div className="d-flex flex-column">
                                    <TextMedium className="fw-normal">{item.name}</TextMedium>
                                    <TextMedium className="fw-normal">
                                      NT$ {Number(item.price).toLocaleString()} / 數量：
                                      {item.quantity}
                                    </TextMedium>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <TextMedium className="text-muted">無商品資料</TextMedium>
                            )}
                          </div>

                          <div className="d-flex flex-column gap-3 pb-2 border-bottom">
                            <H5Primary className="fs-5">金額資訊</H5Primary>
                            <TextMedium className="fw-normal">
                              商品總計：NT$ {Number(order.final_amount).toLocaleString()}
                            </TextMedium>
                            <TextMedium className="fw-normal">
                              折扣總額：NT$ {Number(order.discount_price).toLocaleString()}
                            </TextMedium>
                            <TextMedium className="fw-normal">
                              運費：NT$ {Number(order.shippingFee).toLocaleString()}
                            </TextMedium>
                            <div className="divider-line" />
                            <TextMedium className="fw-bold">
                              支付總額：NT$ {Number(order.amount).toLocaleString()}
                            </TextMedium>
                          </div>
                        </div>
                      </>
                    );
                  })()
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .hover-text:hover {
          color: #4a6465;
        }
        .mobile-order-card {
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: box-shadow 0.2s ease;
        }

        .mobile-order-card:hover {
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .cursor-pointer {
          cursor: pointer;
        }

        .min-width-0 {
          min-width: 0;
        }

        .text-break {
          word-break: break-word;
        }

        .transition-transform {
          transition: transform 0.2s ease-in-out;
        }

        .rotate-180 {
          transform: rotate(180deg);
        }

        @media (max-width: 991.98px) {
          .container {
            padding-left: 15px;
            padding-right: 15px;
          }

          .mobile-order-card {
            margin-left: -15px;
            margin-right: -15px;
            border-radius: 0;
            border-left: none;
            border-right: none;
          }

          .mobile-order-card:first-child {
            border-top: none;
          }
        }

        @media (max-width: 575.98px) {
          .mobile-order-card .position-absolute.badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.5rem;
          }
        }

        /* 訂單編號顯示 */
        .order-number-text {
          line-height: 1;
        }

        }
      `}</style>
    </>
  );
}

export default OrderHistoryPage;
