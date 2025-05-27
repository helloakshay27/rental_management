
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: LucideIcon;
  color: string;
  backgroundColor?: string;
}

const StatCard = ({ title, value, change, changeType, icon: Icon, color, backgroundColor = 'bg-white' }: StatCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'warning': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card className={`${backgroundColor} border border-gray-200 hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-[#1a1a1a] mt-3">{value}</p>
            {change && (
              <p className={`text-sm mt-2 font-medium ${getChangeColor()}`}>
                {change}
              </p>
            )}
          </div>
          <div className={`p-4 rounded-xl ${color} shadow-lg`}>
            <Icon className="h-7 w-7 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
