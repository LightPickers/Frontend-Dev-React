import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { setCredentials } from "@features/auth/authSlice";

function GoogleRedirectPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    const name = params.get("name");
    const isProfileCompleted = params.get("isProfileCompleted") === "true";

    if (token) {
      const user = { name };
      localStorage.setItem("token", token);
      localStorage.setItem("googleUser", JSON.stringify(user));
      dispatch(setCredentials({ token, user }));
      if (isProfileCompleted) {
        navigate("/"); // 已補資料者直接回首頁
      } else {
        navigate("/google-register"); // 第一次登入者導向補資料
      }
    } else {
      toast.error("Google 登入失敗");
      navigate("/login");
    }
  }, [dispatch, navigate, location.search]);

  return <p>登入中，請稍候...</p>;
}

export default GoogleRedirectPage;
