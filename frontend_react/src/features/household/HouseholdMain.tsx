import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { AppDispatch } from '../../app/store';

import {
  selectIsLoadingHousehold,
  fetchAsyncGetHouseholdTransactions,
  fetchHouseholdStart,
  fetchHouseholdEnd,
  selectTransactions,
} from './householdSlice';

import {
  setOpenSignIn,
  resetOpenSignIn,
  fetchAsyncGetMyProf,
  selectMyProfile,
  selectIsLoadingAuth,
} from '../auth/authSlice';

import type { Transaction } from './householdtypes';
import Auth from '../auth/Auth';
import { formatMonth } from '../utils/formatting';
import Home from './pages/Home'

const HouseholdMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const profile = useSelector(selectMyProfile);
  const isLoadingAuth = useSelector(selectIsLoadingAuth);
  const isLoadingHousehold = useSelector(selectIsLoadingHousehold);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  // DatabaseからTransactionデータを取得
  useEffect(() => {
    const fetchHouseholdBootLoader = async () => {
      //ログイン画面を閉じる
      // dispatch(resetOpenSignIn());
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          //データの取得に失敗したら、ログイン画面に戻るが、Modalを重複起動になるのでコメントアウト
          // dispatch(setOpenSignIn());
          return null;
        }
        //ログインに成功したら、Transactionデータの取得をする
        await dispatch(fetchAsyncGetHouseholdTransactions());
      }
    };
    fetchHouseholdBootLoader();
  }, [dispatch]);
  console.log('[INFO] household transactions:', transactions);

  //Transactionデータを１ヶ月でフィルタリングする
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });
  console.log('[INFO]: monthlyTransactions:', monthlyTransactions);

  return (
    <div>
      <Auth />
      {profile.nickName ? (
        <Home
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
        />
      ) : (
        <p>Login False</p>
      )}
    </div>
  );
};

export default HouseholdMain;
