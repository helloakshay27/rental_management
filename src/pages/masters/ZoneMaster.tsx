import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, MapPinned, ChevronLeft, Eye } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

const ZoneMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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

    return (
        <div className="p-6 space-y-6 text-[#1a1a1a]">
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
                        <h1 className="text-2xl font-bold text-gray-900">Zone Master</h1>
                        <p className="text-gray-600">Manage zones and their association with regions</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Zone
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">
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
                                className="bg-[#C72030] hover:bg-[#A01825] text-white"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingZone ? 'Updating...' : 'Creating...') : (editingZone ? 'Update Zone' : 'Save Zone')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[#1a1a1a]">Zones Database</CardTitle>
                            <CardDescription>Complete list of all zones in the system</CardDescription>
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
                                    placeholder="Search zones..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingZones ? (
                        <div className="text-center py-8 text-gray-500">Loading zones...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Zone Details</TableHead>
                                    <TableHead>Zone Code</TableHead>
                                    <TableHead>Region</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredZones.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No zones found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredZones.map((zone) => (
                                        <TableRow key={zone.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <MapPinned className="h-4 w-4 mr-2 text-[#C72030]" />
                                                        <p className="font-medium">{zone.name}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">ID: {zone.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{zone.code}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{zone.region?.name || 'N/A'}</p>
                                                    {zone.region?.code && (
                                                        <Badge variant="secondary" className="mt-1">{zone.region.code}</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={zone.is_active ? 'Active' : 'Inactive'}
                                                    onValueChange={(value) => handleUpdateStatus(zone.id, value === 'Active')}
                                                >
                                                    <SelectTrigger className={`w-32 h-8 ${zone.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
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
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/zones/${zone.id}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditZone(zone)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteZone(zone.id)}>
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

export default ZoneMaster;
