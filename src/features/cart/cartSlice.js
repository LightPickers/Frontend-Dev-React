import { createSlice } from "@reduxjs/toolkit";

import { cartApi } from "@/features/cart/cartApi";

const initialState = {
  items: [],
  productIds: new Set(),
  isLoading: false,
  isCartOpen: false,
  totalItems: 0,
  totalPrice: 0,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // 手動增刪商品ID => 用於樂觀更新
    addProductId: (state, action) => {
      state.productIds.add(action.payload);
    },
    removeProductId: (state, action) => {
      state.productIds.delete(action.payload);
    },
    // 批量設置商品ID
    setProductIds: (state, action) => {
      state.productIds = new Set(action.payload);
    },
    // 清空購物車狀態
    clearCart: state => {
      state.items = [];
      state.productIds = new Set();
      state.totalPrice = 0;
      state.totalItems = 0;
    },
    toggleCart(state) {
      state.isCartOpen = !state.isCartOpen;
    },
    openCart(state) {
      state.isCartOpen = true;
    },
    closeCart(state) {
      state.isCartOpen = false;
    },
    setCartSummary(state, action) {
      const { totalItems, totalPrice } = action.payload;
      state.totalItems = totalItems;
      state.totalPrice = totalPrice;
    },
  },
  // extraReducers: builder => {
  //   builder
  //     // 取得購物車資料成功
  //     .addMatcher(cartApi.endpoints.getCart.matchFulfilled, (state, action) => {
  //       const cartData = action.payload?.data;

  //       if (cartData) {
  //         state.items = cartData.items || [];
  //         state.totalPrice = cartData.amount || 0;

  //         // 提取商品 ID
  //         const productIds = cartData.items?.map(item => item.product_id).filter(id => id) || [];
  //         state.productIds = new Set(productIds);

  //         // 計算總商品數量
  //         state.totalItems =
  //           cartData.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;
  //       } else {
  //         // 如果沒有 data，重置狀態
  //         state.items = [];
  //         state.productIds = new Set();
  //         state.totalPrice = 0;
  //         state.totalItems = 0;
  //       }

  //       state.isLoading = false;
  //       state.error = null;
  //     })
  //     // 加入購物車成功
  //     .addMatcher(cartApi.endpoints.addToCart.matchFulfilled, (state, action) => {
  //       // 樂觀更新
  //       const productId = action.meta.arg; // addToCart 的參數
  //       state.productIds.add(productId);
  //       state.isLoading = false;
  //       state.error = null;
  //     })
  //     // 移除購物車商品成功
  //     .addMatcher(cartApi.endpoints.deleteCartProduct.matchFulfilled, (state, action) => {
  //       // 從狀態移除對應商品 ID
  //       const deletedItemId = action.meta.arg;
  //       const deletedItem = state.items.find(item => item.id === deletedItemId);
  //       if (deletedItem && deletedItem.product_id) {
  //         state.productIds.delete(deletedItem.product_id);
  //       }
  //       state.isLoading = false;
  //       state.error = null;
  //     })
  //     // 請求開始
  //     .addMatcher(
  //       action => action.type.endsWith("/pending") && action.type.includes("cart"),
  //       state => {
  //         state.isLoading = true;
  //         state.error = null;
  //       }
  //     )
  //     // 請求失敗
  //     .addMatcher(
  //       action => action.type.endsWith("/rejected") && action.type.includes("cart"),
  //       (state, action) => {
  //         state.isLoading = false;
  //         state.error = action.error?.message || "請求失敗";
  //       }
  //     );
  // },
});

export const {
  addProductId,
  removeProductId,
  setProductIds,
  clearCart,
  toggleCart,
  openCart,
  closeCart,
  setCartSummary,
} = cartSlice.actions;

// Selectors
export const selectCartItems = state => state.cart.items;
export const selectCartProductIds = state => state.cart.productIds;
export const selectIsProductInCart = (state, productId) => state.cart.productIds.has(productId);
export const selectCartTotalPrice = state => state.cart.totalPrice;
export const selectCartTotalItems = state => state.cart.totalItems;
export const selectCartLoading = state => state.cart.isLoading;
export const selectCartError = state => state.cart.error;

export default cartSlice.reducer;
