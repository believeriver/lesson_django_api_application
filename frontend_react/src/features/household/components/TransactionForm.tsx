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

import CloseIcon from '@mui/icons-material/Close'
import FastfoodIcon from '@mui/icons-material/Fastfood'
import addHomeIcon from '@mui/icons-material/AddHome'
import AlarmIcon from '@mui/icons-material/Alarm'
import Diversity3Icon from "@mui/icons-material/Diversity3";
import SportsTennisIcon from "@mui/icons-material/SportsTennis";
import TrainIcon from "@mui/icons-material/Train";
import WorkIcon from "@mui/icons-material/Work";
import SavingsIcon from "@mui/icons-material/Savings";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";

import {Controller,useForm} from 'react-hook-form'
import type { SubmitHandler } from 'react-hook-form';
import  type { JSX } from '@fullcalendar/core/preact.js';
import { zodResolver} from '@hookform/resolvers/zod'

import type { expenseCategory, incomeCategory, Transaction } from '../types';

const TransactionForm = () => {
  return <div>TransactionForm</div>;
};

export default TransactionForm;
