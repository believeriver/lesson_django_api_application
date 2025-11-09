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
  fetchAsyncGetMyProf,
  selectMyProfile,
  selectIsLoadingAuth,
} from '../auth/authSlice';

import Auth from '../auth/Auth';
import { formatMonth } from '../utils/formatting';
import Home from './pages/Home';
import Navigation from '../front/Navigation';
import { ThemeProvider } from '@emotion/react';
import { theme } from './theme/theme';
import { CssBaseline } from '@mui/material';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AppLayout from './components/layout/AppLayout';
import Report from './pages/Report';
import NoMatch from './pages/NoMatch';

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
      {/* <Auth /> */}
      {profile.nickName ? (
        <Home
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
        />
      ) : (
        // <ThemeProvider theme={theme}>
        //   <CssBaseline />
        //   <Router>
        //     <Routes>
        //       <Route path="/household/home" element={<AppLayout />}>
        //         <Route
        //           index
        //           element={
        //             <Home
        //               monthlyTransactions={monthlyTransactions}
        //               setCurrentMonth={setCurrentMonth}
        //             />
        //           }
        //         />
        //         <Route path="/household/report" element={<Report />} />
        //         <Route path="*" element={<NoMatch />} />
        //       </Route>
        //     </Routes>
        //   </Router>
        // </ThemeProvider>
        <Auth />
      )}
    </div>
  );
};

export default HouseholdMain;
