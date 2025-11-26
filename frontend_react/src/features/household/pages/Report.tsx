import { Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { AppDispatch } from '../../../app/store';
import {
  fetchAsyncGetHouseholdTransactions,
  selectTransactions,
} from '../householdSlice';
import { fetchAsyncGetMyProf, selectMyProfile } from '../../auth/authSlice';
import Auth from '../../auth/Auth';
import Navigation from '../../front/Navigation';
import { formatMonth } from '../../utils/formatting';

const Report: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const profile = useSelector(selectMyProfile);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // DatabaseからTransactionデータを取得
  useEffect(() => {
    const fetchHouseholdBootLoader = async () => {
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          return null;
        }
        //ログインに成功したら、Transactionデータの取得をする
        await dispatch(fetchAsyncGetHouseholdTransactions());
      }
      return null;
    };
    fetchHouseholdBootLoader();
  }, [dispatch]);

  //Transactionデータを１ヶ月でフィルタリングする
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  return (
    <Grid container spacing={2}>
      {/* 日付エリア */}
      Report
    </Grid>
  );
};

export default Report;
