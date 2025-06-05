import { useState } from "react";

function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const orders = [
    {
      id: "A123456789",
      product: "Leica SF 60 閃光燈",
      createdAt: "2025-06-01",
      total: 12800,
      payment: "信用卡",
      status: "completed",
    },
    {
      id: "B987654321",
      product: "Fujifilm X100V",
      createdAt: "2025-05-20",
      total: 7600,
      payment: "ATM轉帳",
      status: "cancelled",
    },
    {
      id: "C456789123",
      product: "Sony RX100 VII",
      createdAt: "2025-04-15",
      total: 98000,
      payment: "信用卡",
      status: "completed",
    },
  ];
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
                  { key: "all", label: "全部", count: 3 },
                  { key: "completed", label: "已完成", count: 3 },
                  { key: "cancelled", label: "已取消", count: 0 },
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
              {filteredOrders.map(order => (
                <div
                  key={order.id}
                  className="row align-items-center px-2 py-3 border-bottom"
                  style={{ fontSize: "0.95rem" }}
                >
                  <div className="col-6 col-md-2">{order.createdAt}</div>
                  <div className="col-6 col-md-2">{order.id}</div>
                  <div className="col-6 col-md-3">{order.product}</div>
                  <div className="col-6 col-md-1">{order.total}</div>
                  <div className="col-6 col-md-2">{order.payment}</div>
                  <div className="col-6 col-md-2">
                    {order.status === "completed" ? (
                      <span className="text-muted">已完成</span>
                    ) : order.status === "cancelled" ? (
                      <span className="text-muted">已取消</span>
                    ) : (
                      <span className="text-muted">處理中</span>
                    )}
                  </div>
                </div>
              ))}
              <div className="text-center text-muted py-4 " style={{ fontSize: "0.9rem" }}>
                沒有更多訂單資料
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderHistoryPage;
