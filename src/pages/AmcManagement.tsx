
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Wrench, Calendar, Users, FileText } from 'lucide-react';
import AmcOverview from '@/components/Amc/AmcOverview';
import ContractManagement from '@/components/Amc/ContractManagement';
import ServiceScheduling from '@/components/Amc/ServiceScheduling';
import VendorManagement from '@/components/Amc/VendorManagement';
import { Heading } from '@/components/ui/typography';

const AmcManagement = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader title="AMC Management" description="Manage Annual Maintenance Contracts and service providers" />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2"
          >
            <Wrench className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="contracts"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger
            value="scheduling"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger
            value="vendors"
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Vendors
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="bg-white">
          <AmcOverview />
        </TabsContent>

        <TabsContent value="contracts" className="bg-white">
          <ContractManagement />
        </TabsContent>

        <TabsContent value="scheduling" className="bg-white">
          <ServiceScheduling />
        </TabsContent>

        <TabsContent value="vendors" className="bg-white">
          <VendorManagement />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default AmcManagement;
