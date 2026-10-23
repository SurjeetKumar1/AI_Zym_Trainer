import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import workoutReducer from "./slices/workoutSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    workout: workoutReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
