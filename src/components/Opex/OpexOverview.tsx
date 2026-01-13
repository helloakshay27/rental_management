
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Calendar, PieChart, Calculator, Target, Loader2 } from 'lucide-react';
import { getAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';

const OpexOverview = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverview = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await getAuth(`/expenses/overview.json${token ? `?token=${token}` : ''}`);
        setData(response);
      } catch (error) {
        console.error('Failed to fetch OPEX overview:', error);
        toast.error('Failed to load overview data');
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  const stats = data?.stats || [
    { title: 'Total Monthly OPEX', amount: '₹0', change: '0%', trend: 'up', icon: DollarSign },
    { title: 'YTD Expenses', amount: '₹0', change: '0%', trend: 'up', icon: Calendar },
    { title: 'Average per Property', amount: '₹0', change: '0%', trend: 'down', icon: Calculator },
    { title: 'Budget Utilization', amount: '0%', change: '0%', trend: 'up', icon: Target }
  ];

  const categories = data?.categories || [];
  const recentTransactions = data?.recent_transactions || data?.recent_expenses || [];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'DollarSign': return DollarSign;
      case 'Calendar': return Calendar;
      case 'Calculator': return Calculator;
      case 'Target': return Target;
      default: return DollarSign;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat: any, index: number) => {
          const IconComponent = getIcon(stat.icon);
          return (
            <Card key={index} className="bg-white border border-gray-200 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.title}</CardTitle>
                <IconComponent className="h-4 w-4 text-[#C72030]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-black text-gray-900">{stat.amount}</div>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} flex items-center mt-1`}>
                  {stat.trend === 'up' ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                  {stat.change} from last month
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-bold">
              <PieChart className="h-5 w-5 text-[#C72030]" />
              Expense Categories
            </CardTitle>
            <CardDescription className="text-gray-500">Breakdown by category this month</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-5">
              {categories.length > 0 ? categories.map((category: any, index: number) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-2.5 h-2.5 bg-[#C72030] rounded-full" style={{ backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}></div>
                      <span className="text-sm font-bold text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-gray-900">{category.amount}</div>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="bg-[#C72030] h-1.5 rounded-full"
                      style={{ width: `${category.percentage}%`, backgroundColor: `hsl(${index * 45}, 70%, 50%)` }}
                    ></div>
                  </div>
                  <div className="text-[10px] text-right text-gray-400 font-bold">{category.percentage}% of total</div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400 italic">No category data available</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-gray-900 flex items-center gap-2 text-lg font-bold">
              <Calendar className="h-5 w-5 text-[#C72030]" />
              Recent Transactions
            </CardTitle>
            <CardDescription className="text-gray-500">Latest expense entries</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {recentTransactions.length > 0 ? recentTransactions.map((transaction: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-xl border border-gray-50 hover:border-gray-100 hover:bg-gray-50/50 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-white transition-colors">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{transaction.description || transaction.subcategory}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                        {transaction.date || transaction.expense_date} • {transaction.category || transaction.expense_category?.name}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-black text-gray-900">{transaction.amount}</div>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400 italic">No recent transactions</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpexOverview;
