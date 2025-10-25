import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../../app/store';

const apiUrl = import.meta.env.VITE_API_URL;

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    openSignIn: true,
    openSignUp: false,
    openProfile: false,
    isLoadingAuth: false,
    myprofile: {
      id: 0,
      nickName: '',
      userProfile: 0,
      create_on: '',
      img: '',
    },
    profiles: [
      {
        id: 0,
        nickName: '',
        userProfile: 0,
        created_on: '',
        img: '',
      },
    ],
  },
  reducers: {
    fetchCredStart(state) {
      state.isLoadingAuth = true;
    },
    fetchCredEnd(state) {
      state.isLoadingAuth = false;
    },
    setOpenSignIn(state) {
      state.openSignIn = true;
    },
    resetOpenSignIn(state) {
      state.openSignIn = false;
    },
    setOpenSignUp(state) {
      state.openSignUp = true;
    },
    resetOpenSignUp(state) {
      state.openSignUp = false;
    },
    setOpenProfile(state) {
      state.openProfile = true;
    },
    resetOpenProfile(state) {
      state.openProfile = false;
    },
    editNickname(state, action) {
      state.myprofile.nickName = action.payload;
    },
  },
});

//export reducer.
export const {
  fetchCredStart,
  fetchCredEnd,
  setOpenSignIn,
  setOpenSignUp,
  setOpenProfile,
  resetOpenSignIn,
  resetOpenSignUp,
  resetOpenProfile,
  editNickname,
} = authSlice.actions;

// export state

export default authSlice.reducer;
