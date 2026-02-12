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

interface City {
    id: number;
    name: string;
    code: string;
    description: string;
    pms_zone: {
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

const CityMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [editingCity, setEditingCity] = useState<City | null>(null);
    const [cities, setCities] = useState<City[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);
    const [zones, setZones] = useState([])

    const [formData, setFormData] = useState({
        zone_id: '',
        name: ''
    });

    const fetchZones = async () => {
        try {
            const data = await getAuth('/pms/zones');
            if (Array.isArray(data)) {
                setZones(data);
            }
        } catch (error: any) {
            console.error('Failed to fetch regions', error);
            toast.error('Failed to load regions');
        }
    };

    const fetchCities = async () => {
        try {
            setLoadingCities(true);
            let url = '/pms/cities';
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
                setCities(data.data);
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
            setLoadingCities(false);
        }
    };

    useEffect(() => {
        fetchZones();
        fetchCities();
    }, [statusFilter]);

    const filteredCities = cities.filter(city =>
        city.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.zone?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditCity = async (city: City) => {
        try {
            setIsLoading(true);
            const cityData = await getAuth(`/pms/cities/${city.id}`);
            const data = cityData?.pms_city || cityData;

            setEditingCity(data);
            setFormData({
                name: data.name || '',
                zone_id: data.pms_zone.id?.toString() || '',
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
        setEditingCity(null);
        setFormData({
            name: '',
            zone_id: '',
        });
    };

    const handleSubmit = async () => {
        try {
            setIsLoading(true);

            // Validation
            if (!formData.name.trim() || !formData.zone_id) {
                toast.error('City name and zone are required');
                return;
            }

            // Prepare payload
            const payload = {
                pms_city: {
                    name: formData.name,
                    pms_zone_id: parseInt(formData.zone_id),
                    status: true
                }
            };

            // Make API call
            if (editingCity) {
                await patchAuth(`/pms/cities/${editingCity.id}`, payload);
                toast.success('City updated successfully');
            } else {
                await postAuth('/pms/cities', payload);
                toast.success('City created successfully');
            }

            // Reset form and close dialog
            handleCloseDialog();

            // Refresh zones list
            fetchCities();

        } catch (error: any) {
            let errorMessage = editingCity ? 'Failed to update city' : 'Failed to create city';

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

    const handleDeleteCity = async (cityId: number) => {
        if (window.confirm('Are you sure you want to delete this city?')) {
            try {
                setIsLoading(true);
                await deleteAuth(`/pms/cities/${cityId}`);
                toast.success('City deleted successfully');
                fetchCities();
            } catch (error: any) {
                toast.error('Failed to delete city');
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleUpdateStatus = async (cityId: number, newStatus: boolean) => {
        try {
            setIsLoading(true);
            await patchAuth(`/pms/cities/${cityId}`, {
                pms_city: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchCities();
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
                        <h1 className="text-2xl font-bold text-gray-900">City Master</h1>
                        <p className="text-gray-600">Manage cities and their association with zones</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add City
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">
                                {editingCity ? 'Edit City' : 'Add New City'}
                            </DialogTitle>
                            <DialogDescription className="text-gray-600">
                                {editingCity ? 'Update the city details below' : 'Enter city information'}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="zone" className="text-gray-900 font-medium">Zone *</Label>
                                <Select
                                    value={formData.zone_id}
                                    onValueChange={(value) => setFormData(prev => ({ ...prev, zone_id: value }))}
                                >
                                    <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                                        <SelectValue placeholder="Select zone" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        {zones.map((zone) => (
                                            <SelectItem key={zone.id} value={zone.id.toString()}>
                                                {zone.name} ({zone.code})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="city-name" className="text-gray-900 font-medium">City Name *</Label>
                                <Input
                                    id="city-name"
                                    placeholder="e.g., Central City"
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
                                className="bg-[#C72030] hover:bg-[#A01825] text-white"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingCity ? 'Updating...' : 'Creating...') : (editingCity ? 'Update City' : 'Save City')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-[#1a1a1a]">Cities Database</CardTitle>
                            <CardDescription>Complete list of all cities in the system</CardDescription>
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
                                    placeholder="Search cities..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingCities ? (
                        <div className="text-center py-8 text-gray-500">Loading cities...</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>City Details</TableHead>
                                    <TableHead>Zone</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredCities.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                                            No cities found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredCities.map((city) => (
                                        <TableRow key={city.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <MapPinned className="h-4 w-4 mr-2 text-[#C72030]" />
                                                        <p className="font-medium">{city.name}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">ID: {city.id}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    <p className="font-medium text-sm">{city.pms_zone?.name || 'N/A'}</p>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={city.status ? 'Active' : 'Inactive'}
                                                    onValueChange={(value) => handleUpdateStatus(city.id, value === 'Active')}
                                                >
                                                    <SelectTrigger className={`w-32 h-8 ${city.status ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
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
                                                    {/* <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/zones/${city.id}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button> */}
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditCity(city)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteCity(city.id)}>
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
}

export default CityMaster