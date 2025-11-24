import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import type { AppDispatch } from '../../app/store';

import {
  // selectIsLoadingHousehold,
  fetchAsyncGetHouseholdTransactions,
  // fetchHouseholdStart,
  // fetchHouseholdEnd,
  selectTransactions,
} from './householdSlice';

import {
  fetchAsyncGetMyProf,
  selectMyProfile,
  // selectIsLoadingAuth,
} from '../auth/authSlice';

import Auth from '../auth/Auth';
import { formatMonth } from '../utils/formatting';
import Home from './pages/Home';
import Navigation from '../front/Navigation';

const HouseholdMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const profile = useSelector(selectMyProfile);
  // const isLoadingAuth = useSelector(selectIsLoadingAuth);
  // const isLoadingHousehold = useSelector(selectIsLoadingHousehold);

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
  console.log('[INFO] household transactions:', transactions);

  //Transactionデータを１ヶ月でフィルタリングする
  const monthlyTransactions = transactions.filter((transaction) => {
    return transaction.date.startsWith(formatMonth(currentMonth));
  });
  console.log('[INFO]: monthlyTransactions:', monthlyTransactions);

  return (
    <div>
      <Navigation />
      {profile.nickName ? (
        <Home
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
        />
      ) : (
        <Auth />
      )}
    </div>
  );
};

export default HouseholdMain;
