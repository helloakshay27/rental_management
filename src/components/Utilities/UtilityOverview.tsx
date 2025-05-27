
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Droplets, Thermometer, Wifi, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const UtilityOverview = () => {
  const utilities = [
    { type: 'Electricity', icon: Zap, usage: '15,240 kWh', cost: '$2,286', change: '+8%', trend: 'up' },
    { type: 'Water', icon: Droplets, usage: '8,450 gal', cost: '$168', change: '-3%', trend: 'down' },
    { type: 'Gas', icon: Thermometer, usage: '1,250 therms', cost: '$425', change: '+12%', trend: 'up' },
    { type: 'Internet', icon: Wifi, usage: '5 connections', cost: '$299', change: '0%', trend: 'neutral' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {utilities.map((utility, index) => {
          const Icon = utility.icon;
          return (
            <Card key={index} className="bg-[#f6f4ee] border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-[#D5DbDB]">{utility.type}</CardTitle>
                <Icon className="h-4 w-4 text-[#C72030]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-[#1a1a1a]">{utility.cost}</div>
                <div className="text-sm text-[#D5DbDB]">{utility.usage}</div>
                <p className={`text-xs mt-1 flex items-center ${
                  utility.trend === 'up' ? 'text-red-600' : 
                  utility.trend === 'down' ? 'text-green-600' : 
                  'text-gray-500'
                }`}>
                  {utility.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                  {utility.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                  {utility.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#C72030]" />
              Consumption Trends
            </CardTitle>
            <CardDescription className="text-[#D5DbDB]">Monthly utility usage patterns</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-4">
              {[
                { month: 'January', electricity: 15240, water: 8450, gas: 1250 },
                { month: 'December', electricity: 14120, water: 8720, gas: 1110 },
                { month: 'November', electricity: 13890, water: 8950, gas: 980 }
              ].map((data, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm font-medium text-[#1a1a1a]">{data.month}</span>
                  <div className="text-xs text-[#D5DbDB]">
                    E: {data.electricity} kWh | W: {data.water} gal | G: {data.gas} therms
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#C72030]" />
              Upcoming Bills
            </CardTitle>
            <CardDescription className="text-[#D5DbDB]">Bills due this month</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-3">
              {[
                { utility: 'Electricity', provider: 'PowerCorp', due: '2024-01-25', amount: '$2,286', status: 'Due Soon' },
                { utility: 'Water', provider: 'AquaCity', due: '2024-01-28', amount: '$168', status: 'Pending' },
                { utility: 'Gas', provider: 'GasPlus', due: '2024-02-02', amount: '$425', status: 'Scheduled' }
              ].map((bill, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-white">
                  <div>
                    <div className="text-sm font-medium text-[#1a1a1a]">{bill.utility}</div>
                    <div className="text-xs text-[#D5DbDB]">{bill.provider} • Due {bill.due}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-[#1a1a1a]">{bill.amount}</div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      bill.status === 'Due Soon' ? 'bg-red-100 text-red-800' :
                      bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {bill.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UtilityOverview;
