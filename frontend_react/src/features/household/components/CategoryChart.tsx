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
  return <div>CategoryChart</div>;
};

export default CategoryChart;
