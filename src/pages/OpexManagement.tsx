
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Calendar, Building } from 'lucide-react';
import OpexOverview from '@/components/Opex/OpexOverview';
import ExpenseTracking from '@/components/Opex/ExpenseTracking';
import BudgetPlanning from '@/components/Opex/BudgetPlanning';
import OpexReporting from '@/components/Opex/OpexReporting';
import { useNavigate } from 'react-router-dom';
import { Heading } from '@/components/ui/typography';

const OpexManagement = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <PageHeader title="OPEX Management" description="Track and manage operational expenses across all properties" />

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="tracking"
            className="flex items-center gap-2"
          >
            <TrendingUp className="h-4 w-4" />
            Expense Tracking
          </TabsTrigger>
          <TabsTrigger
            value="budget"
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Budget Planning
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="bg-white">
          <OpexOverview />
        </TabsContent>

        <TabsContent value="tracking" className="bg-white">
          <ExpenseTracking />
        </TabsContent>

        <TabsContent value="budget" className="bg-white">
          <BudgetPlanning />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default OpexManagement;
