import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import instaPostReducer from '../features/instapost/instaPostSlice';
import householdReducer from '../features/household/householdSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    instaPost: instaPostReducer,
    household: householdReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
