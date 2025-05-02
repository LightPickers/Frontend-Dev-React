import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useLoginUserMutation, useRegisterUserMutation } from "@features/users/userApi";
import UserProfileForm from "@features/users/UserProfileForm";
import loginAndRedirect from "@features/auth/loginAndRedirect";

function RegisterPage() {
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleRegister = async data => {
    try {
      const res = await registerUser(data).unwrap();
      toast.success("註冊成功，正在登入…");
      const { email, password } = data;
      const loginData = { email, password };
      await loginAndRedirect({ loginUser, dispatch, navigate, loginData });
    } catch (error) {
      console.error("註冊失敗", error);
      const message = error?.data?.message || "註冊失敗，請稍後再試";
      toast.error(message);
    }
  };
  return (
    <>
      <UserProfileForm onSubmit={handleRegister} />
    </>
  );
}

export default RegisterPage;
