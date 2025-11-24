import React from 'react'
import { Box, Button } from '@mui/material'
import { DatePicker, LocalizationProvider} from '@mui/x-date-pickers'
import { AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns'
import { addMonths } from 'date-fns'
import { ja } from 'date-fns/locale'


interface MonthSelectorProps {
  currentMonth: Date
  setCurrentMonth: React.Dispatch<React.SetStateAction<Date>>
}

const MonthSelector = ({
  currentMonth,
  setCurrentMonth,
}: MonthSelectorProps) => {
  console.log('[INFO]: currentMonth in MonthSelector :',currentMonth)
  return (
    <div>MonthSelector</div>
  )
}

export default MonthSelector