
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Settings2, ChevronLeft, Eye, CheckCircle2, XCircle } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface LeaseCustomField {
    id: number;
    name: string;
    field_type: string;
    required: boolean;
    status: string;
    created_at: string;
    updated_at: string;
}

const LeaseCustomFieldsManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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
            let url = '/lease_custom_fields';
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
                        <h1 className="text-2xl font-bold text-gray-900">Lease Custom Fields</h1>
                        <p className="text-gray-600">Manage custom fields for lease agreements</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Field
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">
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
                                className="bg-[#C72030] hover:bg-[#A01825] text-white"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingField ? 'Updating...' : 'Creating...') : (editingField ? 'Update Field' : 'Save Field')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Custom Fields Directory</CardTitle>
                            <CardDescription>Configure additional data points for your lease agreements</CardDescription>
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
                                    placeholder="Search fields..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingFields ? (
                        <div className="text-center py-8 text-gray-500">Loading custom fields...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Field Information</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Required</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredFields.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No custom fields found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredFields.map((field) => (
                                        <TableRow key={field.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <Settings2 className="h-4 w-4 mr-2 text-[#C72030]" />
                                                        <p className="font-medium text-gray-900">{field.name}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">ID: {field.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="capitalize">
                                                    {field.field_type}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                {field.required ? (
                                                    <Badge className="bg-red-100 text-red-700 hover:bg-red-100 border-red-200">
                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                        Yes
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="text-gray-400">
                                                        <XCircle className="h-3 w-3 mr-1" />
                                                        No
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={field.status || 'Active'}
                                                    onValueChange={(value) => handleUpdateStatus(field.id, value)}
                                                >
                                                    <SelectTrigger className={`w-32 h-8 ${field.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
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
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/lease-custom-fields/${field.id}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditField(field)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteField(field.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default LeaseCustomFieldsManagement;
