import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { useLoginUserMutation, useRegisterUserMutation } from "@features/users/userApi";
import UserProfileForm from "@features/users/UserProfileForm";
import loginAndRedirect from "@features/auth/loginAndRedirect";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
import useAuthRedirect from "@hooks/useAuthRedirect";
// import RedirectIfAuthenticated from "@/components/RedirectIfAuthenticated";

function RegisterPage() {
  const [registerUser] = useRegisterUserMutation();
  const [loginUser] = useLoginUserMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggingin, setIsLoggingin] = useState(false);
  const { redirectToPage } = useAuthRedirect();

  const handleRegister = async data => {
    setIsRegistering(true);
    try {
      const result = await registerUser(data).unwrap();
      console.log("註冊結果", result);
      const { email, password } = data;
      const loginData = { email, password };
      setIsLoggingin(true);
      await loginAndRedirect({
        loginUser,
        dispatch,
        navigate,
        loginData,
        onSuccess: redirectToPage,
      });
    } catch (error) {
      toast.error(getApiErrorMessage(error, "註冊失敗，請稍後再試"));
    } finally {
      setIsRegistering(false);
      setIsLoggingin(false);
    }
  };
  return (
    <>
      {/* <RedirectIfAuthenticated /> */}
      <UserProfileForm
        onSubmit={handleRegister}
        isSubmitting={isRegistering}
        isLoggingin={isLoggingin}
      />
    </>
  );
}

export default RegisterPage;
