
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Wrench, Calendar, Users, FileText } from 'lucide-react';
import AmcOverview from '@/components/Amc/AmcOverview';
import ContractManagement from '@/components/Amc/ContractManagement';
import ServiceScheduling from '@/components/Amc/ServiceScheduling';
import VendorManagement from '@/components/Amc/VendorManagement';
import AddAmcDialog from '@/components/Amc/AddAmcDialog';

const AmcManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">AMC Management</h1>
          <p className="text-[#1a1a1a]/70 mt-2">Manage Annual Maintenance Contracts and service providers</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#C72030] hover:bg-[#A01825] text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add AMC Contract
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Wrench className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="contracts" 
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <FileText className="h-4 w-4" />
            Contracts
          </TabsTrigger>
          <TabsTrigger 
            value="scheduling" 
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Calendar className="h-4 w-4" />
            Scheduling
          </TabsTrigger>
          <TabsTrigger 
            value="vendors" 
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
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

      <AddAmcDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
};

export default AmcManagement;
