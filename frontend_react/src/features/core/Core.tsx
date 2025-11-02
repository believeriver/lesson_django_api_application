import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
  withStyles,
  styled,
} from '@mui/material';
// import { styled } from '@mui/material/styles';
// import Stack from '@mui/material/Stack';

import { MdAddAPhoto } from 'react-icons/md';

import Auth from '../auth/Auth';
import styles from './Core.module.css';
import type { AppDispatch } from '../../app/store';

import InstaPost from '../instapost/InstaPost';

import {
  editNickname,
  selectProfiles,
  selectIsLoadingAuth,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  setOpenProfile,
  resetOpenProfile,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  selectMyProfile,
} from '../auth/authSlice';

import {
  selectPosts,
  selectIsLoadingPost,
  setOpenNewPost,
  resetOpenNewPost,
  fetchAsyncGetPosts,
  fetchAsyncGetComments,
} from '../instapost/instaPostSlice';
import EditProfile from './EditProfile';
import NewPost from './NewPost';

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    '&::after': {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '50%',
      animation: 'ripple 1.2s infinite ease-in-out',
      border: '1px solid currentColor',
      content: '""',
    },
  },
  '@keyframes ripple': {
    '0%': {
      transform: 'scale(.8)',
      opacity: 1,
    },
    '100%': {
      transform: 'scale(2.4)',
      opacity: 0,
    },
  },
}));

const Core: React.FC = () => {
  // useDispatch
  // dispatchによってアクションを実行し、stateを変更。
  // state変更後、再レンダリング。
  const dispatch: AppDispatch = useDispatch();
  //useSelect
  // storeから必要なデータを取り出すuseSelector
  const profile = useSelector(selectMyProfile);
  const posts = useSelector(selectPosts);
  const isLoadingPost = useSelector(selectIsLoadingPost);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);

  console.log('[INFO]: profile in Core.tsx: ', profile);

  //useEffect
  // コンポーネントのレンダリング後に実行したい処理
  //API通信、ログ出力、イベント登録・解除などの「副作用（side effect）」を行うとき
  //ブラウザが起動したときに最初に実行される
  useEffect(() => {
    const fetchBootLoader = async () => {
      if (localStorage.localJWT) {
        dispatch(resetOpenSignIn());
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          dispatch(setOpenSignIn());
          return null;
        }
        await dispatch(fetchAsyncGetPosts());
        await dispatch(fetchAsyncGetProfs());
        await dispatch(fetchAsyncGetComments());
      }
    };
    fetchBootLoader();
  }, [dispatch]);

  return (
    <div>
      <Auth />
      <EditProfile />
      <NewPost />
      <div className={styles.core_header}>
        <h1 className={styles.core_title}>SNS clone</h1>
        {profile?.nickName ? (
          <>
            {/* ログインに成功したら表示 */}
            <button
              className={styles.core_btnModal}
              onClick={() => {
                dispatch(setOpenNewPost());
                dispatch(resetOpenProfile());
              }}
            >
              <MdAddAPhoto />
            </button>
            <div className={styles.core_logout}>
              {(isLoadingPost || isLoadingAuth) && <CircularProgress />}
              <Button
                onClick={() => {
                  localStorage.removeItem('localJWT');
                  dispatch(editNickname(''));
                  dispatch(resetOpenProfile());
                  dispatch(resetOpenNewPost());
                  dispatch(setOpenSignIn());
                }}
              >
                Logout
              </Button>
              <button
                className={styles.core_btnModal}
                onClick={() => {
                  dispatch(setOpenProfile());
                  dispatch(resetOpenNewPost());
                }}
              >
                <StyledBadge
                  overlap="circular"
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                  // badgeContent={1}
                  variant="dot"
                >
                  <Avatar alt="who?" src={profile.img} />
                </StyledBadge>
              </button>
            </div>
          </>
        ) : (
          <div>
            {/* ログインしていない時に表示するボタン */}
            <Button
              onClick={() => {
                dispatch(setOpenSignIn());
                dispatch(resetOpenSignUp());
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                dispatch(setOpenSignUp());
                dispatch(resetOpenSignIn());
              }}
            >
              SignUp
            </Button>
          </div>
        )}
      </div>

      {/* ログインしている時にポスト一覧を表示する */}
      {profile?.nickName && (
        <>
          <div className={styles.core_posts}>
            <Grid container spacing={4}>
              {posts
                .slice(0)
                .reverse()
                .map((post) => (
                  <Grid key={post.id} size={{ xs: 12, md: 4 }}>
                    <InstaPost
                      postId={post.id}
                      title={post.title}
                      loginId={profile.userProfile}
                      userPost={post.userPost}
                      imageUrl={post.img}
                      liked={post.liked}
                    />
                  </Grid>
                ))}
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default Core;
