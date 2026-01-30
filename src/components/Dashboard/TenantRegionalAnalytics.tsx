
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Legend } from 'recharts';
import { MapPin, TrendingUp, Loader2, Clock, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const regionalData = [
  { month: 'Jan', mumbai: 12.5, delhi: 11.2, bangalore: 8.9, chennai: 6.1, others: 7.3 },
  { month: 'Feb', mumbai: 12.8, delhi: 11.5, bangalore: 9.1, chennai: 6.3, others: 7.5 },
  { month: 'Mar', mumbai: 13.2, delhi: 11.8, bangalore: 9.4, chennai: 6.5, others: 7.8 },
  { month: 'Apr', mumbai: 13.6, delhi: 12.1, bangalore: 9.7, chennai: 6.7, others: 8.1 },
  { month: 'May', mumbai: 14.1, delhi: 12.4, bangalore: 10.0, chennai: 6.9, others: 8.4 },
  { month: 'Jun', mumbai: 14.5, delhi: 12.8, bangalore: 10.3, chennai: 7.2, others: 8.7 }
];

const COLORS = ['#C72030', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFA726', '#BDC3C7'];

const TenantRegionalAnalytics = ({ data, loading }: { data: any, loading: boolean }) => {
  // Transform API data structure to Recharts format
  const months = data?.regional_expense_trends?.months || [];
  const series = data?.regional_expense_trends?.series || [];

  const regionalData = months.length > 0 ? months.map((month: string, index: number) => {
    const entry: any = { month };
    series.forEach((s: any) => {
      entry[s.city] = parseFloat(s.values[index]) || 0;
    });
    return entry;
  }) : [];

  const regionalPerformance = data?.regional_performance || [];

  // Dynamic Chart Config
  const chartConfig: any = {};
  series.forEach((s: any, index: number) => {
    chartConfig[s.city] = {
      label: s.city.charAt(0).toUpperCase() + s.city.slice(1),
      color: COLORS[index % COLORS.length]
    };
  });

  const recentActivity = data?.recent_activity || [];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

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
                  {Object.keys(chartConfig).map((cityKey) => (
                    <Area
                      key={cityKey}
                      type="monotone"
                      dataKey={cityKey}
                      stackId="1"
                      stroke={chartConfig[cityKey].color}
                      fill={chartConfig[cityKey].color}
                      fillOpacity={0.8}
                    />
                  ))}
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
              {regionalPerformance.map((region: any, index: number) => {
                const growthVal = parseFloat(region.yoy_growth?.toString() || '0');
                const growthStr = growthVal >= 0 ? `+${growthVal.toFixed(1)}%` : `${growthVal.toFixed(1)}%`;

                return (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{region.city}</p>
                      <p className="text-sm text-gray-600">{region.properties} properties</p>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${growthVal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {growthStr}
                      </p>
                      <p className="text-xs text-gray-500">YoY growth</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Activity Section */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h4 className="font-semibold text-[#1a1a1a] flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4" />
            Recent Regional Activity
          </h4>
          <div className="space-y-4">
            {recentActivity.map((activity: any, index: number) => (
              <div key={index} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex gap-4">
                  <div className={`mt-1 p-2 rounded-full ${activity.status === 'success' ? 'bg-green-100' : 'bg-gray-100'}`}>
                    <CheckCircle className={`h-4 w-4 ${activity.status === 'success' ? 'text-green-600' : 'text-gray-400'}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <MapPin className="h-3 w-3" />
                      {activity.city} • {activity.time_ago}
                    </p>
                  </div>
                </div>
                {activity.status && (
                  <Badge className={`${activity.status === 'success' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {activity.status}
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TenantRegionalAnalytics;
