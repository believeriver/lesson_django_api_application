import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../../app/store';
import type { Transaction } from './householdtypes';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlHousehold = `${apiUrl}api_household/transactions/`;

//API
export const fetchAsyncGetHouseholdTransactions = createAsyncThunk(
  'household/get',
  async () => {
    try {
      const res = await axios.get(apiUrlHousehold, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchAsyncGetHouseholdTransactions: ', err.message);
      // alert(`[ERROR]: fetchAsyncGetPosts: ${err.message}`);
    }
  }
);

// main(createSlice) ----
export const householdSlice = createSlice({
  name: 'householde',
  initialState: {
    isLoadingHousehold: false,
    transactions: [
      {
        id: 0,
        amount: 0,
        type: '',
        date: '',
        category: '',
        content: '',
      },
    ],
  },
  reducers: {
    fetchHouseholdStart(state) {
      state.isLoadingHousehold = true;
    },
    fetchHouseholdEnd(state) {
      state.isLoadingHousehold = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchAsyncGetHouseholdTransactions.fulfilled,
      (state, action) => {
        return {
          ...state,
          transactions: action.payload,
        };
      }
    );
  },
});

export default householdSlice.reducer;
