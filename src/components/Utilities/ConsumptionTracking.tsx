import React from 'react';
import { Panel, PanelRow } from '@/components/ui/panel';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Zap, Droplets } from 'lucide-react';

interface Usage {
  current: number;
  previous: number;
  percentage: number;
}

const ConsumptionTracking = () => {
  const consumptionData = [
    { property: 'Sunset Apartments', electricity: { current: 5240, previous: 4890, percentage: 107 }, water: { current: 2850, previous: 3020, percentage: 94 } },
    { property: 'Downtown Plaza', electricity: { current: 6890, previous: 6450, percentage: 107 }, water: { current: 3420, previous: 3150, percentage: 109 } },
    { property: 'Green Valley', electricity: { current: 3110, previous: 2780, percentage: 112 }, water: { current: 2180, previous: 2400, percentage: 91 } }
  ];

  /**
   * One utility's usage block. Electricity and water rendered the same markup
   * twice before, each with its own icon tint and trend colours — this keeps
   * the single semantic signal (up = worse) and drops the rest.
   */
  const renderUsage = (
    label: string,
    icon: React.ReactNode,
    usage: Usage,
    unit: string
  ) => {
    const up = usage.percentage > 100;

    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center gap-2 text-brand-body-4 font-medium text-brand-text">
            {icon}
            {label}
          </span>
          <span
            className={`flex items-center gap-1 text-brand-body-4 font-semibold ${up ? 'text-brand-error' : 'text-brand-success'
              }`}
          >
            {up ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            {usage.percentage}%
          </span>
        </div>
        <div className="text-brand-body-5 text-brand-text-light">
          {usage.current} {unit} (vs {usage.previous} {unit} last month)
        </div>
        <Progress value={Math.min(usage.percentage, 100)} className="h-2" />
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <Panel title="Consumption Analysis" description="Track utility usage across properties">
        {consumptionData.map((property, index) => (
          <div key={index} className="rounded-md border border-brand-border px-4 py-3">
            <div className="mb-3 text-brand-body-3 font-semibold text-brand-text">
              {property.property}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {renderUsage(
                'Electricity',
                <Zap className="h-4 w-4 text-brand" />,
                property.electricity,
                'kWh'
              )}
              {renderUsage(
                'Water',
                <Droplets className="h-4 w-4 text-brand" />,
                property.water,
                'gal'
              )}
            </div>
          </div>
        ))}
      </Panel>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Efficiency Metrics" description="Usage efficiency across properties">
          <PanelRow label="Avg kWh per Unit" value="485 kWh" />
          <PanelRow label="Avg Water per Unit" value="281 gal" />
          <PanelRow label="Most Efficient" value="Green Valley" />
        </Panel>

        <Panel title="Cost Analysis" description="Utility costs breakdown">
          <PanelRow label="Total Monthly Cost" value="$3,178" />
          <PanelRow label="Cost per Unit" value="$105.93" />
          <PanelRow
            label="YoY Change"
            value={<span className="text-brand-error">+8.5%</span>}
          />
        </Panel>
      </div>
    </div>
  );
};

export default ConsumptionTracking;
