
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import InvoiceManagement from '@/components/Dashboard/InvoiceManagement';
import { Heading } from '@/components/ui/typography';

const Invoicing = () => {
  return (
    <PageContainer>
      <PageHeader title="Invoice Management" description="Create, manage, and track invoices for your properties" />

      <InvoiceManagement />
    </PageContainer>
  );
};

export default Invoicing;
