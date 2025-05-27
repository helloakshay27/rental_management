
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import TenantSummaryCards from './TenantSummaryCards';
import TenantFilters from './TenantFilters';
import TenantTable from './TenantTable';
import TenantViewDialog from './TenantViewDialog';
import TenantEditDialog from './TenantEditDialog';
import { useToast } from '@/hooks/use-toast';

const TenantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  // Mock data for tenants
  const tenants = [
    {
      id: 'T001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91 98765 43210',
      propertyName: 'Sunset Apartments - Unit 2A',
      leaseStart: '2024-01-15',
      leaseEnd: '2024-12-31',
      rent: 2500,
      status: 'active',
      emergencyContact: 'Jane Smith - +91 98765 43211',
      profession: 'Software Engineer'
    },
    {
      id: 'T002',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+91 98765 43212',
      propertyName: 'Downtown Plaza - Unit 5B',
      leaseStart: '2024-03-01',
      leaseEnd: '2025-02-28',
      rent: 3200,
      status: 'active',
      emergencyContact: 'Robert Johnson - +91 98765 43213',
      profession: 'Marketing Manager'
    },
    {
      id: 'T003',
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '+91 98765 43214',
      propertyName: 'Green Valley - Unit 1C',
      leaseStart: '2023-06-01',
      leaseEnd: '2024-05-31',
      rent: 1800,
      status: 'notice_given',
      emergencyContact: 'Lisa Wilson - +91 98765 43215',
      profession: 'Teacher'
    },
    {
      id: 'T004',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+91 98765 43216',
      propertyName: 'City Center - Unit 3A',
      leaseStart: '2024-02-01',
      leaseEnd: '2024-07-31',
      rent: 2800,
      status: 'inactive',
      emergencyContact: 'Tom Davis - +91 98765 43217',
      profession: 'Consultant'
    }
  ];

  // Action handlers
  const handleViewTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    setSelectedTenant(tenant || null);
    setIsViewDialogOpen(true);
  };

  const handleEditTenant = (tenantId: string) => {
    const tenant = tenants.find(t => t.id === tenantId);
    setSelectedTenant(tenant || null);
    setIsEditDialogOpen(true);
  };

  const handleSaveTenant = (updatedTenant) => {
    // In a real app, this would update the database
    console.log('Saving updated tenant:', updatedTenant);
    // You could also update local state here if needed
  };

  const handleCallTenant = (tenantId: string, phone: string) => {
    console.log('Calling tenant:', tenantId, 'at', phone);
    window.open(`tel:${phone}`);
    toast({
      title: "Calling Tenant",
      description: `Initiating call to ${phone}`,
    });
  };

  const handleEmailTenant = (tenantId: string, email: string) => {
    console.log('Emailing tenant:', tenantId, 'at', email);
    window.open(`mailto:${email}`);
    toast({
      title: "Opening Email Client",
      description: `Composing email to ${email}`,
    });
  };

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <TenantSummaryCards tenants={tenants} />

      {/* Tenant Management */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#1a1a1a]">Tenant Directory</CardTitle>
            <Button className="bg-[#C72030] hover:bg-[#A01825] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Tenant
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          <TenantFilters 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
          />

          <TenantTable 
            tenants={filteredTenants}
            onViewTenant={handleViewTenant}
            onEditTenant={handleEditTenant}
            onCallTenant={handleCallTenant}
            onEmailTenant={handleEmailTenant}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <TenantViewDialog 
        tenant={selectedTenant}
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
      />
      
      <TenantEditDialog 
        tenant={selectedTenant}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSave={handleSaveTenant}
      />
    </div>
  );
};

export default TenantManagement;
