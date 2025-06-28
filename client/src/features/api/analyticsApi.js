import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_BACKEND_URL}/analytics`,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getOwnerAnalytics: builder.query({
      query: () => "/owner",
    }),
  }),
});

export const { useGetOwnerAnalyticsQuery } = analyticsApi;
