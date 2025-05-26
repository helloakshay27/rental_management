
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, DollarSign, TrendingUp, Calendar, Building } from 'lucide-react';
import OpexOverview from '@/components/Opex/OpexOverview';
import ExpenseTracking from '@/components/Opex/ExpenseTracking';
import BudgetPlanning from '@/components/Opex/BudgetPlanning';
import OpexReporting from '@/components/Opex/OpexReporting';
import AddExpenseDialog from '@/components/Opex/AddExpenseDialog';

const OpexManagement = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">OPEX Management</h1>
          <p className="text-gray-600 mt-2">Track and manage operational expenses across all properties</p>
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)} className="bg-[#C72030] hover:bg-[#A01825]">
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <DollarSign className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="tracking" 
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <TrendingUp className="h-4 w-4" />
            Expense Tracking
          </TabsTrigger>
          <TabsTrigger 
            value="budget" 
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Calendar className="h-4 w-4" />
            Budget Planning
          </TabsTrigger>
          <TabsTrigger 
            value="reports" 
            className="flex items-center gap-2 text-gray-600 data-[state=active]:bg-[#C72030] data-[state=active]:text-white rounded-md"
          >
            <Building className="h-4 w-4" />
            Reports
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <OpexOverview />
        </TabsContent>
        
        <TabsContent value="tracking">
          <ExpenseTracking />
        </TabsContent>
        
        <TabsContent value="budget">
          <BudgetPlanning />
        </TabsContent>
        
        <TabsContent value="reports">
          <OpexReporting />
        </TabsContent>
      </Tabs>

      <AddExpenseDialog 
        open={isAddDialogOpen} 
        onOpenChange={setIsAddDialogOpen} 
      />
    </div>
  );
};

export default OpexManagement;
