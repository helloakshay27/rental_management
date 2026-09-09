
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import TenantDashboard from '@/components/Dashboard/TenantDashboard';
import { Heading } from '@/components/ui/typography';

const Dashboard = () => {
  return (
    <PageContainer>
      {/* Header Section */}
      <PageHeader title="Tenant Dashboard" description="Track your rentals, payments, and maintenance requests" />

      {/* Tenant Dashboard Content */}
      <TenantDashboard />
    </PageContainer>
  );
};

export default Dashboard;
