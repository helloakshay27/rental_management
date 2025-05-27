
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const leaseData = [
  { category: '0-6 months', count: 15, percentage: 3 },
  { category: '6-12 months', count: 42, percentage: 8 },
  { category: '1-2 years', count: 128, percentage: 25 },
  { category: '2-5 years', count: 189, percentage: 36 },
  { category: '5+ years', count: 149, percentage: 28 }
];

const COLORS = ['#FF6B6B', '#FFA726', '#FFEB3B', '#66BB6A', '#42A5F5'];

const chartConfig = {
  count: {
    label: 'Properties'
  }
};

const TenantLeaseExpiryChart = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Lease Expiry Distribution</CardTitle>
        <p className="text-sm text-gray-600">Portfolio breakdown by remaining lease duration</p>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={leaseData}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                label={({ percentage }) => `${percentage}%`}
              >
                {leaseData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip 
                content={<ChartTooltipContent />}
                formatter={(value, name) => [`${value} properties`, name]}
              />
              <Legend 
                formatter={(value, entry) => `${entry.payload.category}: ${entry.payload.count} properties`}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TenantLeaseExpiryChart;
