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
  fetchHouseholdStart,
  fetchHouseholdEnd,
} from '../householdSlice';
import type { AppDispatch } from '../../../app/store';
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
  setSelectedTransaction,
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
    watch,
    formState: { errors },
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
    resolver: zodResolver(transactionSchema),
  });

  // 収支タイプを切り替える関数
  const incomeExpenseToggle = (type: IncomeExpense) => {
    setValue('type', type);
    setValue('category', '');
  };

  //API--------------------------------
  //送信処理(データベース更新)
  const onSubmit: SubmitHandler<Schema> = async (data) => {
    await dispatch(fetchHouseholdStart());
    if (selectedTransaction) {
      // 選択されている場合の更新処理
      const update_data = {
        id: selectedTransaction.id,
        ...data,
      };
      await dispatch(fetchAsyncUpdateHouseholdTransaction(update_data));
    } else {
      // 選択されていない場合は新規追加
      await dispatch(fetchAsyncAddHouseholdTransaction(data));
    }
    await dispatch(fetchHouseholdEnd());
    reset({
      type: 'expense',
      date: currentDay,
      amount: 0,
      category: '',
      content: '',
    });
  };

  //削除処理
  const handleDelete = async () => {
    await dispatch(fetchHouseholdStart());
    if (selectedTransaction) {
      await dispatch(
        fetchAsyncDeleteHouseholdTransaction(selectedTransaction.id)
      );
      if (isMobile) {
        setIsDialogOpen(false);
      }
      setSelectedTransaction(null);
    }
    await dispatch(fetchHouseholdEnd());
  };

  //useEffect ---------------------------
  // 選択肢が更新されたか確認
  useEffect(() => {
    if (selectedTransaction) {
      const categoryExists = categories.some(
        (category) => category.label === selectedTransaction?.category
      );
      setValue('category', categoryExists ? selectedTransaction.category : '');
    }
  }, [selectedTransaction, categories]);

  // 日付が変更されたタイミングを処理するuseEffect
  useEffect(() => {
    setValue('date', currentDay);
  }, [currentDay]);

  // 取引が選択されたタイミングが処理を行うuseEffect
  // フォーム内容を更新(category : 別のuseEffectで更新)
  useEffect(() => {
    if (selectedTransaction) {
      setValue('type', selectedTransaction.type);
      setValue('date', selectedTransaction.date);
      setValue('amount', selectedTransaction.amount);
      setValue('content', selectedTransaction.content);
    } else {
      reset({
        type: 'expense',
        date: currentDay,
        amount: 0,
        category: '',
        content: '',
      });
    }
  }, [selectedTransaction]);

  //収支タイプを監視して更新
  const currentType = watch('type');
  useEffect(() => {
    const newCategories =
      currentType === 'expense' ? expenseCategories : incomeCategories;
    setCategories(newCategories);
  }, [currentType]);

  // form
  const formContent = (
    <>
      {/* 入力エリアのヘッダー */}
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
      {/* フォーム要素 */}
      <Box component={'form'} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2}>
          {/* 収支切り替えボタン */}
          <Controller
            name="type"
            control={control}
            render={({ field }) => {
              return (
                <ButtonGroup fullWidth>
                  <Button
                    variant={
                      field.value === 'expense' ? 'contained' : 'outlined'
                    }
                    color="error"
                    onClick={() => incomeExpenseToggle('expense')}
                  >
                    支出
                  </Button>
                  <Button
                    variant={
                      field.value === 'income' ? 'contained' : 'outlined'
                    }
                    color="primary"
                    onClick={() => incomeExpenseToggle('income')}
                  >
                    収入
                  </Button>
                </ButtonGroup>
              );
            }}
          />
          {/* 日付 */}
          <Controller
            name="date"
            control={control}
            render={({ field }) => {
              return (
                <TextField
                  {...field}
                  label="日付"
                  type="date"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={!!errors.date}
                  helperText={errors.date?.message}
                />
              );
            }}
          />
          {/* カテゴリ */}
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.category}
                helperText={errors.category?.message}
                {...field}
                id="カテゴリ"
                label="カテゴリ"
                select
              >
                {categories.map((category, index) => (
                  <MenuItem value={category.label} key={index}>
                    <ListItemIcon>
                      {category.icon as React.ReactNode}{' '}
                    </ListItemIcon>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          {/* 金額 */}
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.amount}
                helperText={errors.amount?.message}
                {...field}
                value={field.value === 0 ? '' : field.value}
                onChange={(e) => {
                  const newValue = parseInt(e.target.value, 10) || 0;
                  field.onChange(newValue);
                }}
                label="金額"
                type="number"
              />
            )}
          />
          {/* 内容 */}
          <Controller
            name="content"
            control={control}
            render={({ field }) => (
              <TextField
                error={!!errors.content}
                helperText={errors.content?.message}
                {...field}
                label="内容"
                type="text"
              />
            )}
          />
          {/* 保存ボタン */}
          <Button
            type="submit"
            variant="contained"
            color={currentType === 'income' ? 'primary' : 'error'}
            fullWidth
          >
            {selectedTransaction ? '更新' : '保存'}
          </Button>
          {/* 削除ボタン */}
          {selectedTransaction && (
            <Button
              onClick={handleDelete}
              variant="outlined"
              color="secondary"
              fullWidth
            >
              削除
            </Button>
          )}
        </Stack>
      </Box>
    </>
  );

  // main
  return (
    <>
      {isMobile ? (
        // Mobile
        <Dialog
          open={isDialogOpen}
          onClose={onCloseForm}
          fullWidth
          maxWidth={'sm'}
        >
          <DialogContent>{formContent}</DialogContent>
        </Dialog>
      ) : (
        //PC
        <Box
          sx={{
            position: 'fixed',
            top: 64,
            right: isEntryDrawerOpen ? formWidth : '-2%',
            width: formWidth,
            height: '100%',
            bgcolor: 'background.paper',
            zIndex: (theme) => theme.zIndex.drawer - 1,
            transition: (theme) =>
              theme.transitions.create('right', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            p: 2,
            boxSizing: 'border-box',
            boxShadow: '0px 0px 15px -5px #777777',
          }}
        >
          {formContent}
        </Box>
      )}
    </>
  );
};

export default TransactionForm;
