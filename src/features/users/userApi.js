import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
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
  tagTypes: ["User"],
  endpoints: builder => ({
    // 用戶登入
    loginUser: builder.mutation({
      query: credentials => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    // 用戶註冊
    registerUser: builder.mutation({
      query: newUser => ({
        url: "/users/signup",
        method: "POST",
        body: newUser,
      }),
    }),
    // 驗證登入身分
    verifyAuth: builder.query({
      query: () => ({
        url: "/users/auth/verify",
        method: "POST",
      }),
      providesTags: ["User"],
      keepUnusedDataFor: 60,
    }),
    // 取得用戶資料
    getUserProfile: builder.query({
      query: () => "/users/profile",
      providesTags: ["User"],
    }),
    // 修改用戶資料
    updateUser: builder.mutation({
      query: updatedUser => ({
        url: "/users/profile",
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useVerifyAuthQuery,
  useLazyVerifyAuthQuery,
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserMutation,
} = userApi;
