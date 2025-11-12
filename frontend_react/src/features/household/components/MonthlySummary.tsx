import { Card, Grid, CardContent, Typography, Stack } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

import type { Balance, Transaction } from '../types';
import { financeCalculations } from '../../utils/financeCalculations';
import { formatCurrency } from '../../utils/formatting';
import { theme } from '../theme/theme';

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[];
}

const MonthlySummary = ({ monthlyTransactions }: MonthlySummaryProps) => {
  const res= financeCalculations(monthlyTransactions);
  const income = res.income
  const expense = res.expense
  const balance = res.balance
  console.log(
    '[INFO]MonthlySummary.tsx: monthlyTransactions:',
    monthlyTransactions
  );
  return (
  <Grid container spacing={2} size={{xs:1, sm:2}}>
    <Grid size={{xs: 4}} display={'flex'} flexDirection={'column'}>
      <Card
       sx={{
        bgcolor:(theme) => theme.palette.incomeColor.main,
        color: 'white',
        borderRadius: '10px',
        flexGrow: 1,
       }}
      >
        <CardContent sx={{padding: {xs:1, sm: 2}}}>
          <Stack direction={'row'}>
            <ArrowUpwardIcon sx={{fontSize: '2rem'}} />
            <Typography>収入</Typography>
          </Stack>
          <Typography
            textAlign={'right'}
            variant='h5'
            fontWeight={'fontWeightBold'}
            sx={{
              wordBreak: 'break-word',
              fontSize:{xs: '.8rem', sm: '1rem', md: '1.2rem'}
            }}
          >
            ¥{formatCurrency(income)}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
  );
};

export default MonthlySummary;
