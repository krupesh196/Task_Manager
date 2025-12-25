import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const API_URL = import.meta.env.VITE_APP_BASE_URL || "https://task-manager-jw2l.onrender.com";

const baseQuery = fetchBaseQuery({
    baseUrl: API_URL + "/api",
    credentials: 'include'
});

export const apiSlice = createApi({
    baseQuery,
    tagTypes: ["Task", "User"],
    endpoints: () => ({}),
});