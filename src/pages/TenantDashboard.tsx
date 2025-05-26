
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Home, CreditCard, Calendar, FileText } from 'lucide-react';
import MyRentals from '@/components/Tenant/MyRentals';
import PaymentHistory from '@/components/Tenant/PaymentHistory';
import MaintenanceRequests from '@/components/Tenant/MaintenanceRequests';
import Documents from '@/components/Tenant/Documents';

const TenantDashboard = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tenant Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your rental properties and landlord relationships</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Add New Rental
        </Button>
      </div>

      <Tabs defaultValue="rentals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rentals" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            My Rentals
          </TabsTrigger>
          <TabsTrigger value="payments" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger value="maintenance" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rentals">
          <MyRentals />
        </TabsContent>
        
        <TabsContent value="payments">
          <PaymentHistory />
        </TabsContent>
        
        <TabsContent value="maintenance">
          <MaintenanceRequests />
        </TabsContent>
        
        <TabsContent value="documents">
          <Documents />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard;
