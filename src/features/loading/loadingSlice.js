// 用於設置 loading 狀態
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  loadingText: "載入中...",
  loadingType: null, // 可以用來區分不同類型的 loading
};

const loadingSlice = createSlice({
  name: "loading",
  initialState,
  reducers: {
    showLoading: (state, action) => {
      state.isLoading = true;
      state.loadingText = action.payload?.text || "載入中...";
      state.loadingType = action.payload?.type || null;
    },
    hideLoading: state => {
      state.isLoading = false;
      state.loadingText = "載入中...";
      state.loadingType = null;
    },
    updateLoadingText: (state, action) => {
      state.loadingText = action.payload;
    },
  },
});

export const { showLoading, hideLoading, updateLoadingText } = loadingSlice.actions;
export default loadingSlice.reducer;

// Selectors
export const selectLoading = state => state.loading.isLoading;
export const selectLoadingText = state => state.loading.loadingText;
export const selectLoadingType = state => state.loading.loadingType;
