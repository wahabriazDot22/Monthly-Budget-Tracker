import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TrendingUp, TrendingDown, Wallet, PlusCircle, User as UserIcon, LogOut } from 'lucide-react';
import { MonthData, User } from '../types';
import { getDaysInMonth, formatCurrency, calculateMonthlyExpense } from '../utils';
import { StatCard } from './StatCard';
import { DayRow } from './DayRow';
import { AuthModal } from './AuthModal';

interface MonthViewProps {
  monthData: MonthData;
  monthIndex: number;
  year: number;
  user: User | null;
  onUpdateIncome: (amount: number) => void;
  onAddExpense: (date: string, description: string, amount: number) => void;
  onRemoveExpense: (date: string, id: string) => void;
  onSignIn: (email: string, pass: string) => boolean;
  onSignUp: (name: string, email: string, pass: string) => boolean;
  onGoogleSignIn: () => void;
  onSignOut: () => void;
}

export const MonthView: React.FC<MonthViewProps> = ({
  monthData,
  monthIndex,
  year,
  user,
  onUpdateIncome,
  onAddExpense,
  onRemoveExpense,
  onSignIn,
  onSignUp,
  onGoogleSignIn,
  onSignOut,
}) => {
  const [incomeInput, setIncomeInput] = useState('');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Generate all days for this month
  const daysInMonth = useMemo(() => getDaysInMonth(year, monthIndex), [year, monthIndex]);

  // Calculate totals
  const totalExpense = calculateMonthlyExpense(monthData.days);
  const balance = monthData.income - totalExpense;

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(incomeInput);
    if (!isNaN(amount) && amount >= 0) {
        // We add to existing income
        onUpdateIncome(monthData.income + amount);
        setIncomeInput('');
    }
  };

  return (
    <div className="flex-1 p-8 ml-64 min-h-screen">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onGoogleSignIn={onGoogleSignIn}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{monthData.name} {year}</h2>
            <p className="text-gray-500 mt-1">Manage your monthly finances effectively.</p>
          </div>
          
          {/* User Profile & Auth */}
          <div className="flex items-center gap-4">
            {!user && (
              <button 
                onClick={() => setIsAuthModalOpen(true)}
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50"
              >
                Sign In
              </button>
            )}
            
            <div className="flex items-center gap-3 bg-white p-2 pr-4 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 shadow-inner">
                  <UserIcon size={20} className="stroke-[2.5]" />
              </div>
              <div className="hidden md:block text-right">
                  <p className="text-sm font-semibold text-gray-700">{user ? user.name : 'Guest User'}</p>
                  <p className="text-xs text-gray-500">{user ? user.email : 'Free Account'}</p>
              </div>
              {user && (
                <button 
                  onClick={onSignOut}
                  className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          {/* Income Column with Add Form */}
          <div className="space-y-3">
             <form onSubmit={handleIncomeSubmit} className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2">
                <div className="relative flex-grow">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">৳</span>
                    <input 
                        type="number" 
                        value={incomeInput}
                        onChange={(e) => setIncomeInput(e.target.value)}
                        placeholder="Add Income"
                        className="w-full pl-8 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 transition-all"
                        min="0"
                        step="0.01"
                    />
                </div>
                <button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 text-white p-2 rounded-lg transition-colors shadow-sm active:scale-95"
                  title="Add to Income"
                >
                    <PlusCircle size={20} />
                </button>
             </form>

             <StatCard
                title="Total Income"
                amount={formatCurrency(monthData.income)}
                icon={TrendingUp}
                colorClass="text-green-600"
                bgClass="bg-green-50"
             />
          </div>
          
          {/* Expenses Card */}
          <StatCard
            title="Total Expenses"
            amount={formatCurrency(totalExpense)}
            icon={TrendingDown}
            colorClass="text-red-600"
            bgClass="bg-red-50"
          />

          {/* Balance Card */}
          <StatCard
            title="Current Balance"
            amount={formatCurrency(balance)}
            icon={Wallet}
            colorClass={balance >= 0 ? "text-indigo-600" : "text-red-600"}
            bgClass="bg-indigo-50"
          />
        </div>

        {/* Days List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col">
            <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800">Daily Breakdown</h3>
            </div>
            <div className="divide-y divide-gray-100">
            {daysInMonth.map((date) => (
                <DayRow
                key={date}
                date={date}
                expenses={monthData.days[date] || []}
                onAddExpense={(desc, amount) => onAddExpense(date, desc, amount)}
                onRemoveExpense={(id) => onRemoveExpense(date, id)}
                />
            ))}
            </div>
        </div>
      </div>
    </div>
  );
};