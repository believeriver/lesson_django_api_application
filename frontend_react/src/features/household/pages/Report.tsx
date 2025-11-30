import { Grid, Paper } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { AppDispatch } from '../../../app/store';
import {
  fetchAsyncGetHouseholdTransactions,
  fetchAsyncDeleteHouseholdTransaction,
  selectTransactions,
  fetchHouseholdStart,
  fetchHouseholdEnd,
} from '../householdSlice';
import { fetchAsyncGetMyProf, selectMyProfile } from '../../auth/authSlice';
import Auth from '../../auth/Auth';
// import Navigation from '../../front/Navigation';
import { formatMonth } from '../../utils/formatting';
import MonthSelector from '../components/MonthSelector';
import CategoryChart from '../components/CategoryChart';
import BarChart from '../components/BarChart';
import TransactionTable from '../components/TransactionTable';

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
        await dispatch(fetchHouseholdStart());
        await dispatch(fetchAsyncGetHouseholdTransactions());
        await dispatch(fetchHouseholdEnd());
      }
      return null;
    };
    fetchHouseholdBootLoader();
  }, [dispatch]);

  //Transactionデータを１ヶ月でフィルタリングする
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });

  //Transactionデータを一括削除
  const handleDeleteTransaction = async (
    transactionIds: string | readonly string[]
  ) => {
    const idsToDelete = Array.isArray(transactionIds)
      ? transactionIds
      : [transactionIds];
    await dispatch(fetchHouseholdStart());
    for (const id of idsToDelete) {
      await dispatch(fetchAsyncDeleteHouseholdTransaction(id));
    }
    await dispatch(fetchAsyncGetHouseholdTransactions());
    await dispatch(fetchHouseholdEnd());
  };

  //Paper style
  const commonPaperStyle = {
    height: '400px',
    display: 'flex',
    flexDirection: 'column',
    p: 2,
  };

  return (
    <div>
      {/* <Navigation /> */}
      {profile.nickName ? (
        <Grid container spacing={2}>
          {/* 日付エリア */}
          <Grid size={{ xs: 12 }}>
            <MonthSelector
              currentMonth={currentMonth}
              setCurrentMonth={setCurrentMonth}
            />
          </Grid>
          {/* 円グラフ */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper sx={commonPaperStyle}>
              <CategoryChart monthlyTransactions={monthlyTransactions} />
            </Paper>
          </Grid>
          {/* 棒グラフ */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={commonPaperStyle}>
              <BarChart monthlyTransactions={monthlyTransactions} />
            </Paper>
          </Grid>
          {/* 取引履歴テーブル */}
          <Grid size={{ xs: 12 }}>
            <TransactionTable
              monthlyTransactions={monthlyTransactions}
              onDeleteTransactions={handleDeleteTransaction}
            />
          </Grid>
        </Grid>
      ) : (
        <Auth />
      )}
    </div>
  );
};

export default Report;
