import React, { useState } from 'react';
import { Avatar, Divider, Checkbox } from '@mui/material';
// import { makeStyles, createStyles } from '@mui/styles';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { AvatarGroup } from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';

import type { AppDispatch } from '../../app/store';
import styles from './instaPost.module.css';

import { selectProfiles } from '../auth/authSlice';

import {
  selectComments,
  fetchPostStart,
  fetchPostEnd,
  fetchAsyncPostComment,
  fetchAsyncPatchLiked,
} from './instaPostSlice';

import type { InstPostProps } from '../types';
// import { current } from '@reduxjs/toolkit';

// const useStyles = makeStyles((theme: any) =>
//   createStyles({
//     small: {
//       width: theme.spacing(3),
//       height: theme.spacing(3),
//       marginRight: theme.spacing(1),
//     },
//   })
// );
// const useStyles = makeStyles((theme: any) => ({
//   small: {
//     width: theme.spacing(3),
//     height: theme.spacing(3),
//     marginRight: theme.spacing(1),
//   },
// }));

const InstaPost: React.FC<InstPostProps> = ({
  postId,
  loginId,
  userPost,
  title,
  imageUrl,
  liked,
}) => {
  // const classes = useStyles();
  const dispatch: AppDispatch = useDispatch();
  const profiles = useSelector(selectProfiles);
  const comments = useSelector(selectComments);
  const [text, setText] = useState('');

  const commentsOnPost = comments.filter((com) => {
    return com.post === postId;
  });

  const prof = profiles.filter((prof) => {
    return prof.userProfile === userPost;
  });

  // コメントを投足するボタンを押下
  const postComment = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = { text: text, post: postId };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPostComment(packet));
    await dispatch(fetchPostEnd());
    setText('');
  };

  //いいねボタン
  const handlerLiked = async () => {
    const packet = {
      id: postId,
      title: title,
      current: liked,
      new: loginId,
    };
    await dispatch(fetchPostStart());
    await dispatch(fetchAsyncPatchLiked(packet));
    await dispatch(fetchPostEnd());
  };

  if (title) {
    return (
      <div className={styles.post}>
        {/* 投稿 */}
        <div className={styles.post_header}>
          <Avatar className={styles.post_avatar} src={prof[0]?.img} />
          <h3>{prof[0]?.nickName}</h3>
        </div>
        <img className={styles.post_image} src={imageUrl} alt="" />
        {/* いいねボタン */}
        <h4 className={styles.post_text}>
          <Checkbox
            className={styles.post_checkBox}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            checked={liked.some((like) => like === loginId)}
            onClick={handlerLiked}
          />
          <strong>{prof[0]?.nickName}</strong>
          {title}
          <AvatarGroup max={7}>
            {liked.map((like) => (
              <Avatar
                className={styles.post_avatarGroup}
                key={like}
                src={profiles.find((prof) => prof.userProfile == like)?.img}
              />
            ))}
          </AvatarGroup>
        </h4>

        <Divider />
        {/* コメント */}
        <div className={styles.post_comments}>
          {commentsOnPost.map((comment) => (
            <div key={comment.id} className={styles.post_comment}>
              <Avatar
                src={
                  profiles.find(
                    (prof) => prof.userProfile === comment.userComment
                  )?.img
                }
                sx={{
                  width: 24, // px単位で直接指定OK
                  height: 24,
                }}
                // className={classes.small}
              />
              <p>
                <strong className={styles.post_strong}>
                  {
                    profiles.find(
                      (prof) => prof.userProfile === comment.userComment
                    )?.nickName
                  }
                </strong>
                {comment.text}
              </p>
            </div>
          ))}
        </div>

        {/* 投稿フォーム */}
        <form className={styles.post_commentBox}>
          <input
            className={styles.post_input}
            type="text"
            placeholder="add a comment"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <button
            disabled={!text.length}
            className={styles.post_button}
            type="submit"
            onClick={postComment}
          >
            Post
          </button>
        </form>
      </div>
    );
  }
  return null;
};

export default InstaPost;
