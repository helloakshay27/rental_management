
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
import { Plus, Edit, Trash2, Building } from 'lucide-react';
import { postAuth, getAuth, deleteAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface FacilityType {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Facility Name', sortable: true, draggable: true },
    { key: 'description', label: 'Description', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const FacilityTypesManagement = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingFacility, setEditingFacility] = useState<FacilityType | null>(null);
    const [facilityTypes, setFacilityTypes] = useState<FacilityType[]>([]);
    const [loadingData, setLoadingData] = useState(true);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        status: 'Active'
    });

    const fetchFacilityTypes = async () => {
        try {
            setLoadingData(true);
            const data = await getAuth('/facility_types');
            setFacilityTypes(data);
        } catch (error: any) {
            toast.error("Failed to fetch facility types");
        } finally {
            setLoadingData(false);
        }
    };

    useEffect(() => {
        fetchFacilityTypes();
    }, []);

    const filteredFacilities = facilityTypes.filter(facility =>
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (facility.description && facility.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleEditFacility = (facility: FacilityType) => {
        setEditingFacility(facility);
        setFormData({
            name: facility.name,
            description: facility.description || '',
            status: facility.status || 'Active'
        });
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingFacility(null);
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
                facility_type: {
                    name: formData.name,
                    description: formData.description,
                    status: formData.status
                }
            };

            if (editingFacility) {
                await patchAuth(`/facility_types/${editingFacility.id}`, payload);
                toast.success("Facility type updated successfully");
            } else {
                await postAuth('/facility_types', payload);
                toast.success("Facility type created successfully");
            }

            handleCloseDialog();
            fetchFacilityTypes();
        } catch (error: any) {
            let errorMessage = editingFacility ? "Failed to update facility type" : "Failed to create facility type";
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

    const handleDeleteFacility = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this facility type?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/facility_types/${id}`);
                toast.success('Facility type deleted successfully');
                fetchFacilityTypes();
            } catch (error: any) {
                toast.error('Failed to delete facility type');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            setIsLoading(true);
            await patchAuth(`/facility_types/${id}`, {
                facility_type: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchFacilityTypes();
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCell = (facility: FacilityType, columnKey: string) => {
        switch (columnKey) {
            case 'name':

                return (
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-md bg-brand-light flex items-center justify-center mr-3">
                            <Building className="h-5 w-5 text-brand" />
                        </div>
                        <span className="font-semibold text-brand-text">{facility.name}</span>
                    </div>
                );
            case 'description':
                return (
                    <span className="text-brand-text-light block max-w-md truncate">
                        {facility.description || '-'}
                    </span>
                );
            case 'status':
                return (
                    <Select
                        value={facility.status || 'Active'}
                        onValueChange={(value) => handleUpdateStatus(facility.id, value)}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 rounded-full ${facility.status?.toLowerCase() === 'active'
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
                return facility[columnKey as keyof FacilityType] as React.ReactNode;
        }
    };

    const renderActions = (facility: FacilityType) => (
        <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditFacility(facility)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" className="text-brand-error" onClick={() => handleDeleteFacility(facility.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
                        <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Facility Type
                        </Button>
                    );

    return (
        <PageContainer>
            <div className="flex items-center justify-between">
                <PageHeader title="Facility Types Management" description="Define and manage various property facility categories" backTo="/masters" />
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) handleCloseDialog();
                }}>
                    <DialogContent className="max-w-md bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">{editingFacility ? 'Edit Facility Type' : 'Add New Facility Type'}</DialogTitle>
                            <DialogDescription className="text-gray-600">Enter the details for the facility category</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-gray-900 font-medium font-outfit">Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., Office, Gym, Parking"
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
                                    placeholder="Enter facility description"
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
                                {isLoading ? (editingFacility ? 'Updating...' : 'Adding...') : (editingFacility ? 'Update Facility' : 'Add Facility')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={filteredFacilities}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(facility) => String(facility.id)}
                    storageKey="facility-types-master-table"
                    leftActions={leftActions}
                    emptyMessage="No facility types found"
                    loading={loadingData}
                    loadingMessage="Loading facility types..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search facility types..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    exportFileName="facility-types"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
};

export default FacilityTypesManagement;
