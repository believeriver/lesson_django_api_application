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
import { useDispatch, useSelector } from 'react-redux';

import { type Transaction } from '../types';
import { type AppDispatch } from '../../../app/store';
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

//テーブルヘッド
interface TransactionTableHeadProps {
  numSelected: number;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  rowCount: number;
}

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

//ツールバー
interface TransactionTableToolbarProps {
  numSelected: number;
  onDelete: () => void;
}

function TransactionTableToolbar(props: TransactionTableToolbarProps) {
  const { numSelected, onDelete } = props;
  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { sx: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100$' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          月の収支
        </Typography>
      )}
      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}

//ツールバーに表示する、月の収支表示するためのコンポーネント
interface FinancialItemProps {
  title: string;
  value: number;
  color: string;
}

function FInancialItem(props: FinancialItemProps) {
  const { title, value, color } = props;
  return (
    <Grid size={{ xs: 4 }} textAlign={'center'}>
      <Typography variant="subtitle1" component={'div'}>
        {title}
      </Typography>
      <Typography
        component={'span'}
        fontWeight={'fontWeightBold'}
        sx={{
          color: color,
          fontSize: { xs: '.8rem', sm: '1rem', md: '1.2rem' },
          wordBreak: 'break-word',
        }}
      >
        ¥{formatCurrency(value)}
      </Typography>
    </Grid>
  );
}

//メイン
interface TransactionTableProps {
  monthlyTransactions: Transaction[];
  onDeleteTransactions: (
    transactionIds: string | readonly string[]
  ) => Promise<void>;
}
const TransactionTable = (props: TransactionTableProps) => {
  const { monthlyTransactions, onDeleteTransactions } = props;
  const dispatch: AppDispatch = useDispatch();
  const theme = useTheme();
  const [order, setOrder] = React.useState<Order>('asc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = monthlyTransactions.map((n) => String(n.id));
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected: readonly string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  //データ削除
  console.log('[INFO]: TransactionTable selected:', selected);
  const handleDelete = () => {
    if (window.confirm('Clicked Delete: Do you want to delete ?')) {
      onDeleteTransactions(selected);
      setSelected([]);
    }
  };

  const isSelected = (id: string) => selected.indexOf(id) !== -1;
  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  //最終ページの空白行
  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - monthlyTransactions.length)
      : 0;

  //取引データから表示件数を取得
  const visibleRows = React.useMemo(() => {
    const sortedMonthluTransactions = [...monthlyTransactions].sort((a, b) =>
      compareDesc(parseISO(a.date), parseISO(b.date))
    );
    return sortedMonthluTransactions.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  },[order, page, rowsPerPage, monthlyTransactions]);

  const {income, expense, balance}= financeCalculations(monthlyTransactions);

  //main　テーブルの見た目を返す
  return (
    <Box sx={{ width: '100%'}}>
      <Paper sx={{ width: '100%', md: 2}}>
        <Grid
          container
          sx={{ borderBottom: '1px solid rgba(244,244,244, 1)'}}
        >
          {/* 収入 */}
          <FInancialItem 
            title='収入'
            value={income}
            color={theme.palette.incomeColor.main}
          />
          {/* 支出 */}
          <FInancialItem 
            title='支出'
            value={expense}
            color={theme.palette.expenseColor.main}
          />
          {/* 残高 */}
          <FInancialItem 
            title='残高'
            value={balance}
            color={theme.palette.balanceColor.main}
          />
        </Grid>

        {/* ツールバー */}
        <TransactionTableToolbar 
          numSelected={selected.length}
          onDelete={handleDelete}
        />

        {/* 取引一覧（テーブルデータ） */}
        <TableContainer>
          <Table
            sx={{minWidth: 750}}
            aria-labelledby='tableTitle'
            size={dense ? 'small' : 'medium'}
          >
            {/* テーブルヘッド */}
            <TransactionTableHead 
              numSelected={selected.length}
              order={order}
              onSelectAllClick={handleSelectAllClick}
              rowCount={monthlyTransactions.length}
            />
          </Table>
          {/* テーブルボディ */}
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TransactionTable;
