import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
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
  tagTypes: ["reviews"],
  endpoints: builder => ({
    // 取得所有評論
    getReviews: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== "") {
            queryParams.set(key, value);
          }
        });
        return `/reviews?${queryParams.toString()}`;
      },
      providesTags: result =>
        result?.data
          ? [
              ...result.data.reviews.map(({ id }) => ({ type: "reviews", id })),
              { type: "reviews", id: "LIST" },
            ]
          : [{ type: "reviews", id: "LIST" }],
    }),
    // 取得首頁評論
    getIndexReviews: builder.query({
      query: () => "/reviews/index",
      // providesTags: ["reviews"],
      providesTags: result =>
        result?.data
          ? [
              ...result.data.indexReviews.map(({ id }) => ({ type: "reviews", id })),
              { type: "reviews", id: "LIST" },
            ]
          : [{ type: "reviews", id: "LIST" }],
    }),
    // 取得單一評論
    getReviewById: builder.query({
      query: reviewId => `/reviews/${reviewId}`,
      providesTags: (result, error, id) => [{ type: "review", id }],
    }),
    // 新增商品評論
    postProductReview: builder.mutation({
      query: ({ productId, review }) => ({
        url: `/reviews/${productId}`,
        method: "POST",
        body: review, // { rating, comment , image }
      }),
      invalidatesTags: [{ type: "reviews", id: "LIST" }],
    }),
    // 修改商品評論
    updateReview: builder.mutation({
      query: ({ reviewId, updatedReview }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body: updatedReview, // { rating, comment , image }
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "reviews", id: reviewId },
        {
          type: "reviews",
          id: "LIST",
        },
      ],
    }),
    // 對評論按讚
    setReviewLiked: builder.mutation({
      query: reviewId => ({
        url: `/reviews/like/${reviewId}`,
        method: "POST",
      }),
      invalidatesTags: (result, error, reviewId) => [{ type: "reviews", id: reviewId }],
    }),
    // 收回對評論的讚
    setReviewUnliked: builder.mutation({
      query: reviewId => ({
        url: `/reviews/like/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, reviewId) => [{ type: "reviews", id: reviewId }],
    }),
    // === 管理者 ===
    // 回覆評論
    postReviewReply: builder.mutation({
      query: ({ reviewId, reply }) => ({
        url: `/reviews/${reviewId}`,
        method: "POST",
        body: reply,
      }),
      invalidatesTags: [{ type: "reviews", id: "LIST" }],
    }),
    // 修改回覆
    updateReviewReply: builder.mutation({
      query: ({ reviewId, updatedReply }) => ({
        url: `/reviews/${reviewId}`,
        method: "PUT",
        body: updatedReply,
      }),
      invalidatesTags: (result, error, { reviewId }) => [
        { type: "reviews", id: reviewId },
        {
          type: "reviews",
          id: "LIST",
        },
      ],
    }),
    // 刪除評論
    removeReview: builder.mutation({
      query: reviewId => ({
        url: `/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, reviewId) => [
        { type: "reviews", id: reviewId },
        {
          type: "reviews",
          id: "LIST",
        },
      ],
    }),
  }),
});

export const {
  useGetReviewByIdQuery,
  useGetReviewsQuery,
  useGetIndexReviewsQuery,
  useLazyGetReviewByIdQuery,
  useLazyGetReviewsQuery,
  useLazyGetIndexReviewsQuery,
  usePostProductReviewMutation,
  usePostReviewReplyMutation,
  usePrefetch,
  useRemoveReviewMutation,
  useSetReviewLikedMutation,
  useSetReviewUnlikedMutation,
  useUpdateReviewMutation,
  useUpdateReviewReplyMutation,
} = reviewApi;
