import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const RedirectIfAuthenticated = () => {
  const user = useSelector(state => state.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      toast.info("你已經登入，正在跳轉回首頁");
      navigate("/", { replace: true });
    }
  }, [user, navigate]);

  return null;
};

export default RedirectIfAuthenticated;
