import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { useLoginUserMutation, useRegisterUserMutation } from "@features/users/userApi";
import UserProfileForm from "@features/users/UserProfileForm";
import loginAndRedirect from "@features/auth/loginAndRedirect";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";

function RegisterPage() {
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingin, setIsLoggingin] = useState(false);

  const handleRegister = async data => {
    setIsRegistering(true);
    try {
      await registerUser(data).unwrap();
      // toast.success("註冊成功，正在登入…");
      const { email, password } = data;
      const loginData = { email, password };
      setIsLoggingin(true);
      await loginAndRedirect({ loginUser, dispatch, navigate, loginData });
    } catch (error) {
      console.error("註冊失敗：", error);
      toast.error(getApiErrorMessage(error, "註冊失敗，請稍後再試"));
    } finally {
      setIsRegistering(false);
      setIsLoggingin(false);
    }
  };
  return (
    <>
      <UserProfileForm
        onSubmit={handleRegister}
        isSubmitting={isRegistering}
        isLoggingin={isLoggingin}
      />
    </>
  );
}

export default RegisterPage;
