import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const aiCustomerServiceApi = createApi({
  reducerPath: "aiCustomerServiceApi",
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
  endpoints: builder => ({
    postAiMessage: builder.mutation({
      query: message => ({
        url: "/aiCustomerService",
        method: "POST",
        body: { message },
      }),
    }),
  }),
});

export const { usePostAiMessageMutation } = aiCustomerServiceApi;
