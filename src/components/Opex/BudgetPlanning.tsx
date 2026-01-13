
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import { getAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';

const BudgetPlanning = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetPlannings = async () => {
      try {
        setLoading(true);
        const token = getToken();
        const response = await getAuth(`/expenses/budget_plannings.json${token ? `?token=${token}` : ''}`);
        setData(response);
      } catch (error) {
        console.error('Failed to fetch budget plannings:', error);
        toast.error('Failed to load budget data');
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetPlannings();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  const budgets = data?.budgets || [];
  const summary = data?.summary || {
    total_budgeted: '₹0',
    total_spent: '₹0',
    remaining_budget: '₹0',
    utilization: '0%'
  };
  const forecasts = data?.forecasts || [];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="h-1 bg-[#C72030]"></div>
        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
          <CardTitle className="text-gray-900 font-bold">Budget vs Actual</CardTitle>
          <CardDescription className="text-gray-500">Monitor budget utilization across categories</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {budgets.length > 0 ? budgets.map((budget: any, index: number) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-bold text-gray-800">{budget.category}</span>
                    {budget.status === 'warning' ? (
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-black text-gray-900">
                      {budget.spent_formatted || `₹${budget.spent?.toLocaleString()}`} / {budget.budgeted_formatted || `₹${budget.budgeted?.toLocaleString()}`}
                    </div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{budget.percentage}% utilization</div>
                  </div>
                </div>
                <Progress
                  value={budget.percentage}
                  className={`h-2.5 rounded-full ${budget.percentage > 90 ? 'bg-orange-100' : 'bg-green-100'}`}
                />
              </div>
            )) : (
              <div className="text-center py-8 text-gray-400 italic">No budget allocation data found</div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-gray-900 font-bold">Budget Summary</CardTitle>
            <CardDescription className="text-gray-500">Overall budget performance</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Allocated</span>
                <span className="text-xl font-black text-gray-900">{summary.total_budgeted}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-100">
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Consumed</span>
                <span className="text-xl font-black text-gray-900">{summary.total_spent}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
                <span className="text-sm font-bold text-green-700 uppercase tracking-wider">Balance Available</span>
                <span className="text-xl font-black text-green-800">{summary.remaining_budget}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
                <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">Overall Efficiency</span>
                <span className="text-xl font-black text-blue-800">{summary.utilization}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader className="bg-gray-50/50 border-b border-gray-100">
            <CardTitle className="text-gray-900 font-bold">Predictive Forecast</CardTitle>
            <CardDescription className="text-gray-500">Projected spending for upcoming periods</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              {forecasts.length > 0 ? forecasts.map((forecast: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                  <span className="text-sm font-bold text-gray-700">{forecast.period}</span>
                  <span className="text-sm font-black text-gray-900">{forecast.amount}</span>
                </div>
              )) : (
                <div className="text-center py-8 text-gray-400 italic">No forecasting data available</div>
              )}

              <Button className="w-full mt-4 bg-[#C72030] hover:bg-[#A01825] text-white font-bold h-12 rounded-xl shadow-sm transition-all active:scale-95">
                <TrendingUp className="h-4 w-4 mr-2" />
                View Detailed Analytics
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BudgetPlanning;
