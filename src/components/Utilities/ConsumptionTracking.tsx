
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Zap, Droplets } from 'lucide-react';

const ConsumptionTracking = () => {
  const consumptionData = [
    { property: 'Sunset Apartments', electricity: { current: 5240, previous: 4890, percentage: 107 }, water: { current: 2850, previous: 3020, percentage: 94 } },
    { property: 'Downtown Plaza', electricity: { current: 6890, previous: 6450, percentage: 107 }, water: { current: 3420, previous: 3150, percentage: 109 } },
    { property: 'Green Valley', electricity: { current: 3110, previous: 2780, percentage: 112 }, water: { current: 2180, previous: 2400, percentage: 91 } }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Consumption Analysis</CardTitle>
          <CardDescription className="text-gray-600">Track utility usage across properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {consumptionData.map((property, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{property.property}</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Zap className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-gray-700">Electricity</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {property.electricity.percentage > 100 ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={`text-sm font-semibold ${property.electricity.percentage > 100 ? 'text-red-600' : 'text-green-600'}`}>
                          {property.electricity.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.electricity.current} kWh (vs {property.electricity.previous} kWh last month)
                    </div>
                    <Progress 
                      value={Math.min(property.electricity.percentage, 100)} 
                      className={`h-2 ${property.electricity.percentage > 100 ? 'bg-red-100' : 'bg-green-100'}`}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Water</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        {property.water.percentage > 100 ? (
                          <TrendingUp className="h-4 w-4 text-red-500" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-green-500" />
                        )}
                        <span className={`text-sm font-semibold ${property.water.percentage > 100 ? 'text-red-600' : 'text-green-600'}`}>
                          {property.water.percentage}%
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.water.current} gal (vs {property.water.previous} gal last month)
                    </div>
                    <Progress 
                      value={Math.min(property.water.percentage, 100)} 
                      className={`h-2 ${property.water.percentage > 100 ? 'bg-red-100' : 'bg-green-100'}`}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Efficiency Metrics</CardTitle>
            <CardDescription className="text-gray-600">Usage efficiency across properties</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Avg kWh per Unit</span>
                <span className="text-sm font-semibold text-gray-900">485 kWh</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Avg Water per Unit</span>
                <span className="text-sm font-semibold text-gray-900">281 gal</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-600">Most Efficient</span>
                <span className="text-sm font-semibold text-green-700">Green Valley</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Cost Analysis</CardTitle>
            <CardDescription className="text-gray-600">Utility costs breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">Total Monthly Cost</span>
                <span className="text-sm font-semibold text-gray-900">$3,178</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">Cost per Unit</span>
                <span className="text-sm font-semibold text-gray-900">$105.93</span>
              </div>
              <div className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">YoY Change</span>
                <span className="text-sm font-semibold text-red-600">+8.5%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumptionTracking;
