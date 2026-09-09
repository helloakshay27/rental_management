
import React, { useState, useEffect } from 'react';
import { SectionLoader } from '@/components/ui/loader';
import { Panel, PanelRow } from '@/components/ui/panel';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
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
      <SectionLoader />
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
    <div className="space-y-5">
      <Panel title="Budget vs Actual" description="Monitor budget utilization across categories">
        {budgets.length > 0 ? (
          budgets.map((budget: any, index: number) => (
            <div
              key={index}
              className="space-y-2 rounded-md border border-brand-border px-4 py-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="truncate text-brand-body-4 font-medium text-brand-text">
                    {budget.category}
                  </span>
                  {budget.status === 'warning' ? (
                    <AlertTriangle className="h-4 w-4 shrink-0 text-brand-warning" />
                  ) : (
                    <CheckCircle className="h-4 w-4 shrink-0 text-brand-success" />
                  )}
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-brand-body-4 font-semibold text-brand-text">
                    {budget.spent_formatted || `₹${budget.spent?.toLocaleString()}`} /{' '}
                    {budget.budgeted_formatted || `₹${budget.budgeted?.toLocaleString()}`}
                  </div>
                  <div className="text-brand-caption text-brand-text-light">
                    {budget.percentage}% utilization
                  </div>
                </div>
              </div>
              <Progress value={budget.percentage} className="h-2" />
            </div>
          ))
        ) : (
          <div className="py-8 text-center text-brand-body-5 text-brand-text-light">
            No budget allocation data found
          </div>
        )}
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Budget Summary" description="Overall budget performance">
          <PanelRow label="Total Allocated" value={summary.total_budgeted} />
          <PanelRow label="Total Consumed" value={summary.total_spent} />
          <PanelRow label="Balance Available" value={summary.remaining_budget} />
          <PanelRow label="Overall Efficiency" value={summary.utilization} />
        </Panel>

        <Panel title="Predictive Forecast" description="Projected spending for upcoming periods">
          {forecasts.length > 0 ? (
            forecasts.map((forecast: any, index: number) => (
              <PanelRow key={index} label={forecast.period} value={forecast.amount} />
            ))
          ) : (
            <div className="py-8 text-center text-brand-body-5 text-brand-text-light">
              No forecasting data available
            </div>
          )}

          <Button className="fm-button-fix fm-button-brand mt-2 w-full px-6 py-2">
            <TrendingUp className="mr-2 h-4 w-4" />
            View Detailed Analytics
          </Button>
        </Panel>
      </div>
    </div>
  );
};

export default BudgetPlanning;
