
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const data = [
  { month: 'Jan', income: 45000, expense: 32000 },
  { month: 'Feb', income: 52000, expense: 28000 },
  { month: 'Mar', income: 48000, expense: 35000 },
  { month: 'Apr', income: 55000, expense: 31000 },
  { month: 'May', income: 49000, expense: 29000 },
  { month: 'Jun', income: 58000, expense: 33000 },
];

const IncomeExpenseChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Income vs Expense Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, '']} />
            <Legend />
            <Bar dataKey="income" fill="#3b82f6" name="Income" />
            <Bar dataKey="expense" fill="#ef4444" name="Expense" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default IncomeExpenseChart;
