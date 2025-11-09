export type TransactionType = 'income' | 'expense';
export type incomeCategory = '給与' | '副収入' | '児童手当';
export type expenseCategory =
  | '食費'
  | '日用品'
  | '住居費'
  | '交際費'
  | '娯楽'
  | '交通費';

export interface Transaction {
  id: number;
  amount: number;
  type: string;
  date: string;
  category: string;
  content: string;
  // id: string;
  // date: string;
  // amount: number;
  // content: string;
  // type: TransactionType;
  // category: incomeCategory | expenseCategory;
}

export interface Balance {
  income: number,
  expense: number,
  balance: number,
}

export interface CalendarContent {
  start: string,
  income: string,
  expense: string,
  balance: string,
}
