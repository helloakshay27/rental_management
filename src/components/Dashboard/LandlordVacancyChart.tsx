
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';

const vacancyData = [
  { month: 'Jan', vacancyRate: 8.2, averageMarket: 12.5, targetRate: 5.0 },
  { month: 'Feb', vacancyRate: 7.8, averageMarket: 11.8, targetRate: 5.0 },
  { month: 'Mar', vacancyRate: 6.5, averageMarket: 11.2, targetRate: 5.0 },
  { month: 'Apr', vacancyRate: 5.9, averageMarket: 10.8, targetRate: 5.0 },
  { month: 'May', vacancyRate: 5.8, averageMarket: 10.5, targetRate: 5.0 },
  { month: 'Jun', vacancyRate: 5.8, averageMarket: 10.2, targetRate: 5.0 }
];

const chartConfig = {
  vacancyRate: {
    label: 'Our Vacancy Rate',
    color: '#FF6B6B'
  },
  averageMarket: {
    label: 'Market Average',
    color: '#FFA726'
  },
  targetRate: {
    label: 'Target Rate',
    color: '#66BB6A'
  }
};

const LandlordVacancyChart = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Vacancy Rate Analysis</CardTitle>
        <p className="text-sm text-gray-600">Vacancy trends vs market benchmarks (%)</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={vacancyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="month" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="averageMarket" 
                stackId="1" 
                stroke={chartConfig.averageMarket.color} 
                fill={chartConfig.averageMarket.color}
                fillOpacity={0.3}
                name="Market Average"
              />
              <Area 
                type="monotone" 
                dataKey="vacancyRate" 
                stackId="2" 
                stroke={chartConfig.vacancyRate.color} 
                fill={chartConfig.vacancyRate.color}
                fillOpacity={0.6}
                name="Our Vacancy Rate"
              />
              <Area 
                type="monotone" 
                dataKey="targetRate" 
                stackId="3" 
                stroke={chartConfig.targetRate.color} 
                fill={chartConfig.targetRate.color}
                fillOpacity={0.4}
                name="Target Rate"
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default LandlordVacancyChart;
