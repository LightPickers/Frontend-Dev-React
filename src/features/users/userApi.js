import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE,
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: builder => ({
    loginUser: builder.mutation({
      query: credentials => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),
    registerUser: builder.mutation({
      query: newUser => ({
        url: "/users/signup",
        method: "POST",
        body: newUser,
      }),
    }),
    getUserProfile: builder.query({
      query: () => "/users/profile",
    }),
    updateUser: builder.mutation({
      query: updatedUser => ({
        url: "/users/profile",
        method: "PUT",
        body: updatedUser,
      }),
    }),
  }),
});

export const {
  useLoginUserMutation,
  useRegisterUserMutation,
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserMutation,
} = userApi;
