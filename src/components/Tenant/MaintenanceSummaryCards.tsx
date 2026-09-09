import React from 'react';
import { StatsGrid } from '@/components/ui/page';
import { StatsCard } from '@/components/ui/stats-card';
import { Wrench, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  status: string;
}

interface MaintenanceSummaryCardsProps {
  requests: MaintenanceRequest[];
}

const MaintenanceSummaryCards = ({ requests }: MaintenanceSummaryCardsProps) => {
  return (
    <StatsGrid>
      <StatsCard title="Total Requests" value={requests.length} icon={<Wrench />} />
      <StatsCard
        title="Pending"
        value={requests.filter(r => r.status === 'pending').length}
        icon={<Clock />}
      />
      <StatsCard
        title="In Progress"
        value={requests.filter(r => r.status === 'in-progress').length}
        icon={<AlertCircle />}
      />
      <StatsCard
        title="Completed"
        value={requests.filter(r => r.status === 'completed').length}
        icon={<CheckCircle />}
      />
    </StatsGrid>
  );
};

export default MaintenanceSummaryCards;
