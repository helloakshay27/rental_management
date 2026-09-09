
import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, CheckCircle2, XCircle, Eye, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Heading, Text } from '@/components/ui/typography';

interface ServiceType {
    id: number;
    name: string;
    description: string;
    billable: boolean;
    monthly: boolean;
    created_at: string;
    updated_at: string;
}

const columns: ColumnConfig[] = [
    { key: 'name', label: 'Name', sortable: true, draggable: true },
    { key: 'description', label: 'Description', sortable: true, draggable: true },
    { key: 'billable', label: 'Billable', sortable: true, draggable: true },
    { key: 'monthly', label: 'Monthly', sortable: true, draggable: true },
    { key: 'created_at', label: 'Created At', sortable: true, draggable: true },
];

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

    /** Shared yes/no flag cell for the billable + monthly columns. */
    const renderFlag = (on: boolean) =>
        on ? (
            <div className="flex items-center text-brand-success gap-1.5 text-[13px] font-medium">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Yes
            </div>
        ) : (
            <div className="flex items-center text-brand-text-light gap-1.5 text-[13px] font-medium">
                <XCircle className="h-3.5 w-3.5" />
                No
            </div>
        );

    const renderCell = (service: ServiceType, columnKey: string) => {
        switch (columnKey) {
            case 'name':
                return <span className="font-medium text-brand-text">{service.name}</span>;
            case 'description':
                return <span className="text-brand-text-light">{service.description}</span>;
            case 'billable':
                return renderFlag(!!service.billable);
            case 'monthly':
                return renderFlag(!!service.monthly);
            case 'created_at':
                return (
                    <span className="text-[13px] text-brand-text-light">
                        {new Date(service.created_at).toLocaleDateString()}
                    </span>
                );
            default:
                return service[columnKey as keyof ServiceType] as React.ReactNode;
        }
    };

    const renderActions = (service: ServiceType) => (
        <div className="flex justify-end gap-2">
            <Button variant="ghost" size="icon" title="View" onClick={() => handleViewClick(service)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Edit" onClick={() => handleEditClick(service)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="Delete" className="text-brand-error" onClick={() => handleDelete(service.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );


    const leftActions = (
            <Button onClick={() => setIsAddModalOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Service Type
            </Button>
        );

    return (
        <PageContainer>
            <div className="flex items-center justify-between">
                <PageHeader title="Agreement Service Master" description="Manage service types for agreements" backTo="/masters" />

                <Dialog open={isAddModalOpen} onOpenChange={(open) => {
                    setIsAddModalOpen(open);
                    if (!open) handleResetForm();
                }}>
                    <DialogContent className="sm:max-w-[425px] bg-white">
                        <form onSubmit={handleAddSubmit}>
                            <DialogHeader>
                                <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Add Service Type</DialogTitle>
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
                                        <span className="text-[13px] text-brand-text-light">Is this service billable?</span>
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
                                        <span className="text-[13px] text-brand-text-light">Is this a monthly recurring service?</span>
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
                                <Button type="submit" disabled={submitting} className="fm-button-fix fm-button-brand px-6 py-2">
                                    {submitting ? <Spinner className="mr-2" /> : null}
                                    Save Service Type
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div>
                <EnhancedTable
                    data={serviceTypes}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(service) => String(service.id)}
                    storageKey="service-types-master-table"
                    leftActions={leftActions}
                    emptyMessage="No service types found."
                    loading={loading}
                    loadingMessage="Loading service types..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search by name..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    exportFileName="service-types"
                    pagination={true}
                    pageSize={pagination.per_page}
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onPageChange={(page) =>
                        setPagination(prev => ({ ...prev, current_page: page }))
                    }
                />
            </div>

            {/* Edit Modal */}
            <Dialog open={isEditModalOpen} onOpenChange={(open) => {
                setIsEditModalOpen(open);
                if (!open) handleResetForm();
            }}>
                <DialogContent className="sm:max-w-[425px] bg-white text-gray-900">
                    <form onSubmit={handleEditSubmit}>
                        <DialogHeader>
                            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Edit Service Type</DialogTitle>
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
                                    <span className="text-[13px] text-brand-text-light">Is this service billable?</span>
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
                                    <span className="text-[13px] text-brand-text-light">Is this a monthly recurring service?</span>
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
                            <Button type="submit" disabled={submitting} className="fm-button-fix fm-button-brand px-6 py-2">
                                {submitting ? <Spinner className="mr-2" /> : null}
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
                        <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">View Service Type</DialogTitle>
                        <DialogDescription className="text-gray-600">
                            Detailed information for this service type.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Name</span>
                            <span className="text-[15px] font-medium text-brand-text">{viewingService?.name}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Description</span>
                            <span className="text-[15px] font-medium text-brand-text">{viewingService?.description}</span>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Billable</span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                                {viewingService?.billable ? (
                                    <div className="flex items-center gap-1 text-[13px] font-medium text-brand-success">
                                        <CheckCircle2 className="h-4 w-4" />
                                        YES
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-[13px] font-medium text-brand-text-light">
                                        <XCircle className="h-4 w-4" />
                                        NO
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1 border-b pb-2">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Monthly Service</span>
                            <div className="flex items-center gap-1.5 pt-0.5">
                                {viewingService?.monthly ? (
                                    <div className="flex items-center gap-1 text-[13px] font-medium text-brand-success">
                                        <CheckCircle2 className="h-4 w-4" />
                                        YES
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-1 text-[13px] font-medium text-brand-text-light">
                                        <XCircle className="h-4 w-4" />
                                        NO
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1">
                            <span className="text-[13px] font-semibold uppercase tracking-wider text-brand-text-light">Created On</span>
                            <span className="text-[15px] font-medium text-brand-text">
                                {viewingService && new Date(viewingService.created_at).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" onClick={() => setIsViewModalOpen(false)} className="fm-button-fix fm-button-brand px-6 py-2">
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageContainer>
    );
};

export default ServiceTypeMaster;
