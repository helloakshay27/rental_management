
import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ComplianceForm from '@/components/Compliances/ComplianceForm';
import ComplianceTable from '@/components/Compliances/ComplianceTable';
import { getAuth, deleteAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

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
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [editingCompliance, setEditingCompliance] = useState<Compliance | null>(null);
  const [compliances, setCompliances] = useState<Compliance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const fetchCompliances = async () => {
    try {
      setIsLoading(true);
      let url = '/compliance_requirements';
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      const data = await getAuth(url);
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
  }, [statusFilter]);


  const filteredCompliances = compliances.filter(compliance =>
    compliance.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compliance.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  const handleDeleteCompliance = async (compliance: Compliance) => {
    if (window.confirm(`Are you sure you want to delete "${compliance.title}"?`)) {
      try {
        setIsLoading(true);
        await deleteAuth(`/compliance_requirements/${compliance.id}`);
        toast.success('Compliance requirement deleted successfully');
        fetchCompliances();
      } catch (error: any) {
        toast.error('Failed to delete compliance requirement');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSaveCompliance = () => {
    setIsDialogOpen(false);
    setIsEditDialogOpen(false);
    setEditingCompliance(null);
    fetchCompliances(); // Refresh list after save
  };

  const handleUpdateStatus = async (complianceId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      await patchAuth(`/compliance_requirements/${complianceId}`, {
        compliance_requirement: { status: newStatus }
      });
      toast.success('Status updated successfully');
      fetchCompliances();
    } catch (error: any) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditDialogOpen(false);
    setEditingCompliance(null);
  };

  const handleViewCompliance = (id: number) => {
    navigate(`/masters/compliances/${id}`);
  };

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader title="Compliances Master" description="Manage property compliance requirements and tracking" backTo="/masters" />
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Add New Compliance</DialogTitle>
              <DialogDescription className="text-gray-600">Create a new compliance requirement</DialogDescription>
            </DialogHeader>
            <ComplianceForm
              onSave={handleSaveCompliance}
              onCancel={() => { }}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div>
        {isLoading ? (
          <div className="text-center py-8 text-gray-500">Loading compliance requirements...</div>
        ) : (
          <ComplianceTable
        leftActions={
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
              <Plus className="w-4 h-4 mr-2" />
              Add Compliance
            </Button>

            <TableFilterDialog
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              onApply={() => setStatusFilter(pendingStatus)}
              onReset={() => {
                setPendingStatus('all');
                setStatusFilter('all');
              }}
            >
              <FilterField label="Status">
                <Select value={pendingStatus} onValueChange={setPendingStatus}>
                  <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Overdue">Overdue</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
            </TableFilterDialog>
          </div>
        }
        compliances={filteredCompliances}
        onFilterClick={() => {
          setPendingStatus(statusFilter);
          setIsFilterOpen(true);
        }}
        onEdit={handleEditCompliance}
        onDelete={handleDeleteCompliance}
        onView={handleViewCompliance}
        onStatusUpdate={handleUpdateStatus}
          />
        )}
      </div>

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
    </PageContainer>
  );
};

export default CompliancesMaster;
