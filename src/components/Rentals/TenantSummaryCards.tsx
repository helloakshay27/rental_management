
import React from 'react';
import { StatsGrid } from '@/components/ui/page';
import { StatsCard } from '@/components/ui/stats-card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  status: string;
  emergencyContact: string;
  profession: string;
}

interface TenantSummaryCardsProps {
  tenants: Tenant[];
}

const TenantSummaryCards = ({ tenants }: TenantSummaryCardsProps) => {
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const noticeGivenTenants = tenants.filter(t => t.status === 'notice_given').length;
  // Guard against 0 tenants, which would otherwise render NaN%.
  const occupancyRate = tenants.length
    ? Math.round((activeTenants / tenants.length) * 100)
    : 0;

  return (
    <StatsGrid>
      <StatsCard title="Total Tenants" value={tenants.length} icon={<Users />} />
      <StatsCard title="Active Tenants" value={activeTenants} icon={<UserCheck />} />
      <StatsCard title="Notice Given" value={noticeGivenTenants} icon={<UserX />} />
      <StatsCard title="Occupancy Rate" value={`${occupancyRate}%`} icon={<TrendingUp />} />
    </StatsGrid>
  );
};

export default TenantSummaryCards;
