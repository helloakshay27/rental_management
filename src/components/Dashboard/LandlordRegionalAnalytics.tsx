
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, TrendingUp, TrendingDown, Building2, DollarSign } from 'lucide-react';

const LandlordRegionalAnalytics = () => {
  const regionalData = [
    {
      region: 'Mumbai',
      properties: 45,
      occupancy: 96.8,
      avgRent: 185,
      growth: 12.5,
      trend: 'up',
      totalRevenue: 0.85
    },
    {
      region: 'Delhi NCR',
      properties: 38,
      occupancy: 94.2,
      avgRent: 165,
      growth: 8.2,
      trend: 'up',
      totalRevenue: 0.68
    },
    {
      region: 'Bangalore',
      properties: 42,
      occupancy: 97.1,
      avgRent: 142,
      growth: 15.8,
      trend: 'up',
      totalRevenue: 0.72
    },
    {
      region: 'Chennai',
      properties: 28,
      occupancy: 89.5,
      avgRent: 125,
      growth: -2.1,
      trend: 'down',
      totalRevenue: 0.42
    },
    {
      region: 'Hyderabad',
      properties: 35,
      occupancy: 92.8,
      avgRent: 138,
      growth: 9.8,
      trend: 'up',
      totalRevenue: 0.58
    },
    {
      region: 'Pune',
      properties: 22,
      occupancy: 95.4,
      avgRent: 152,
      growth: 11.2,
      trend: 'up',
      totalRevenue: 0.41
    }
  ];

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? <TrendingUp size={16} className="text-green-600" /> : <TrendingDown size={16} className="text-red-600" />;
  };

  const getTrendColor = (trend: string) => {
    return trend === 'up' ? 'text-green-600' : 'text-red-600';
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Regional Performance Analytics</CardTitle>
        <p className="text-sm text-gray-600">Detailed breakdown by major markets</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regionalData.map((region) => (
            <div key={region.region} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <MapPin size={20} className="text-[#C72030]" />
                  <h3 className="font-bold text-lg text-[#1a1a1a]">{region.region}</h3>
                </div>
                <Badge className={`${region.trend === 'up' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {region.trend === 'up' ? 'Growing' : 'Declining'}
                </Badge>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Building2 size={16} className="text-blue-500" />
                    <span className="text-sm text-gray-600">Properties</span>
                  </div>
                  <span className="font-semibold text-[#1a1a1a]">{region.properties}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Occupancy Rate</span>
                  <span className="font-semibold text-[#1a1a1a]">{region.occupancy}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Avg Rent/SqFt</span>
                  <span className="font-semibold text-[#1a1a1a]">₹{region.avgRent}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign size={16} className="text-green-500" />
                    <span className="text-sm text-gray-600">Revenue</span>
                  </div>
                  <span className="font-semibold text-[#1a1a1a]">₹{region.totalRevenue}Cr</span>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                  <span className="text-sm text-gray-600">YoY Growth</span>
                  <div className="flex items-center space-x-1">
                    {getTrendIcon(region.trend)}
                    <span className={`font-semibold ${getTrendColor(region.trend)}`}>
                      {region.growth > 0 ? '+' : ''}{region.growth}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-2">Top Performing Market</h4>
            <p className="text-2xl font-bold text-blue-600">Bangalore</p>
            <p className="text-sm text-blue-700">97.1% occupancy, +15.8% growth</p>
          </div>
          
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <h4 className="font-bold text-green-900 mb-2">Highest Revenue</h4>
            <p className="text-2xl font-bold text-green-600">Mumbai</p>
            <p className="text-sm text-green-700">₹0.85Cr monthly, ₹185/sqft</p>
          </div>
          
          <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
            <h4 className="font-bold text-amber-900 mb-2">Growth Opportunity</h4>
            <p className="text-2xl font-bold text-amber-600">Chennai</p>
            <p className="text-sm text-amber-700">89.5% occupancy, improvement needed</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordRegionalAnalytics;
