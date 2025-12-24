import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import type { RootState } from '../../app/store';

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlHousehold = `${apiUrl}api_irbank/companies/`;

//API
// Get
export const fetchCompanies = createAsyncThunk(
  'irbank/get',
  async () => {
    try {
      const res = await axios.get(apiUrlHousehold, {
        headers: {
          Authorization: `JWT ${localStorage.localJWT}`,
        },
      });
      return res.data;
    } catch (err: any) {
      console.log('[ERROR]: fetchCompanies: ', err.message);
    }
  }
);

// main(createSlice) ----
export const irbankSlice = createSlice({
  name: 'irbank',
  initialState: {
    isLoadingIrbank: false,
    openIrbank: false,
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
    fetchIrbankStart(state) {
      state.isLoadingIrbank = true;
    },
    fetchIrbankEnd(state) {
      state.isLoadingIrbank = false;
    },
    setOpenIrbank(state) {
      state.openIrbank = true;
    },
    resetOpenIrbank(state) {
      state.openIrbank = false;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      fetchCompanies.fulfilled,
      (state, action) => {
        return {
          ...state,
          transactions: action.payload,
        };
      }
    );
  },
});

export const {
  fetchIrbankStart,
  fetchIrbankEnd,
  setOpenIrbank,
  resetOpenIrbank,
} = irbankSlice.actions;

//export state for useSelector
export const selectIsLoadingHousehold = (state: RootState) =>
  state.household.isLoadingHousehold;
export const selectOpenHousehold = (state: RootState) =>
  state.household.openHousehold;
export const selectTransactions = (state: RootState) =>
  state.household.transactions;

//export householdReducer
export default irbankSlice.reducer;

