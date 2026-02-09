import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Map, ChevronLeft, Eye } from 'lucide-react';
import { postAuth, getAuth, patchAuth, deleteAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Region {
    id: number;
    name: string;
    code: string;
    description: string;
    state_id: number;
    is_active: boolean;
    state?: {
        id: number;
        name: string;
        code: string;
    };
    created_at: string;
    updated_at: string;
}

interface State {
    id: number;
    name: string;
    code: string;
}

const RegionMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingRegion, setEditingRegion] = useState<Region | null>(null);
    const [regions, setRegions] = useState<Region[]>([]);
    const [loadingRegions, setLoadingRegions] = useState(true);
    const [states, setStates] = useState<State[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        state_id: '',
        description: '',
        is_active: true
    });

    const fetchStates = async () => {
        try {
            const data = await getAuth('/pms/states');
            if (Array.isArray(data)) {
                setStates(data);
            }
        } catch (error: any) {
            console.error('Failed to fetch states', error);
            toast.error('Failed to load states');
        }
    };

    const fetchRegions = async () => {
        try {
            setLoadingRegions(true);
            let url = '/pms/regions';
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
                setRegions(data);
            }
        } catch (error: any) {
            let errorMessage = 'Failed to fetch regions';
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoadingRegions(false);
        }
    };

    useEffect(() => {
        fetchStates();
        fetchRegions();
    }, [statusFilter]);

    const filteredRegions = regions.filter(region =>
        region.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        region.state?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditRegion = async (region: Region) => {
        try {
            setIsLoading(true);
            const regionData = await getAuth(`/pms/regions/${region.id}`);
            const data = regionData?.region || regionData;

            setEditingRegion(data);
            setFormData({
                name: data.name || '',
                code: data.code || '',
                state_id: data.state_id?.toString() || '',
                description: data.description || '',
                is_active: data.is_active ?? true
            });
            setIsDialogOpen(true);
        } catch (error: any) {
            toast.error('Failed to fetch region details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingRegion(null);
        setFormData({
            name: '',
            code: '',
            state_id: '',
            description: '',
            is_active: true
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validation
            if (!formData.name.trim() || !formData.code.trim() || !formData.state_id) {
                toast.error('Region name, code, and state are required');
                return;
            }

            // Prepare payload
            const payload = {
                region: {
                    name: formData.name,
                    code: formData.code,
                    state_id: parseInt(formData.state_id),
                    description: formData.description,
                    is_active: formData.is_active
                }
            };

            // Make API call
            if (editingRegion) {
                await patchAuth(`/pms/regions/${editingRegion.id}`, payload);
                toast.success('Region updated successfully');
            } else {
                await postAuth('/pms/regions', payload);
                toast.success('Region created successfully');
            }

            // Reset form and close dialog
            handleCloseDialog();

            // Refresh regions list
            fetchRegions();

        } catch (error: any) {
            let errorMessage = editingRegion ? 'Failed to update region' : 'Failed to create region';

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

    const handleDeleteRegion = async (regionId: number) => {
        if (window.confirm('Are you sure you want to delete this region?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/pms/regions/${regionId}`);
                toast.success('Region deleted successfully');
                fetchRegions();
            } catch (error: any) {
                toast.error('Failed to delete region');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (regionId: number, newIsActive: boolean) => {
        try {
            setIsLoading(true);
            await patchAuth(`/pms/regions/${regionId}`, {
                region: { is_active: newIsActive }
            });
            toast.success('Status updated successfully');
            fetchRegions();
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
                        <h1 className="text-2xl font-bold text-gray-900">Region Master</h1>
                        <p className="text-gray-600">Manage regions and their association with states</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Region
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">
                                {editingRegion ? 'Edit Region' : 'Add New Region'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editingRegion ? 'Update the region details below' : 'Enter region information'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="state" className="text-gray-900 font-medium">State *</Label>
                                <Select
                                    value={formData.state_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, state_id: value }))}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select state" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {states.map((state) => (
                                            <SelectItem key={state.id} value={state.id.toString()}>
                                                {state.name} ({state.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="region-name" className="text-gray-900 font-medium">Region Name *</Label>
                                    <Input
                                        id="region-name"
                                        placeholder="e.g., Western Maharashtra"
                                        value={formData.name}
                                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                        className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="region-code" className="text-gray-900 font-medium">Region Code *</Label>
                                    <Input
                                        id="region-code"
                                        placeholder="e.g., WMH"
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
                                    placeholder="Western part of Maharashtra"
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
                                {isLoading ? (editingRegion ? 'Updating...' : 'Creating...') : (editingRegion ? 'Update Region' : 'Save Region')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[#1a1a1a]">Regions Database</CardTitle>
                            <CardDescription>Complete list of all regions in the system</CardDescription>
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
                                    placeholder="Search regions..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingRegions ? (
                        <div className="text-center py-8 text-gray-500">Loading regions...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Region Details</TableHead>
                                    <TableHead>Region Code</TableHead>
                                    <TableHead>State</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredRegions.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No regions found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredRegions.map((region) => (
                                        <TableRow key={region.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <Map className="h-4 w-4 mr-2 text-[#C72030]" />
                                                        <p className="font-medium">{region.name}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">ID: {region.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline">{region.code}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{region.state?.name || 'N/A'}</p>
                                                    {region.state?.code && (
                                                        <Badge variant="secondary" className="mt-1">{region.state.code}</Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={region.is_active ? 'Active' : 'Inactive'}
                                                    onValueChange={(value) => handleUpdateStatus(region.id, value === 'Active')}
                                                >
                                                    <SelectTrigger className={`w-32 h-8 ${region.is_active ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
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
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/regions/${region.id}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditRegion(region)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteRegion(region.id)}>
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

export default RegionMaster;
