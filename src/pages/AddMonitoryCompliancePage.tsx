import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import MonitorComplianceForm from '@/components/Tenant/MonitorComplianceForm';

const AddMonitoryCompliancePage = () => {

    return (
        <PageContainer>
            <PageHeader
                title="Add Compliance"
                description="Create a new compliance record"
                backTo="/compliance"
            />

            <MonitorComplianceForm />
        </PageContainer>
    );
};

export default AddMonitoryCompliancePage;
