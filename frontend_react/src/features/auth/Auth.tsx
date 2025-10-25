import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Modal from 'react-modal';
import Formik from 'formik';
import * as Yup from 'yup';
import { TextField, Button, CircularProgress } from '@mui/material';

import type { AppDispatch } from '../../app/store';
import styles from './Auth.module.css';

import {
  selectIsLoadingAuth,
  selectOpenSignIn,
  selectOpenSignUp,
  setOpenSignIn,
  resetOpenSignIn,
  setOpenSignUp,
  resetOpenSignUp,
  fetchCredStart,
  fetchCredEnd,
  fetchAsyncLogin,
  fetchAsyncRegister,
  fetchAsyncGetMyProf,
  fetchAsyncGetProfs,
  fetchAsyncCreateProf,
} from './authSlice';

// Modal style
const customStyles = {
  overlay: {
    backgroundColor: '#777777',
  },
  content: {
    top: '55%',
    left: '50%',

    width: 280,
    height: 350,
    padding: '50px',

    transform: 'translate(-50%, -50%)',
  },
};

const Auth: React.FC = () => {
  Modal.setAppElement('#root');
  const openSignIn = useSelector(selectOpenSignIn);
  const openSingUp = useSelector(selectOpenSignUp);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const dispatch: AppDispatch = useDispatch();

  return <div>Auth</div>;
};

export default Auth;
