import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogContent,
  IconButton,
  ListItemIcon,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import AddHomeIcon from '@mui/icons-material/AddHome';
import AlarmIcon from '@mui/icons-material/Alarm';
import Diversity3Icon from '@mui/icons-material/Diversity3';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import TrainIcon from '@mui/icons-material/Train';
import WorkIcon from '@mui/icons-material/Work';
import SavingsIcon from '@mui/icons-material/Savings';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';

import { Controller, useForm } from 'react-hook-form';
import type { SubmitHandler } from 'react-hook-form';
import type { JSX } from '@fullcalendar/core/preact.js';
import { zodResolver } from '@hookform/resolvers/zod';

import { useDispatch, useSelector } from 'react-redux';

import type { expenseCategory, incomeCategory, Transaction } from '../types';
import {
  fetchAsyncGetHouseholdTransactions,
  fetchAsyncAddHouseholdTransaction,
  fetchAsyncUpdateHouseholdTransaction,
  fetchAsyncDeleteHouseholdTransaction,
} from '../householdSlice';
import type { AppDispatch } from '../../../app/store';
import { theme } from '../theme/theme';
import { transactionSchema, type Schema } from '../validations/schema';


interface TransactionFormProps {
  onCloseForm: () => void;
  isEntryDrawerOpen: boolean;
  currentDay: string;
  isMobile: boolean;
  selectedTransaction: Transaction | null;
  setSelectedTransaction: React.Dispatch<
    React.SetStateAction<Transaction | null>
  >;
  isDialogOpen: boolean;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

type IncomeExpense = 'income' | 'expense';

interface CategoryItem {
  label: incomeCategory | expenseCategory;
  icon: JSX.Element;
}

const TransactionForm = ({
  onCloseForm,
  isEntryDrawerOpen,
  currentDay,
  isMobile,
  selectedTransaction,
  isDialogOpen,
  setIsDialogOpen,
}: TransactionFormProps) => {
  const formWidth = 320;
  const dispatch: AppDispatch = useDispatch();

  // 支出用カテゴリ
  const expenseCategories: CategoryItem[] = [
    { label: '食費', icon: <FastfoodIcon fontSize="small" /> },
    { label: '日用品', icon: <AlarmIcon fontSize="small" /> },
    { label: '住居費', icon: <AddHomeIcon fontSize="small" /> },
    { label: '交際費', icon: <Diversity3Icon fontSize="small" /> },
    { label: '娯楽', icon: <SportsTennisIcon fontSize="small" /> },
    { label: '交通費', icon: <TrainIcon fontSize="small" /> },
  ];
  // 収入用カテゴリ
  const incomeCategories: CategoryItem[] = [
    { label: '給与', icon: <WorkIcon fontSize="small" /> },
    { label: '副収入', icon: <AddBusinessIcon fontSize="small" /> },
    { label: '児童手当', icon: <SavingsIcon fontSize="small" /> },
  ];

  const [categories, setCategories] = useState(expenseCategories);

  const {
    control,
    setValue,
    formState: {errors},
    handleSubmit,
    reset,
  } = useForm<Schema>({
    defaultValues: {
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    },
    resolver: zodResolver(transactionSchema)
  })

  //送信処理
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    if (selectedTransaction){
      // 選択されている場合の更新処理
      const update_data = {
        id: selectedTransaction.id,
        ...data,
      }
      await dispatch(fetchAsyncUpdateHouseholdTransaction(update_data))
    } else {
      // 選択されていない場合は新規追加
    }
  }

  return (
    <Box display={'flex'} justifyContent={'space-between'}>
      <Typography variant="h6">入力</Typography>
      {/* 閉じるボタン */}
      <IconButton
        onClick={onCloseForm}
        sx={{
          color: (theme) => theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
    </Box>
  );
};

export default TransactionForm;
