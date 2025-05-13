// 檢查應用初始化時檢查是否有 token

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setVerified } from "@features/auth/authSlice";
import { useLazyVerifyAuthQuery } from "@features/users/userApi";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { token, isLoading } = useSelector(state => state.auth);
  const [verifyAuth, { isLoading: isVerifying }] = useLazyVerifyAuthQuery();

  // 若有 token，通過 RTK query 的 verifyAuth() 驗證
  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await verifyAuth().unwrap();
        } catch {
          // console.error("認證驗證失敗:", err);
          dispatch(setVerified());
        }
      } else {
        dispatch(setVerified());
      }
    };
    checkAuth();
  }, [dispatch, token, verifyAuth]);

  if (isLoading || isVerifying) {
    return <div className="loading-spinner">載入中...</div>;
  }

  return <>{children}</>;
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
