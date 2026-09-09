
import React from 'react';
import { SectionLoader } from '@/components/ui/loader';
import { StatsGrid } from '@/components/ui/page';
import { Panel, PanelBadge } from '@/components/ui/panel';
import { StatsCard } from '@/components/ui/stats-card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { PieChart, Pie, Cell, Legend, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Shield, DollarSign, Calendar, TrendingUp } from 'lucide-react';

const securityDepositData = [
  { property: 'Mumbai Corporate Tower', deposit: 2550000, duration: 3, type: 'Given', landlord: 'Prestige Properties' },
  { property: 'Delhi Business Park', deposit: 3600000, duration: 6, type: 'Given', landlord: 'DLF Commercial' },
  { property: 'Bangalore Tech Hub', deposit: 2250000, duration: 2, type: 'Given', landlord: 'Brigade Group' },
  { property: 'Chennai IT Center', deposit: 1800000, duration: 3, type: 'Given', landlord: 'L&T Realty' },
  { property: 'Pune Commercial', deposit: 2100000, duration: 4, type: 'Given', landlord: 'Godrej Properties' }
];

const depositByDuration = [
  { duration: '2 months', amount: 2250000, count: 1, color: '#E7848E' },
  { duration: '3 months', amount: 6450000, count: 2, color: '#EDC488' },
  { duration: '4 months', amount: 2100000, count: 1, color: '#CECBF6' },
  { duration: '6 months', amount: 3600000, count: 1, color: '#798C5E' }
];

const chartConfig = {
  deposit: {
    label: 'Security Deposit (₹)',
    color: '#DA7756'
  },
  duration: {
    label: 'Duration (months)',
    color: '#798C5E'
  }
};

const SecurityDepositAnalytics = ({ data, loading }: { data: any, loading: boolean }) => {
  const securityDepositData = data?.by_property?.map((item: any) => ({
    property: item.property || 'Unknown',
    deposit: parseFloat(item.deposit_amount) || 0,
    duration: item.duration_months || 0
  })) || [];

  const depositByDuration = data?.by_duration?.map((item: any) => ({
    duration: `${item.duration_months} months`,
    count: item.count || 0,
    // For the pie chart, we'll use count as the primary value
    amount: item.count || 0
  })) || [];

  const summary = data?.overview || {
    total_deposits_given: { amount_in_cr: "0.0" },
    avg_duration_months: 0,
    total_properties: 0,
    highest_deposit: { amount_in_lakh: 0 }
  };

  if (loading) {
    return (
      <SectionLoader />
    );
  }

  /**
   * One badge per row. The API's `risk_tag` carries the same Short/Medium/Long
   * label this derives from the duration, so it is used as the text when
   * present rather than rendered as a second, identical badge.
   */
  const getDurationBadge = (duration: number, label?: string) => {
    const tone =
      duration <= 2
        ? 'text-brand-error'
        : duration <= 4
          ? 'text-brand-warning'
          : 'text-brand-success';
    const text = label || (duration <= 2 ? 'Short' : duration <= 4 ? 'Medium' : 'Long');

    return <PanelBadge tone={tone} className="capitalize">{text}</PanelBadge>;
  };

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Deposits Given"
          value={`₹${summary.total_deposits_given?.amount_in_cr || '0.0'}Cr`}
          icon={<DollarSign />}
        />
        <StatsCard
          title="Avg Duration"
          value={`${Number(summary.avg_duration_months || 0).toFixed(1)} months`}
          icon={<Calendar />}
        />
        <StatsCard
          title="Total Properties"
          value={summary.total_properties || 0}
          icon={<Shield />}
        />
        <StatsCard
          title="Highest Deposit"
          value={`₹${Number(summary.highest_deposit?.amount_in_lakh || 0).toFixed(1)}L`}
          icon={<TrendingUp />}
        />
      </StatsGrid>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title="Security Deposits by Property"
          description="Deposit amounts and duration by property"
        >
          <ChartContainer config={chartConfig} className="h-[300px]">
            <BarChart data={securityDepositData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis dataKey="property" angle={-45} textAnchor="end" height={80} fontSize={10} />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Bar yAxisId="left" dataKey="deposit" fill="#DA7756" name="Deposit Amount (₹)" />
              <Bar yAxisId="right" dataKey="duration" fill="#798C5E" name="Duration (months)" />
            </BarChart>
          </ChartContainer>
        </Panel>

        <Panel
          title="Deposit Distribution by Duration"
          description="Security deposits categorized by duration (count)"
        >
          <ChartContainer config={chartConfig} className="h-[300px]">
            <PieChart>
              <Pie
                data={depositByDuration}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8E7BE0"
                dataKey="count"
                label={({ duration, count }) => `${duration} (${count})`}
              >
                {depositByDuration.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={['#E7848E', '#EDC488', '#CECBF6', '#798C5E', '#9EC8BA', '#76CDC1'][index % 6]} />
                ))}
              </Pie>
              <ChartTooltip
                content={<ChartTooltipContent />}
                formatter={(value) => [value, 'Count']}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
        </Panel>
      </div>

      <Panel title="Property-wise Security Deposit Details">
        {data?.property_details?.map((deposit: any, index: number) => (
          <div key={index} className="rounded-md border border-brand-border px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="truncate text-brand-body-4 font-medium text-brand-text">
                  {deposit.property || 'Unknown Property'}
                </div>
                <div className="text-brand-body-5 text-brand-text-light">
                  Landlord: {deposit.landlord || 'N/A'}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-brand-caption text-brand-text-light">
                  <span>
                    Deposit:{' '}
                    <span className="font-medium text-brand-text">
                      ₹{Number(deposit.deposit?.amount_in_lakh || 0).toFixed(2)}L
                    </span>
                  </span>
                  <span>
                    Duration:{' '}
                    <span className="font-medium text-brand-text">{deposit.duration_months} months</span>
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5">
                {getDurationBadge(deposit.duration_months, deposit.risk_tag)}
              </div>
            </div>
          </div>
        ))}
        {(!data?.property_details || data.property_details.length === 0) && (
          <div className="py-6 text-center text-brand-body-5 text-brand-text-light">
            No security deposit details available.
          </div>
        )}
      </Panel>
    </div>
  );
};

export default SecurityDepositAnalytics;
