export interface ExpenseItem {
  id: string;
  description: string;
  amount: number;
}

export interface DayData {
  date: string; // ISO Date String YYYY-MM-DD
  items: ExpenseItem[];
}

export interface MonthData {
  id: string; // YYYY-MM format
  name: string;
  year: number;
  income: number;
  // We map specific dates (YYYY-MM-DD) to their data
  days: Record<string, ExpenseItem[]>; 
}

export interface User {
  name: string;
  email: string;
}

export interface AppState {
  months: Record<string, MonthData>;
}