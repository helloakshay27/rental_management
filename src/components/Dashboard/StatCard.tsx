
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral' | 'warning';
  icon: LucideIcon;
  /**
   * Kept for call-site compatibility. The tile now takes its colours from the
   * design tokens — the icon chip is always the brand tan — so this is ignored.
   */
  color?: string;
  backgroundColor?: string;
}

/**
 * Dashboard stat tile. Thin wrapper over the shared `StatsCard` so the
 * dashboards pick up the fm-matrix-revamp look, while keeping the optional
 * change/delta line those dashboards pass.
 */
const StatCard = ({ title, value, change, changeType, icon: Icon }: StatCardProps) => {
  const changeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-brand-success';
      case 'negative':
        return 'text-brand-error';
      case 'warning':
        return 'text-brand-warning';
      default:
        return 'text-brand-text-light';
    }
  };

  return (
    <StatsCard
      title={title}
      value={value}
      icon={<Icon />}
      footer={
        change ? (
          <p className={`mt-0.5 text-brand-caption font-medium ${changeColor()}`}>{change}</p>
        ) : null
      }
    />
  );
};

export default StatCard;
