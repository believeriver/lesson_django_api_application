import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

import type { RootState } from "../../app/store";

const apiUrl = import.meta.env.VITE_API_URL;
const apiUrlHousehold = `${apiUrl}api_irbank/companies/`;

//API
// Get
export const fetchAsyncCompanies = createAsyncThunk("irbank/get", async () => {
  try {
    const res = await axios.get(apiUrlHousehold, {
      headers: {
        Authorization: `JWT ${localStorage.localJWT}`,
      },
    });
    return res.data;
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log("[ERROR]: fetchCompanies: ", err.message);
    } else {
      console.log("[ERROR]: fetchCompanies: ", err);
    }
  }
});

// main(createSlice) ----
export const irbankSlice = createSlice({
  name: "irbank",
  initialState: {
    isLoadingIrbank: false,
    openIrbank: false,
    companies: [
      {
        code: "",
        name: "",
        stock: "",
        dividend: "",
        dividend_rank: "",
        dividend_update: "",
        information: {
          industry: "",
          description: "",
          per: "",
          psr: "",
          pbr: "",
          updated_at: "",
        },
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
    builder.addCase(fetchAsyncCompanies.fulfilled, (state, action) => {
      return {
        ...state,
        companies: action.payload,
      };
    });
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
  state.irbank.isLoadingIrbank;
export const selectOpenHousehold = (state: RootState) =>
  state.irbank.openIrbank;
export const selectCompanise = (state: RootState) =>
  state.irbank.companies;

//export householdReducer
export default irbankSlice.reducer;
