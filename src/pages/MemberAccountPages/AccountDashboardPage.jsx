import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import BtnPrimary from "@/components/Button";
import logoutAndRedirect from "@/features/auth/logoutAndRedirect";
import { H2Primary } from "@/components/Headings";

function AccountDashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutAndRedirect({ dispatch, navigate });
  };
  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-8 mx-auto">
            <div className="d-flex justify-content-between">
              <H2Primary>會員中心</H2Primary>
              <BtnPrimary onClick={handleLogout}>登出</BtnPrimary>
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default AccountDashboardPage;
