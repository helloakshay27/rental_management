
import React from 'react';
import { SectionLoader } from '@/components/ui/loader';
import { Panel, PanelRow, PanelBadge } from '@/components/ui/panel';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, Legend } from 'recharts';
import { MapPin, TrendingUp, Clock, CheckCircle } from 'lucide-react';

const regionalData = [
  { month: 'Jan', mumbai: 12.5, delhi: 11.2, bangalore: 8.9, chennai: 6.1, others: 7.3 },
  { month: 'Feb', mumbai: 12.8, delhi: 11.5, bangalore: 9.1, chennai: 6.3, others: 7.5 },
  { month: 'Mar', mumbai: 13.2, delhi: 11.8, bangalore: 9.4, chennai: 6.5, others: 7.8 },
  { month: 'Apr', mumbai: 13.6, delhi: 12.1, bangalore: 9.7, chennai: 6.7, others: 8.1 },
  { month: 'May', mumbai: 14.1, delhi: 12.4, bangalore: 10.0, chennai: 6.9, others: 8.4 },
  { month: 'Jun', mumbai: 14.5, delhi: 12.8, bangalore: 10.3, chennai: 7.2, others: 8.7 }
];

// Distinct series colours from the brand palette (two source hexes previously
// collapsed onto the same mint, making two regions indistinguishable).
const COLORS = ['#DA7756', '#E7848E', '#9EC8BA', '#76CDC1', '#8E7BE0', '#EDC488', '#D3D1C7'];

const TenantRegionalAnalytics = ({ data, loading }: { data: any, loading: boolean }) => {
  // Transform API data structure to Recharts format
  const months = data?.regional_expense_trends?.months || [];
  const series = data?.regional_expense_trends?.series || [];

  const regionalData = months.length > 0 ? months.map((month: string, index: number) => {
    const entry: any = { month };
    series.forEach((s: any) => {
      entry[s.city] = parseFloat(s.values[index]) || 0;
    });
    return entry;
  }) : [];

  const regionalPerformance = data?.regional_performance || [];

  // Dynamic Chart Config
  const chartConfig: any = {};
  series.forEach((s: any, index: number) => {
    chartConfig[s.city] = {
      label: s.city.charAt(0).toUpperCase() + s.city.slice(1),
      color: COLORS[index % COLORS.length]
    };
  });

  const recentActivity = data?.recent_activity || [];

  if (loading) {
    return (
      <SectionLoader />
    );
  }

  return (
    <div className="space-y-5">
      <Panel
        title={
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-brand" />
            Regional Expense Trends
          </span>
        }
        description="Monthly expense breakdown by region (₹ Crores)"
      >
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <ChartContainer config={chartConfig} className="h-[300px]">
              <AreaChart data={regionalData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="month" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                {Object.keys(chartConfig).map((cityKey) => (
                  <Area
                    key={cityKey}
                    type="monotone"
                    dataKey={cityKey}
                    stackId="1"
                    stroke={chartConfig[cityKey].color}
                    fill={chartConfig[cityKey].color}
                    fillOpacity={0.8}
                  />
                ))}
              </AreaChart>
            </ChartContainer>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-brand-body-4 font-semibold text-brand-text">
              <TrendingUp className="h-4 w-4" />
              Regional Performance
            </div>
            {regionalPerformance.map((region: any, index: number) => {
              const growthVal = parseFloat(region.yoy_growth?.toString() || '0');
              const growthStr = growthVal >= 0 ? `+${growthVal.toFixed(1)}%` : `${growthVal.toFixed(1)}%`;

              return (
                <PanelRow
                  key={index}
                  label={region.city}
                  hint={`${region.properties} properties`}
                  value={
                    <span className="text-right">
                      <span
                        className={`block ${growthVal >= 0 ? 'text-brand-success' : 'text-brand-error'}`}
                      >
                        {growthStr}
                      </span>
                      <span className="block text-brand-caption font-normal text-brand-text-light">
                        YoY growth
                      </span>
                    </span>
                  }
                />
              );
            })}
          </div>
        </div>
      </Panel>

      <Panel
        title={
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-brand" />
            Recent Regional Activity
          </span>
        }
      >
        {recentActivity.map((activity: any, index: number) => (
          <PanelRow
            key={index}
            leading={
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-light">
                <CheckCircle
                  className={`h-4 w-4 ${activity.status === 'success' ? 'text-brand-success' : 'text-brand-text-light'}`}
                />
              </span>
            }
            label={activity.message}
            hint={
              <span className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                {activity.city} • {activity.time_ago}
              </span>
            }
            value={
              activity.status ? (
                <PanelBadge tone="text-brand-success" className="capitalize">
                  {activity.status}
                </PanelBadge>
              ) : null
            }
          />
        ))}
        {recentActivity.length === 0 && (
          <div className="py-6 text-center text-brand-body-5 text-brand-text-light">
            No recent activity.
          </div>
        )}
      </Panel>
    </div>
  );
};

export default TenantRegionalAnalytics;
