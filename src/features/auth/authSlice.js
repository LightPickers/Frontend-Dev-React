import { createSlice } from "@reduxjs/toolkit";

import loadAuthData from "@features/auth/loadAuthData";
import { userApi } from "@features/users/userApi";

// 從 localStorage 取資料
const initialData = loadAuthData();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialData?.user || null,
    token: initialData?.token || null,
    isAuthenticated: !!initialData?.token,
    isLoading: true,
    isVerified: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.error = null;
      localStorage.setItem("auth", JSON.stringify({ user, token }));
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem("auth");
    },
    finishLoading: state => {
      state.isLoading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: state => {
      state.error = null;
    },
    setVerified: state => {
      state.isLoading = false;
      state.isVerified = true;
    },
  },
  // 監聽 RTK Query
  extraReducers: builder => {
    builder
      // 登入成功後設置憑證
      .addMatcher(userApi.endpoints.loginUser.matchFulfilled, (state, { payload }) => {
        if (payload.token && payload.user) {
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: payload.user,
              token: payload.token,
            })
          );
        }
      })
      // 註冊成功後設置憑證
      .addMatcher(userApi.endpoints.registerUser.matchFulfilled, (state, { payload }) => {
        if (payload.token && payload.user) {
          state.token = payload.token;
          state.user = payload.user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: payload.user,
              token: payload.token,
            })
          );
        }
      })
      // 驗證認證狀態
      .addMatcher(userApi.endpoints.verifyAuth.matchFulfilled, (state, { payload }) => {
        state.isAuthenticated = true;
        state.isLoading = false;
        state.isVerified = true;
        // 更新用戶資料 (可選)
        if (payload.user) {
          const updatedData = {
            ...state.user,
            ...payload.user,
          };
          state.user = updatedData;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: updatedData,
              token: state.token,
            })
          );
        }
      })
      // 驗證失敗
      .addMatcher(userApi.endpoints.verifyAuth.matchRejected, state => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.isVerified = true;
        localStorage.removeItem("auth");
      })
      // 處理用戶資料更新
      .addMatcher(userApi.endpoints.updateUser.matchFulfilled, (state, { payload }) => {
        if (payload.user) {
          const updatedData = {
            ...state.user,
            ...payload.user,
          };
          state.user = updatedData;
          localStorage.setItem(
            "auth",
            JSON.stringify({
              user: updatedData,
              token: state.token,
            })
          );
        }
      })
      // 任何 API 的通用錯誤處理
      .addMatcher(
        action =>
          action.type.endsWith("/rejected") &&
          (action.type.includes("loginUser") ||
            action.type.includes("registerUser") ||
            action.type.includes("verifyAuth")),
        (state, action) => {
          state.error = action.payload?.data?.message || action.error?.message || "認證失敗";
          state.isLoading = false;
        }
      );
  },
});

export const { setCredentials, logout, finishLoading, setError, clearError, setVerified } =
  authSlice.actions;
export default authSlice.reducer;
