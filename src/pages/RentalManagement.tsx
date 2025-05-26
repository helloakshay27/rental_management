
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, FileText, Users, Calendar, DollarSign } from 'lucide-react';
import RentalAgreements from '@/components/Rentals/RentalAgreements';
import TenantManagement from '@/components/Rentals/TenantManagement';
import RentCollection from '@/components/Rentals/RentCollection';
import LeaseRenewals from '@/components/Rentals/LeaseRenewals';
import AddRentalDialog from '@/components/Rentals/AddRentalDialog';

const RentalManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-base-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-heading-1 font-semibold text-gray-900">Landlord Dashboard</h1>
          <p className="text-body text-gray-600 mt-2">Manage rental agreements, tenants, and rent collection</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="btn-primary">
          <Plus className="h-4 w-4 mr-2" />
          Add Rental Agreement
        </Button>
      </div>

      <Tabs defaultValue="agreements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-tertiary-1 rounded-lg p-1">
          <TabsTrigger 
            value="agreements" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
          >
            <FileText className="h-4 w-4" />
            Agreements
          </TabsTrigger>
          <TabsTrigger 
            value="tenants" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
          >
            <Users className="h-4 w-4" />
            Tenants
          </TabsTrigger>
          <TabsTrigger 
            value="collection" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
          >
            <DollarSign className="h-4 w-4" />
            Rent Collection
          </TabsTrigger>
          <TabsTrigger 
            value="renewals" 
            className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white rounded-md"
          >
            <Calendar className="h-4 w-4" />
            Renewals
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agreements">
          <RentalAgreements />
        </TabsContent>
        
        <TabsContent value="tenants">
          <TenantManagement />
        </TabsContent>
        
        <TabsContent value="collection">
          <RentCollection />
        </TabsContent>
        
        <TabsContent value="renewals">
          <LeaseRenewals />
        </TabsContent>
      </Tabs>

      <AddRentalDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
};

export default RentalManagement;
