import React, { useState, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TrendingUp, TrendingDown, Wallet, PlusCircle, User as UserIcon, LogOut, Menu } from 'lucide-react';
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
  onMobileMenuClick: () => void;
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
  onMobileMenuClick
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
    <div className="flex-1 min-h-screen transition-all duration-300 md:ml-64 ml-0 bg-gray-50/50">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={onSignIn}
        onSignUp={onSignUp}
        onGoogleSignIn={onGoogleSignIn}
      />

      <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
             {/* Mobile Menu Button */}
             <button 
              onClick={onMobileMenuClick}
              className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-white hover:shadow-sm rounded-lg transition-all"
            >
              <Menu size={24} />
            </button>
            
            {/* User Profile & Auth (Desktop) */}
            <div className="hidden md:flex items-center gap-4 ml-auto">
              {!user && (
                <button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors px-4 py-2 rounded-lg hover:bg-indigo-50"
                >
                  Sign In
                </button>
              )}
              
              <div className="flex items-center gap-3 bg-white p-1.5 pr-4 pl-1.5 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-all">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-700 shadow-inner">
                    <UserIcon size={18} className="stroke-[2.5]" />
                </div>
                <div className="text-right">
                    <p className="text-sm font-bold text-gray-800 leading-tight">{user ? user.name : 'Guest User'}</p>
                    <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">{user ? 'Premium' : 'Free Plan'}</p>
                </div>
                {user && (
                  <button 
                    onClick={onSignOut}
                    className="ml-2 text-gray-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 rounded-full"
                    title="Sign Out"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{monthData.name} {year}</h2>
              <p className="text-gray-500 text-sm md:text-base mt-1">Track your financial health.</p>
            </div>

            {/* Mobile User Profile Button */}
            <div className="md:hidden flex items-center justify-between bg-white p-3 rounded-xl border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                      <UserIcon size={20} />
                   </div>
                   <div>
                      <p className="font-semibold text-gray-800">{user ? user.name : 'Guest User'}</p>
                      <p className="text-xs text-gray-500">{user ? user.email : 'Sign in to save data'}</p>
                   </div>
                </div>
                {user ? (
                   <button onClick={onSignOut} className="text-gray-400 hover:text-red-500 p-2"><LogOut size={20}/></button>
                ) : (
                   <button onClick={() => setIsAuthModalOpen(true)} className="text-indigo-600 font-semibold text-sm">Sign In</button>
                )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end">
          {/* Income Column with Add Form */}
          <div className="space-y-3 order-2 md:order-1">
             <form onSubmit={handleIncomeSubmit} className="bg-white p-1.5 pl-3 rounded-xl border border-gray-200 shadow-sm flex items-center gap-2 focus-within:ring-2 focus-within:ring-indigo-500/20 focus-within:border-indigo-500 transition-all">
                <div className="relative flex-grow">
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">৳</span>
                    <input 
                        type="number" 
                        value={incomeInput}
                        onChange={(e) => setIncomeInput(e.target.value)}
                        placeholder="Add Income"
                        className="w-full pl-5 pr-2 py-2 text-sm border-none bg-transparent focus:ring-0 text-gray-900 placeholder-gray-400 font-medium"
                        min="0"
                        step="0.01"
                    />
                </div>
                <button 
                  type="submit" 
                  className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-lg transition-all shadow-sm active:scale-95"
                  title="Add to Income"
                >
                    <PlusCircle size={20} />
                </button>
             </form>

             <StatCard
                title="Total Income"
                amount={formatCurrency(monthData.income)}
                icon={TrendingUp}
                colorClass="text-emerald-600"
                bgClass="bg-emerald-50"
             />
          </div>
          
          {/* Expenses Card */}
          <div className="order-3 md:order-2">
            <StatCard
                title="Total Expenses"
                amount={formatCurrency(totalExpense)}
                icon={TrendingDown}
                colorClass="text-rose-600"
                bgClass="bg-rose-50"
            />
          </div>

          {/* Balance Card - Highlighted on Mobile */}
          <div className="order-1 md:order-3">
             <StatCard
                title="Current Balance"
                amount={formatCurrency(balance)}
                icon={Wallet}
                colorClass={balance >= 0 ? "text-indigo-600" : "text-rose-600"}
                bgClass={balance >= 0 ? "bg-indigo-50" : "bg-rose-50"}
             />
          </div>
        </div>

        {/* Days List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="p-4 md:p-6 border-b border-gray-100 bg-gray-50/30">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  Daily Transactions
                  <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {new Date(year, monthIndex).toLocaleString('default', { month: 'long' })}
                  </span>
                </h3>
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