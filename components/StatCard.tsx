import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, amount, icon: Icon, colorClass, bgClass }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4">
      <div className={`p-4 rounded-full ${bgClass}`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className={`text-2xl font-bold ${colorClass}`}>{amount}</h3>
      </div>
    </div>
  );
};
