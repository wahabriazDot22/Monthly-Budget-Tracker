import React from 'react';
import { Calendar } from 'lucide-react';

interface SidebarProps {
  months: string[];
  selectedMonthIndex: number;
  onSelectMonth: (index: number) => void;
  availableYears: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  months, 
  selectedMonthIndex, 
  onSelectMonth,
  availableYears,
  selectedYear,
  onSelectYear
}) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 flex items-center gap-3 border-b border-gray-100">
        <div className="bg-indigo-600 p-2 rounded-lg">
          <Calendar className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">Budget App</h1>
      </div>

      <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 block">
          Year
        </label>
        <div className="relative">
          <select
            value={selectedYear}
            onChange={(e) => onSelectYear(parseInt(e.target.value))}
            className="block w-full pl-3 pr-8 py-2 text-sm border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-md border shadow-sm text-gray-700 cursor-pointer hover:border-gray-300 transition-colors"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 py-4">
        <h2 className="px-6 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
          Select Month
        </h2>
        <nav className="space-y-1 px-3">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => onSelectMonth(index)}
              className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors duration-150 ${
                selectedMonthIndex === index
                  ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent'
              }`}
            >
              {month}
            </button>
          ))}
        </nav>
      </div>
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-center text-gray-400">
          © {new Date().getFullYear()} Expense Tracker
        </p>
      </div>
    </div>
  );
};