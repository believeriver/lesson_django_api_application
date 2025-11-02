import React, { useState } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { Button, TextField, IconButton } from '@mui/material';
import { MdAddAPhoto } from 'react-icons/md';

import styles from './Core.module.css';
import type { AppDispatch } from '../../app/store';
import type { File } from '../types';

import {
  editNickname,
  selectMyProfile,
  selectOpenProfile,
  resetOpenProfile,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncUpdateProf,
} from '../auth/authSlice';

// Modal style
const customStyles = {
  content: {
    top: '55%',
    left: '50%',

    width: 280,
    height: 400,
    padding: '50px',

    transform: 'translate(-50%, -50%)',
  },
};

const EditProfile: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const openProfile = useSelector(selectOpenProfile);
  const myprofile = useSelector(selectMyProfile);
  const [image, setImage] = useState<File | null>(null);

  const updateProfile = async (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const packet = {
      id: myprofile.id,
      nickName: myprofile.nickName,
      img: image,
    };
    console.log('[INFO] packet at updateProfie in EditProfile.tsx: ', packet);

    await dispatch(fetchCredStart());
    await dispatch(fetchAsyncUpdateProf(packet));
    await dispatch(fetchCredEnd());
    await dispatch(resetOpenProfile());
  };

  const handerEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput?.click();
  };

  return (
    <>
      <Modal
        isOpen={openProfile}
        onRequestClose={async () => {
          await dispatch(resetOpenProfile());
        }}
        style={customStyles}
      >
        <form className={styles.core_signUp}>
          <h1 className={styles.core_title}>SNS clone</h1>
          <br />
          <TextField
            placeholder="nickname"
            type="text"
            value={myprofile?.nickName}
            onChange={(e) => dispatch(editNickname(e.target.value))}
          />

          <input
            type="file"
            id="imageInput"
            hidden={true}
            onChange={(e) => setImage(e.target.files![0])}
          />

          <IconButton onClick={handerEditPicture}>
            <MdAddAPhoto />
          </IconButton>
          <br />

          <Button
            disabled={!myprofile.nickName}
            variant="contained"
            color="primary"
            type="submit"
            onClick={updateProfile}
          >
            Update
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default EditProfile;
