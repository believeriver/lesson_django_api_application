import React from 'react';
import {
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  Stack,
  Typography,
  Card,
  CardActionArea,
  CardContent,
  Grid,
} from '@mui/material';
import NotesIcon from '@mui/icons-material/Notes';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import type { Transaction } from '../types';
import { formatCurrency } from '../../utils/formatting';
import IconComponents from './common/IconComponents';

import { fetchAsyncAddHouseholdTransaction } from '../householdSlice';
import { theme } from '../theme/theme';

interface TransactionMenuProps {
  dailyTransactions: Transaction[];
  currentDay: string;
  onAddTransactionForm: () => void;
  onSelectTransaction: (transaction: Transaction) => void;
  isMobile: boolean;
  open: boolean;
  onClose: () => void;
}

const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  onAddTransactionForm,
  onSelectTransaction,
  isMobile,
  open,
  onClose,
}: TransactionMenuProps) => {
  const menuDrawerWidth = 320;
  console.log('[INFO] open in TransactionMenu.tsx', open);
  console.log('[INFO] isMobile in TransactionMenu.tsx', isMobile);

  return (
    <Drawer
      sx={{
        width: isMobile ? 'auto' : menuDrawerWidth,
        '& .MuiDrawer-paper': {
          width: isMobile ? 'auto' : menuDrawerWidth,
          boxSizing: 'border-box',
          p: 2,
          ...(isMobile && {
            height: '80vh',
            borderTopRightRadius: 8,
            borderTopLeftRadius: 8,
          }),
          ...(!isMobile && {
            top: 64,
            height: `calc(100% - 64px)`,
          }),
        },
      }}
      variant={isMobile ? 'temporary' : 'permanent'}
      anchor={isMobile ? 'bottom' : 'right'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Stack sx={{ height: '100%' }} spacing={2}>
        <Typography fontWeight={'fontWeightBold'}>
          日時：{currentDay}
        </Typography>
        <div>DailySummary</div>

        {/* 内訳タイトル＆内訳追加ボタン */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            p: 1,
          }}
        >
          {/* 左側：メモアイコン、テキスト */}
          <Box display={'flex'} alignItems={'center'}>
            <NotesIcon sx={{ mr: 1 }} />
            <Typography variant="body1">内訳</Typography>
          </Box>
          {/* 右側：追加ボタン */}
          <Button
            startIcon={<AddCircleIcon />}
            color="primary"
            onClick={onAddTransactionForm}
          >
            内訳を追加
          </Button>
        </Box>
        {/* 取引一覧 */}
        <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
          <List aria-label="取引履歴">
            <Stack spacing={2}>
              {dailyTransactions.map((transaction) => (
                <ListItem disablePadding>
                  <Card
                    sx={{
                      width: '100%',
                      backgroundColor:
                        transaction.type === 'income'
                          ? (theme) => theme.palette.incomeColor.light
                          : (theme) => theme.palette.expenseColor.light,
                    }}
                    onClick={() => onSelectTransaction(transaction)}
                  >
                    <CardActionArea>
                      <CardContent>
                        <Grid
                          container
                          spacing={{ xs: 1 }}
                          alignItems={'center'}
                          wrap="wrap"
                        >
                          {/* カテゴリ */}
                          <Grid size={{ xs: 1 }}>
                            {
                              IconComponents[
                                transaction.category
                              ] as React.ReactNode
                            }
                          </Grid>
                          <Grid size={{xs:2.5}}>
                            <Typography
                              variant='caption'
                              display={'block'}
                              gutterBottom
                            >
                              {transaction.category}
                            </Typography>
                          </Grid>
                          {/* content */}
                        </Grid>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))}
            </Stack>
          </List>
        </Box>
      </Stack>
    </Drawer>
  );
};

export default TransactionMenu;
