import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../../app/store';
import type {
  AuthProps,
  InstCommentProps,
  InstLikedProps,
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
    // alert(`[ERROR]: fetchAsyncGetPosts: ${err.message}`);
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
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncNewPost: ', err.message);
      // alert(`[ERROR]: fetchAsyncNewPost: ${err.message}`);
    }
  }
);

export const fetchAsyncPatchLiked = createAsyncThunk(
  'post/patch',
  async (liked: InstLikedProps) => {
    try {
      const currentLiked = liked.current;
      const uploadData = new FormData();

      let isOverLapped = false;
      currentLiked.forEach((current) => {
        if (current === liked.new) {
          isOverLapped = true;
        } else {
          uploadData.append('liked', String(current));
        }
      });

      if (!isOverLapped) {
        uploadData.append('liked', String(liked.new));
      } else if (currentLiked.length === 1) {
        uploadData.append('title', liked.title);
        const res = await axios.put(
          `${apiUrlInstaPost}${liked.id}/`,
          uploadData,
          {
            headers: {
              // 'Content-Type': 'application/json',
              Authorization: `JWT ${localStorage.localJWT}`,
            },
          }
        );
        return res.data;
      }

      // isOverlapped===true and currentLiked.length !== 1
      const res = await axios.patch(
        `${apiUrlInstaPost}${liked.id}/`,
        uploadData,
        {
          headers: {
            // 'Content-Type': 'application/json',
            Authorization: `JWT ${localStorage.localJWT}`,
          },
        }
      );
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncPatchLiked: ', err.message);
      // alert(`[ERROR]: fetchAsyncPatchLiked: ${err.message}`);
    }
  }
);

export const fetchAsyncGetComments = createAsyncThunk(
  'comment/get',
  async () => {
    try {
      const res = await axios.get(apiUrlInstaComment, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncGetComments: ', err.message);
      // alert(`[ERROR]: fetchAsyncGetComments: ${err.message}`);
    }
  }
);

export const fetchAsyncPostComment = createAsyncThunk(
  'comment/post',
  async (comment: InstCommentProps) => {
    try {
      const res = await axios.post(apiUrlInstaComment, comment, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncPostComments: ', err.message);
      // alert(`[ERROR]: fetchAsyncPostComments: ${err.message}`);
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
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGetPosts.fulfilled, (state, action) => {
      return {
        ...state,
        posts: action.payload,
      };
    });
    builder.addCase(fetchAsyncNewPost.fulfilled, (state, action) => {
      return {
        ...state,
        posts: [...state.posts, action.payload],
      };
    });
    builder.addCase(fetchAsyncGetComments.fulfilled, (state, action) => {
      return {
        ...state,
        comments: action.payload,
      };
    });
    builder.addCase(fetchAsyncPostComment.fulfilled, (state, action) => {
      return {
        ...state,
        comments: [...state.comments, action.payload],
      };
    });
    builder.addCase(fetchAsyncPatchLiked.fulfilled, (state, action) => {
      return {
        ...state,
        posts: state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        ),
      };
    });
  },
});

export const {
  fetchPostStart,
  fetchPostEnd,
  setOpenNewPost,
  resetOpenNewPost,
} = instaPostSlice.actions;

// export state for useSelector
export const selectIsLoadingPost = (state: RootState) =>
  state.instaPost.isLoadingPost;
export const selectOpenNewPost = (state: RootState) =>
  state.instaPost.openNewPost;
export const selectPosts = (state: RootState) => state.instaPost.posts;
export const selectComments = (state: RootState) => state.instaPost.comments;

export default instaPostSlice.reducer;
