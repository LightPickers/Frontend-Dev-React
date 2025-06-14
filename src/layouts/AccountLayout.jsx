import { Outlet, useLocation, Link } from "react-router-dom";
import { useState } from "react";

import { useGetUserProfileQuery } from "@/features/users/userApi";
import { ArrowDownIcon } from "@/components/icons";
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

function AccountLayout() {
  const { data: userData, isLoading } = useGetUserProfileQuery();
  const user = userData?.data?.user;
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // 取得目前頁面的標題
  const getCurrentPageTitle = () => {
    switch (location.pathname) {
      case "/account/profile/settings":
        return "我的帳戶";
      case "/account/profile/orders":
        return "訂單資訊";
      case "/account/profile/wishlists":
        return "收藏資訊";
      default:
        return "選單";
    }
  };

  const menuItems = [
    { path: "/account/profile/settings", label: "我的帳戶" },
    { path: "/account/profile/orders", label: "訂單資訊" },
    { path: "/account/profile/wishlists", label: "收藏資訊" },
  ];

  return (
    <div style={{ backgroundColor: "#f1f3f5", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">
        <div className="row g-4">
          {/* 左側欄位 大螢幕*/}
          <div className="col-lg-3 d-none d-lg-block">
            <div className="bg-white rounded shadow-sm p-4">
              <div className="text-center">
                <img
                  src={
                    user?.photo ||
                    "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop"
                  }
                  alt="會員照片"
                  className="rounded-circle mb-2"
                  style={{ width: "140px", height: "140px", objectFit: "cover" }}
                />
                <div>{user?.name || "取得帳戶中"}</div>
                <div
                  className=" small mb-0 "
                  style={{
                    color: "#939393",
                  }}
                >
                  {user?.email || "取得電子郵件中"}
                </div>
              </div>
              <hr />
              <ul className="list-unstyled mb-0">
                {menuItems.map(item => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`text-decoration-none d-inline-block py-2 fw-bold ${
                        location.pathname === item.path ? "text-primary-custom" : "text-secondary"
                      }`}
                      style={{
                        color: location.pathname === item.path ? "#8BB0B7" : "#495057",
                      }}
                      onMouseOver={e => {
                        if (location.pathname !== item.path) {
                          e.currentTarget.style.color = "#4A6465";
                        }
                      }}
                      onMouseOut={e => {
                        if (location.pathname !== item.path) {
                          e.currentTarget.style.color = "#495057";
                        }
                      }}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 手機版選單 */}
          <div className="col-12 d-lg-none">
            <div className="bg-white rounded shadow-sm p-3 mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center">
                  <div>
                    <div className=" h5 muted-text">{getCurrentPageTitle()}</div>
                  </div>
                </div>
                <button
                  className="btn p-2"
                  type="button"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  aria-expanded={isMenuOpen}
                  style={{ border: "none", background: "transparent" }}
                >
                  <ArrowDownIcon
                    size={20}
                    className={`transition-transform ${isMenuOpen ? "rotate-180" : ""}`}
                    style={{
                      transform: isMenuOpen ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.2s ease-in-out",
                    }}
                  />
                </button>
              </div>

              {/* 下拉選單內容 */}
              <div className={`collapse ${isMenuOpen ? "show" : ""}`}>
                <hr className="my-3" />
                <div className="list-group list-group-flush">
                  {menuItems.map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`list-group-item list-group-item-action border-0 px-0 ${
                        location.pathname === item.path ? "active" : ""
                      }`}
                      style={{
                        backgroundColor:
                          location.pathname === item.path ? "#8BB0B7" : "transparent",
                        color: location.pathname === item.path ? "white" : "#495057",
                      }}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 右側內容：交由子路由渲染 */}
          <div className="col-lg-9">
            <div className="bg-white rounded shadow-sm p-4">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountLayout;
