import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const PURCHASE_API = "http://localhost:8080/api/v1";

export const purchaseApi = createApi({
  reducerPath: "purchaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: PURCHASE_API,
    credentials: "include", // if using cookies/session
  }),
  endpoints: (builder) => ({
    purchaseCourse: builder.mutation({
      query: (courseId) => ({
        url: `/purchase/${courseId}`,
        method: "POST",
      }),
    }),

    getMyCourses: builder.query({
      query: () => ({
        url: `/my-courses`,
        method: "GET",
      }),
    }),

    getCourseDetailWithStatus: builder.query({
      query: (courseId) => ({
        url: `/course/${courseId}/detail-with-status`,
        method: "GET",
      }),
    }),

    getPurchasedCourses: builder.query({
      query: () => ({
        url: `/`,
        method: "GET",
      }),
    }),

    submitReview: builder.mutation({
      query: ({ courseId, rating, comment }) => ({
        url: `/course/${courseId}/review`,
        method: "POST",
        body: { rating, comment },
      }),
    }),
    getInstructorPurchases: builder.query({
      query: () => "/instructor/dashboard",
      providesTags: ["Purchase"],
    }),
  }),
});

export const {
  usePurchaseCourseMutation,
  useGetMyCoursesQuery,
  useGetCourseDetailWithStatusQuery,
  useGetPurchasedCoursesQuery,
  useSubmitReviewMutation,
  useGetInstructorPurchasesQuery,
} = purchaseApi;
