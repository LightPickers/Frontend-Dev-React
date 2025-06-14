import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

import UserProfileForm from "@features/users/UserProfileForm";
import { useUpdateUserMutation } from "@features/users/userApi";
import { getApiErrorMessage } from "@utils/getApiErrorMessage";
import loginAndRedirect from "@features/auth/loginAndRedirect";
import useAuthRedirect from "@hooks/useAuthRedirect";
import { useGetUserProfileQuery, useRegisterSuccessEmailMutation } from "@features/users/userApi";

function GoogleRegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { redirectToPage } = useAuthRedirect();
  const { data: userData, isLoading: isGetUserLoading } = useGetUserProfileQuery();
  const googleUser = userData?.data?.user;
  const [updateUserProfile] = useUpdateUserMutation();
  const [sendRegisterSuccessEmail] = useRegisterSuccessEmailMutation();

  const handleCompleteProfile = async data => {
    setIsSubmitting(true);
    try {
      const result = await updateUserProfile(data).unwrap();
      await sendRegisterSuccessEmail().unwrap();

      toast.success("註冊成功！歡迎回來！");
      redirectToPage(); // 或 navigate("/")
    } catch (error) {
      toast.error(getApiErrorMessage(error, "註冊失敗，請稍後再試"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <UserProfileForm
        isEdit={false}
        isGoogleUser={true}
        userData={googleUser}
        onSubmit={handleCompleteProfile}
        isSubmitting={isSubmitting}
      />
    </>
  );
}

export default GoogleRegisterPage;
