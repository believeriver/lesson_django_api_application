import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  Button,
  Grid,
  Avatar,
  Badge,
  CircularProgress,
  withStyles,
} from '@mui/material';

import { MdAddAPhoto } from 'react-icons/md'


import Auth from '../auth/Auth';
import styles from './Core.module.css';
import type { AppDispatch } from '../../app/store';

const Core: React.FC = () => {
  return (
    <div>
      <Auth />
      <Button />

    </div>
  );
};

export default Core;
