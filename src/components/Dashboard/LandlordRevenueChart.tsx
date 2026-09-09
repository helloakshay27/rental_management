
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, Legend } from 'recharts';

const revenueData = [
  { month: 'Jan', actualRevenue: 2.4, projectedRevenue: 2.2, previousYear: 2.1 },
  { month: 'Feb', actualRevenue: 2.6, projectedRevenue: 2.3, previousYear: 2.2 },
  { month: 'Mar', actualRevenue: 2.8, projectedRevenue: 2.5, previousYear: 2.3 },
  { month: 'Apr', actualRevenue: 2.7, projectedRevenue: 2.6, previousYear: 2.4 },
  { month: 'May', actualRevenue: 2.9, projectedRevenue: 2.7, previousYear: 2.5 },
  { month: 'Jun', actualRevenue: 2.8, projectedRevenue: 2.8, previousYear: 2.6 }
];

const chartConfig = {
  actualRevenue: {
    label: 'Actual Revenue',
    color: '#DA7756'
  },
  projectedRevenue: {
    label: 'Projected Revenue',
    color: '#76CDC1'
  },
  previousYear: {
    label: 'Previous Year',
    color: '#888780'
  }
};

const LandlordRevenueChart = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-brand-body-1 font-bold text-[#1a1a1a]">Revenue Performance</CardTitle>
        <p className="text-sm text-gray-600">Monthly revenue trends vs projections (₹ Crores)</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <LineChart data={revenueData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="month" />
            <YAxis />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="actualRevenue" 
              stroke={chartConfig.actualRevenue.color} 
              strokeWidth={3}
              name="Actual Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="projectedRevenue" 
              stroke={chartConfig.projectedRevenue.color} 
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Projected Revenue"
            />
            <Line 
              type="monotone" 
              dataKey="previousYear" 
              stroke={chartConfig.previousYear.color} 
              strokeWidth={2}
              name="Previous Year"
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LandlordRevenueChart;
