import { useState } from "react";
import { Link } from "react-router-dom";

import { useGetOrdersQuery } from "@/features/orders/orderApi";

function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

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
                            to={`/orders/${order.id}`}
                            className="btn btn-sm btn-outline-primary mx-auto d-block"
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
    </>
  );
}

export default OrderHistoryPage;
