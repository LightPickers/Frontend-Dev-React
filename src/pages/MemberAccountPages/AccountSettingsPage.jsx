import { toast } from "react-toastify";
import { useState } from "react";

import { useGetUserProfileQuery, useUpdateUserMutation } from "@features/users/userApi";
import UserProfileForm from "@features/users/UserProfileForm";

function AccountSettingsPage() {
  const { data, isLoading, error } = useGetUserProfileQuery();
  const [updateUser] = useUpdateUserMutation();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async newData => {
    setIsUpdating(true);
    try {
      console.log("要更新的資料：", newData);
      const res = await updateUser(newData).unwrap();
      console.log("更新回應", res);
      toast.success("更新資料成功");
    } catch (error) {
      console.error("更新失敗：", error);
      const message = error?.data?.message || "更新失敗，請稍後再試";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-4">資料載入中...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        載入數據時發生錯誤：{error?.data?.message || "請稍後再試"}
      </div>
    );
  }

  if (!data || !data.data || !data.data.user) {
    return <div className="text-center py-4">無法獲取用戶資料</div>;
  }

  const userData = data.data.user;

  console.log("API 返回的原始數據:", data);
  console.log("傳給表單的數據:", userData);

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
