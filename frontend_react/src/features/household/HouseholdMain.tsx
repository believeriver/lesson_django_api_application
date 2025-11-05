import React, { useEffect } from 'react';
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

const HouseholdMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  const profile = useSelector(selectMyProfile);
  const isLoadingAuth = useSelector(selectIsLoadingAuth)
  const isLoadingHousehold = useSelector(selectIsLoadingHousehold)

  useEffect(() => {
    const fetchHouseholdBootLoader = async () => {
      //ログイン画面を閉じる>Core.tsxで定義ずみのため、ここでuseSelectorは使わない
      // dispatch(resetOpenSignIn());
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetMyProf());
        if (fetchAsyncGetMyProf.rejected.match(result)) {
          //データの取得に失敗したら、ログイン画面に戻る
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

  return (
    <div>
      <Auth />
      {profile.nickName ? (
        <p>Success. Household</p>
      ) : (
        <p>Login False</p>
      )}
    </div>
  );
};

export default HouseholdMain;
