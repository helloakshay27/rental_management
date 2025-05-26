
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';

const BudgetPlanning = () => {
  const budgets = [
    { category: 'Maintenance & Repairs', budgeted: 20000, spent: 15240, percentage: 76, status: 'on-track' },
    { category: 'Utilities', budgeted: 15000, spent: 12890, percentage: 86, status: 'warning' },
    { category: 'Insurance', budgeted: 10000, spent: 8650, percentage: 87, status: 'warning' },
    { category: 'Security', budgeted: 8000, spent: 5430, percentage: 68, status: 'on-track' },
    { category: 'Cleaning', budgeted: 5000, spent: 3470, percentage: 69, status: 'on-track' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Budget vs Actual</CardTitle>
          <CardDescription className="text-gray-600">Monitor budget utilization across categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {budgets.map((budget, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-900">{budget.category}</span>
                    {budget.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">
                      ${budget.spent.toLocaleString()} / ${budget.budgeted.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500">{budget.percentage}% used</div>
                  </div>
                </div>
                <Progress 
                  value={budget.percentage} 
                  className={`h-2 ${budget.status === 'warning' ? 'bg-yellow-100' : 'bg-green-100'}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Budget Summary</CardTitle>
            <CardDescription className="text-gray-600">Overall budget performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Budgeted</span>
                <span className="text-lg font-semibold text-gray-900">$58,000</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Total Spent</span>
                <span className="text-lg font-semibold text-gray-900">$45,680</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <span className="text-sm text-green-600">Remaining Budget</span>
                <span className="text-lg font-semibold text-green-700">$12,320</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <span className="text-sm text-blue-600">Budget Utilization</span>
                <span className="text-lg font-semibold text-blue-700">78.8%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Budget Forecast</CardTitle>
            <CardDescription className="text-gray-600">Projected spending for remaining months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">February Forecast</span>
                <span className="text-sm font-semibold text-gray-900">$52,000</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">March Forecast</span>
                <span className="text-sm font-semibold text-gray-900">$55,500</span>
              </div>
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm text-gray-700">Q1 Total Projection</span>
                <span className="text-sm font-semibold text-gray-900">$153,180</span>
              </div>
              <Button className="w-full bg-[#C72030] hover:bg-[#A01825]">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Detailed Forecast
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetPlanning;
