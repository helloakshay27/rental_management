
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, ChevronLeft, Building } from 'lucide-react';
import { postAuth, getAuth, deleteAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface FacilityType {
    id: number;
    name: string;
    description: string;
    status: string;
    created_at: string;
}

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
                        <h1 className="text-2xl font-bold text-gray-900">Facility Types Management</h1>
                        <p className="text-gray-600">Define and manage various property facility categories</p>
                    </div>
                </div>
                <Dialog open={isDialogOpen} onOpenChange={(open) => {
                    setIsDialogOpen(open);
                    if (!open) handleCloseDialog();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825]">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Facility Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md bg-white">
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-semibold text-xl">{editingFacility ? 'Edit Facility Type' : 'Add New Facility Type'}</DialogTitle>
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
                                className="bg-[#C72030] hover:bg-[#A01825] text-white h-11 rounded-xl px-6"
                                onClick={handleSubmit}
                                disabled={isLoading}
                            >
                                {isLoading ? (editingFacility ? 'Updating...' : 'Adding...') : (editingFacility ? 'Update Facility' : 'Add Facility')}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="border-none shadow-sm bg-white/50 backdrop-blur-sm rounded-3xl overflow-hidden">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-xl font-bold text-gray-900">Facility Types List</CardTitle>
                            <CardDescription>View and manage all facility type categories</CardDescription>
                        </div>
                        <div className="relative">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64 bg-white border-2 border-gray-100 focus:border-[#C72030] h-10 rounded-xl"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50 hover:bg-gray-50/50 border-none">
                                <TableHead className="rounded-l-2xl">Facility Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="rounded-r-2xl">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loadingData ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : filteredFacilities.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8">
                                        No facility types found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredFacilities.map((facility) => (
                                    <TableRow key={facility.id} className="hover:bg-gray-50/50 border-b border-gray-100 last:border-0">
                                        <TableCell>
                                            <div className="flex items-center">
                                                <div className="w-10 h-10 rounded-xl bg-[#C72030]/10 flex items-center justify-center mr-3">
                                                    <Building className="h-5 w-5 text-[#C72030]" />
                                                </div>
                                                <span className="font-semibold text-gray-900">{facility.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 max-w-md truncate">{facility.description || '-'}</TableCell>
                                        <TableCell>
                                            <Select
                                                value={facility.status || 'Active'}
                                                onValueChange={(value) => handleUpdateStatus(facility.id, value)}
                                            >
                                                <SelectTrigger className={`w-32 h-8 rounded-full ${facility.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent className="bg-white rounded-xl">
                                                    <SelectItem value="Active">Active</SelectItem>
                                                    <SelectItem value="Inactive">Inactive</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center space-x-1">
                                                <Button variant="ghost" size="icon" className="hover:bg-blue-50 hover:text-blue-600 rounded-lg h-9 w-9" onClick={() => handleEditFacility(facility)}>
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="hover:bg-red-50 hover:text-red-600 rounded-lg h-9 w-9" onClick={() => handleDeleteFacility(facility.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default FacilityTypesManagement;
