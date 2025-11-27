import React, { useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  type ChartData,
} from 'chart.js';
import { Pie } from 'react-chartjs-2';
import {
  Box,
  CircularProgress,
  MenuItem,
  selectClasses,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';

import type {
  expenseCategory,
  incomeCategory,
  Transaction,
  TransactionType,
} from '../types';

ChartJS.register(ArcElement, Tooltip, Legend);

interface CategoryChartProps {
  monthlyTransactions: Transaction[];
  isLoading: boolean;
}

const CategoryChart = ({
  monthlyTransactions,
  isLoading,
}: CategoryChartProps) => {
  console.log(
    '[INFO] monthlyTransactions in CategoryChart.tsx:',
    monthlyTransactions
  );

  const theme = useTheme();
  // Typeの選択、切り替え
  const [selectedType, setSelectedType] = useState<TransactionType>('expense');
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setSelectedType(e.target.value as TransactionType);
  };

  // カテゴリタイプごとの合計金額計算
  const categorySums = monthlyTransactions
    .filter((transaction) => transaction.type === selectedType)
    .reduce<Record<string, number>>((acc, transaction) => {
      if (!acc[transaction.category]) {
        acc[transaction.category] = 0;
      }
      acc[transaction.category] += transaction.amount;
      return acc;
    }, {} as Record<string, number>);

  //　カテゴリー名をlabelとして取得
  const categoryLabels = Object.keys(categorySums) as (
    | incomeCategory
    | expenseCategory
  )[];

  // カテゴリーごとの合計値を取得
  const categoryValues = Object.values(categorySums);

  // pie chart オブジェクト
  const options = {
    maintainAspectRatio: false,
    responsive: true,
  };
  const incomeCategoryColor: Record<incomeCategory, string> = {
    給与: theme.palette.incomeCategoryColor.給与,
    副収入: theme.palette.incomeCategoryColor.副収入,
    児童手当: theme.palette.incomeCategoryColor.児童手当,
  };
  const expenseCategoryColor: Record<expenseCategory, string> = {
    食費: theme.palette.expenseCategoryColor.食費,
    日用品: theme.palette.expenseCategoryColor.日用品,
    住居費: theme.palette.expenseCategoryColor.住居費,
    交際費: theme.palette.expenseCategoryColor.交際費,
    娯楽: theme.palette.expenseCategoryColor.娯楽,
    交通費: theme.palette.expenseCategoryColor.交通費,
  };
  const getCategoryColor = (
    category: incomeCategory | expenseCategory
  ): string => {
    if (selectedType === 'income') {
      return incomeCategoryColor[category as incomeCategory];
    } else {
      return expenseCategoryColor[category as expenseCategory];
    }
  };
  const data: ChartData<'pie'> = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryValues,
        backgroundColor: categoryLabels.map((category) => {
          return getCategoryColor(category);
        }),
        borderColor: categoryLabels.map((category) => {
          return getCategoryColor(category);
        }),
        borderWidth: 1,
      },
    ],
  };

  return <div>CategoryChart</div>;
};

export default CategoryChart;
