import { apiSlice } from "./apiSlice";

export const instructorApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateInstructorProfile: builder.mutation({
      query: (data) => ({
        url: "/user/instructor/update",
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateInstructorProfileMutation } = instructorApi;
