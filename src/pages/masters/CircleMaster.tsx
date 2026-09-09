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
import { Plus, Edit, Trash2, MapPinned } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface City {
    id: number;
    name: string;
    code: string;
    description: string;
    pms_city: {
        id: number;
        name: string;
    };
    status: boolean;
    zone?: {
        id: number;
        name: string;
        code: string;
    };
    created_at: string;
    updated_at: string;
}

interface Region {
    id: number;
    name: string;
    code: string;
}

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Circle Details', sortable: true, draggable: true },
    { key: 'pms_city', label: 'City', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const CircleMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCircle, setEditingCircle] = useState<Region | null>(null);
    const [circles, setCircles] = useState<City[]>([]);
    const [loadingCircles, setLoadingCircles] = useState(false);
    const [cities, setCities] = useState<City[]>([]);

    const [formData, setFormData] = useState({
        city_id: '',
        name: ''
    });

    const fetchCities = async () => {
        try {
            const data = await getAuth('/pms/cities');
            if (Array.isArray(data.data)) {
                setCities(data.data);
            }
        } catch (error: any) {
            console.error('Failed to fetch cities', error);
            toast.error('Failed to load cities');
        }
    };

    const fetchCircles = async () => {
        try {
            setLoadingCircles(true);
            let url = '/pms/circles';
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('q[status_eq]', statusFilter === 'Active' ? 'true' : 'false');
            }
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            const data = await getAuth(url);
            if (Array.isArray(data.data)) {
                setCircles(data.data);
            }
        } catch (error: any) {
            let errorMessage = 'Failed to fetch cities';
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoadingCircles(false);
        }
    };

    useEffect(() => {
        fetchCircles();
        fetchCities();
    }, [statusFilter]);

    const filteredCircles = circles.filter(circle =>
        circle.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        circle.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditCircle = async (circle: City) => {
        try {
            setIsLoading(true);
            const circleData = await getAuth(`/pms/circles/${circle.id}`);
            const data = circleData?.pms_circle || circleData;

            setEditingCircle(data);
            setFormData({
                name: data.name || '',
                city_id: data.pms_city.id?.toString() || '',
            });
            setIsDialogOpen(true);
        } catch (error: any) {
            toast.error('Failed to fetch zone details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingCircle(null);
        setFormData({
            name: '',
            city_id: '',
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validation
            if (!formData.name.trim() || !formData.city_id) {
                toast.error('Circle name and city are required');
                return;
            }

            // Prepare payload
            const payload = {
                pms_circle: {
                    name: formData.name,
                    pms_city_id: parseInt(formData.city_id),
                    status: true
                }
            };

            // Make API call
            if (editingCircle) {
                await patchAuth(`/pms/circles/${editingCircle.id}`, payload);
                toast.success('Circle updated successfully');
            } else {
                await postAuth('/pms/circles', payload);
                toast.success('Circle created successfully');
            }

            // Reset form and close dialog
            handleCloseDialog();

            // Refresh zones list
            fetchCircles();

        } catch (error: any) {
            let errorMessage = editingCircle ? 'Failed to update circle' : 'Failed to create circle';

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

    const handleDeleteCircle = async (circleId: number) => {
        if (window.confirm('Are you sure you want to delete this circle?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/pms/circles/${circleId}`);
                toast.success('Circle deleted successfully');
                fetchCircles();
            } catch (error: any) {
                toast.error('Failed to delete circle');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (circleId: number, newStatus: boolean) => {
        try {
            setIsLoading(true);
            await patchAuth(`/pms/circles/${circleId}`, {
                pms_circle: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchCircles();
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCell = (circle: City, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div>
                        <div className="flex items-center mb-1">
                            <MapPinned className="h-4 w-4 mr-2 text-brand" />
                            <p className="font-medium">{circle.name}</p>
                        </div>
                        <p className="text-brand-caption text-brand-text-light">ID: {circle.id}</p>
                    </div>
                );
            case 'pms_city':
                return <p className="font-medium text-brand-body-5">{circle.pms_city?.name || 'N/A'}</p>;
            case 'status':
                return (
                    <Select
                        value={circle.status ? 'Active' : 'Inactive'}
                        onValueChange={(value) => handleUpdateStatus(circle.id, value === 'Active')}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 ${circle.status
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
                return circle[columnKey as keyof City] as React.ReactNode;
        }
    };

    const renderActions = (circle: City) => (
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditCircle(circle)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteCircle(circle.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Circle
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
                <PageHeader title="Circle Master" description="Manage circles and their association with cities" backTo="/masters" />
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">
                                {editingCircle ? 'Edit Circle' : 'Add New Circle'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editingCircle ? 'Update the circle details below' : 'Enter circle information'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="zone" className="text-gray-900 font-medium">City *</Label>
                                <Select
                                    value={formData.city_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, city_id: value }))}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select city" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {cities.map((city) => (
                                            <SelectItem key={city.id} value={city.id.toString()}>
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="circle-name" className="text-gray-900 font-medium">Circle Name *</Label>
                                <Input
                                    id="circle-name"
                                    placeholder="e.g., Central Circle"
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                />
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
                                {isLoading ? (editingCircle ? 'Updating...' : 'Creating...') : (editingCircle ? 'Update Circle' : 'Save Circle')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={filteredCircles}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(item) => String(item.id)}
                    storageKey="circles-master-table"
                    emptyMessage="No circles found"
                    loading={loadingCircles}
                    loadingMessage="Loading circles..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search circles..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    leftActions={leftActions}
                    onFilterClick={() => {
                        setPendingStatus(statusFilter);
                        setIsFilterOpen(true);
                    }}
                    exportFileName="circles"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
}

export default CircleMaster