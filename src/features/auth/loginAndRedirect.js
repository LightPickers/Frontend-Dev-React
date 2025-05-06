import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

import { setCredentials } from "@features/auth/authSlice";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

async function loginAndRedirect({ loginUser, dispatch, navigate, loginData, onSuccess }) {
  try {
    const result = await loginUser(loginData).unwrap();
    const { token, user } = result.data;

    // 在 authSlice/localStorage 存資料
    dispatch(setCredentials({ token, user }));
    localStorage.setItem("token", token);

    // 解碼 token，並跳轉
    // const { id: userId } = jwtDecode(token);
    // const redirectedPage = redirectTo || `/account/${userId}/settings`;

    // navigate(redirectedPage);

    // 成功訊息
    toast.success("登入成功！");
    if (onSuccess) {
      onSuccess();
      console.log("登入成功");
    } else {
      console.log("navigate");
      const { id: userId } = jwtDecode(token);
      navigate("/account/profile/settings");
    }
  } catch (error) {
    console.error("登入失敗：", error);
    toast.error(getApiErrorMessage(error, "登入失敗，請稍後再試"));
    navigate("/login");
  }
}

export default loginAndRedirect;
