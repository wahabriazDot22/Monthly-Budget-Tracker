import React from 'react';
import { Calendar, X } from 'lucide-react';

interface SidebarProps {
  months: string[];
  selectedMonthIndex: number;
  onSelectMonth: (index: number) => void;
  availableYears: number[];
  selectedYear: number;
  onSelectYear: (year: number) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  months, 
  selectedMonthIndex, 
  onSelectMonth,
  availableYears,
  selectedYear,
  onSelectYear,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar Content */}
      <div className={`
        fixed top-0 left-0 h-full w-72 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out z-50
        flex flex-col
        md:w-64 md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-800 tracking-tight">Budget App</h1>
          </div>
          <button 
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            Select Year
          </label>
          <div className="relative">
            <select
              value={selectedYear}
              onChange={(e) => onSelectYear(parseInt(e.target.value))}
              className="block w-full pl-4 pr-8 py-2.5 text-sm font-medium border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 rounded-xl border shadow-sm text-gray-700 cursor-pointer hover:border-gray-300 transition-all"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 py-4 overflow-y-auto custom-scrollbar">
          <h2 className="px-6 text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Months
          </h2>
          <nav className="space-y-1 px-3">
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => {
                  onSelectMonth(index);
                  // Close sidebar on mobile when selection is made
                  if (window.innerWidth < 768) onClose();
                }}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                  selectedMonthIndex === index
                    ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-200'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-3 ${selectedMonthIndex === index ? 'bg-indigo-500' : 'bg-gray-300'}`}></span>
                {month}
              </button>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 bg-gray-50/30">
          <p className="text-xs text-center text-gray-400 font-medium">
            © {new Date().getFullYear()} Expense Tracker
          </p>
        </div>
      </div>
    </>
  );
};