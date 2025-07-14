import { apiSlice } from "../apiSlice";

const TASKS_URL = "/task";

export const taskApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getDashboardStats: builder.query({
            query: (userId) => ({
                url: `${TASKS_URL}/dashboard?userId=${userId}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Task"],
        }),

        getAllTask: builder.query({
            query: ({ strQuery, isTrashed, search, assignedTo }) => ({
                url: `${TASKS_URL}?stage=${strQuery}&isTrashed=${isTrashed}&search=${search}${assignedTo ? `&assignedTo=${assignedTo}` : ''}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Task"],
        }),

        createTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/create`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        duplicateTask: builder.mutation({
            query: (id) => ({
                url: `${TASKS_URL}/duplicate/${id}`,
                method: "POST",
                body: {},
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        updateTask: builder.mutation({
            query: (data) => ({
                url: `${TASKS_URL}/update/${data._id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        trashTast: builder.mutation({
            query: ({ id }) => ({
                url: `${TASKS_URL}/${id}`,
                method: "PUT",
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        createSubTask: builder.mutation({
            query: ({ data, id }) => ({
                url: `${TASKS_URL}/create-subtask/${id}`,
                method: "PUT",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        getSingleTask: builder.query({
            query: (id) => ({
                url: `${TASKS_URL}/${id}`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Task"],
        }),

        postTaskActivity: builder.mutation({
            query: ({ data, id }) => ({
                url: `${TASKS_URL}/activity/${id}`,
                method: "POST",
                body: data,
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

        deleteRestoreTast: builder.mutation({
            query: ({ id, actionType }) => ({
                url: `${TASKS_URL}/delete-restore/${id}?actionType=${actionType}`,
                method: "DELETE",
                credentials: "include",
            }),
            invalidatesTags: ["Task"],
        }),

    }),
});

export const {
    useGetDashboardStatsQuery,
    useGetAllTaskQuery,
    useCreateTaskMutation,
    useDuplicateTaskMutation,
    useUpdateTaskMutation,
    useTrashTastMutation,
    useCreateSubTaskMutation,
    useGetSingleTaskQuery,
    usePostTaskActivityMutation,
    useDeleteRestoreTastMutation,
} = taskApiSlice