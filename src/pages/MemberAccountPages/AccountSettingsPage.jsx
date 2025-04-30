import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

import EditProfileForm from "@/pages/MemberAccountPages/components/EditProfileForm";

function AccountSettingsPage() {
  const { userId } = useParams();
  const token = localStorage.getItem("token");
  const API_BASE = import.meta.env.VITE_API_BASE;

  const [authorized, setAuthorized] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setAuthorized(false);
        return;
      }

      try {
        const { id: decodedId } = jwtDecode(token);
        if (decodedId !== userId) {
          setAuthorized(false);
          return;
        }

        const res = await axios.get(`${API_BASE}/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(res);
        setUserData(res.data.data.user);
        setAuthorized(true);
      } catch (error) {
        if (error.response) {
          console.error("狀態碼:", error.response.status);
          console.error("錯誤消息:", error.response.data);
        }
        alert("取得資料失敗");
        return <Navigate to="/login" />;
      }
    };

    fetchProfile();
  }, [userId, token, API_BASE]);

  if (authorized === null) {
    return <div className="text-center mt-5">載入中...</div>;
  }

  if (authorized === false) {
    alert("您無造訪此網頁的權限");
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">會員帳戶設定</h2>
      {userData ? (
        <EditProfileForm userData={userData} token={token} />
      ) : (
        <div>會員資料載入中...</div>
      )}
    </div>
  );
}

export default AccountSettingsPage;
