
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Zap, Droplets, Thermometer, Activity } from 'lucide-react';
import UtilityOverview from '@/components/Utilities/UtilityOverview';
import BillManagement from '@/components/Utilities/BillManagement';
import ConsumptionTracking from '@/components/Utilities/ConsumptionTracking';
import UtilityReporting from '@/components/Utilities/UtilityReporting';
import { useNavigate } from 'react-router-dom';

const UtilityManagement = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utility Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage utility consumption and billing across properties</p>
        </div>
        <Button onClick={() => navigate('/utilities/new')} className="bg-[#C72030] hover:bg-[#A01825]">
          <Plus className="h-4 w-4 mr-2" />
          Add Utility
        </Button>
      </div>

      {/* ... existing tabs content ... */}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger
            value="overview"
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Zap className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="bills"
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Droplets className="h-4 w-4" />
            Bill Management
          </TabsTrigger>
          <TabsTrigger
            value="consumption"
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Activity className="h-4 w-4" />
            Consumption
          </TabsTrigger>
          <TabsTrigger
            value="reports"
            className="flex items-center gap-2 text-[#D5DbDB] data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Thermometer className="h-4 w-4" />
            Reports
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

        <TabsContent value="reports">
          <UtilityReporting />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UtilityManagement;
