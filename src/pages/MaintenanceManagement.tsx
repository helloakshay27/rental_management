
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import MaintenanceRequests from '@/components/Tenant/MaintenanceRequests';
import { Heading } from '@/components/ui/typography';

const MaintenanceManagement = () => {
    return (
        <PageContainer>
            <PageHeader title="Maintenance Management" description="Track and manage all maintenance requests from tenants" />

            <MaintenanceRequests />
        </PageContainer>
    );
};

export default MaintenanceManagement;
