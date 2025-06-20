import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import Breadcrumbs from "@/components/Breadcrumbs";
import { useGetUserProfileQuery, useUpdateUserMutation } from "@features/users/userApi";
import UserProfileForSettingPage from "@/features/users/UserProfileForSettingPage";

const API_BASE = import.meta.env.VITE_API_BASE;

function AccountSettingsPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useSelector(state => state.auth);
  const { data, isLoading, error, refetch } = useGetUserProfileQuery(undefined, {
    skip: !isAuthenticated || !token,
  });
  const [updateUser] = useUpdateUserMutation();
  const [isUpdating, setIsUpdating] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoUpload = async event => {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("檔案格式錯誤，請上傳 JPG、JPEG、PNG 格式");
      return;
    }

    // 檢查檔案大小 (5MB = 5 * 1024 * 1024 bytes)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("檔案大小超過 5MB 限制");
      return;
    }

    const formData = new FormData();
    formData.append("files", file);

    try {
      const response = await fetch(`${API_BASE}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // 檢查回應狀態
      if (!response.ok) {
        // 錯誤訊息
        let errorMessage = "頭像上傳失敗，請稍後再試";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          console.error("無法解析錯誤回應:", parseError);
        }

        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      const imageUrl = responseData.data.image_urls[0];

      // 呼叫更新 user 的 API
      await handleUpdateProfile({ ...userData, photo: imageUrl });
    } catch (error) {
      console.error("頭像上傳失敗: ", error);

      // 處理不同類型的錯誤
      let errorMessage = "頭像上傳失敗，請稍後再試";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        // 網路錯誤
        errorMessage = "網路連線異常，請檢查網路連線";
      } else if (error.message) {
        // 使用從伺服器回傳的錯誤訊息
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      // 清空 input
      event.target.value = "";
    }
  };

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

  // 大頭貼
  const PhotoSection = ({ className = "" }) => (
    <div className={`d-flex flex-column align-items-center justify-content-start ${className}`}>
      <div className="text-center">
        <img
          src={
            userData?.photo ||
            "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop"
          }
          alt="會員照片"
          className="rounded-circle mb-2"
          style={{ width: "250px", height: "250px", objectFit: "cover" }}
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
        onClick={() => fileInputRef.current.click()}
      >
        更換相片
      </button>
      <div className="mt-2 text-muted small text-center">
        <div>檔案大小上限：5MB</div>
        <div>格式支援：JPG、JPEG、PNG</div>
      </div>
      {/* 隱藏input */}
      <input
        type="file"
        accept=".jpg, .jpeg, .png, "
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handlePhotoUpload}
      />
    </div>
  );

  // PropTypes 驗證
  PhotoSection.propTypes = {
    className: PropTypes.string,
  };

  return (
    <>
      <div className="container">
        <Breadcrumbs />
        <div className="row g-4">
          <div className="col-lg-12">
            <div className="bg-white rounded p-4">
              <h4 className="mb-5 py-2 mb-md-0">我的帳戶</h4>

              {/* 手機版大頭貼 - 顯示在最上方 */}
              <div className="d-lg-none mb-4">
                <PhotoSection />
                <hr className="mt-4" />
              </div>

              <div className="row justify-content-center">
                {/* 左邊表單欄位 - 調整響應式類別 */}
                <div className="col-12 col-lg-8">
                  <hr className="d-none d-lg-block" />

                  {/* 確保表單內容對齊 */}
                  <div className="w-100">
                    <UserProfileForSettingPage
                      isEdit={true}
                      userData={userData}
                      onSubmit={handleUpdateProfile}
                      isSubmitting={isUpdating}
                    />
                  </div>
                </div>

                {/* 桌面版大頭貼 - 右邊欄位 */}
                <div className="col-lg-4 d-none d-lg-flex">
                  <PhotoSection className="mt-4 mt-lg-0" />
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
