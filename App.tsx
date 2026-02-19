import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Sidebar } from './components/Sidebar';
import { MonthView } from './components/MonthView';
import { generateMonths } from './utils';
import { MonthData, ExpenseItem, User } from './types';

const App: React.FC = () => {
  // Years configuration: includes current year + requested range
  const currentSystemYear = new Date().getFullYear();
  const availableYears = Array.from(new Set([currentSystemYear, 2026, 2027, 2028, 2029, 2030])).sort((a, b) => a - b);
  
  const [selectedYear, setSelectedYear] = useState(currentSystemYear);
  const monthsList = generateMonths(selectedYear);
  
  // State for selected month index (0 = Jan, 11 = Dec)
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(new Date().getMonth());
  
  // Main data state
  const [data, setData] = useState<Record<string, MonthData>>({});
  
  // User Auth State
  const [user, setUser] = useState<User | null>(null);

  // Initialize data on load or when year changes
  useEffect(() => {
    const savedData = localStorage.getItem(`budget-app-data-${selectedYear}`);
    if (savedData) {
      setData(JSON.parse(savedData));
    } else {
      // Initialize empty structure for all months of the selected year
      const initialData: Record<string, MonthData> = {};
      monthsList.forEach((name, index) => {
        const id = `${selectedYear}-${String(index + 1).padStart(2, '0')}`;
        initialData[id] = {
          id,
          name,
          year: selectedYear,
          income: 0,
          days: {},
        };
      });
      setData(initialData);
    }
  }, [selectedYear]);

  // Load User Session
  useEffect(() => {
    const savedUser = localStorage.getItem('budget-app-session');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save to local storage whenever data changes
  useEffect(() => {
    const dataKeys = Object.keys(data);
    if (dataKeys.length > 0) {
      const firstKey = dataKeys[0]; 
      if (firstKey.startsWith(String(selectedYear))) {
        localStorage.setItem(`budget-app-data-${selectedYear}`, JSON.stringify(data));
      }
    }
  }, [data, selectedYear]);

  // Auth Handlers
  const handleSignIn = (email: string, pass: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('budget-app-users') || '{}');
    const userRecord = storedUsers[email];
    
    if (userRecord && userRecord.password === pass) {
      const newUser = { name: userRecord.name, email: email };
      setUser(newUser);
      localStorage.setItem('budget-app-session', JSON.stringify(newUser));
      return true;
    }
    return false;
  };

  const handleSignUp = (name: string, email: string, pass: string): boolean => {
    const storedUsers = JSON.parse(localStorage.getItem('budget-app-users') || '{}');
    if (storedUsers[email]) {
      return false; // User exists
    }
    
    // Save new user
    storedUsers[email] = { name, password: pass };
    localStorage.setItem('budget-app-users', JSON.stringify(storedUsers));
    
    // Auto login
    const newUser = { name, email };
    setUser(newUser);
    localStorage.setItem('budget-app-session', JSON.stringify(newUser));
    return true;
  };

  const handleGoogleSignIn = () => {
    // Mock Google Sign In
    const mockUser = {
      name: "Google User",
      email: "user@gmail.com"
    };
    setUser(mockUser);
    localStorage.setItem('budget-app-session', JSON.stringify(mockUser));
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('budget-app-session');
  };

  const currentMonthId = `${selectedYear}-${String(selectedMonthIndex + 1).padStart(2, '0')}`;
  const currentMonthData = data[currentMonthId];

  const handleUpdateIncome = (newTotalIncome: number) => {
    setData((prev) => ({
      ...prev,
      [currentMonthId]: {
        ...prev[currentMonthId],
        income: newTotalIncome,
      },
    }));
  };

  const handleAddExpense = (date: string, description: string, amount: number) => {
    const newItem: ExpenseItem = {
      id: uuidv4(),
      description,
      amount,
    };

    setData((prev) => {
      const monthData = prev[currentMonthId];
      const existingDayExpenses = monthData.days[date] || [];
      
      return {
        ...prev,
        [currentMonthId]: {
          ...monthData,
          days: {
            ...monthData.days,
            [date]: [...existingDayExpenses, newItem],
          },
        },
      };
    });
  };

  const handleRemoveExpense = (date: string, id: string) => {
    setData((prev) => {
      const monthData = prev[currentMonthId];
      const existingDayExpenses = monthData.days[date] || [];
      
      return {
        ...prev,
        [currentMonthId]: {
          ...monthData,
          days: {
            ...monthData.days,
            [date]: existingDayExpenses.filter((item) => item.id !== id),
          },
        },
      };
    });
  };

  if (!currentMonthData) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 w-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-2 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar
        months={monthsList}
        selectedMonthIndex={selectedMonthIndex}
        onSelectMonth={setSelectedMonthIndex}
        availableYears={availableYears}
        selectedYear={selectedYear}
        onSelectYear={setSelectedYear}
      />
      <MonthView
        monthData={currentMonthData}
        monthIndex={selectedMonthIndex}
        year={selectedYear}
        user={user}
        onUpdateIncome={handleUpdateIncome}
        onAddExpense={handleAddExpense}
        onRemoveExpense={handleRemoveExpense}
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        onGoogleSignIn={handleGoogleSignIn}
        onSignOut={handleSignOut}
      />
    </div>
  );
};

export default App;