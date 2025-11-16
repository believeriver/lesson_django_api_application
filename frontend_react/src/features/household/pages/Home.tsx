import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';

import { format } from 'date-fns';
import type { DateClickArg } from '@fullcalendar/interaction';

import type { Transaction } from '../types';
import MonthlySummary from '../components/MonthlySummary';
import Calendar  from '../components/Calender';
import TransactionMenu from '../components/TransactionMenu';

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
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  console.log('[INFO]: isMobile in Home.tsx:', isMobile)

  // function -------------------
  const dailyTransactions = monthlyTransactions.filter((transaction) => {
    return transaction.date === currentDay;
  });

  //閉じるボタン
  const onCloseForm = () => {
    setSelectedTransaction(null);
    if (isMobile) {
      setIsDialogOpen(!isDialogOpen);
    } else {
      setIsEntryDrawerOpen(isEntryDrawerOpen);
    }
  };
  //フォーム開閉処理(内訳追加ボタン)
  const handleAddTransactionForm = () => {
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      if (selectedTransaction) {
        setSelectedTransaction(null);
      } else {
        setIsEntryDrawerOpen(!isEntryDrawerOpen);
      }
    }
  };

  //取引が選択された時の処理
  const handleSelectTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    if (isMobile) {
      setIsDialogOpen(true);
    } else {
      setIsEntryDrawerOpen(true);
    }
  };

  //モバイル用Drawerを閉じる処理
  const handleCloseMobileDrawer = () => {
    setIsMobileDrawerOpen(false);
  };

  //日付を選択した時の処理
  const handleDateClick = (dateInfo: DateClickArg): void => {
    setCurrentDay(dateInfo.dateStr);
    setIsMobileDrawerOpen(true);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Left sidebar */}
      <Box sx={{ flexGrow: 1 }}>
        <MonthlySummary monthlyTransactions={monthlyTransactions} />
        <Calendar
          monthlyTransactions={monthlyTransactions}
          setCurrentMonth={setCurrentMonth}
          setCurrentDay={setCurrentDay}
          currentDay={currentDay}
          today={today}
          onDateClick={handleDateClick}
        />
      </Box>
      {/* Right Main bar */}
      <Box>
        <TransactionMenu 
          dailyTransactions={dailyTransactions}
          currentDay={currentDay}
          onAddTransactionForm={handleAddTransactionForm}
          onSelectTransaction={handleSelectTransaction}
          isMobile={isMobile}
          open={isMobileDrawerOpen}
          onClose={handleCloseMobileDrawer}
        />
        <div>TransactionForm</div>
      </Box>
    </Box>
  );
};

export default Home;
