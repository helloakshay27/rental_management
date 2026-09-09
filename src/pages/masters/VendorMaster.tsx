
import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Edit, Trash2, Building, Star, Phone, Mail, Eye, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

interface BankDetail {
    account_number: string;
    bank_name: string;
    ifsc_code: string;
    account_type: string;
    bank_branch: string;
}

interface Vendor {
    id: number;
    vendor_name: string;
    contact_person: string;
    email: string;
    phone: string;
    alternate_phone: string;
    address: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    gst_number: string;
    pan_number: string;
    vendor_type: string;
    rating: number;
    status: string;
    created_by: number;
    bank_detail?: BankDetail;
    created_at: string;
    updated_at: string;
}

const columns: ColumnConfig[] = [
    { key: 'vendor_name', label: 'Vendor Details', sortable: true, draggable: true },
    { key: 'email', label: 'Contact Info', sortable: true, draggable: true },
    { key: 'vendor_type', label: 'Type & Rating', sortable: true, draggable: true },
    { key: 'city', label: 'Location', sortable: true, draggable: true },
    { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const VendorMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [pendingStatus, setPendingStatus] = useState('all');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loadingVendors, setLoadingVendors] = useState(true);
    const [pagination, setPagination] = useState({
        current_page: 1,
        per_page: 10,
        total_pages: 1,
        total_entries: 0
    });

    const fetchVendors = async (page = 1) => {
        try {
            setLoadingVendors(true);
            let url = `/vendors.json?page=${page}`;
            if (statusFilter !== 'all') {
                url += `&q[is_active_eq]=${statusFilter === 'Active'}`;
            }
            if (searchTerm) {
                url += `&q[vendor_name_or_vendor_code_cont]=${searchTerm}`;
            }

            const data = await getAuth(url);
            if (data.vendors) {
                setVendors(data.vendors);
                if (data.pagination) {
                    setPagination(data.pagination);
                }
            } else if (Array.isArray(data)) {
                setVendors(data);
            }
        } catch (error: any) {
            let errorMessage = 'Failed to fetch vendors';
            if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
                errorMessage = error.response.errors.join(', ');
            } else if (error.message) {
                errorMessage = error.message;
            }
            toast.error(errorMessage);
        } finally {
            setLoadingVendors(false);
        }
    };

    useEffect(() => {
        fetchVendors(pagination.current_page);
    }, [statusFilter, pagination.current_page]);

    const handleSearch = () => {
        setPagination(prev => ({ ...prev, current_page: 1 }));
        fetchVendors(1);
    };

    const filteredVendors = vendors; // Filtering is now handled by the API

    const handleEditVendor = (vendorId: number) => {
        navigate(`/masters/vendors/edit/${vendorId}`);
    };

    const handleDeleteVendor = async (vendorId: number) => {
        if (window.confirm('Are you sure you want to delete this vendor?')) {
            try {
                await deleteAuth(`/vendors/${vendorId}`);
                toast.success('Vendor deleted successfully');
                fetchVendors();
            } catch (error: any) {
                toast.error('Failed to delete vendor');
            }
        }
    };

    const handleUpdateStatus = async (vendorId: number, newStatus: string) => {
        try {
            await patchAuth(`/vendors/${vendorId}`, {
                vendor: { status: newStatus }
            });
            toast.success('Status updated successfully');
            fetchVendors();
        } catch (error: any) {
            toast.error('Failed to update status');
        }
    };

    const handleAddVendor = () => {
        navigate('/masters/vendors/add');
    };

    const renderCell = (vendor: Vendor, columnKey: string) => {
        switch (columnKey) {
            case 'vendor_name':
                return (
                    <div>
                        <div className="flex items-center mb-1">
                            <Building className="h-4 w-4 mr-2 text-brand" />
                            <p className="font-medium">{vendor.vendor_name}</p>
                        </div>
                        {vendor.contact_person && (
                            <p className="text-brand-caption text-brand-text-light">Contact: {vendor.contact_person}</p>
                        )}
                    </div>
                );
            case 'email':
                return (
                    <div className="space-y-1">
                        {vendor.email && (
                            <div className="flex items-center text-brand-caption">
                                <Mail className="h-3 w-3 mr-1" />
                                <span className="truncate max-w-32">{vendor.email}</span>
                            </div>
                        )}
                        {vendor.phone && (
                            <div className="flex items-center text-brand-caption">
                                <Phone className="h-3 w-3 mr-1" />
                                <span>{vendor.phone}</span>
                            </div>
                        )}
                    </div>
                );
            case 'vendor_type':
                return (
                    <div>
                        {vendor.vendor_type && (
                            <Badge variant="outline" className="mb-1">{vendor.vendor_type}</Badge>
                        )}
                        {vendor.rating && (
                            <div className="flex items-center text-brand-caption text-brand-text-light">
                                <Star className="h-3 w-3 mr-1 fill-current text-brand-warning" />
                                <span>{Number(vendor.rating).toFixed(1)}</span>
                            </div>
                        )}
                    </div>
                );
            case 'city':
                return (
                    <div className="text-brand-body-5">
                        {vendor.city && <p>{vendor.city}</p>}
                        {vendor.state && <p className="text-brand-caption text-brand-text-light">{vendor.state}</p>}
                    </div>
                );
            case 'status':
                return (
                    <Select
                        value={vendor.status || 'Active'}
                        onValueChange={(value) => handleUpdateStatus(vendor.id, value)}
                    >
                        <SelectTrigger
                            className={`w-32 h-8 ${vendor.status?.toLowerCase() === 'active'
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
                return vendor[columnKey as keyof Vendor] as React.ReactNode;
        }
    };

    const renderActions = (vendor: Vendor) => (
        <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/vendors/${vendor.id}`)}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditVendor(vendor.id)}>
                <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteVendor(vendor.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );

    const leftActions = (
        <div className="flex items-center gap-2">
            <Button onClick={handleAddVendor} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                Add Vendor
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
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <PageHeader title="Vendor Master" description="Manage vendors, suppliers, and their details" backTo="/masters" />
            </div>

            <div>
                <EnhancedTable
                    data={filteredVendors}
                    columns={columns}
                    renderCell={renderCell}
                    renderActions={renderActions}
                    getItemId={(vendor) => String(vendor.id)}
                    storageKey="vendors-master-table"
                    emptyMessage="No vendors found"
                    loading={loadingVendors}
                    loadingMessage="Loading vendors..."
                    searchTerm={searchTerm}
                    onSearchChange={setSearchTerm}
                    searchPlaceholder="Search vendors..."
                    disableClientSearch={true}
                    enableSearch={true}
                    enableSelection={false}
                    leftActions={leftActions}
                    onFilterClick={() => {
                        setPendingStatus(statusFilter);
                        setIsFilterOpen(true);
                    }}
                    exportFileName="vendors"
                    pagination={true}
                    pageSize={pagination.per_page}
                    currentPage={pagination.current_page}
                    totalPages={pagination.total_pages}
                    onPageChange={(page) =>
                        setPagination(prev => ({ ...prev, current_page: page }))
                    }
                />
            </div>
        </div>
    );
};

export default VendorMaster;
