import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../../app/store';
import type {
  AuthProps,
  InstNewPostProps,
  nickNameProps,
  ProfileProps,
} from '../types';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlInstaPost = `${apiUrl}api_insta/insta_post/`;
const apiUrlInstaComment = `${apiUrl}api_insta/insta_comment/`;

//API
export const fetchAsyncGetPosts = createAsyncThunk('post/get', async () => {
  try {
    const res = await axios.get(apiUrlInstaPost, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  } catch (err: any) {
    console.log('[ERROR]: fetchAsyncGetPosts: ', err.message);
    alert(`[ERROR]: fetchAsyncGetPosts: ${err.message}`);
  }
});

export const fetchAsyncNewPost = createAsyncThunk(
  'post/post',
  async (newPost: InstNewPostProps) => {
    try {
      const uploadData = new FormData();
      uploadData.append('title', newPost.title);
      newPost.img && uploadData.append('img', newPost.img, newPost.img.name);
      const res = await axios.post(apiUrlInstaPost, uploadData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncNewPost: ', err.message);
      alert(`[ERROR]: fetchAsyncNewPost: ${err.message}`);
    }
  }
);

// main -------------------------------
export const instaPostSlice = createSlice({
  name: 'instaPost',
  initialState: {
    isLoadingPost: false,
    openNewPost: false,
    posts: [
      {
        id: 0,
        title: '',
        userPost: 0,
        created_on: '',
        img: '',
        liked: [0],
      },
    ],
    comments: [
      {
        id: 0,
        text: '',
        userComment: 0,
        post: 0,
      },
    ],
  },
  reducers: {
    fetchPostStart(state) {
      state.isLoadingPost = true;
    },
    fetchPostEnd(state) {
      state.isLoadingPost = false;
    },
    setOpenNewPost(state) {
      state.openNewPost = true;
    },
    resetOpenNewPost(state) {
      state.openNewPost = false;
    },
  },
});
