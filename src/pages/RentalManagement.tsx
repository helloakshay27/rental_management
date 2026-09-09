
import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Calendar, DollarSign } from 'lucide-react';
import RentalAgreements from '@/components/Rentals/RentalAgreements';
import TenantManagement from '@/components/Rentals/TenantManagement';
import RentCollection from '@/components/Rentals/RentCollection';
import LeaseRenewals from '@/components/Rentals/LeaseRenewals';
import AddRentalDialog from '@/components/Rentals/AddRentalDialog';
import { Heading } from '@/components/ui/typography';

const RentalManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <PageContainer>
      <PageHeader
        title="Landlord Dashboard"
        description="Manage rental agreements, tenants, and rent collection"
        backTo="/dashboard"
      />

      <Tabs defaultValue="agreements" className="space-y-6">
        <TabsList>
          <TabsTrigger 
            value="agreements" 
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Agreements
          </TabsTrigger>
          <TabsTrigger 
            value="tenants" 
            className="flex items-center gap-2"
          >
            <Users className="h-4 w-4" />
            Tenants
          </TabsTrigger>
          <TabsTrigger 
            value="collection" 
            className="flex items-center gap-2"
          >
            <DollarSign className="h-4 w-4" />
            Rent Collection
          </TabsTrigger>
          <TabsTrigger 
            value="renewals" 
            className="flex items-center gap-2"
          >
            <Calendar className="h-4 w-4" />
            Renewals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agreements" className="bg-white">
          <RentalAgreements />
        </TabsContent>
        
        <TabsContent value="tenants" className="bg-white">
          <TenantManagement />
        </TabsContent>
        
        <TabsContent value="collection" className="bg-white">
          <RentCollection />
        </TabsContent>
        
        <TabsContent value="renewals" className="bg-white">
          <LeaseRenewals />
        </TabsContent>
      </Tabs>

      <AddRentalDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </PageContainer>
  );
};

export default RentalManagement;
