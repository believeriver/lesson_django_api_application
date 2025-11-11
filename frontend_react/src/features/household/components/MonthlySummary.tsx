import { Card,Grid,CardContent,Typography,Stack } from "@mui/material"
import ArrowUpwardIcon  from "@mui/icons-material/ArrowUpward"
import ArrowDownwardIcon  from "@mui/icons-material/ArrowDownward"
import AccountBalanceIcon  from "@mui/icons-material/AccountBalance"

import type { Transaction } from "../types"
import { financeCalculations } from "../../utils/financeCalculations"
import { formatCurrency } from "../../utils/formatting"

interface MonthlySummaryProps {
  monthlyTransactions: Transaction[]
}

const MonthlySummary = ({monthlyTransactions}: MonthlySummaryProps) => {
  console.log('[INFO]MonthlySummary.tsx: monthlyTransactions:', monthlyTransactions)
  return (
    <div>MonthlySummary</div>
  )
}

export default MonthlySummary