
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Zap, Droplets, Thermometer, Activity } from 'lucide-react';
import UtilityOverview from '@/components/Utilities/UtilityOverview';
import BillManagement from '@/components/Utilities/BillManagement';
import ConsumptionTracking from '@/components/Utilities/ConsumptionTracking';
import UtilityReporting from '@/components/Utilities/UtilityReporting';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/typography';

const UtilityManagement = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader title="Utility Management" description="Monitor and manage utility consumption and billing across properties" />

      {/* ... existing tabs content ... */}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2"
          >
            <Zap className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="bills"
            className="flex items-center gap-2"
          >
            <Droplets className="h-4 w-4" />
            Bill Management
          </TabsTrigger>
          <TabsTrigger
            value="consumption"
            className="flex items-center gap-2"
          >
            <Activity className="h-4 w-4" />
            Consumption
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <UtilityOverview />
        </TabsContent>

        <TabsContent value="bills">
          <BillManagement />
        </TabsContent>

        <TabsContent value="consumption">
          <ConsumptionTracking />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default UtilityManagement;
