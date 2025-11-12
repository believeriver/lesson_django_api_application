import type { Balance, Transaction } from '../household/types';

export function financeCalculations(transactions: Transaction[]): Balance {
  return transactions.reduce<Balance>(
    (acc, transaction) => {
      if (transaction.type == 'income') {
        acc.income += transaction.amount;
      } else {
        acc.expense += transaction.amount;
      }
      acc.balance = acc.income - acc.expense;
      return acc;
    },
    { income: 0, expense: 0, balance: 0 }
  );
}

//日付ごとの収支を計算する:Recode {key,value}
// {
//   "2025-12-20" : {income: 700. expense: 200, Balance: 500},
//   "2025-12-25" : {income: 700. expense: 200, Balance: 500},
// }
export function calculateDailyBalances(
  transactions: Transaction[]
): Record<string, Balance> {
  return transactions.reduce<Record<string, Balance>>((acc, transaction) => {
    const day = transaction.date;
    if (!acc[day]) {
      acc[day] = { income: 0, expense: 0, balance: 0 };
    }

    if (transaction.type === 'income') {
      acc[day].income += transaction.amount;
    } else {
      acc[day].expense += transaction.amount;
    }

    acc[day].expense = acc[day].income - acc[day].expense;
    return acc;
  }, {});
}
