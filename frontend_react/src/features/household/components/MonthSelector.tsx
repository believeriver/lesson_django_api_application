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
  //日付の選択が変わった時
  const handleDateChange = (newDate: Date | null) => {
    if(newDate){
      setCurrentMonth(newDate)
    }
  }
  console.log('[INFO]: currentMonth in MonthSelector :',currentMonth)

  //先月ボタンを押した時の処理
  const handlePreviousMonth = () => {
    const previousMonth = addMonths(currentMonth, -1)
    setCurrentMonth(previousMonth)
  }
  //次月ボタンを押した時の処理
  const handleNextMonth = () => {
    const nextMonth = addMonths(currentMonth, 1)
    setCurrentMonth(nextMonth)
  }
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ja}
    >
      <Box
        sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}
      >
        <Button
          onClick={handlePreviousMonth}
          color='error'
          variant='contained'
        >
          先月
        </Button>
        <DatePicker 
          onChange={handleDateChange}
          value={currentMonth}
          label='年月を選択'
          sx={{ mx: 2, background: 'white'}}
          views={['year', 'month']}
          format='yyyy/MM'
          slotProps={{
            toolbar: {
              toolbarFormat: 'yyyy年MM月'
            },
            calendarHeader: {
              format: 'yyyy年MM月'
            },
          }}
        />
        <Button
          onClick={handleNextMonth}
          color='primary'
          variant='contained'
        >
          次月
        </Button>
      </Box>
    </LocalizationProvider>
  )
}

export default MonthSelector