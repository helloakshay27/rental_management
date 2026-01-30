
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

const chartConfig = {
  count: {
    label: 'Properties'
  }
};

interface LeaseExpiryData {
  '0_3_months'?: number;
  '3_6_months'?: number;
  '6_12_months'?: number;
  'above_12'?: number;
}

const TenantLeaseExpiryChart = ({ data }: { data?: LeaseExpiryData }) => {
  const leaseData = [
    { category: '0-3 months', count: data?.['0_3_months'] || 0 },
    { category: '3-6 months', count: data?.['3_6_months'] || 0 },
    { category: '6-12 months', count: data?.['6_12_months'] || 0 },
    { category: 'Above 12 months', count: data?.['above_12'] || 0 },
  ];

  const total = leaseData.reduce((sum, item) => sum + item.count, 0);

  // Calculate percentages for labels
  const dataWithPercentages = leaseData.map(item => ({
    ...item,
    percentage: total > 0 ? Math.round((item.count / total) * 100) : 0
  }));

  const COLORS = ['#FF6B6B', '#FFA726', '#FFEB3B', '#66BB6A'];

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
                data={dataWithPercentages}
                cx="50%"
                cy="50%"
                outerRadius={120}
                fill="#8884d8"
                dataKey="count"
                label={({ percentage }) => percentage > 0 ? `${percentage}%` : ''}
              >
                {dataWithPercentages.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value, name) => [`${value} properties`, name]}
              />
              <Legend
                formatter={(value, entry) => {
                  const item = dataWithPercentages.find(d => d.category === value);
                  return item ? `${item.category}: ${item.count} properties` : value;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default TenantLeaseExpiryChart;
