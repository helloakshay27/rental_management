
import React from 'react';
import { StatsGrid } from '@/components/ui/page';
import { Panel, PanelRow, PanelBadge } from '@/components/ui/panel';
import { StatsCard } from '@/components/ui/stats-card';
import { Zap, Droplets, Thermometer, Wifi, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const UtilityOverview = () => {
  const utilities = [
    { type: 'Electricity', icon: Zap, usage: '15,240 kWh', cost: '$2,286', change: '+8%', trend: 'up' },
    { type: 'Water', icon: Droplets, usage: '8,450 gal', cost: '$168', change: '-3%', trend: 'down' },
    { type: 'Gas', icon: Thermometer, usage: '1,250 therms', cost: '$425', change: '+12%', trend: 'up' },
    { type: 'Internet', icon: Wifi, usage: '5 connections', cost: '$299', change: '0%', trend: 'neutral' }
  ];

  /** Due-date urgency is the one semantic colour these rows keep. */
  const getBillTone = (status: string) =>
    status === 'Due Soon'
      ? 'text-brand-error'
      : status === 'Pending'
        ? 'text-brand-warning'
        : 'text-brand-success';

  return (
    <div className="space-y-5">
      <StatsGrid>
        {utilities.map((utility, index) => {
          const Icon = utility.icon;
          return (
            <StatsCard
              key={index}
              title={utility.type}
              value={utility.cost}
              icon={<Icon />}
              footer={
                <>
                  <p className="text-brand-body-5 text-brand-text-light">{utility.usage}</p>
                  <p
                    className={`mt-0.5 flex items-center text-brand-caption ${
                      utility.trend === 'up'
                        ? 'text-brand-error'
                        : utility.trend === 'down'
                        ? 'text-brand-success'
                        : 'text-brand-text-light'
                    }`}
                  >
                    {utility.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                    {utility.trend === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                    {utility.change} from last month
                  </p>
                </>
              }
            />
          );
        })}
      </StatsGrid>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel
          title={
            <span className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-brand" />
              Consumption Trends
            </span>
          }
          description="Monthly utility usage patterns"
        >
          {[
            { month: 'January', electricity: 15240, water: 8450, gas: 1250 },
            { month: 'December', electricity: 14120, water: 8720, gas: 1110 },
            { month: 'November', electricity: 13890, water: 8950, gas: 980 }
          ].map((data, index) => (
            <PanelRow
              key={index}
              label={data.month}
              value={
                <span className="text-brand-body-5 font-normal text-brand-text-light">
                  E: {data.electricity} kWh &middot; W: {data.water} gal &middot; G: {data.gas} therms
                </span>
              }
            />
          ))}
        </Panel>

        <Panel
          title={
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand" />
              Upcoming Bills
            </span>
          }
          description="Bills due this month"
        >
          {[
            { utility: 'Electricity', provider: 'PowerCorp', due: '2024-01-25', amount: '$2,286', status: 'Due Soon' },
            { utility: 'Water', provider: 'AquaCity', due: '2024-01-28', amount: '$168', status: 'Pending' },
            { utility: 'Gas', provider: 'GasPlus', due: '2024-02-02', amount: '$425', status: 'Scheduled' }
          ].map((bill, index) => (
            <PanelRow
              key={index}
              label={bill.utility}
              hint={`${bill.provider} · Due ${bill.due}`}
              value={
                <span className="flex items-center gap-2">
                  {bill.amount}
                  <PanelBadge tone={getBillTone(bill.status)}>{bill.status}</PanelBadge>
                </span>
              }
            />
          ))}
        </Panel>
      </div>
    </div>
  );
};

export default UtilityOverview;
