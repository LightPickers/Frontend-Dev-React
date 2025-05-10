import { toast } from "react-toastify";

import { setCredentials } from "@features/auth/authSlice";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

async function loginAndRedirect({ loginUser, dispatch, navigate, loginData, onSuccess }) {
  try {
    const result = await loginUser(loginData).unwrap();
    // console.log("登入結果", result);

    // 在 authSlice/localStorage 存資料
    const { token, user } = result?.data || {};
    if (!token || !user) {
      throw new Error("登入回應不完整");
    }
    dispatch(setCredentials({ token, user }));

    // 成功訊息
    toast.success("登入成功！");
    if (onSuccess) {
      onSuccess(); // 跳轉目標頁面
    } else {
      navigate("/");
    }
  } catch (error) {
    toast.error(getApiErrorMessage(error, "登入失敗，請稍後再試"));
  }
}

export default loginAndRedirect;
