
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import ComplianceForm from '@/components/Compliances/ComplianceForm';
import ComplianceTable from '@/components/Compliances/ComplianceTable';
import ComplianceFilters from '@/components/Compliances/ComplianceFilters';

const CompliancesMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompliance, setEditingCompliance] = useState(null);

  const compliances = [
    {
      id: 'C001',
      name: 'Fire Safety NOC',
      type: 'Safety',
      description: 'Fire Department No Objection Certificate',
      validityPeriod: 12,
      applicablePropertyTypes: ['Residential', 'Commercial'],
      specificProperties: [],
      renewalNotice: 30,
      status: 'Active',
      documents: ['Fire NOC Certificate', 'Fire Safety Plan'],
      authority: 'Fire Department',
      cost: '₹5,000',
      createdDate: '2024-01-15'
    },
    {
      id: 'C002',
      name: 'Municipal Operating License',
      type: 'Operating',
      description: 'Local municipal operating permission',
      validityPeriod: 24,
      applicablePropertyTypes: ['Commercial'],
      specificProperties: ['P003'],
      renewalNotice: 60,
      status: 'Active',
      documents: ['Operating License', 'Property Tax Receipt'],
      authority: 'Municipal Corporation',
      cost: '₹10,000',
      createdDate: '2024-02-01'
    },
    {
      id: 'C003',
      name: 'Environmental Clearance',
      type: 'Environmental',
      description: 'Environmental impact clearance certificate',
      validityPeriod: 36,
      applicablePropertyTypes: ['Warehouse'],
      specificProperties: [],
      renewalNotice: 90,
      status: 'Active',
      documents: ['Environmental Certificate', 'Pollution Control Board NOC'],
      authority: 'Pollution Control Board',
      cost: '₹15,000',
      createdDate: '2024-03-10'
    }
  ];

  const filteredCompliances = compliances.filter(compliance =>
    compliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compliance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compliance.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCompliance = (compliance) => {
    setEditingCompliance(compliance);
  };

  const handleDeleteCompliance = (compliance) => {
    console.log('Delete compliance:', compliance.id);
  };

  const handleSaveCompliance = () => {
    console.log('Save compliance');
    setEditingCompliance(null);
  };

  const handleCancelEdit = () => {
    setEditingCompliance(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliances Master</h1>
          <p className="text-gray-600">Manage property compliance requirements and tracking</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle>Add New Compliance</DialogTitle>
              <DialogDescription>Create a new compliance requirement</DialogDescription>
            </DialogHeader>
            <ComplianceForm 
              onSave={handleSaveCompliance}
              onCancel={() => {}}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>Manage all compliance requirements and their applicability</CardDescription>
            </div>
            <ComplianceFilters 
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ComplianceTable 
            compliances={filteredCompliances}
            onEdit={handleEditCompliance}
            onDelete={handleDeleteCompliance}
          />
        </CardContent>
      </Card>

      {/* Edit Compliance Dialog */}
      <Dialog open={!!editingCompliance} onOpenChange={() => setEditingCompliance(null)}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit Compliance</DialogTitle>
            <DialogDescription>Update compliance information</DialogDescription>
          </DialogHeader>
          <ComplianceForm 
            isEdit={true}
            compliance={editingCompliance}
            onSave={handleSaveCompliance}
            onCancel={handleCancelEdit}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompliancesMaster;
