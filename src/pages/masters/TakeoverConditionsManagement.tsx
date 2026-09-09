
import React, { useState, useEffect } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Layout } from 'lucide-react';
import { postAuth, getAuth, deleteAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface TakeoverCondition {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Condition Name', sortable: true, draggable: true },
    { key: 'description', label: 'Description', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const TakeoverConditionsManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCondition, setEditingCondition] = useState<TakeoverCondition | null>(null);
    const [conditions, setConditions] = useState<TakeoverCondition[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active'
    });

    const fetchConditions = async () => {
        try {
            setLoadingData(true);
            const data = await getAuth('/property_takeover_conditions');
            setConditions(data);
        } catch (error: any) {
            toast.error("Failed to fetch takeover conditions");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchConditions();
    }, []);

    const filteredConditions = conditions.filter(condition =>
        (condition.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (condition.description?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleEditCondition = (condition: TakeoverCondition) => {
        setEditingCondition(condition);
        setFormData({
            name: condition.name,
            description: condition.description,
            status: condition.status || 'Active'
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCondition(null);
        setFormData({
            name: '',
            description: '',
            status: 'Active'
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            if (!formData.name.trim()) {
                toast.error("Name is required");
                return;
            }

            const payload = {
                property_takeover_condition: {
                    name: formData.name,
                    description: formData.description,
                    status: formData.status
                }
            };

            if (editingCondition) {
                await patchAuth(`/property_takeover_conditions/${editingCondition.id}`, payload);
                toast.success("Condition updated successfully");
            } else {
                await postAuth('/property_takeover_conditions', payload);
                toast.success("Condition created successfully");
            }

            handleCloseDialog();
            fetchConditions();
        } catch (error: any) {
            let errorMessage = editingCondition ? "Failed to update condition" : "Failed to create condition";
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(", ");
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteCondition = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this condition?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/property_takeover_conditions/${id}`);
                toast.success('Condition deleted successfully');
                fetchConditions();
            } catch (error: any) {
                toast.error('Failed to delete condition');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            setIsLoading(true);
            await patchAuth(`/property_takeover_conditions/${id}`, {
                property_takeover_condition: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchConditions();
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCell = (condition: TakeoverCondition, columnKey: string) => {
        switch (columnKey) {
            case 'name':

                return (
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md bg-brand-light flex items-center justify-center mr-3">
                            <Layout className="h-5 w-5 text-brand" />
                        </div>
                        <span className="font-semibold text-brand-text">{condition.name}</span>
                    </div>
                );
            case 'description':
                return (
                    <span className="text-brand-text-light block max-w-md truncate">
                        {condition.description || '-'}
                    </span>
                );
            case 'status':
                return (
                    <Select
                        value={condition.status || 'Active'}
                        onValueChange={(value) => handleUpdateStatus(condition.id, value)}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 rounded-full ${condition.status?.toLowerCase() === 'active'
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
                return condition[columnKey as keyof TakeoverCondition] as React.ReactNode;
        }
    };

    const renderActions = (condition: TakeoverCondition) => (
        <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditCondition(condition)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" className="text-brand-error" onClick={() => handleDeleteCondition(condition.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
                        <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Condition
                        </Button>
                    );

    return (
        <PageContainer>
            <div className="flex items-center justify-between">
                <PageHeader title="Property Takeover Conditions" description="Manage conditions under which properties are taken over" backTo="/masters" />
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) handleCloseDialog();
                }}>
                    <DialogContent className="max-w-md bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">{editingCondition ? 'Edit Condition' : 'Add New Condition'}</DialogTitle>
                            <DialogDescription className="text-gray-600">Enter the details for the property takeover condition</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-900 font-medium font-outfit">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Fully Furnished"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-white border-2 border-gray-100 focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 h-12 rounded-xl"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-gray-900 font-medium font-outfit">Status *</Label>
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
                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-900 font-medium font-outfit">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Enter condition description"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-white border-2 border-gray-100 focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 min-h-[100px] rounded-xl"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end space-x-2">
                            <Button
                                variant="outline"
                                className="border-2 border-gray-100 text-gray-600 hover:bg-gray-50 h-11 rounded-xl px-6"
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
                                {isLoading ? (editingCondition ? 'Updating...' : 'Adding...') : (editingCondition ? 'Update Condition' : 'Add Condition')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={filteredConditions}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(condition) => String(condition.id)}
                    storageKey="takeover-conditions-master-table"
                    leftActions={leftActions}
                    emptyMessage="No conditions found"
                    loading={loadingData}
                    loadingMessage="Loading conditions..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search conditions..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    exportFileName="takeover-conditions"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
};

export default TakeoverConditionsManagement;
