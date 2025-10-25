import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../../app/store';
import type { AuthProps, nickNameProps, ProfileProps } from '../types';

const apiUrl = import.meta.env.VITE_API_URL;
const token = localStorage.localJWT;

//API function ------------
export const fetchAsyncLogin = createAsyncThunk(
  'auth/post',
  async (auth: AuthProps) => {
    try {
      const res = await axios.post(`${apiUrl}authen/jwt/create`, auth, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncLogin: ', err.message);
      alert(`[ERROR]: fetchAsyncLogin: ${err.message}`);
    }
  }
);

export const fetchAsyncRegister = createAsyncThunk(
  'auth/register',
  async (auth: AuthProps) => {
    try {
      const res = await axios.post(`${apiUrl}api_auth/register/`, auth, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncRegister: ', err.message);
      alert(`[ERROR]: fetchAsyncRegister: ${err.message}`);
    }
  }
);

export const fetchAsyncCreateProf = createAsyncThunk(
  'profile/post',
  async (nickName: nickNameProps) => {
    try {
      const res = await axios.post(`${apiUrl}api_auth/profile/`, nickName, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${token}`,
        },
      });
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncCreateProf: ', err.message);
      alert(`[ERROR]: fetchAsyncCreateProf: ${err.message}`);
    }
  }
);

export const fetchAsyncUpdateProf = createAsyncThunk(
  'profile/put',
  async (profile: ProfileProps) => {
    try {
      const uploadData = new FormData();
      uploadData.append('nickName', profile.nickName);
      profile.img && uploadData.append('img', profile.img, profile.img.name);
      const res = await axios.put(
        `${apiUrl}api_auth/profile/${profile.id}/`,
        uploadData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `JWT ${token}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncUpdateProf: ', err.message);
      alert(`[ERROR]: fetchAsyncUpdateProf: ${err.message}`);
    }
  }
);

export const fetchAsyncGetMyProf = createAsyncThunk('profile/get', async () => {
  try {
    const res = await axios.get(`${apiUrl}api_auth/myprofile/`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    return res.data[0];
  } catch (err: any) {
    console.log('[ERROR]: fetchAsyncGetMyProf: ', err.message);
    alert(`[ERROR]: fetchAsyncGetMyProf: ${err.message}`);
  }
});

export const fetchAsyncGetProfs = createAsyncThunk('profiles/get', async () => {
  try {
    const res = await axios.get(`${apiUrl}api_auth/profile/`, {
      headers: {
        Authorization: `JWT ${token}`,
      },
    });
    return res.data;
  } catch (err: any) {
    console.log('[ERROR]: fetchAsyncGetProfs: ', err.message);
    alert(`[ERROR]: fetchAsyncGetProfs: ${err.message}`);
  }
});

// main -------------------------------
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
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncLogin.fulfilled, (state, action) => {
      localStorage.setItem('localJWT', action.payload.access);
    });
    builder.addCase(fetchAsyncCreateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetMyProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
    });
    builder.addCase(fetchAsyncGetProfs.fulfilled, (state, action) => {
      state.profiles = action.payload;
    });
    builder.addCase(fetchAsyncUpdateProf.fulfilled, (state, action) => {
      state.myprofile = action.payload;
      state.profiles = state.profiles.map((prof) => {
        return prof.id === action.payload.id ? action.payload : prof;
      });
    });
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

// export state for useSelector
export const selectIsLoadingAuth = (state: RootState) =>
  state.auth.isLoadingAuth;
export const selectOpenSignIn = (state: RootState) => state.auth.openSignIn;
export const selectOpenSignUp = (state: RootState) => state.auth.openSignUp
export const selectOpenProfile = (state: RootState) => state.auth.openProfile
export const selectMyProfile = (state: RootState) => state.auth.myprofile
export const selectProfiles = (state: RootState) => state.auth.profiles

// export reducer
export default authSlice.reducer;
