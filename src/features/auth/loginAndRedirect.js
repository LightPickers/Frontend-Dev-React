import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import { setCredentials } from "@features/auth/authSlice";

async function loginAndRedirect({ loginUser, dispatch, navigate, loginData }) {
  try {
    const result = await loginUser(loginData).unwrap();
    const { token, user } = result.data;

    // 在 authSlice/localStorage 存資料
    dispatch(setCredentials({ token, user }));
    localStorage.setItem("token", token);

    // 解碼 token，並跳轉
    const { id: userId } = jwtDecode(token);
    navigate(`/account/${userId}/settings`);

    // 成功訊息
    toast.success("登入成功！");
  } catch (error) {
    console.error("登入失敗：", error);
    const message = error?.data?.message || "登入失敗，請稍後再試";
    toast.error(message);
    navigate("/login");
  }
}

export default loginAndRedirect;
