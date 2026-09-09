

import React, { useState, useEffect } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Edit, Trash2, Eye, Phone, Mail, MapPin } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Lessee Details', sortable: true, draggable: true },
  { key: 'email', label: 'Contact Info', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const TenantsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [tenants, setTenants] = useState<any[]>([]);
  const [loadingTenants, setLoadingTenants] = useState(true);
  const [editingTenant, setEditingTenant] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    alternate_phone: '',
    designation: '',
    permanent_address: '',
    company_name: '',
    aadhar_number: '',
    pan_number: '',
    status: 'Active'
  });

  const fetchTenants = async () => {
    try {
      setLoadingTenants(true);
      let url = '/tenants';
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
        setTenants(data);
      }
    } catch (error: any) {
      console.error('Failed to fetch tenants', error);
      toast.error('Failed to load lessees');
    } finally {
      setLoadingTenants(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [statusFilter]);

  const handleEditTenant = async (tenantId: number) => {
    try {
      setIsLoading(true);
      const tenantData = await getAuth(`/tenants/${tenantId}`);
      // Based on typical API responses, check if data is nested under 'tenant' or direct
      const data = tenantData?.tenant || tenantData;

      setEditingTenant(data);
      setFormData({
        name: data.full_name || '',
        email: data.email || '',
        phone: data.phone || '',
        alternate_phone: data.alternate_phone || '',
        designation: data.designation || '',
        permanent_address: data.permanent_address || '',
        company_name: data.company_name || '',
        aadhar_number: data.aadhar_number || '',
        pan_number: data.pan_number || '',
        status: data.status || 'Active'
      });
      setIsDialogOpen(true);
    } catch (error: any) {
      console.error('Failed to fetch lessee details', error);
      toast.error('Failed to fetch lessee details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingTenant(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      alternate_phone: '',
      designation: '',
      permanent_address: '',
      company_name: '',
      aadhar_number: '',
      pan_number: '',
      status: 'Active'
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
        toast.error('Name, email, and phone are required');
        return;
      }

      // Prepare payload
      const payload = {
        tenant: {
          full_name: formData.name,
          email: formData.email,
          phone: formData.phone,
          alternate_phone: formData.alternate_phone,
          designation: formData.designation,
          permanent_address: formData.permanent_address,
          company_name: formData.company_name,
          aadhar_number: formData.aadhar_number,
          pan_number: formData.pan_number,
          status: formData.status,
          is_active: formData.status === 'Active'
        }
      };

      // Make API call
      if (editingTenant) {
        await patchAuth(`/tenants/${editingTenant.id}`, payload);
        toast.success('Lessee updated successfully');
      } else {
        await postAuth('/tenants', payload);
        toast.success('Lessee created successfully');
      }

      // Reset form and close dialog
      handleCloseDialog();

      // Refresh tenants list
      fetchTenants();

    } catch (error: any) {
      let errorMessage = editingTenant ? 'Failed to update lessee' : 'Failed to create lessee';

      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
        errorMessage = error.response.errors.join(', ');
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTenant = async (tenantId: number) => {
    if (window.confirm('Are you sure you want to delete this lessee?')) {
      try {
        setIsLoading(true);
        await deleteAuth(`/tenants/${tenantId}`);
        toast.success('Lessee deleted successfully');
        fetchTenants();
      } catch (error: any) {
        toast.error('Failed to delete lessee');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (tenantId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      await patchAuth(`/tenants/${tenantId}`, {
        tenant: { 
          status: newStatus,
          is_active: newStatus === 'Active'
        }
      });
      toast.success('Status updated successfully');
      fetchTenants();
    } catch (error: any) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredTenants = tenants.filter(tenant =>
    tenant.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.phone?.includes(searchTerm) ||
    tenant.company_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCell = (tenant: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className="font-medium">{tenant.name}</p>
            <p className="text-brand-body-5 text-brand-text-light">ID: {tenant.id}</p>
            <p className="text-brand-body-5 text-brand-text-light">PAN: {tenant.pan}</p>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-1">
            <div className="flex items-center text-brand-body-5">
              <Mail className="h-3 w-3 mr-1" />
              {tenant.email}
            </div>
            <div className="flex items-center text-brand-body-5">
              <Phone className="h-3 w-3 mr-1" />
              {tenant.phone}
            </div>
          </div>
        );
      case 'status':
        return (
          <Select
            value={tenant.is_active === false ? 'Inactive' : (tenant.status || 'Active')}
            onValueChange={(value) => handleUpdateStatus(tenant.id, value)}
          >
            <SelectTrigger
              className={`w-32 h-8 ${tenant.is_active === false || tenant.status?.toLowerCase() === 'inactive'
                ? 'bg-brand-muted text-brand-text'
                : 'bg-brand-success-bg text-brand-success'}`}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return tenant[columnKey];
    }
  };

  const renderActions = (tenant: any) => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/tenants/${tenant.id}`)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditTenant(tenant.id)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteTenant(tenant.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
        <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Lessee
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
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </FilterField>
        </TableFilterDialog>
    </div>
  );

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader title="Lessee Management" description="Manage lessee information, documents, and profiles" backTo="/masters" />
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">
                {editingTenant ? 'Edit Lessee' : 'Add New Lessee'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingTenant ? 'Update lessee details' : 'Enter lessee details and documentation'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 font-medium">Full Name (LESSEE) *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-900 font-medium">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-900 font-medium">Phone Number *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternate_phone" className="text-gray-900 font-medium">Alternate Phone</Label>
                  <Input
                    id="alternate_phone"
                    placeholder="Enter alternate phone"
                    value={formData.alternate_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, alternate_phone: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
              </div>

              {/* Professional Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name" className="text-gray-900 font-medium">Company Name</Label>
                  <Input
                    id="company_name"
                    placeholder="Enter company name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-gray-900 font-medium">Designation</Label>
                  <Input
                    id="designation"
                    placeholder="Enter designation"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="permanent_address" className="text-gray-900 font-medium">Permanent Address</Label>
                <Textarea
                  id="permanent_address"
                  placeholder="Enter permanent address"
                  value={formData.permanent_address}
                  onChange={(e) => setFormData(prev => ({ ...prev, permanent_address: e.target.value }))}
                  className="bg-white border-gray-300 text-gray-900"
                  rows={3}
                />
              </div>

              {/* ID Proof */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhar" className="text-gray-900 font-medium">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    placeholder="Enter Aadhar number"
                    value={formData.aadhar_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, aadhar_number: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-900"
                    maxLength={12}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-gray-900 font-medium">PAN Number</Label>
                  <Input
                    id="pan"
                    placeholder="Enter PAN number"
                    value={formData.pan_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan_number: e.target.value.toUpperCase() }))}
                    className="bg-white border-gray-300 text-gray-900"
                    maxLength={10}
                  />
                </div>
              </div>

              {/* Status Field */}
              <div className="space-y-2">
                <Label className="text-gray-900 font-medium">Status *</Label>
                <div className="flex items-center space-x-6 pt-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'Active'}
                      onChange={() => setFormData(prev => ({ ...prev, status: 'Active' }))}
                      className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={formData.status === 'Inactive'}
                      onChange={() => setFormData(prev => ({ ...prev, status: 'Inactive' }))}
                      className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                    />
                    <span className="text-sm text-gray-700">Inactive</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={handleCloseDialog}
                disabled={isLoading}
                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="fm-button-fix fm-button-brand px-6 py-2"
              >
                {isLoading ? 'Saving...' : (editingTenant ? 'Update Lessee' : 'Save Lessee')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <EnhancedTable
          data={filteredTenants}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(tenant) => String(tenant.id)}
          storageKey="lessees-master-table"
          emptyMessage="No lessees found"
          loading={loadingTenants}
          loadingMessage="Loading lessees..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search lessees..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
          setPendingStatus(statusFilter);
          setIsFilterOpen(true);
          }}
          exportFileName="lessees"
          pagination={true}
          pageSize={10}
        />
      </div>
    </PageContainer>
  );
};

export default TenantsManagement;

