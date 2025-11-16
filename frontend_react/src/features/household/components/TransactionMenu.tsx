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
import NotesIcon from '@mui/icons-material/Notes'
import { AddCircle } from '@mui/icons-material';

import type { Transaction } from '../types';
import { formatCurrency } from '../../utils/formatting';
import IconComponents from './common/IconComponents';

import { fetchAsyncAddHouseholdTransaction } from '../householdSlice';

interface TransactionMenuProps {
  dailyTransactions: Transaction[]
  currentDay: string;
  onSelectTransaction: (transaction: Transaction) => void
  isMobile: boolean,
  open: boolean
  onClose: () => void
}

const TransactionMenu = ({
  dailyTransactions,
  currentDay,
  onSelectTransaction,
  isMobile,
  open,
  onClose
}: TransactionMenuProps) => {
  const menuDrawerWidth = 320
  console.log('[INFO] open in TransactionMenu.tsx', open)
  return (
    <Drawer 
      sx={{
        width: isMobile ? 'auto': menuDrawerWidth,
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
          })
        },
      }}
      variant={isMobile ? 'temporary': 'permanent'}
      anchor={isMobile ? 'bottom': 'right'}
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true
      }}
    >
      Drawer Content
    </Drawer>
  );
};

export default TransactionMenu;
