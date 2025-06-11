import { useState } from "react";
import { Link } from "react-router-dom";

//import { useGetOrdersQuery } from "@/features/orders/orderApi";

function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  //const { data: response, isLoading, isError } = useGetOrdersQuery();
  //const orders = response?.data ?? [];
  const isLoading = false;
  const orders = [
    {
      id: "ORD001",
      createdAt: "2025-06-01",
      Product: {
        name: "sony相機",
        selling_price: 1280,
      },
      payment: "信用卡",
      status: "completed",
    },
    {
      id: "ORD002",
      createdAt: "2025-06-05",
      Product: {
        name: "vc-530 鏡頭",
        selling_price: 1780,
      },
      payment: "貨到付款",
      status: "canceled",
    },
    {
      id: "ORD003",
      createdAt: "2025-06-06",
      Product: {
        name: "873-NU機身",
        selling_price: 980,
      },
      payment: "信用卡",
      status: "canceled",
    },
    {
      id: "ORD004",
      createdAt: "2025-06-06",
      Product: {
        name: "873-NU機身",
        selling_price: 980,
      },
      payment: "信用卡",
      status: "canceled",
    },
  ];

  const countAll = orders.length;
  const countCompleted = orders.filter(o => o.status === "completed").length;
  const countCanceled = orders.filter(o => o.status === "canceled").length;
  console.log("取得訂單：", orders);

  const filteredOrders = orders
    //狀態篩選
    .filter(order => activeTab === "all" || order.status === activeTab)
    //文字篩選
    .filter(
      order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.product.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <h4 className="mb-5 py-2 mb-md-0">訂單資訊</h4>
              {/* <hr /> */}
              {/* 切換按鈕區 */}
              <div className="d-flex gap-4 border-bottom mb-4">
                {[
                  { key: "all", label: "全部", count: countAll },
                  { key: "completed", label: "已完成", count: countCompleted },
                  { key: "canceled", label: "已取消", count: countCanceled },
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
              {isLoading && (
                <div className="text-center py-5">
                  <div className="spinner-border text-secondary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">載入中...</p>
                </div>
              )}
              {/* search space */}
              <div className="mb-4">
                <input
                  type="text"
                  className="form-control"
                  placeholder="搜尋訂單編號或商品名稱"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
              {/* 表頭欄位名稱 */}
              <div
                className="row text-muted px-2 mb-2 py-2 bg-light"
                style={{ backgroundColor: "#F2F2F2", fontSize: "0.9rem" }}
              >
                <div className="col-6 col-md-2">訂單成立日期</div>
                <div className="col-6 col-md-2">訂單編號</div>
                <div className="col-6 col-md-3">購入商品</div>
                <div className="col-6 col-md-1">總金額</div>
                <div className="col-6 col-md-2">付款方式</div>
                <div className="col-6 col-md-2">狀態</div>
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
                    <div className="col-6 col-md-2">{order.createdAt}</div>
                    <div className="col-6 col-md-2">{order.id}</div>
                    <div className="col-6 col-md-3">{order.Product.name}</div>
                    <div className="col-6 col-md-1">{order.Product.selling_price}</div>
                    <div className="col-6 col-md-2">{order.payment}</div>
                    <div className="col-6 col-md-2">
                      {order.status === "completed" ? (
                        <span className="text-muted">已完成</span>
                      ) : order.status === "canceled" ? (
                        <span className="text-muted">已取消</span>
                      ) : (
                        <span className="text-muted">處理中</span>
                      )}
                    </div>
                  </div>
                ))
              )}
              {filteredOrders.length > 0 && (
                <div className="text-center text-muted py-4 " style={{ fontSize: "0.9rem" }}>
                  沒有更多訂單資料
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderHistoryPage;
