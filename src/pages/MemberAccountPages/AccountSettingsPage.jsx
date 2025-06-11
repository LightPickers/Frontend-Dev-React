import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { useGetUserProfileQuery, useUpdateUserMutation } from "@features/users/userApi";
import UserProfileForSettingPage from "@/features/users/UserProfileForSettingPage";

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
      // console.log("要更新的資料：", newData);
      const res = await updateUser(newData).unwrap();
      // console.log("更新回應", res);
      toast.success("更新資料成功");
      // 重新抓取最新資料
      refetch();
    } catch (error) {
      // console.error("更新失敗：", error);
      const message = error?.data?.message || "更新失敗，請稍後再試";
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isAuthenticated) {
    return <div className="text-center py-4">請先登入</div>;
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

  // console.log("API 返回的原始資料:", data);
  // console.log("傳給表單的資料:", userData);

  return (
    <>
      <div className="container">
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <h4 className="mb-5 py-2 mb-md-0">我的帳戶</h4>
              <div className="row">
                {/* 左邊表單欄位 */}
                <div className="col-md-8">
                  <hr />
                  <UserProfileForSettingPage
                    isEdit={true}
                    userData={userData}
                    onSubmit={handleUpdateProfile}
                    isSubmitting={isUpdating}
                  />
                </div>

                {/* 右邊大頭貼 */}
                <div className="col-md-4 d-flex flex-column align-items-center justify-content-start mt-4 mt-md-0">
                  <div className="text-center">
                    <img
                      src={
                        user?.photo ||
                        "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop"
                      }
                      alt="會員照片"
                      className="rounded-circle mb-2"
                      width={190}
                      height={190}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-underline"
                    style={{
                      color: "#4A6465",
                    }}
                    onMouseOver={e => (e.currentTarget.style.color = "#8BB0B7")}
                    onMouseOut={e => (e.currentTarget.style.color = "#4A6465")}
                    onClick={() => toast.info("尚未支援頭像上傳")}
                  >
                    更換相片
                  </button>
                  <div className="mt-2 text-muted small text-center">
                    <div>檔案大小上限：5MB</div>
                    <div>格式支援：JPG、JPEG、PNG</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* {isUpdating && <div className="text-center py-2">正在更新資料...</div>} */}
    </>
  );
}

export default AccountSettingsPage;
