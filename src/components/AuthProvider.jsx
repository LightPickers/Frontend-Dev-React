import { node } from "prop-types";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { setVerified } from "@features/auth/authSlice";
import { useLazyVerifyAuthQuery } from "@features/users/userApi";
import PageLoader from "@components/loaders/PageLoader";

// 檢查應用初始化時是否有 token
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
          dispatch(setVerified());
        }
      } else {
        dispatch(setVerified());
      }
    };
    checkAuth();
  }, [dispatch, token, verifyAuth]);

  return (
    <>
      <PageLoader loading={isLoading || isVerifying} text="身分驗證中…" minTime={1000} />
      {children}
    </>
  );
}

AuthProvider.propTypes = {
  children: node.isRequired,
};
