import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const analyticsApi = createApi({
  reducerPath: "analyticsApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8080/api/v1/analytics",
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getOwnerAnalytics: builder.query({
      query: () => "/owner",
    }),
  }),
});

export const { useGetOwnerAnalyticsQuery } = analyticsApi;
