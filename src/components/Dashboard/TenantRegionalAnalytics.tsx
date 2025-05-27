
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { MapPin, TrendingUp } from 'lucide-react';

const regionalData = [
  { month: 'Jan', mumbai: 12.5, delhi: 11.2, bangalore: 8.9, chennai: 6.1, others: 7.3 },
  { month: 'Feb', mumbai: 12.8, delhi: 11.5, bangalore: 9.1, chennai: 6.3, others: 7.5 },
  { month: 'Mar', mumbai: 13.2, delhi: 11.8, bangalore: 9.4, chennai: 6.5, others: 7.8 },
  { month: 'Apr', mumbai: 13.6, delhi: 12.1, bangalore: 9.7, chennai: 6.7, others: 8.1 },
  { month: 'May', mumbai: 14.1, delhi: 12.4, bangalore: 10.0, chennai: 6.9, others: 8.4 },
  { month: 'Jun', mumbai: 14.5, delhi: 12.8, bangalore: 10.3, chennai: 7.2, others: 8.7 }
];

const chartConfig = {
  mumbai: {
    label: 'Mumbai',
    color: '#C72030'
  },
  delhi: {
    label: 'Delhi NCR',
    color: '#FF6B6B'
  },
  bangalore: {
    label: 'Bangalore',
    color: '#4ECDC4'
  },
  chennai: {
    label: 'Chennai',
    color: '#45B7D1'
  },
  others: {
    label: 'Others',
    color: '#96CEB4'
  }
};

const TenantRegionalAnalytics = () => {
  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a] flex items-center gap-2">
          <MapPin className="h-6 w-6" />
          Regional Expense Trends
        </CardTitle>
        <p className="text-sm text-gray-600">Monthly expense breakdown by region (₹ Crores)</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="mumbai" 
                    stackId="1" 
                    stroke={chartConfig.mumbai.color} 
                    fill={chartConfig.mumbai.color} 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="delhi" 
                    stackId="1" 
                    stroke={chartConfig.delhi.color} 
                    fill={chartConfig.delhi.color} 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="bangalore" 
                    stackId="1" 
                    stroke={chartConfig.bangalore.color} 
                    fill={chartConfig.bangalore.color} 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="chennai" 
                    stackId="1" 
                    stroke={chartConfig.chennai.color} 
                    fill={chartConfig.chennai.color} 
                    fillOpacity={0.8}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="others" 
                    stackId="1" 
                    stroke={chartConfig.others.color} 
                    fill={chartConfig.others.color} 
                    fillOpacity={0.8}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>

          {/* Regional Summary */}
          <div className="space-y-4">
            <h4 className="font-semibold text-[#1a1a1a] flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Regional Performance
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Mumbai</p>
                  <p className="text-sm text-gray-600">142 properties</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+4.2%</p>
                  <p className="text-xs text-gray-500">YoY growth</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Delhi NCR</p>
                  <p className="text-sm text-gray-600">126 properties</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+3.8%</p>
                  <p className="text-xs text-gray-500">YoY growth</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Bangalore</p>
                  <p className="text-sm text-gray-600">98 properties</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+5.1%</p>
                  <p className="text-xs text-gray-500">YoY growth</p>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Others</p>
                  <p className="text-sm text-gray-600">157 properties</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+6.3%</p>
                  <p className="text-xs text-gray-500">YoY growth</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantRegionalAnalytics;
