import { Outlet } from "react-router-dom";

function AccountDashboardPage() {
  return (
    <>
      <div>這是會員中心首頁</div>
      <Outlet />
    </>
  );
}

export default AccountDashboardPage;
