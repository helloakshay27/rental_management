
import React, { useState, useEffect } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Edit, Trash2, Settings2, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface LeaseCustomField {
    id: number;
    name: string;
    field_type: string;
    required: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Field Information', sortable: true, draggable: true },
    { key: 'field_type', label: 'Type', sortable: true, draggable: true },
    { key: 'required', label: 'Required', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const LeaseCustomFieldsManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingField, setEditingField] = useState<LeaseCustomField | null>(null);
    const [customFields, setCustomFields] = useState<LeaseCustomField[]>([]);
    const [loadingFields, setLoadingFields] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        field_type: 'text',
        required: false,
        status: 'Active'
    });

    const fetchCustomFields = async () => {
        try {
            setLoadingFields(true);
            let url = '/lease_custom_fields?per_page=100';
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('status', statusFilter);
            }
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            const response = await getAuth(url);
            // Handle new response format { data: [], meta: {} }
            const fields = response?.data || response;
            if (Array.isArray(fields)) {
                setCustomFields(fields);
            }
        } catch (error: any) {
            console.error('Failed to fetch custom fields', error);
            toast.error('Failed to load custom fields');
        } finally {
            setLoadingFields(false);
        }
    };

    useEffect(() => {
        fetchCustomFields();
    }, [statusFilter]);

    const filteredFields = customFields.filter(field =>
        field.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        field.field_type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditField = async (field: LeaseCustomField) => {
        try {
            setIsLoading(true);
            const response = await getAuth(`/lease_custom_fields/${field.id}`);
            const data = response?.data || response?.lease_custom_field || response;

            setEditingField(data);
            setFormData({
                name: data.name || '',
                field_type: data.field_type || 'text',
                required: data.required || false,
                status: data.status || 'Active'
            });
            setIsDialogOpen(true);
        } catch (error: any) {
            toast.error('Failed to fetch custom field details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingField(null);
        setFormData({
            name: '',
            field_type: 'text',
            required: false,
            status: 'Active'
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validation
            if (!formData.name.trim()) {
                toast.error('Field name is required');
                return;
            }

            // Prepare payload
            const payload = {
                lease_custom_field: {
                    name: formData.name,
                    field_type: formData.field_type,
                    required: formData.required,
                    status: formData.status
                }
            };

            // Make API call
            if (editingField) {
                await patchAuth(`/lease_custom_fields/${editingField.id}`, payload);
                toast.success('Custom field updated successfully');
            } else {
                await postAuth('/lease_custom_fields', payload);
                toast.success('Custom field created successfully');
            }

            // Reset form and close dialog
            handleCloseDialog();

            // Refresh list
            fetchCustomFields();

        } catch (error: any) {
            let errorMessage = editingField ? 'Failed to update custom field' : 'Failed to create custom field';
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

    const handleDeleteField = async (fieldId: number) => {
        if (window.confirm('Are you sure you want to delete this custom field?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/lease_custom_fields/${fieldId}`);
                toast.success('Custom field deleted successfully');
                fetchCustomFields();
            } catch (error: any) {
                toast.error('Failed to delete custom field');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (fieldId: number, newStatus: string) => {
        try {
            setIsLoading(true);
            await patchAuth(`/lease_custom_fields/${fieldId}`, {
                lease_custom_field: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchCustomFields();
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCell = (field: LeaseCustomField, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div>
                        <div className="flex items-center mb-1">
                            <Settings2 className="h-4 w-4 mr-2 text-brand" />
                            <p className="font-medium">{field.name}</p>
                        </div>
                        <p className="text-brand-caption text-brand-text-light">ID: {field.id}</p>
                    </div>
                );
            case 'field_type':
                return <Badge variant="secondary" className="capitalize">{field.field_type}</Badge>;
            case 'required':
                return field.required ? (
                    <Badge variant="destructive">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Yes
                    </Badge>
                ) : (
                    <Badge variant="outline" className="text-brand-text-light">
                        <XCircle className="h-3 w-3 mr-1" />
                        No
                    </Badge>
                );
            case 'status':
                return (
                    <Select
                        value={field.status || 'Active'}
                        onValueChange={(value) => handleUpdateStatus(field.id, value)}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 ${field.status?.toLowerCase() === 'active'
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
                return field[columnKey as keyof LeaseCustomField] as React.ReactNode;
        }
    };

    const renderActions = (field: LeaseCustomField) => (
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/lease-custom-fields/${field.id}`)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditField(field)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteField(field.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Field
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
                <PageHeader title="Lease Custom Fields" description="Manage custom fields for lease agreements" backTo="/masters" />
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">
                                {editingField ? 'Edit Custom Field' : 'Add New Custom Field'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editingField ? 'Update the custom field details below' : 'Define a new custom field for leases'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="field-name" className="text-gray-900 font-medium">Field Name *</Label>
                                    <Input
                                        id="field-name"
                                        placeholder="e.g., Floor Number"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="field-type" className="text-gray-900 font-medium">Field Type *</Label>
                                    <Select
                                        value={formData.field_type}
                                        onValueChange={(value) => setFormData(prev => ({ ...prev, field_type: value }))}
                                    >
                                        <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent className="bg-white">
                                            <SelectItem value="text">Text</SelectItem>
                                            <SelectItem value="number">Number</SelectItem>
                                            <SelectItem value="date">Date</SelectItem>
                                            <SelectItem value="boolean">Boolean</SelectItem>
                                            <SelectItem value="textarea">Long Text</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="flex items-center space-x-2 py-2">
                                <Switch
                                    id="required-toggle"
                                    checked={formData.required}
                                    onCheckedChange={(checked) => setFormData(prev => ({ ...prev, required: checked }))}
                                />
                                <Label htmlFor="required-toggle" className="text-gray-900 font-medium cursor-pointer">
                                    Is this field required?
                                </Label>
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
                                className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700"
                                onClick={handleCloseDialog}
                                disabled={isLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                className="fm-button-fix fm-button-brand px-6 py-2"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingField ? 'Updating...' : 'Creating...') : (editingField ? 'Update Field' : 'Save Field')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={filteredFields}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(field) => String(field.id)}
                    storageKey="lease-custom-fields-master-table"
                    emptyMessage="No custom fields found"
                    loading={loadingFields}
                    loadingMessage="Loading custom fields..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search fields..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    leftActions={leftActions}
                    onFilterClick={() => {
                        setPendingStatus(statusFilter);
                        setIsFilterOpen(true);
                    }}
                    exportFileName="lease-custom-fields"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
};

export default LeaseCustomFieldsManagement;
