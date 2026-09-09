
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';
import { ANALYTICS_PALETTE } from '@/styles/chartPalette';

const chartConfig = {
  rentExpense: {
    label: 'Rent Expense',
    color: ANALYTICS_PALETTE[0]
  },
  utilities: {
    label: 'Utilities',
    color: ANALYTICS_PALETTE[1]
  },
  maintenance: {
    label: 'Maintenance',
    color: ANALYTICS_PALETTE[2]
  },
  totalCost: {
    label: 'Total Cost',
    color: ANALYTICS_PALETTE[3]
  }
};

interface ExpenseAnalysisData {
  month?: string;
  breakdown?: {
    rent?: { amount_in_cr?: string | number };
    maintenance?: { amount_in_lakh?: string | number };
    utilities?: { amount_in_lakh?: string | number };
  };
  total?: { amount_in_cr?: string | number };
}

const TenantIncomeExpenseChart = ({ data }: { data?: ExpenseAnalysisData }) => {
  const chartData = data ? [
    {
      month: data.month?.split(' ')[0] || 'Current',
      rentExpense: parseFloat(data.breakdown?.rent?.amount_in_cr?.toString() || '0'),
      utilities: parseFloat(data.breakdown?.utilities?.amount_in_lakh?.toString() || '0'),
      maintenance: parseFloat(data.breakdown?.maintenance?.amount_in_lakh?.toString() || '0'),
    }
  ] : [
    { month: 'Jan', rentExpense: 0, utilities: 0, maintenance: 0 },
  ];

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-brand-body-1 font-bold text-[#1a1a1a]">Monthly Expense Analysis</CardTitle>
        <p className="text-sm text-gray-600">Breakdown of property-related expenses (₹ Crores/Lakhs)</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Bar dataKey="rentExpense" fill={chartConfig.rentExpense.color} name="Rent (Cr)" />
            <Bar dataKey="utilities" fill={chartConfig.utilities.color} name="Utilities (L)" />
            <Bar dataKey="maintenance" fill={chartConfig.maintenance.color} name="Maintenance (L)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TenantIncomeExpenseChart;
