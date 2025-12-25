import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_APP_BASE_URL || "https://krupesh-task-manager-server.onrender.com";

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL + "/api",
    credentials: 'include'
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Task", "User"],
    endpoints: () => ({}),
});