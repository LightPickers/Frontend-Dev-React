// AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { logout, setCredentials, finishLoading } from "@features/auth/authSlice";
import { useVerifyAuthQuery } from "@features/users/userApi";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const { data, error, isLoading, isUninitialized } = useVerifyAuthQuery(undefined, {
    skip: !token, // 沒有 token 就不打
  });

  useEffect(() => {
    if (!token) {
      dispatch(finishLoading());
      return;
    }

    if (!isLoading && !isUninitialized) {
      if (data?.user) {
        dispatch(setCredentials({ token, user: data.user }));
      } else {
        dispatch(logout());
      }
      dispatch(finishLoading());
    }
  }, [isLoading, isUninitialized, data, token, dispatch]);

  return children;
}
