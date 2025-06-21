import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Cart"],
  endpoints: builder => ({
    // 取得購物車內容
    getCart: builder.query({
      query: userId => `/cart?userId=${userId}`,
      providesTags: result =>
        result?.data.items
          ? [
              ...result.data.items.map(({ id }) => ({ type: "Cart", id })),
              { type: "Cart", id: "LIST" },
            ]
          : [{ type: "Cart", id: "LIST" }],
    }),
    // 新增商品到購物車
    addToCart: builder.mutation({
      query: productId => ({
        url: `/cart/${productId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
    // 刪除購物車品項
    deleteCartProduct: builder.mutation({
      query: productId => ({
        url: `/cart/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
    // 刪除購物車
    deleteCart: builder.mutation({
      query: () => ({
        url: "/cart",
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
    // 確認訂單資料
    confirmOrderInfo: builder.mutation({
      query: orderInfo => ({
        url: "/cart/checkout",
        method: "POST",
        body: orderInfo,
      }),
      invalidatesTags: [{ type: "Cart", id: "LIST" }],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useDeleteCartMutation,
  useDeleteCartProductMutation,
  useGetCartQuery,
  useConfirmOrderInfoMutation,
  useLazyGetCartQuery,
  usePrefetch,
} = cartApi;
