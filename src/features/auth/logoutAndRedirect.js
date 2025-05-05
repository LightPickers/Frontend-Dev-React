import { toast } from "react-toastify";

import { logout } from "@features/auth/authSlice";

function logoutAndRedirect({ dispatch, navigate }) {
  dispatch(logout());
  localStorage.removeItem("token");

  toast.success("已成功登出");
  console.log("成功登出");
  navigate("/", { replace: true });
  console.log("目前頁面：", window.location.hash);
}

export default logoutAndRedirect;
