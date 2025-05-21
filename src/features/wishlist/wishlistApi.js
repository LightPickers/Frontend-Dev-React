import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const wishlistApi = createApi({
  reducerPath: "wishlistApi",
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
  tagTypes: ["Wishlist"],
  endpoints: builder => ({
    // 取得收藏列表
    getWishlistProducts: builder.query({
      query: () => "/users/favorites?sortBy=created_at&orderBy=DESC",
      providesTags: result =>
        result?.data
          ? [
              ...result.data.map(({ id }) => ({ type: "Wishlist", id })),
              { type: "Wishlist", id: "LIST" },
            ]
          : [{ type: "Wishlist", id: "LIST" }],
    }),
    // 將商品加到收藏列表
    addProductToWishlist: builder.mutation({
      query: favoriteProduct => ({
        url: "/users/favorites",
        method: "POST",
        body: favoriteProduct,
      }),
      invalidatesTags: [{ type: "Wishlist", id: "LIST" }],
    }),
    // 刪除收藏列表品項
    deleteWishlistProduct: builder.mutation({
      query: favoriteId => ({
        url: `/users/favorites/${favoriteId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, favoriteId) => [
        { type: "Wishlist", id: favoriteId },
        { type: "Wishlist", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useAddProductToWishlistMutation,
  useDeleteWishlistProductMutation,
  useGetWishlistProductsQuery,
  useLazyGetWishlistProductsQuery,
  usePrefetch,
} = wishlistApi;
