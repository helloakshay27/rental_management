
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Shield, DollarSign, Calendar, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const securityDepositData = [
  { property: 'Mumbai Corporate Tower', deposit: 2550000, duration: 3, type: 'Given', landlord: 'Prestige Properties' },
  { property: 'Delhi Business Park', deposit: 3600000, duration: 6, type: 'Given', landlord: 'DLF Commercial' },
  { property: 'Bangalore Tech Hub', deposit: 2250000, duration: 2, type: 'Given', landlord: 'Brigade Group' },
  { property: 'Chennai IT Center', deposit: 1800000, duration: 3, type: 'Given', landlord: 'L&T Realty' },
  { property: 'Pune Commercial', deposit: 2100000, duration: 4, type: 'Given', landlord: 'Godrej Properties' }
];

const depositByDuration = [
  { duration: '2 months', amount: 2250000, count: 1, color: '#FF6B6B' },
  { duration: '3 months', amount: 6450000, count: 2, color: '#FFA726' },
  { duration: '4 months', amount: 2100000, count: 1, color: '#FFEB3B' },
  { duration: '6 months', amount: 3600000, count: 1, color: '#66BB6A' }
];

const chartConfig = {
  deposit: {
    label: 'Security Deposit (₹)',
    color: '#C72030'
  },
  duration: {
    label: 'Duration (months)',
    color: '#66BB6A'
  }
};

const SecurityDepositAnalytics = () => {
  const totalDepositsGiven = securityDepositData
    .filter(item => item.type === 'Given')
    .reduce((sum, item) => sum + item.deposit, 0);
  
  const avgDepositDuration = securityDepositData.reduce((sum, item) => sum + item.duration, 0) / securityDepositData.length;

  const getDurationBadge = (duration: number) => {
    if (duration <= 2) return <Badge className="bg-red-100 text-red-800">Short</Badge>;
    if (duration <= 4) return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
    return <Badge className="bg-green-100 text-green-800">Long</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Deposits Given</p>
                <p className="text-2xl font-bold text-[#C72030]">₹{(totalDepositsGiven / 10000000).toFixed(1)}Cr</p>
              </div>
              <DollarSign className="h-8 w-8 text-[#C72030]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-2xl font-bold text-[#C72030]">{avgDepositDuration.toFixed(1)} months</p>
              </div>
              <Calendar className="h-8 w-8 text-[#C72030]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Properties</p>
                <p className="text-2xl font-bold text-[#C72030]">{securityDepositData.length}</p>
              </div>
              <Shield className="h-8 w-8 text-[#C72030]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Highest Deposit</p>
                <p className="text-2xl font-bold text-[#C72030]">₹{(Math.max(...securityDepositData.map(d => d.deposit)) / 100000).toFixed(1)}L</p>
              </div>
              <TrendingUp className="h-8 w-8 text-[#C72030]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Deposit Amount by Property */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#1a1a1a]">Security Deposits by Property</CardTitle>
            <p className="text-sm text-gray-600">Deposit amounts and duration by property</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={securityDepositData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="property" angle={-45} textAnchor="end" height={80} fontSize={10} />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="deposit" fill="#C72030" name="Deposit Amount (₹)" />
                  <Bar yAxisId="right" dataKey="duration" fill="#66BB6A" name="Duration (months)" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Distribution by Duration */}
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-[#1a1a1a]">Deposit Distribution by Duration</CardTitle>
            <p className="text-sm text-gray-600">Security deposits categorized by duration</p>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={depositByDuration}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ duration, count }) => `${duration} (${count})`}
                  >
                    {depositByDuration.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`₹${(Number(value) / 100000).toFixed(1)}L`, 'Amount']}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Deposit List */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#1a1a1a]">Property-wise Security Deposit Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {securityDepositData.map((deposit, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{deposit.property}</h4>
                    <p className="text-sm text-gray-600">Landlord: {deposit.landlord}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm text-gray-600">
                        Deposit: <span className="font-medium">₹{(deposit.deposit / 100000).toFixed(1)}L</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Duration: <span className="font-medium">{deposit.duration} months</span>
                      </span>
                      <span className="text-sm text-gray-600">
                        Type: <span className="font-medium">{deposit.type}</span>
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {getDurationBadge(deposit.duration)}
                    <Badge className="bg-blue-100 text-blue-800">{deposit.type}</Badge>
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

export default SecurityDepositAnalytics;
