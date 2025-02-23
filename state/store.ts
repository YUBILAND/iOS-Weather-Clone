import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./api/apiSlice";
import settingsReducer from "./settings/settingsSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    settings: settingsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
