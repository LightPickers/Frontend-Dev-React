import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 前台產品相關 API
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE,
  }),
  tagTypes: ["Product"],
  endpoints: builder => ({
    // 取得產品列表
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    // 取得精選產品
    getFeaturedProducts: builder.query({
      query: () => "/products/featured",
      providesTags: ["Product"],
    }),
    // 取得最新產品
    getLatestProducts: builder.query({
      query: () => "/products/latest?sort=latest",
      providesTags: ["Product"],
    }),
    // 取得單一產品
    getProductById: builder.query({
      query: productId => `/products/${productId}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
  }),
});

export const {
  useGetFeaturedProductsQuery,
  useGetLatestProductsQuery,
  useGetProductByIdQuery,
  useGetProductsQuery,
  useLazyGetFeaturedProductsQuery,
  useLazyGetLatestProductsQuery,
  useLazyGetProductByIdQuery,
  useLazyGetProductsQuery,
  usePrefetch,
} = productApi;
