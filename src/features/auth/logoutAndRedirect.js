import { toast } from "react-toastify";

import { logout } from "@features/auth/authSlice";

function logoutAndRedirect({ dispatch, navigate }) {
  dispatch(logout());
  localStorage.removeItem("token");

  toast.success("已成功登出");
  console.log("成功登出");
  // 加入延遲，避免 ProtectedRoute 判斷過早
  Promise.resolve().then(() => {
    navigate("/", { replace: true });
  });
}

export default logoutAndRedirect;
