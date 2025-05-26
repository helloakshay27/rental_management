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
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Tenant Dashboard</h1>
          <p className="text-[#1a1a1a]/70 mt-2">Manage your rental properties and landlord relationships</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#C72030] hover:bg-[#A01825] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Rental
        </Button>
      </div>

      <Tabs defaultValue="rentals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-[#D5DbDB] border border-gray-200 rounded-lg p-1">
          <TabsTrigger 
            value="rentals" 
            className="flex items-center gap-2 text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Home className="h-4 w-4" />
            My Rentals
          </TabsTrigger>
          <TabsTrigger 
            value="payments" 
            className="flex items-center gap-2 text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <CreditCard className="h-4 w-4" />
            Payment History
          </TabsTrigger>
          <TabsTrigger 
            value="maintenance" 
            className="flex items-center gap-2 text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Calendar className="h-4 w-4" />
            Maintenance
          </TabsTrigger>
          <TabsTrigger 
            value="documents" 
            className="flex items-center gap-2 text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <FileText className="h-4 w-4" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rentals" className="bg-[#D5DbDB] p-6 rounded-lg">
          <MyRentals />
        </TabsContent>
        
        <TabsContent value="payments" className="bg-[#D5DbDB] p-6 rounded-lg">
          <PaymentHistory />
        </TabsContent>
        
        <TabsContent value="maintenance" className="bg-[#D5DbDB] p-6 rounded-lg">
          <MaintenanceRequests />
        </TabsContent>
        
        <TabsContent value="documents" className="bg-[#D5DbDB] p-6 rounded-lg">
          <Documents />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenantDashboard;
