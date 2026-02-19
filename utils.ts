import { MonthData, ExpenseItem } from './types';

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD', // Changed to USD for generic appeal, could be BDT based on prompt language but USD/Generic is safer. 
    minimumFractionDigits: 2,
  }).format(amount).replace('$', '৳'); // Using Taka symbol as requested implicitly by context, or generic currency. Let's use Taka (৳) since the user prompted in Bengali.
};

export const generateMonths = (year: number): string[] => {
  const months = [];
  for (let i = 0; i < 12; i++) {
    const date = new Date(year, i, 1);
    months.push(date.toLocaleString('default', { month: 'long' }));
  }
  return months;
};

export const getDaysInMonth = (year: number, monthIndex: number): string[] => {
  const date = new Date(year, monthIndex, 1);
  const days = [];
  while (date.getMonth() === monthIndex) {
    const yearStr = date.getFullYear();
    const monthStr = String(date.getMonth() + 1).padStart(2, '0');
    const dayStr = String(date.getDate()).padStart(2, '0');
    days.push(`${yearStr}-${monthStr}-${dayStr}`);
    date.setDate(date.getDate() + 1);
  }
  return days;
};

export const calculateDailyTotal = (items: ExpenseItem[] | undefined): number => {
  if (!items) return 0;
  return items.reduce((acc, item) => acc + item.amount, 0);
};

export const calculateMonthlyExpense = (days: Record<string, ExpenseItem[]>): number => {
  let total = 0;
  Object.values(days).forEach((items) => {
    total += calculateDailyTotal(items);
  });
  return total;
};