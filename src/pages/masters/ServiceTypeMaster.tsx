
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Loader2, CheckCircle2, XCircle, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface ServiceType {
    id: number;
    name: string;
    description: string;
    billable: boolean;
    monthly: boolean;
    created_at: string;
    updated_at: string;
}

const ServiceTypeMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [serviceTypes, setServiceTypes] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_entries: 0
    });

    // Modal states
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [editingService, setEditingService] = useState<ServiceType | null>(null);
    const [viewingService, setViewingService] = useState<ServiceType | null>(null);

    // Form states
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        billable: true,
        monthly: true
    });

    const fetchServiceTypes = async (page = 1) => {
        try {
            setLoading(true);
            let url = `/service_types.json?page=${page}`;
            if (searchTerm) {
                url += `&q[name_cont]=${searchTerm}`;
            }
            const data = await getAuth(url);

            if (data.service_types) {
                setServiceTypes(data.service_types);
                if (data.pagination) setPagination(data.pagination);
            } else if (Array.isArray(data)) {
                setServiceTypes(data);
            }
        } catch (error) {
            console.error('Error fetching service types:', error);
            toast.error('Failed to load service types');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServiceTypes(pagination.current_page);
    }, [pagination.current_page]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchServiceTypes(1);
    };

    const handleResetForm = () => {
        setFormData({ name: '', description: '', billable: true, monthly: true });
        setEditingService(null);
    };

    const handleAddSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const payload = { service_type: formData };
            await postAuth('/service_types.json', payload);
            toast.success('Service type created successfully');
            setIsAddModalOpen(false);
            handleResetForm();
            fetchServiceTypes(1);
        } catch (error: any) {
            console.error('Error creating service type:', error);
            toast.error(error.message || 'Failed to create service type');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewClick = (service: ServiceType) => {
        setViewingService(service);
        setIsViewModalOpen(true);
    };

    const handleEditClick = (service: ServiceType) => {
        setEditingService(service);
        setFormData({
            name: service.name,
            description: service.description,
            billable: service.billable,
            monthly: service.monthly
        });
        setIsEditModalOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingService) return;
        try {
            setSubmitting(true);
            const payload = { service_type: formData };
            await patchAuth(`/service_types/${editingService.id}.json`, payload);
            toast.success('Service type updated successfully');
            setIsEditModalOpen(false);
            handleResetForm();
            fetchServiceTypes(pagination.current_page);
        } catch (error: any) {
            console.error('Error updating service type:', error);
            toast.error(error.message || 'Failed to update service type');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Are you sure you want to delete this service type?')) return;
        try {
            await deleteAuth(`/service_types/${id}.json`);
            toast.success('Service type deleted successfully');
            fetchServiceTypes(pagination.current_page);
        } catch (error: any) {
            toast.error('Failed to delete service type');
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
                        <h1 className="text-2xl font-bold text-gray-900">Agreement Service Master</h1>
                        <p className="text-gray-600">Manage service types for agreements</p>
                    </div>
                </div>

                <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                    setIsAddModalOpen(open);
                    if (!open) handleResetForm();
                }}>
                    <DialogTrigger asChild>
                        <Button className="bg-[#C72030] hover:bg-[#A01825] text-white">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Service Type
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <form onSubmit={handleAddSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-gray-900 font-bold text-xl">Add Service Type</DialogTitle>
                                <DialogDescription className="text-gray-600">
                                    Create a new service type for agreements.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-gray-900 font-medium">Name *</Label>
                                    <Input
                                        id="name"
                                        placeholder="e.g. CAM"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="description" className="text-gray-900 font-medium">Description *</Label>
                                    <Input
                                        id="description"
                                        placeholder="e.g. Common Area Maintenance"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="bg-white border-gray-300 text-gray-900"
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border rounded-md p-3">
                                    <Label htmlFor="billable" className="flex flex-col gap-1 text-gray-900 font-medium">
                                        <span>Billable</span>
                                        <span className="font-normal text-xs text-muted-foreground text-gray-500">Is this service billable?</span>
                                    </Label>
                                    <Switch
                                        id="billable"
                                        checked={formData.billable}
                                        onCheckedChange={(checked) => setFormData({ ...formData, billable: checked })}
                                    />
                                </div>
                                <div className="flex items-center justify-between space-x-2 border rounded-md p-3">
                                    <Label htmlFor="monthly" className="flex flex-col gap-1 text-gray-900 font-medium">
                                        <span>Monthly</span>
                                        <span className="font-normal text-xs text-muted-foreground text-gray-500">Is this a monthly recurring service?</span>
                                    </Label>
                                    <Switch
                                        id="monthly"
                                        checked={formData.monthly}
                                        onCheckedChange={(checked) => setFormData({ ...formData, monthly: checked })}
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button variant="outline" type="button" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={submitting} className="bg-[#C72030] hover:bg-[#A01825]">
                                    {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                    Save Service Type
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white">
                <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="relative flex-1 max-w-sm">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <Input
                                placeholder="Search by name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                className="pl-10"
                            />
                        </div>
                        <Button onClick={handleSearch} variant="outline">Search</Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead>Name</TableHead>
                                    <TableHead>Description</TableHead>
                                    <TableHead>Billable</TableHead>
                                    <TableHead>Monthly</TableHead>
                                    <TableHead>Created At</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center">
                                            <div className="flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
                                                <span className="text-sm text-gray-500">Loading service types...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : serviceTypes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                                            No service types found.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    serviceTypes.map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell className="font-medium text-gray-900">{service.name}</TableCell>
                                            <TableCell className="text-gray-600">{service.description}</TableCell>
                                            <TableCell>
                                                {service.billable ? (
                                                    <div className="flex items-center text-green-600 gap-1.5 text-xs font-medium">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Yes
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-gray-400 gap-1.5 text-xs font-medium">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        No
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {service.monthly ? (
                                                    <div className="flex items-center text-green-600 gap-1.5 text-xs font-medium">
                                                        <CheckCircle2 className="h-3.5 w-3.5" />
                                                        Yes
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-gray-400 gap-1.5 text-xs font-medium">
                                                        <XCircle className="h-3.5 w-3.5" />
                                                        No
                                                    </div>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-xs">
                                                {new Date(service.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleViewClick(service)}>
                                                        <Eye className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleEditClick(service)}>
                                                        <Edit className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {!loading && pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total_entries)} of {pagination.total_entries} entries
                            </p>
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === 1}
                                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <div className="text-xs font-medium">
                                    Page {pagination.current_page} of {pagination.total_pages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={pagination.current_page === pagination.total_pages}
                                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                                    className="h-8 w-8 p-0"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) handleResetForm();
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-gray-900 font-bold text-xl">Edit Service Type</DialogTitle>
                            <DialogDescription className="text-gray-600">
                                Update service type information.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="edit-name" className="text-gray-900 font-medium">Name</Label>
                                <Input
                                    id="edit-name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="edit-description" className="text-gray-900 font-medium">Description</Label>
                                <Input
                                    id="edit-description"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="bg-white border-gray-300 text-gray-900"
                                    required
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2 border rounded-md p-3">
                                <Label htmlFor="edit-billable" className="flex flex-col gap-1 text-gray-900 font-medium">
                                    <span>Billable</span>
                                    <span className="font-normal text-xs text-muted-foreground text-gray-500">Is this service billable?</span>
                                </Label>
                                <Switch
                                    id="edit-billable"
                                    checked={formData.billable}
                                    onCheckedChange={(checked) => setFormData({ ...formData, billable: checked })}
                                />
                            </div>
                            <div className="flex items-center justify-between space-x-2 border rounded-md p-3">
                                <Label htmlFor="edit-monthly" className="flex flex-col gap-1 text-gray-900 font-medium">
                                    <span>Monthly</span>
                                    <span className="font-normal text-xs text-muted-foreground text-gray-500">Is this a monthly recurring service?</span>
                                </Label>
                                <Switch
                                    id="edit-monthly"
                                    checked={formData.monthly}
                                    onCheckedChange={(checked) => setFormData({ ...formData, monthly: checked })}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={submitting} className="bg-[#C72030] hover:bg-[#A01825]">
                                {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Update Service Type
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* View Modal */}
            <Dialog open={isViewModalOpen} onOpenChange={setIsViewModalOpen}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                    <DialogHeader>
                        <DialogTitle className="text-gray-900 font-bold text-xl">View Service Type</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Detailed information for this service type.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Name</span>
                            <span className="text-sm font-medium text-gray-900">{viewingService?.name}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Description</span>
                            <span className="text-sm font-medium text-gray-900">{viewingService?.description}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Billable</span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                                {viewingService?.billable ? (
                                    <div className="flex items-center text-green-600 gap-1 text-xs font-semibold">
                                        <CheckCircle2 className="h-4 w-4" />
                                        YES
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-400 gap-1 text-xs font-semibold">
                                        <XCircle className="h-4 w-4" />
                                        NO
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Monthly Service</span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                                {viewingService?.monthly ? (
                                    <div className="flex items-center text-green-600 gap-1 text-xs font-semibold">
                                        <CheckCircle2 className="h-4 w-4" />
                                        YES
                                    </div>
                                ) : (
                                    <div className="flex items-center text-gray-400 gap-1 text-xs font-semibold">
                                        <XCircle className="h-4 w-4" />
                                        NO
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-xs text-gray-500 uppercase font-semibold">Created On</span>
                            <span className="text-sm font-medium text-gray-900">
                                {viewingService && new Date(viewingService.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setIsViewModalOpen(false)} className="bg-[#C72030] hover:bg-[#A01825]">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ServiceTypeMaster;
