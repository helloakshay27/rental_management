
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import ComplianceForm from '@/components/Compliances/ComplianceForm';
import ComplianceTable from '@/components/Compliances/ComplianceTable';
import ComplianceFilters from '@/components/Compliances/ComplianceFilters';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

interface PropertyType {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

interface Compliance {
  id: number;
  site_id: number | null;
  requirement_type: string;
  title: string;
  description: string;
  regulatory_body: string;
  due_date: string;
  completion_date: string | null;
  status: string;
  responsible_party: string;
  assigned_to: number;
  documents: any;
  reminder_days: number;
  is_recurring: boolean;
  created_at: string;
  updated_at: string;
  validity_months: number;
  approx_cost: string;
  property_types: PropertyType[];
}

const CompliancesMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompliance, setEditingCompliance] = useState<Compliance | null>(null);
  const [compliances, setCompliances] = useState<Compliance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchCompliances = async () => {
    try {
      setIsLoading(true);
      const data = await getAuth('/compliance_requirements');
      if (Array.isArray(data)) {
        setCompliances(data);
      }
    } catch (error) {
      console.error('Failed to fetch compliances', error);
      toast.error('Failed to load compliance requirements');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCompliances();
  }, []);


  const filteredCompliances = compliances.filter(compliance =>
    compliance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compliance.requirement_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compliance.regulatory_body?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCompliance = async (compliance: Compliance) => {
    try {
      setIsLoading(true);
      const complianceData = await getAuth(`/compliance_requirements/${compliance.id}`);
      setEditingCompliance(complianceData);
      setIsEditDialogOpen(true);
    } catch (error) {
      console.error('Failed to fetch compliance details', error);
      toast.error('Failed to load compliance details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCompliance = (compliance) => {
    console.log('Delete compliance:', compliance.id);
  };

  const handleSaveCompliance = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingCompliance(null);
    fetchCompliances(); // Refresh list after save
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingCompliance(null);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliances Master</h1>
          <p className="text-gray-600">Manage property compliance requirements and tracking</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-semibold text-xl">Add New Compliance</DialogTitle>
              <DialogDescription className="text-gray-600">Create a new compliance requirement</DialogDescription>
            </DialogHeader>
            <ComplianceForm
              onSave={handleSaveCompliance}
              onCancel={() => { }}
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
          {isLoading ? (
            <div className="text-center py-8 text-gray-500">Loading compliance requirements...</div>
          ) : (
            <ComplianceTable
              compliances={filteredCompliances}
              onEdit={handleEditCompliance}
              onDelete={handleDeleteCompliance}
            />
          )}
        </CardContent>
      </Card>

      {/* Edit Compliance Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={(open) => !open && handleCancelEdit()}>
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
