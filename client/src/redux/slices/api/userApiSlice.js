import { apiSlice } from "../apiSlice";

const USER_URL = "/user"

export const userApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/profile`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["User", "Task"],
        }),

        getTeamList: builder.query({
            query: () => ({
                url: `${USER_URL}/get-team`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User"],
        }),

        deleteUser: builder.mutation({
            query: (id) => ({
                url: `${USER_URL}/${id}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["User", "Task"],
        }),

        userAction: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/${data.id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["User", "Task"],
        }),

        getNotifications: builder.query({
            query: () => ({
                url: `${USER_URL}/notifications`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["User"],
        }),

        markNotiAsRead: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/read-noti?isReadType=${data.type}&id=${data?.id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: `${USER_URL}/change-password`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["User"],
        }),
    }),
});

export const {
    useUpdateUserMutation,
    useGetTeamListQuery,
    useDeleteUserMutation,
    useUserActionMutation,
    useGetNotificationsQuery,
    useMarkNotiAsReadMutation,
    useChangePasswordMutation,
} = userApiSlice;
