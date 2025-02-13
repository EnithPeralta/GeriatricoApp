import { configureStore } from "@reduxjs/toolkit";
import { forgotPasswordSlice } from "./auth/forgotPasswordSlice";
import { personSlice } from "./personas/personSlice";
import { authSlice } from "./auth/authSlice";
import { geriatricoSlice } from "./geriatrico/geriatricoSlice";

export const store = configureStore({
    reducer: {
        auth:authSlice.reducer,
        forgotPassword:forgotPasswordSlice.reducer,
        person:personSlice.reducer,
        geriatrico:geriatricoSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: false,
    })
})
