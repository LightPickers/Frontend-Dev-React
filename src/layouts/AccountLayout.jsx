import { Outlet, useLocation, Link } from "react-router-dom";
import { useGetUserProfileQuery } from "@/features/users/userApi";

function AccountLayout() {
  const { data: userData, isLoading } = useGetUserProfileQuery();
  const user = userData?.data?.user;
  const location = useLocation();

  return (
    <div style={{ backgroundColor: "#f1f3f5", minHeight: "100vh", padding: "40px 0" }}>
      <div className="container">
        <div className="row g-4">
          {/* 左側欄位 */}
          <div className="col-lg-3">
            <div className="bg-white rounded shadow-sm p-4">
              <div className="text-center">
                <img
                  src={
                    user?.photo ??
                    "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop"
                  }
                  alt="會員照片"
                  className="rounded-circle mb-2"
                  width={80}
                  height={80}
                />
                <div>{user?.name || "未登入"}</div>
                <div>{user?.email || "無法取得您的電子郵件"}</div>
              </div>
              <hr />
              <ul className="list-unstyled mb-0">
                <li>
                  <Link
                    to="/account/profile/settings"
                    className={`text-decoration-none d-block py-2 ${location.pathname === "/account/profile/settings" ? "fw-bold" : "text-secondary"}`}
                    style={{
                      color:
                        location.pathname === "/account/profile/settings" ? "#8BB0B7" : "#495057",
                    }}
                  >
                    我的帳戶
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/profile/orders"
                    className={`text-decoration-none d-block py-2 ${location.pathname === "/account/profile/orders" ? "fw-bold" : "text-secondary"}`}
                    style={{
                      color:
                        location.pathname === "/account/profile/orders" ? "#8BB0B7" : "#495057",
                    }}
                  >
                    訂單資訊
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/profile/wishlists"
                    className={`text-decoration-none d-block py-2 ${location.pathname === "/account/profile/wishlists" ? "fw-bold" : "text-secondary"}`}
                    style={{
                      color:
                        location.pathname === "/account/profile/wishlists" ? "#8BB0B7" : "#495057",
                    }}
                  >
                    收藏資訊
                  </Link>
                </li>
              </ul>
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
