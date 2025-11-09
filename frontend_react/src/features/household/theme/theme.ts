import { createTheme } from '@mui/material';
import type { PaletteColor, PaletteColorOptions } from '@mui/material';
import {
  amber,
  blue,
  cyan,
  deepOrange,
  green,
  lightBlue,
  lightGreen,
  pink,
  purple,
  red,
} from '@mui/material/colors';
import type { expenseCategory, incomeCategory } from '../types';

declare module '@mui/material/styles' {
  interface Palette {
    incomeColor: PaletteColor;
    expenseColor: PaletteColor;
    balanceColor: PaletteColor;
    incomeCategoryColor: Record<incomeCategory, string>;
    expenseCategoryColor: Record<expenseCategory, string>;
  }
  interface PaletteOptions {
    incomeColor?: PaletteColorOptions;
    expenseColor?: PaletteColorOptions;
    balanceColor?: PaletteColorOptions;
    incomeCategoryColor?: Record<incomeCategory, string>;
    expenseCategoryColor?: Record<expenseCategory, string>;
  }
}

export const theme = createTheme({
  typography: {
    fontFamily: 'Noto Sans JP, Robot, "Helvetica Neue", Arial, sans-serif',
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
  },

  palette: {
    incomeColor: {
      main: blue[500],
      light: blue[100],
      dark: blue[700],
    },
    expenseColor: {
      main: red[500],
      light: red[100],
      dark: red[700],
    },
    balanceColor: {
      main: green[500],
      light: green[100],
      dark: green[700],
    },

    //円グラフ用
    incomeCategoryColor: {
      給与: lightBlue[600],
      副収入: cyan[200],
      児童手当: lightGreen['A700'],
    },

    expenseCategoryColor: {
      食費: deepOrange[600],
      日用品: lightGreen[200],
      住居費: amber['A700'],
      交際費: pink[300],
      娯楽: cyan[200],
      交通費: purple[400],
    },
  },
});
