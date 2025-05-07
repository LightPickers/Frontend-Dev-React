import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const { isAuthenticated, isVerified, isLoading } = useSelector(state => state.auth);
  const location = useLocation();

  // 還在載入認證狀態，避免閃跳
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // 認證完成後仍未通過驗證，導向登入頁
  if (!isAuthenticated && isVerified) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 認證通過，繼續渲染
  return <Outlet />;
}

export default ProtectedRoute;
