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
import { Plus, Edit, Trash2, MapPinned, Eye } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface Zone {
    id: number;
    name: string;
    code: string;
    description: string;
    region_id: number;
    is_active: boolean;
    region?: {
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
    { key: 'name', label: 'Zone Details', sortable: true, draggable: true },
    { key: 'code', label: 'Zone Code', sortable: true, draggable: true },
    { key: 'region', label: 'Region', sortable: true, draggable: true },
    { key: 'is_active', label: 'Status', sortable: true, draggable: true },
];

const ZoneMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingZone, setEditingZone] = useState<Zone | null>(null);
    const [zones, setZones] = useState<Zone[]>([]);
    const [loadingZones, setLoadingZones] = useState(true);
    const [regions, setRegions] = useState<Region[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        region_id: '',
        description: '',
        is_active: true
    });

    const fetchRegions = async () => {
        try {
            const data = await getAuth('/pms/regions');
            if (Array.isArray(data)) {
                setRegions(data);
            }
        } catch (error: any) {
            console.error('Failed to fetch regions', error);
            toast.error('Failed to load regions');
        }
    };

    const fetchZones = async () => {
        try {
            setLoadingZones(true);
            let url = '/pms/zones';
            const params = new URLSearchParams();
            if (statusFilter !== 'all') {
                params.append('is_active', statusFilter === 'Active' ? 'true' : 'false');
            }
            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }
            const data = await getAuth(url);
            if (Array.isArray(data)) {
                setZones(data);
            }
        } catch (error: any) {
            let errorMessage = 'Failed to fetch zones';
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoadingZones(false);
        }
    };

    useEffect(() => {
        fetchRegions();
        fetchZones();
    }, [statusFilter]);

    const filteredZones = zones.filter(zone =>
        zone.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        zone.region?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditZone = async (zone: Zone) => {
        try {
            setIsLoading(true);
            const zoneData = await getAuth(`/pms/zones/${zone.id}`);
            const data = zoneData?.pms_zone || zoneData;

            setEditingZone(data);
            setFormData({
                name: data.name || '',
                code: data.code || '',
                region_id: data.region_id?.toString() || '',
                description: data.description || '',
                is_active: data.is_active ?? true
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
        setEditingZone(null);
        setFormData({
            name: '',
            code: '',
            region_id: '',
            description: '',
            is_active: true
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validation
            if (!formData.name.trim() || !formData.code.trim() || !formData.region_id) {
                toast.error('Zone name, code, and region are required');
                return;
            }

            // Prepare payload
            const payload = {
                pms_zone: {
                    name: formData.name,
                    code: formData.code,
                    region_id: parseInt(formData.region_id),
                    description: formData.description,
                    is_active: formData.is_active
                }
            };

            // Make API call
            if (editingZone) {
                await patchAuth(`/pms/zones/${editingZone.id}`, payload);
                toast.success('Zone updated successfully');
            } else {
                await postAuth('/pms/zones', payload);
                toast.success('Zone created successfully');
            }

            // Reset form and close dialog
            handleCloseDialog();

            // Refresh zones list
            fetchZones();

        } catch (error: any) {
            let errorMessage = editingZone ? 'Failed to update zone' : 'Failed to create zone';

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

    const handleDeleteZone = async (zoneId: number) => {
        if (window.confirm('Are you sure you want to delete this zone?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/pms/zones/${zoneId}`);
                toast.success('Zone deleted successfully');
                fetchZones();
            } catch (error: any) {
                toast.error('Failed to delete zone');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (zoneId: number, newIsActive: boolean) => {
        try {
            setIsLoading(true);
            await patchAuth(`/pms/zones/${zoneId}`, {
                pms_zone: { is_active: newIsActive }
            });
            toast.success('Status updated successfully');
            fetchZones();
        } catch (error: any) {
            toast.error('Failed to update status');
        } finally {
            setIsLoading(false);
        }
    };

    const renderCell = (zone: Zone, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return (
                    <div>
                        <div className="flex items-center mb-1">
                            <MapPinned className="h-4 w-4 mr-2 text-brand" />
                            <p className="font-medium">{zone.name}</p>
                        </div>
                        <p className="text-brand-caption text-brand-text-light">ID: {zone.id}</p>
                    </div>
                );
            case 'code':
                return <Badge variant="outline">{zone.code}</Badge>;
            case 'region':
                return (
                    <div>
                        <p className="font-medium text-brand-body-5">{zone.region?.name || 'N/A'}</p>
                        {zone.region?.code && (
                            <Badge variant="secondary" className="mt-1">{zone.region.code}</Badge>
                        )}
                    </div>
                );
            case 'is_active':
                return (
                    <Select
                        value={zone.is_active ? 'Active' : 'Inactive'}
                        onValueChange={(value) => handleUpdateStatus(zone.id, value === 'Active')}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 ${zone.is_active
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
                return zone[columnKey as keyof Zone] as React.ReactNode;
        }
    };

    const renderActions = (zone: Zone) => (
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/zones/${zone.id}`)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditZone(zone)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteZone(zone.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Zone
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
                <PageHeader title="Zone Master" description="Manage zones and their association with regions" backTo="/masters" />
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">
                                {editingZone ? 'Edit Zone' : 'Add New Zone'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editingZone ? 'Update the zone details below' : 'Enter zone information'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="region" className="text-gray-900 font-medium">Region *</Label>
                                <Select
                                    value={formData.region_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, region_id: value }))}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select region" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {regions.map((region) => (
                                            <SelectItem key={region.id} value={region.id.toString()}>
                                                {region.name} ({region.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="zone-name" className="text-gray-900 font-medium">Zone Name *</Label>
                                    <Input
                                        id="zone-name"
                                        placeholder="e.g., Central Zone"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zone-code" className="text-gray-900 font-medium">Zone Code *</Label>
                                    <Input
                                        id="zone-code"
                                        placeholder="e.g., CZ"
                                        value={formData.code}
                                        onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-gray-900 font-medium">Description</Label>
                                <Input
                                    id="description"
                                    placeholder="Central operational zone"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                />
                            </div>

                            {/* Status Field */}
                            <div className="space-y-2">
                                <Label className="text-gray-900 font-medium">Status *</Label>
                                <div className="flex items-center space-x-6 pt-2">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === true}
                                            onChange={() => setFormData(prev => ({ ...prev, is_active: true }))}
                                            className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                                        />
                                        <span className="text-sm text-gray-700">Active</span>
                                    </label>
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="is_active"
                                            checked={formData.is_active === false}
                                            onChange={() => setFormData(prev => ({ ...prev, is_active: false }))}
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
                                {isLoading ? (editingZone ? 'Updating...' : 'Creating...') : (editingZone ? 'Update Zone' : 'Save Zone')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={filteredZones}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(item) => String(item.id)}
                    storageKey="zones-master-table"
                    emptyMessage="No zones found"
                    loading={loadingZones}
                    loadingMessage="Loading zones..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search zones..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    leftActions={leftActions}
                    onFilterClick={() => {
                        setPendingStatus(statusFilter);
                        setIsFilterOpen(true);
                    }}
                    exportFileName="zones"
                    pagination={true}
                    pageSize={10}
                />
            </div>
        </PageContainer>
    );
};

export default ZoneMaster;
