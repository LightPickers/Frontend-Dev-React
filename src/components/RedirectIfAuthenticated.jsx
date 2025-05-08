import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const RedirectIfAuthenticated = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const fromLoginForm = location.state?.fromLogin;
    const fromProtectedRoute = location.state?.from;
    if (isAuthenticated && !fromProtectedRoute && !fromLoginForm) {
      toast.info("你已經登入，正在跳轉回首頁");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate, location]);

  return null;
};

export default RedirectIfAuthenticated;
