
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
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rental Management</h1>
          <p className="text-gray-600 mt-2">Manage rental agreements, tenants, and rent collection</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add Rental Agreement
        </Button>
      </div>

      <Tabs defaultValue="agreements" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agreements" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Agreements
          </TabsTrigger>
          <TabsTrigger value="tenants" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Tenants
          </TabsTrigger>
          <TabsTrigger value="collection" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Rent Collection
          </TabsTrigger>
          <TabsTrigger value="renewals" className="flex items-center gap-2">
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
