import { configureStore } from "@reduxjs/toolkit"
import { apiSlice } from "../slices/apiSlice"
import authReducer from "../slices/authSlice"
import searchReducer from "./searchSlice"

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        auth: authReducer,
        search: searchReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
})

export default store
