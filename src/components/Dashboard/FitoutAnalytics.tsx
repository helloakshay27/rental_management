
import React from 'react';
import { StatsGrid } from '@/components/ui/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, Legend, PieChart, Pie, Cell } from 'recharts';
import { Building, Clock, DollarSign, TrendingDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const fitoutData = [
  { property: 'Mumbai Corporate Tower', fitoutCost: 2500000, lockinMonths: 36, monthsRemaining: 18, tenant: 'TechCorp Solutions' },
  { property: 'Delhi Business Park', fitoutCost: 1800000, lockinMonths: 24, monthsRemaining: 8, tenant: 'Global Industries' },
  { property: 'Bangalore Tech Hub', fitoutCost: 3200000, lockinMonths: 48, monthsRemaining: 32, tenant: 'Innovation Labs' },
  { property: 'Chennai IT Center', fitoutCost: 1500000, lockinMonths: 30, monthsRemaining: 6, tenant: 'DataFlow Inc' },
  { property: 'Pune Commercial', fitoutCost: 2100000, lockinMonths: 36, monthsRemaining: 24, tenant: 'Enterprise Solutions' }
];

const lockinStatusData = [
  { status: 'High Risk (< 6 months)', count: 12, percentage: 15, color: '#E7848E' },
  { status: 'Medium Risk (6-12 months)', count: 18, percentage: 22, color: '#EDC488' },
  { status: 'Safe (12-24 months)', count: 28, percentage: 35, color: '#CECBF6' },
  { status: 'Very Safe (24+ months)', count: 22, percentage: 28, color: '#798C5E' }
];

const chartConfig = {
  fitoutCost: {
    label: 'Fitout Cost (₹)',
    color: '#DA7756'
  },
  monthsRemaining: {
    label: 'Months Remaining',
    color: '#798C5E'
  }
};

const FitoutAnalytics = () => {
  const totalFitoutInvestment = fitoutData.reduce((sum, item) => sum + item.fitoutCost, 0);
  const avgLockinPeriod = fitoutData.reduce((sum, item) => sum + item.lockinMonths, 0) / fitoutData.length;

  const getUrgencyBadge = (monthsRemaining: number) => {
    if (monthsRemaining <= 6) return <Badge className="bg-red-100 text-red-800">Critical</Badge>;
    if (monthsRemaining <= 12) return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>;
    if (monthsRemaining <= 24) return <Badge className="bg-yellow-100 text-yellow-800">Monitor</Badge>;
    return <Badge className="bg-green-100 text-green-800">Safe</Badge>;
  };

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Fitout Investment"
          value={`₹${(totalFitoutInvestment / 10000000).toFixed(1)}Cr`}
          icon={<DollarSign />}
        />
        <StatsCard
          title="Avg Lockin Period"
          value={`${avgLockinPeriod.toFixed(0)} months`}
          icon={<Clock />}
        />
        <StatsCard
          title="Properties with Fitout"
          value={fitoutData.length}
          icon={<Building />}
        />
        <StatsCard
          title="At Risk Properties"
          value={12}
          icon={<TrendingDown />}
          valueClassName="text-brand-error"
        />
      </StatsGrid>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fitout Investment vs Lockin Status */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#1a1a1a]">Fitout Investment Analysis</CardTitle>
            <p className="text-sm text-gray-600">Investment vs remaining lockin period</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={fitoutData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="property" angle={-45} textAnchor="end" height={80} fontSize={10} />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar yAxisId="left" dataKey="fitoutCost" fill="#DA7756" name="Fitout Cost (₹)" />
                <Bar yAxisId="right" dataKey="monthsRemaining" fill="#798C5E" name="Months Remaining" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Lockin Risk Distribution */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#1a1a1a]">Lockin Risk Distribution</CardTitle>
            <p className="text-sm text-gray-600">Properties categorized by lockin expiry risk</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={lockinStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8E7BE0"
                  dataKey="count"
                  label={({ percentage }) => `${percentage}%`}
                >
                  {lockinStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Property List */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#1a1a1a]">Property-wise Fitout Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fitoutData.map((property, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{property.property}</h4>
                    <p className="text-sm text-gray-600">Tenant: {property.tenant}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600">
                        Fitout Cost: <span className="font-medium">₹{(property.fitoutCost / 100000).toFixed(1)}L</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Lockin: <span className="font-medium">{property.lockinMonths} months</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Remaining: <span className="font-medium">{property.monthsRemaining} months</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getUrgencyBadge(property.monthsRemaining)}
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-[#C72030] h-2 rounded-full" 
                        style={{ width: `${(property.monthsRemaining / property.lockinMonths) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FitoutAnalytics;
