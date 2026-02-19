import React, { useState, useMemo } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, Tag, FileText, Banknote } from 'lucide-react';
import { ExpenseItem } from '../types';
import { formatCurrency, calculateDailyTotal } from '../utils';

interface DayRowProps {
  date: string;
  expenses: ExpenseItem[];
  onAddExpense: (description: string, amount: number) => void;
  onRemoveExpense: (id: string) => void;
}

export const DayRow: React.FC<DayRowProps> = ({ date, expenses, onAddExpense, onRemoveExpense }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newDesc, setNewDesc] = useState('');
  const [newAmount, setNewAmount] = useState('');

  // Parse date string (YYYY-MM-DD) as local date to ensure consistent display across timezones
  const [year, month, day] = date.split('-').map(Number);
  const dateObj = new Date(year, month - 1, day);

  const formattedDate = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const dailyTotal = useMemo(() => calculateDailyTotal(expenses), [expenses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDesc || !newAmount) return;
    const amount = parseFloat(newAmount);
    if (isNaN(amount) || amount <= 0) return;

    onAddExpense(newDesc, amount);
    setNewDesc('');
    setNewAmount('');
  };

  return (
    <div className="border border-gray-200 rounded-lg bg-white overflow-hidden transition-all duration-200 shadow-sm hover:shadow-md">
      <div
        className={`flex items-center justify-between p-4 cursor-pointer transition-colors ${
          isOpen ? 'bg-gray-50' : 'bg-white'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center space-x-3">
          <div className="text-gray-400">
            {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-gray-800">{formattedDate}</span>
            <span className="text-xs text-gray-500">
              {expenses.length} transaction{expenses.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
            <span className="text-xs text-gray-500 uppercase font-medium">Total</span>
            <span className={`font-bold text-lg ${dailyTotal > 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {formatCurrency(dailyTotal)}
            </span>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          {/* List of expenses */}
          {expenses.length > 0 && (
            <div className="space-y-2 mb-4">
              {expenses.map((item) => (
                <div key={item.id} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-100 p-2 rounded-full">
                        <Tag size={14} className="text-gray-500" />
                    </div>
                    <span className="text-gray-700 font-medium">{item.description}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-red-600 font-bold bg-red-50 px-2 py-1 rounded text-sm">{formatCurrency(item.amount)}</span>
                    <button
                      onClick={() => onRemoveExpense(item.id)}
                      className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 transition-all"
                      title="Remove"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add new expense form */}
          <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-3 items-stretch">
                <div className="relative flex-grow group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FileText size={16} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Expense description..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                    />
                </div>
                
                <div className="relative w-full sm:w-40 group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Banknote size={16} className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
                    </div>
                    <input
                        type="number"
                        placeholder="Amount"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-500"
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        min="0"
                        step="0.01"
                    />
                </div>

                <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 flex items-center justify-center gap-2 text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all"
                >
                <Plus size={18} />
                Add
                </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};