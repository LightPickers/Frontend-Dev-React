import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const RedirectIfAuthenticated = () => {
  const { user, isVerified } = useSelector(state => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    // 如果尚未完成驗證，不做任何事
    if (!isVerified) return;

    // 驗證完成後且有使用者資料，進行跳轉
    if (isVerified && user) {
      toast.info("你已經登入，正在跳轉回首頁");
      navigate("/", { replace: true });
    }
  }, [isVerified, user, navigate]);

  return null;
};

export default RedirectIfAuthenticated;
