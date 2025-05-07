import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetUserProfileQuery, useUpdateUserMutation } from "@features/users/userApi";
import UserProfileForm from "@features/users/UserProfileForm";

function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector(state => state.auth);
  const { data, isLoading, error, refetch } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });
  const [updateUser] = useUpdateUserMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      navigate("/login", { state: { from: "/account/profile" } });
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated && token) refetch();
  }, [isAuthenticated, token, refetch]);

  const handleUpdateProfile = async newData => {
    setIsUpdating(true);
    try {
      console.log("要更新的資料：", newData);
      const res = await updateUser(newData).unwrap();
      console.log("更新回應", res);
      toast.success("更新資料成功");
      // 重新抓取最新資料
      refetch();
    } catch (error) {
      console.error("更新失敗：", error);
      const message = error?.data?.message || "更新失敗，請稍後再試";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center py-4">請先登入...</div>;
  }

  if (isLoading) {
    return <div className="text-center py-4">資料載入中...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        載入資料時發生錯誤：{error?.data?.message || "請稍後再試"}
      </div>
    );
  }

  if (!data || !data.data || !data.data.user) {
    return <div className="text-center py-4">無法獲取用戶資料</div>;
  }

  const userData = data.data.user;

  console.log("API 返回的原始資料:", data);
  console.log("傳給表單的資料:", userData);

  return (
    <>
      {/* {isUpdating && <div className="text-center py-2">正在更新資料...</div>} */}
      <UserProfileForm
        isEdit={true}
        userData={userData}
        onSubmit={handleUpdateProfile}
        isSubmitting={isUpdating}
      />
    </>
  );
}

export default AccountSettingsPage;
