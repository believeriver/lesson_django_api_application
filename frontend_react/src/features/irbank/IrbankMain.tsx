import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import type { AppDispatch } from "../../app/store";

import { fetchAsyncCompanies } from "./irbankSlice";
import { selectCompanise } from "./irbankSlice";
import { Navigation } from "@mui/icons-material";

const IrbankMain: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const companise = useSelector(selectCompanise);

  useEffect(() => {
    const fetchIrbankCompaniesBootLoader = async () => {
      await dispatch(fetchAsyncCompanies());
    };
    fetchIrbankCompaniesBootLoader();
  }, [dispatch]);
  console.log("[INFO] irbank companise in IrbankMain.tsx", companise);

  return (
    <div>
      <Navigation />
      IrbankMain
    </div>
  );
};

export default IrbankMain;
