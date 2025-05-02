import { createSlice } from "@reduxjs/toolkit";

import loadAuthData from "@/features/auth/loadAuthData";

const initialData = loadAuthData();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: initialData?.user || null,
    token: initialData?.token || null,
    isAuthenticated: !!initialData?.token,
  },
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      localStorage.setItem("auth", JSON.stringify({ user, token }));
      state.isAuthenticated = true;
    },
    logout: state => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("auth");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
