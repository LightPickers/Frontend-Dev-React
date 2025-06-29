import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const orderApi = createApi({
  reducerPath: "orderApi",
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
  tagTypes: ["Order"],
  endpoints: builder => ({
    // 取得特定訂單
    getOrderById: builder.query({
      query: orderId => `/orders/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    // 取得結帳完成訂單
    getPaidOrderById: builder.query({
      query: orderId => `/orders/paid/${orderId}`,
      providesTags: (result, error, id) => [{ type: "Order", id }],
    }),
    // 新增訂單資料
    createNewOrder: builder.mutation({
      query: newOrder => ({
        url: "/orders",
        method: "POST",
        body: newOrder,
      }),
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
    // 修改訂單資料（許願）
    updateOrderInfo: builder.mutation({
      query: ({ orderId, ...updatedOrderInfo }) => ({
        url: `/orders/${orderId}`,
        method: "PUT",
        body: updatedOrderInfo,
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }],
    }),
    // 刪除特定訂單（許願）
    deleteOrderById: builder.mutation({
      query: ({ orderId }) => ({
        url: `/orders/${orderId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { orderId }) => [{ type: "Order", id: orderId }],
    }),

    //取得所有訂單
    getOrders: builder.query({
      query: () => "/orders",
      // 修正
      providesTags: (result, error) => {
        if (result?.data && Array.isArray(result.data)) {
          return [
            ...result.data.map(({ id }) => ({ type: "Order", id })),
            { type: "Order", id: "LIST" },
          ];
        }
        return [{ type: "Order", id: "LIST" }];
      },
    }),

    // 再次付款（pending 訂單）
    repayOrder: builder.mutation({
      query: orderId => ({
        url: `/orders/pending/${orderId}`,
        method: "POST",
        responseHandler: response => response.text(), // 將 html 當作 text 回傳
      }),
    }),
  }),
});

export const {
  useUpdateOrderInfoMutation,
  useDeleteOrderByIdMutation,
  useCreateNewOrderMutation,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useGetPaidOrderByIdQuery,
  usePrefetch,
  useGetOrdersQuery,
  useRepayOrderMutation,
} = orderApi;
