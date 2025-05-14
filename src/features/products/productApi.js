import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// 前台產品相關 API
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE,
  }),
  tagTypes: ["Product", "Category", "Brand"],
  endpoints: builder => ({
    // 取得商品列表
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    // 取得精選商品
    getFeaturedProducts: builder.query({
      query: () => "/products/featured",
      providesTags: ["Product"],
    }),
    // 取得最新商品
    getLatestProducts: builder.query({
      query: () => "/products/latest?sort=latest",
      providesTags: ["Product"],
    }),
    // 取得單一商品
    getProductById: builder.query({
      query: productId => `/products/${productId}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),
    // 取得商品類別
    getProductCategory: builder.query({
      query: () => "/categories",
      providesTags: ["Category"],
    }),
    // 取得商品矚目類別
    getFeaturedCategory: builder.query({
      query: () => "/category/featured",
      providesTags: ["Category"],
    }),
    // 取得商品品牌
    getProductBrands: builder.query({
      query: () => "/brands",
      providesTags: ["Brand"],
    }),
  }),
});

export const {
  useGetFeaturedCategoryQuery,
  useGetProductBrandsQuery,
  useGetProductCategoryQuery,
  useLazyGetFeaturedCategoryQuery,
  useLazyGetProductBrandsQuery,
  useLazyGetProductCategoryQuery,
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
