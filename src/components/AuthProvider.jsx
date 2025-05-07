import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { finishLoading } from "@features/auth/authSlice";
import { useLazyVerifyAuthQuery } from "@features/users/userApi";

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { token, isLoading } = useSelector(state => state.auth);
  const [verifyAuth, { isLoading: isVerifying }] = useLazyVerifyAuthQuery();

  useEffect(() => {
    const checkAuth = async () => {
      if (token) {
        try {
          await verifyAuth().unwrap();
        } catch (err) {
          console.error("認證驗證失敗:", err);
        }
      } else {
        dispatch(finishLoading());
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
