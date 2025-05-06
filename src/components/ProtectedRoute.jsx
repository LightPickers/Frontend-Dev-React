import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

function ProtectedRoute() {
  const isAuthenticated = useSelector(state => state.auth.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;
