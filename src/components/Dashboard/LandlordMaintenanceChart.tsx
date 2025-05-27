
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const maintenanceData = [
  { month: 'Jan', preventive: 45, reactive: 32, emergency: 8, totalCost: 2.8 },
  { month: 'Feb', preventive: 52, reactive: 28, emergency: 5, totalCost: 2.6 },
  { month: 'Mar', preventive: 48, reactive: 35, emergency: 12, totalCost: 3.2 },
  { month: 'Apr', preventive: 55, reactive: 31, emergency: 7, totalCost: 2.9 },
  { month: 'May', preventive: 49, reactive: 29, emergency: 4, totalCost: 2.5 },
  { month: 'Jun', preventive: 53, reactive: 33, emergency: 9, totalCost: 3.1 }
];

const chartConfig = {
  preventive: {
    label: 'Preventive',
    color: '#66BB6A'
  },
  reactive: {
    label: 'Reactive',
    color: '#FFA726'
  },
  emergency: {
    label: 'Emergency',
    color: '#FF6B6B'
  }
};

const LandlordMaintenanceChart = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Maintenance Analysis</CardTitle>
        <p className="text-sm text-gray-600">Monthly maintenance requests by type</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={maintenanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar dataKey="preventive" fill={chartConfig.preventive.color} name="Preventive" />
              <Bar dataKey="reactive" fill={chartConfig.reactive.color} name="Reactive" />
              <Bar dataKey="emergency" fill={chartConfig.emergency.color} name="Emergency" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LandlordMaintenanceChart;
