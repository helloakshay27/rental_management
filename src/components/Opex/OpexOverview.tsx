
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const OpexOverview = () => {
  const stats = [
    { title: 'Total Monthly OPEX', amount: '$45,680', change: '+12%', trend: 'up' },
    { title: 'YTD Expenses', amount: '$547,200', change: '+8%', trend: 'up' },
    { title: 'Average per Property', amount: '$3,045', change: '-3%', trend: 'down' },
    { title: 'Budget Utilization', amount: '78%', change: '+5%', trend: 'up' }
  ];

  const categories = [
    { name: 'Maintenance & Repairs', amount: '$15,240', percentage: 33 },
    { name: 'Utilities', amount: '$12,890', percentage: 28 },
    { name: 'Insurance', amount: '$8,650', percentage: 19 },
    { name: 'Property Management', amount: '$5,430', percentage: 12 },
    { name: 'Other', amount: '$3,470', percentage: 8 }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="bg-white border border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
              <DollarSign className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.amount}</div>
              <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center`}>
                {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.change} from last month
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Expense Categories</CardTitle>
            <CardDescription className="text-gray-600">Breakdown by category this month</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-[#C72030] rounded-full" style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}></div>
                    <span className="text-sm text-gray-700">{category.name}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold text-gray-900">{category.amount}</div>
                    <div className="text-xs text-gray-500">{category.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Transactions</CardTitle>
            <CardDescription className="text-gray-600">Latest expense entries</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: '2024-01-15', description: 'HVAC Maintenance - Building A', amount: '$850', category: 'Maintenance' },
                { date: '2024-01-14', description: 'Electricity Bill - December', amount: '$1,240', category: 'Utilities' },
                { date: '2024-01-12', description: 'Security Service', amount: '$620', category: 'Security' },
                { date: '2024-01-10', description: 'Cleaning Supplies', amount: '$180', category: 'Maintenance' }
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{transaction.description}</div>
                    <div className="text-xs text-gray-500">{transaction.date} • {transaction.category}</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{transaction.amount}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpexOverview;
