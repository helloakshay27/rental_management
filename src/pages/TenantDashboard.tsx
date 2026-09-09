
import React, { useState } from 'react';
import { PageContainer } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Home, CreditCard, Calendar, FileText } from 'lucide-react';
import MyRentals from '@/components/Tenant/MyRentals';
import PaymentHistory from '@/components/Tenant/PaymentHistory';
import Documents from '@/components/Tenant/Documents';
import { Heading } from '@/components/ui/typography';

const TenantDashboard = ({ initialTab = "rentals" }: { initialTab?: string }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <PageContainer>
      <div className="flex justify-between items-center">
        <div>
          <Heading level="h1">Tenant Dashboard</Heading>
          <p className="text-[#1a1a1a]/70 mt-2">Manage your rental properties and landlord relationships</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
          <Plus className="h-4 w-4 mr-2" />
          Add New Rental
        </Button>
      </div>

      <Tabs defaultValue={initialTab} className="space-y-6">
        <TabsList>
          <TabsTrigger
            value="rentals"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            My Rentals
          </TabsTrigger>
          <TabsTrigger
            value="payments"
            className="flex items-center gap-2"
          >
            <CreditCard className="h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger
            value="documents"
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rentals" className="bg-white">
          <MyRentals />
        </TabsContent>

        <TabsContent value="payments" className="bg-white">
          <PaymentHistory />
        </TabsContent>

        <TabsContent value="documents" className="bg-white">
          <Documents />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default TenantDashboard;
