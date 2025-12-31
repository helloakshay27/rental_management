

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Phone, Mail, MapPin, ChevronLeft } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const TenantsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
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
      toast.error('Failed to load tenants');
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
      console.error('Failed to fetch tenant details', error);
      toast.error('Failed to fetch tenant details');
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
          status: formData.status
        }
      };

      // Make API call
      if (editingTenant) {
        await patchAuth(`/tenants/${editingTenant.id}`, payload);
        toast.success('Tenant updated successfully');
      } else {
        await postAuth('/tenants', payload);
        toast.success('Tenant created successfully');
      }

      // Reset form and close dialog
      handleCloseDialog();

      // Refresh tenants list
      fetchTenants();

    } catch (error: any) {
      let errorMessage = editingTenant ? 'Failed to update tenant' : 'Failed to create tenant';

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
    if (window.confirm('Are you sure you want to delete this tenant?')) {
      try {
        setIsLoading(true);
        await deleteAuth(`/tenants/${tenantId}`);
        toast.success('Tenant deleted successfully');
        fetchTenants();
      } catch (error: any) {
        toast.error('Failed to delete tenant');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (tenantId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      await patchAuth(`/tenants/${tenantId}`, {
        tenant: { status: newStatus }
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/masters')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tenants Management</h1>
            <p className="text-gray-600">Manage tenant information, documents, and profiles</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tenant
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-semibold text-xl">
                {editingTenant ? 'Edit Tenant' : 'Add New Tenant'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingTenant ? 'Update tenant details' : 'Enter tenant details and documentation'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-900 font-medium">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                    className="bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-900 font-medium">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="alternate_phone" className="text-gray-900 font-medium">Alternate Phone</Label>
                  <Input
                    id="alternate_phone"
                    placeholder="Enter alternate phone"
                    value={formData.alternate_phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, alternate_phone: e.target.value }))}
                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="designation" className="text-gray-900 font-medium">Designation</Label>
                  <Input
                    id="designation"
                    placeholder="Enter designation"
                    value={formData.designation}
                    onChange={(e) => setFormData(prev => ({ ...prev, designation: e.target.value }))}
                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                  className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                    className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                className="bg-[#C72030] hover:bg-[#A01825] text-white"
              >
                {isLoading ? 'Saving...' : (editingTenant ? 'Update Tenant' : 'Save Tenant')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Tenants Directory</CardTitle>
              <CardDescription>Complete list of all tenants in the system</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-white">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search tenants..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant Details</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Current Property</TableHead>
                <TableHead>Rent (₹)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{tenant.name}</p>
                      <p className="text-sm text-gray-500">ID: {tenant.id}</p>
                      <p className="text-sm text-gray-500">PAN: {tenant.pan}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {tenant.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {tenant.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {tenant.currentProperty ? (
                      <div>
                        <p className="font-medium">{tenant.currentProperty}</p>
                        <p className="text-sm text-gray-500">
                          {tenant.leaseStart} to {tenant.leaseEnd}
                        </p>
                      </div>
                    ) : (
                      <span className="text-gray-400">No active lease</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {tenant.rent ? (
                      <span className="font-medium">₹{tenant.rent.toLocaleString()}</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={tenant.status || 'Active'}
                      onValueChange={(value) => handleUpdateStatus(tenant.id, value)}
                    >
                      <SelectTrigger className={`w-32 h-8 ${tenant.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/tenants/${tenant.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditTenant(tenant.id)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteTenant(tenant.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantsManagement;

