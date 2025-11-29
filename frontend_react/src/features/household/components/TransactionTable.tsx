import * as React from 'react';
import { alpha, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import { Grid } from '@mui/material';
import { compareDesc, parseISO } from 'date-fns';
import { useSelector } from 'react-redux';

import { type Transaction } from '../types';
import {
  selectIsLoadingHousehold,
  fetchAsyncDeleteHouseholdTransaction,
} from '../householdSlice';
import { financeCalculations } from '../../utils/financeCalculations';
import { formatCurrency } from '../../utils/formatting';
import IconComponents from './common/IconComponents';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

interface TransactionTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

//テーブルヘッド
function TransactionTableHead(props: TransactionTableHeadProps) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            color="primary"
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{
              'aria-label': 'select all deserts',
            }}
          />
          <TableCell align="left">日付</TableCell>
          <TableCell align="left">カテゴリ</TableCell>
          <TableCell align="left">金額</TableCell>
          <TableCell align="left">内容</TableCell>
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

interface TransactionTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
}

const TransactionTable = () => {
  return <div>TransactionTable</div>;
};

export default TransactionTable;
