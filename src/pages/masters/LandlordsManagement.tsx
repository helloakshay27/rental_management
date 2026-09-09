
import React, { useState, useEffect } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Edit, Trash2, Eye, Phone, Mail, Building } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface Landlord {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  pan: string;
  gst: string;
  aadhaar_number: string;
  user_id: number;
  status: string;
  bank_details?: {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    account_type: string;
    bank_branch: string;
  }[];
}

const columns: ColumnConfig[] = [
  { key: 'contact_person', label: 'Landlord Details', sortable: true, draggable: true },
  { key: 'email', label: 'Contact Info', sortable: true, draggable: true },
  { key: 'pan', label: 'Tax Details', sortable: false, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const LandlordsManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [landlords, setLandlords] = useState<Landlord[]>([]);
  const [loadingLandlords, setLoadingLandlords] = useState(true);
  const [editingLandlord, setEditingLandlord] = useState<any>(null);

  const [formData, setFormData] = useState({
    company_name: '',
    contact_person: '',
    email: '',
    phone: '',
    pan: '',
    gst: '',
    aadhaar_number: '',
    user_id: 1,
    // Bank Details
    bank_account_number: '',
    bank_name: '',
    bank_ifsc_code: '',
    bank_account_type: '',
    bank_branch: '',
    status: 'Active'
  });

  const fetchLandlords = async () => {
    try {
      setIsLoading(true);
      setLoadingLandlords(true);
      let url = '/landlords';
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
        setLandlords(data);
      }
    } catch (error: any) {
      console.error('Failed to fetch landlords', error);
      toast.error('Failed to load landlords');
    } finally {
      setLoadingLandlords(false);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLandlords();
  }, [statusFilter]);

  const handleEditLandlord = async (landlordId: number) => {
    try {
      setIsLoading(true);
      const landlordData = await getAuth(`/landlords/${landlordId}`);
      const data = landlordData?.landlord || landlordData;

      setEditingLandlord(data);
      setFormData({
        company_name: data.company_name || '',
        contact_person: data.contact_person || '',
        email: data.email || '',
        phone: data.phone || '',
        pan: data.pan || '',
        gst: data.gst || '',
        aadhaar_number: data.aadhaar_number || '',
        user_id: data.user_id || 1,
        // Bank Details - get first bank detail if exists
        bank_account_number: data.bank_details?.[0]?.account_number || '',
        bank_name: data.bank_details?.[0]?.bank_name || '',
        bank_ifsc_code: data.bank_details?.[0]?.ifsc_code || '',
        bank_account_type: data.bank_details?.[0]?.account_type || '',
        bank_branch: data.bank_details?.[0]?.bank_branch || '',
        status: data.status || 'Active'
      });
      setIsDialogOpen(true);
    } catch (error: any) {
      toast.error('Failed to fetch landlord details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingLandlord(null);
    setFormData({
      company_name: '',
      contact_person: '',
      email: '',
      phone: '',
      pan: '',
      gst: '',
      aadhaar_number: '',
      user_id: 1,
      bank_account_number: '',
      bank_name: '',
      bank_ifsc_code: '',
      bank_account_type: '',
      bank_branch: '',
      status: 'Active'
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!formData.contact_person.trim() || !formData.email.trim() || !formData.phone.trim()) {
        toast.error('Name, email, and phone are required');
        return;
      }

      // Prepare payload
      const payload: any = {
        landlord: {
          company_name: formData.company_name,
          contact_person: formData.contact_person,
          email: formData.email,
          phone: formData.phone,
          pan: formData.pan,
          gst: formData.gst,
          aadhaar_number: formData.aadhaar_number,
          user_id: formData.user_id,
          status: formData.status
        }
      };

      // Add bank details if any field is filled
      if (formData.bank_account_number) {
        payload.landlord.bank_details_attributes = [
          {
            account_number: formData.bank_account_number,
            bank_name: formData.bank_name,
            ifsc_code: formData.bank_ifsc_code,
            account_type: formData.bank_account_type,
            bank_branch: formData.bank_branch
          }
        ];
      }

      // Make API call - PATCH for editing, POST for creating
      if (editingLandlord) {
        await patchAuth(`/landlords/${editingLandlord.id}`, payload);
        toast.success('Landlord updated successfully');
      } else {
        await postAuth('/landlords', payload);
        toast.success('Landlord created successfully');
      }

      // Reset form and close dialog
      handleCloseDialog();

      // Refresh landlords list
      fetchLandlords();

    } catch (error: any) {
      let errorMessage = editingLandlord ? 'Failed to update landlord' : 'Failed to create landlord';

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

  const handleDeleteLandlord = async (landlordId: number) => {
    if (window.confirm('Are you sure you want to delete this landlord?')) {
      try {
        setIsLoading(true);
        await deleteAuth(`/landlords/${landlordId}`);
        toast.success('Landlord deleted successfully');
        fetchLandlords();
      } catch (error: any) {
        toast.error('Failed to delete landlord');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (landlordId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      await patchAuth(`/landlords/${landlordId}`, {
        landlord: { status: newStatus }
      });
      toast.success('Status updated successfully');
      fetchLandlords();
    } catch (error: any) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLandlords = landlords.filter(landlord =>
    landlord.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCell = (landlord: Landlord, columnKey: string) => {
    switch (columnKey) {
      case 'contact_person':
        return (
          <div>
            <p className="font-medium">{landlord.contact_person || landlord.company_name}</p>
            <p className="text-brand-body-5 text-brand-text-light">ID: {landlord.id}</p>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-1">
            <div className="flex items-center text-brand-body-5">
              <Mail className="h-3 w-3 mr-1" />
              {landlord.email}
            </div>
            <div className="flex items-center text-brand-body-5">
              <Phone className="h-3 w-3 mr-1" />
              {landlord.phone}
            </div>
          </div>
        );
      case 'pan':
        return (
          <div>
            {landlord.pan && <p className="text-brand-body-5">PAN: {landlord.pan}</p>}
            {landlord.gst && <p className="text-brand-body-5">GST: {landlord.gst}</p>}
          </div>
        );
      case 'status':
        return (
          <Select
            value={landlord.status || 'Active'}
            onValueChange={(value) => handleUpdateStatus(landlord.id, value)}
          >
            <SelectTrigger
              className={`w-32 h-8 ${landlord.status?.toLowerCase() === 'active'
                ? 'bg-brand-success-bg text-brand-success'
                : 'bg-brand-muted text-brand-text'}`}
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
        return landlord[columnKey as keyof Landlord] as React.ReactNode;
    }
  };

  const renderActions = (landlord: Landlord) => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/landlords/${landlord.id}`)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditLandlord(landlord.id)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteLandlord(landlord.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
        <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Add Landlord
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
        <PageHeader title="Landlords Management" description="Manage landlord profiles, properties, and contact details" backTo="/masters" />
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogContent className="max-w-3xl bg-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">
                {editingLandlord ? 'Edit Landlord' : 'Add New Landlord'}
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                {editingLandlord ? 'Update landlord information' : 'Enter landlord business and contact information'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Basic Information */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 ">
                  <Label htmlFor="company-name" className="text-gray-900 font-medium">Company Name *</Label>
                  <Input
                    id="company-name"
                    placeholder="Enter business name"
                    value={formData.company_name}
                    onChange={(e) => setFormData(prev => ({ ...prev, company_name: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2 ">
                  <Label htmlFor="contact-person" className="text-gray-900 font-medium">Landlord / Contact Person Name (LESSOR) *</Label>
                  <Input
                    id="contact-person"
                    placeholder="Enter name"
                    value={formData.contact_person}
                    onChange={(e) => setFormData(prev => ({ ...prev, contact_person: e.target.value }))}
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
                  <Label htmlFor="phone" className="text-gray-900 font-medium">Phone *</Label>
                  <Input
                    id="phone"
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] text-gray-900"
                  />
                </div>
              </div>

              {/* Tax & Identity Details */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="pan" className="text-gray-900 font-medium">PAN Number</Label>
                  <Input
                    id="pan"
                    placeholder="Enter PAN number"
                    value={formData.pan}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                    className="bg-white border-gray-300 text-gray-900"
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gst" className="text-gray-900 font-medium">GST Number</Label>
                  <Input
                    id="gst"
                    placeholder="Enter GST number"
                    value={formData.gst}
                    onChange={(e) => setFormData(prev => ({ ...prev, gst: e.target.value.toUpperCase() }))}
                    className="bg-white border-gray-300 text-gray-900"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="aadhar" className="text-gray-900 font-medium">Aadhar Number</Label>
                  <Input
                    id="aadhar"
                    placeholder="Enter Aadhar number"
                    value={formData.aadhaar_number}
                    onChange={(e) => setFormData(prev => ({ ...prev, aadhaar_number: e.target.value }))}
                    className="bg-white border-gray-300 text-gray-900"
                    maxLength={12}
                  />
                </div>
              </div>

              {/* Bank Details */}
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Bank Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-number" className="text-gray-900 font-medium">Account Number</Label>
                    <Input
                      id="account-number"
                      placeholder="Enter account number"
                      value={formData.bank_account_number}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_account_number: e.target.value }))}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bank-name" className="text-gray-900 font-medium">Bank Name</Label>
                    <Input
                      id="bank-name"
                      placeholder="e.g., HDFC Bank"
                      value={formData.bank_name}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_name: e.target.value }))}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc-code" className="text-gray-900 font-medium">IFSC Code</Label>
                    <Input
                      id="ifsc-code"
                      placeholder="e.g., HDFC0001234"
                      value={formData.bank_ifsc_code}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_ifsc_code: e.target.value.toUpperCase() }))}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="account-type" className="text-gray-900 font-medium">Account Type</Label>
                    <select
                      id="account-type"
                      value={formData.bank_account_type}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_account_type: e.target.value }))}
                      className="w-full p-2 border-gray-300 hover:border-[#C72030] rounded-md bg-white text-gray-900 focus:border-[#C72030] focus:ring-[#C72030] focus:outline-none"
                    >
                      <option value="">Select account type</option>
                      <option value="Savings">Savings</option>
                      <option value="Current">Current</option>
                      <option value="Cash Credit">Cash Credit</option>
                      <option value="Overdraft">Overdraft</option>
                    </select>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="bank-branch" className="text-gray-900 font-medium">Bank Branch</Label>
                    <Input
                      id="bank-branch"
                      placeholder="e.g., Mumbai - Andheri East"
                      value={formData.bank_branch}
                      onChange={(e) => setFormData(prev => ({ ...prev, bank_branch: e.target.value }))}
                      className="bg-white border-gray-300 text-gray-900"
                    />
                  </div>
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
                {isLoading ? 'Saving...' : (editingLandlord ? 'Update Landlord' : 'Save Landlord')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <EnhancedTable
          data={filteredLandlords}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(landlord) => String(landlord.id)}
          storageKey="landlords-master-table"
          emptyMessage="No landlords found"
          loading={loadingLandlords}
          loadingMessage="Loading landlords..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search landlords..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
          setPendingStatus(statusFilter);
          setIsFilterOpen(true);
          }}
          exportFileName="landlords"
          pagination={true}
          pageSize={10}
        />
      </div>
    </PageContainer>
  );
};

export default LandlordsManagement;
