import { useState } from "react";

function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState("all");
  return (
    <>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <h4 className="mb-5 mb-md-0">訂單資訊</h4>
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
                    className={`btn btn-link px-0 ${activeTab === tab.key ? "fw-bold text-warning" : "text-muted"}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label} <sup>{tab.count}</sup>
                  </button>
                ))}
              </div>
            </div>
            {/* 測試 */}
            <p>
              目前選擇的篩選條件是：<strong>{activeTab}</strong>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderHistoryPage;
