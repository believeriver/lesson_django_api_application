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

import type { Transaction } from './householdtypes';

const HouseholdMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const transactions = useSelector(selectTransactions);
  useEffect(() => {
    const fetchHouseholdBootLoader = async () => {
      if (localStorage.localJWT) {
        const result = await dispatch(fetchAsyncGetHouseholdTransactions());
      }
    };
    fetchHouseholdBootLoader();
  }, [dispatch]);
  console.log('[INFO] household transactions:', transactions);
  return <div>HouseholdMain</div>;
};

export default HouseholdMain;
