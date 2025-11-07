import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { format } from 'date-fns';
import type { DateClickArg } from '@fullcalendar/interaction';

import type { Transaction } from '../householdtypes';

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
  console.log('[INFO] monthlyTransactions in Home.tsx:', monthlyTransactions);

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Left sidebar */}
      <Box sx={{ flexGrow: 1 }}>
        <div>Summary</div>
        <div>Calender</div>
      </Box>
      {/* Right Main bar */}
      <Box>
        <div>TransactionMenu</div>
        <div>TransactionForm</div>
      </Box>
    </Box>
  );
};

export default Home;
