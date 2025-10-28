import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import instaPostReducer from '../features/instapost/instapostSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    instaPost: instaPostReducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch