
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const chartData = [
  { month: 'Jan', rentExpense: 38.5, utilities: 4.2, maintenance: 2.1, totalCost: 44.8 },
  { month: 'Feb', rentExpense: 39.1, utilities: 3.8, maintenance: 1.9, totalCost: 44.8 },
  { month: 'Mar', rentExpense: 40.2, utilities: 4.5, maintenance: 3.2, totalCost: 47.9 },
  { month: 'Apr', rentExpense: 41.8, utilities: 4.1, maintenance: 2.8, totalCost: 48.7 },
  { month: 'May', rentExpense: 42.3, utilities: 4.7, maintenance: 2.5, totalCost: 49.5 },
  { month: 'Jun', rentExpense: 42.8, utilities: 4.3, maintenance: 3.1, totalCost: 50.2 }
];

const chartConfig = {
  rentExpense: {
    label: 'Rent Expense',
    color: '#C72030'
  },
  utilities: {
    label: 'Utilities',
    color: '#FF6B6B'
  },
  maintenance: {
    label: 'Maintenance',
    color: '#4ECDC4'
  },
  totalCost: {
    label: 'Total Cost',
    color: '#45B7D1'
  }
};

const TenantIncomeExpenseChart = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Monthly Expense Analysis</CardTitle>
        <p className="text-sm text-gray-600">Breakdown of property-related expenses (₹ Crores)</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="rentExpense" fill={chartConfig.rentExpense.color} name="Rent Expense" />
              <Bar dataKey="utilities" fill={chartConfig.utilities.color} name="Utilities" />
              <Bar dataKey="maintenance" fill={chartConfig.maintenance.color} name="Maintenance" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TenantIncomeExpenseChart;
