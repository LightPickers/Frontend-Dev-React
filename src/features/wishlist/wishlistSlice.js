// import { createSlice } from "@reduxjs/toolkit";
// import { createSelector } from "@reduxjs/toolkit";

// import { wishlistApi } from "@/features/wishlist/wishlistApi";

// const initialState = {
//   items: [],
//   productIds: new Set(),
//   isLoading: false,
//   error: null,
//   totalSellingPrice: 0,
//   message: "",
//   status: false,
// };

// const wishlistSlice = createSlice({
//   name: "wishlist",
//   initialState,
//   reducers: {
//     // 手動增刪商品ID => 用於樂觀更新
//     addProductId: (state, action) => {
//       state.productIds.add(action.payload);
//     },
//     removeProductId: (state, action) => {
//       state.productIds.delete(action.payload);
//     },
//     // 批量設置商品ID
//     setProductIds: (state, action) => {
//       state.productIds = new Set(action.payload);
//     },
//     // 清空願望清單狀態
//     clearWishlist: state => {
//       state.items = [];
//       state.productIds = new Set();
//       state.totalSellingPrice = 0;
//       state.message = "";
//       state.status = false;
//     },
//     // 更新願望清單摘要
//     setWishlistSummary(state, action) {
//       const { totalSellingPrice, message, status } = action.payload;
//       state.totalSellingPrice = totalSellingPrice || 0;
//       state.message = message || "";
//       state.status = status || false;
//     },
//   },
//   extraReducers: builder => {
//     builder
//       // 取得願望清單資料成功
//       .addMatcher(wishlistApi.endpoints.getWishlistProducts.matchFulfilled, (state, action) => {
//         const wishlistData = action.payload?.data;

//         if (wishlistData && Array.isArray(wishlistData.data)) {
//           state.items = wishlistData.data || [];
//           state.totalSellingPrice = wishlistData.totalSellingPrice || 0;
//           state.message = wishlistData.message || "";
//           state.status = wishlistData.status || false;

//           // 從 Products 物件中提取商品ID
//           const productIds =
//             wishlistData.data.map(item => item.Products?.id).filter(id => id) || [];
//           state.productIds = new Set(productIds);
//         } else {
//           // 如果沒有 data 或格式不正確，重置狀態
//           state.items = [];
//           state.productIds = new Set();
//           state.totalSellingPrice = 0;
//           state.message = "";
//           state.status = false;
//         }

//         state.isLoading = false;
//         state.error = null;
//       })
//       // 加入願望清單成功
//       .addMatcher(wishlistApi.endpoints.addProductToWishlist.matchFulfilled, (state, action) => {
//         // 樂觀更新
//         const productId = action.meta.arg; // addProductToWishlist 的參數
//         state.productIds.add(productId);
//         state.isLoading = false;
//         state.error = null;
//       })
//       // 移除願望清單商品成功
//       .addMatcher(wishlistApi.endpoints.deleteWishlistProduct.matchFulfilled, (state, action) => {
//         // 從狀態移除對應商品ID
//         const removedItemId = action.meta.arg;

//         // 如果 removedItemId 是願望清單項目的 id
//         const removedItem = state.items.find(item => item.id === removedItemId);
//         if (removedItem && removedItem.Products?.id) {
//           state.productIds.delete(removedItem.Products.id);
//         } else {
//           // 如果 removedItemId 直接是商品ID
//           state.productIds.delete(removedItemId);
//         }

//         state.isLoading = false;
//         state.error = null;
//       })
//       // 請求開始
//       .addMatcher(
//         action => action.type.endsWith("/pending") && action.type.includes("wishlist"),
//         state => {
//           state.isLoading = true;
//           state.error = null;
//         }
//       )
//       // 請求失敗
//       .addMatcher(
//         action => action.type.endsWith("/rejected") && action.type.includes("wishlist"),
//         (state, action) => {
//           state.isLoading = false;
//           state.error = action.error?.message || "請求失敗";
//         }
//       );
//   },
// });

// export const { addProductId, removeProductId, setProductIds, clearWishlist, setWishlistSummary } =
//   wishlistSlice.actions;

// // 基本 Selectors
// export const selectWishlistItems = state => state.wishlist.items;
// export const selectWishlistProductIds = state => state.wishlist.productIds;
// export const selectIsProductInWishlist = (state, productId) =>
//   state.wishlist.productIds.has(productId);
// export const selectWishlistTotalPrice = state => state.wishlist.totalSellingPrice;
// export const selectWishlistLoading = state => state.wishlist.isLoading;
// export const selectWishlistError = state => state.wishlist.error;
// export const selectWishlistMessage = state => state.wishlist.message;
// export const selectWishlistStatus = state => state.wishlist.status;

// // 進階 Selectors - 與購物車比對相關
// export const selectWishlistProducts = createSelector([selectWishlistItems], items =>
//   items.map(item => item.Products).filter(product => product)
// );

// // 比對願望清單和購物車的商品
// export const selectWishlistCartComparison = createSelector(
//   [selectWishlistProductIds, state => state.cart.productIds],
//   (wishlistIds, cartIds) => {
//     const wishlistArray = Array.from(wishlistIds);
//     const cartArray = Array.from(cartIds);

//     return {
//       // 在願望清單但不在購物車的商品
//       onlyInWishlist: wishlistArray.filter(id => !cartIds.has(id)),
//       // 在購物車但不在願望清單的商品
//       onlyInCart: cartArray.filter(id => !wishlistIds.has(id)),
//       // 同時在願望清單和購物車的商品
//       inBoth: wishlistArray.filter(id => cartIds.has(id)),
//       // 統計資訊
//       stats: {
//         wishlistCount: wishlistArray.length,
//         cartCount: cartArray.length,
//         bothCount: wishlistArray.filter(id => cartIds.has(id)).length,
//       },
//     };
//   }
// );

// // 取得願望清單中已加入購物車的商品詳細資訊
// export const selectWishlistItemsInCart = createSelector(
//   [selectWishlistItems, state => state.cart.productIds],
//   (wishlistItems, cartProductIds) => {
//     return wishlistItems.filter(item => item.Products?.id && cartProductIds.has(item.Products.id));
//   }
// );

// // 取得願望清單中未加入購物車的商品詳細資訊
// export const selectWishlistItemsNotInCart = createSelector(
//   [selectWishlistItems, state => state.cart.productIds],
//   (wishlistItems, cartProductIds) => {
//     return wishlistItems.filter(item => item.Products?.id && !cartProductIds.has(item.Products.id));
//   }
// );

// // 檢查特定商品是否同時在願望清單和購物車中
// export const selectIsProductInBothWishlistAndCart = createSelector(
//   [selectWishlistProductIds, state => state.cart.productIds],
//   (wishlistIds, cartIds) => productId => {
//     return wishlistIds.has(productId) && cartIds.has(productId);
//   }
// );

// export default wishlistSlice.reducer;
