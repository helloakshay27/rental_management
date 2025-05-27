
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ComposedChart, Bar, Line, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const rentRollData = [
  { month: 'Jan', collections: 98.2, escalations: 12, newLeases: 3, renewals: 8 },
  { month: 'Feb', collections: 97.8, escalations: 8, newLeases: 5, renewals: 12 },
  { month: 'Mar', collections: 99.1, escalations: 15, newLeases: 2, renewals: 6 },
  { month: 'Apr', collections: 98.5, escalations: 10, newLeases: 7, renewals: 14 },
  { month: 'May', collections: 99.3, escalations: 18, newLeases: 4, renewals: 9 },
  { month: 'Jun', collections: 98.9, escalations: 22, newLeases: 6, renewals: 11 }
];

const chartConfig = {
  collections: {
    label: 'Collection Rate (%)',
    color: '#C72030'
  },
  escalations: {
    label: 'Escalations',
    color: '#45B7D1'
  },
  newLeases: {
    label: 'New Leases',
    color: '#66BB6A'
  },
  renewals: {
    label: 'Renewals',
    color: '#FFA726'
  }
};

const LandlordRentRollChart = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Rent Roll Performance</CardTitle>
        <p className="text-sm text-gray-600">Collection rates and lease activity</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={rentRollData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar yAxisId="left" dataKey="escalations" fill={chartConfig.escalations.color} name="Escalations" />
              <Bar yAxisId="left" dataKey="newLeases" fill={chartConfig.newLeases.color} name="New Leases" />
              <Bar yAxisId="left" dataKey="renewals" fill={chartConfig.renewals.color} name="Renewals" />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="collections" 
                stroke={chartConfig.collections.color} 
                strokeWidth={3}
                name="Collection Rate (%)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LandlordRentRollChart;
