import { useEffect } from "react";

import { useLazyGetUserProfileQuery } from "@features/users/userApi";
import UserProfileForm from "@features/users/UserProfileForm";

function AccountSettingsPage() {
  const [triggerGetProfile, { data, isLoading }] = useLazyGetUserProfileQuery();

  useEffect(() => {
    triggerGetProfile();
  }, [triggerGetProfile]);

  if (isLoading || !data) {
    return <div>資料載入中...</div>;
  }

  const userData = data.data.user;

  return <UserProfileForm isEdit={true} userData={userData} />;
}

export default AccountSettingsPage;
