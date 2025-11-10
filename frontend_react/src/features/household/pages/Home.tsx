import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { format } from 'date-fns';
import type { DateClickArg } from '@fullcalendar/interaction';

import type { Transaction } from '../types';

interface HomeProps {
  monthlyTransactions: Transaction[];
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>;
}

const Home = ({ monthlyTransactions, setCurrentMonth }: HomeProps) => {
  console.log('[INFO] monthlyTransactions in Home.tsx:', monthlyTransactions);
  const today = format(new Date(), 'yyyy-MM-dd');
  const [currentDay, setCurrentDay] = useState(today);
  const [isEntryDrawerOpen, setIsEntryDrawerOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isMobileDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  // function
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });

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
