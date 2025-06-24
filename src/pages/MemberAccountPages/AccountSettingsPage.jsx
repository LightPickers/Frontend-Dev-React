import { toast } from "react-toastify";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

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
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null); // 預覽照片
  const [pendingPhotoUrl, setPendingPhotoUrl] = useState(null); // 待儲存的照片URL
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

    // 創建預覽圖片
    const reader = new window.FileReader();
    reader.onload = e => {
      setPreviewPhoto(e.target.result);
    };
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("files", file);

    setIsUploadingPhoto(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/upload/image`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      // 檢查回應狀態
      if (!response.ok) {
        // 錯誤訊息
        let errorMessage = "照片上傳失敗，請稍後再試";
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

      // 保存待儲存的照片URL，不直接更新資料庫
      setPendingPhotoUrl(imageUrl);
      toast.success("照片已選擇，請點擊「儲存」按鈕完成變更");
    } catch (error) {
      console.error("照片上傳失敗: ", error);

      // 清除預覽
      setPreviewPhoto(null);

      // 處理不同類型的錯誤
      let errorMessage = "照片上傳失敗，請稍後再試";

      if (error.name === "TypeError" && error.message.includes("fetch")) {
        // 網路錯誤
        errorMessage = "網路連線異常，請檢查網路連線";
      } else if (error.message) {
        // 使用從伺服器回傳的錯誤訊息
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsUploadingPhoto(false);
      // 清空 input
      event.target.value = "";
    }
  };

  // 取消照片變更
  const handleCancelPhotoChange = () => {
    setPreviewPhoto(null);
    setPendingPhotoUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
      // 如果有待儲存的照片，加入到更新資料中
      const updateData = {
        ...newData,
        ...(pendingPhotoUrl && { photo: pendingPhotoUrl }),
      };

      // console.log("要更新的資料：", updateData);
      const res = await updateUser(updateData).unwrap();
      // console.log("更新回應", res);
      toast.success("更新資料成功");

      // 清除待儲存的照片狀態
      setPreviewPhoto(null);
      setPendingPhotoUrl(null);

      // 重新抓取最新資料
      refetch();
    } catch (error) {
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

  // 決定顯示的照片：預覽照片 > 原始照片 > 預設照片
  const displayPhoto =
    previewPhoto ||
    userData?.photo ||
    "https://plus.unsplash.com/premium_photo-1739786996022-5ed5b56834e2?q=80&w=1480&auto=format&fit=crop";

  // 大頭貼
  const PhotoSection = ({ className = "" }) => (
    <div className={`d-flex flex-column align-items-center justify-content-start ${className}`}>
      <div className="text-center">
        <div
          className="rounded-circle mb-2 d-flex align-items-center justify-content-center responsive-avatar"
          style={{
            width: "250px",
            height: "250px",
            maxWidth: "100%",
            backgroundImage: `url(${displayPhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            backgroundColor: "#f8f9fa", // 破圖時的背景色
          }}
        ></div>
      </div>

      {/* 照片操作按鈕 */}
      <div className="d-flex gap-2 align-items-center">
        <button
          type="button"
          className="btn btn-link p-0 text-decoration-underline"
          style={{
            color: "#4A6465",
          }}
          onMouseOver={e => (e.currentTarget.style.color = "#8BB0B7")}
          onMouseOut={e => (e.currentTarget.style.color = "#4A6465")}
          onClick={() => fileInputRef.current.click()}
          disabled={isUploadingPhoto || isUpdating}
        >
          {isUploadingPhoto ? "上傳中" : "更換相片"}
        </button>

        {/* 如果有預覽照片，顯示取消按鈕 */}
        {previewPhoto && (
          <button
            type="button"
            className="btn btn-link p-0 text-decoration-underline small"
            style={{
              color: "#dc3545",
            }}
            onMouseOver={e => (e.currentTarget.style.color = "#c82333")}
            onMouseOut={e => (e.currentTarget.style.color = "#dc3545")}
            onClick={handleCancelPhotoChange}
            disabled={isUploadingPhoto || isUpdating}
          >
            取消變更
          </button>
        )}
      </div>

      {/* 照片提示 */}
      <div className="mt-2 text-muted small text-center">
        <div>檔案大小上限：5MB</div>
        <div>格式支援：JPG、JPEG、PNG</div>
        {previewPhoto && (
          <div className="text-danger mt-1">
            <small>照片尚未儲存，請點擊下方「儲存」按鈕</small>
          </div>
        )}
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
              hasPhotoChange={!!previewPhoto} // 傳遞照片變更狀態
            />
          </div>
        </div>

        {/* 桌面版大頭貼 - 右邊欄位 */}
        <div className="col-lg-4 d-none d-lg-flex">
          <PhotoSection className="mt-4 mt-lg-0" />
        </div>
      </div>
      <style>
        {`
    @media (max-width: 1200px) {
      .responsive-avatar {
        width: 180px !important;
        height: 180px !important;
      }
    }
  `}
      </style>
    </>
  );
}

export default AccountSettingsPage;
