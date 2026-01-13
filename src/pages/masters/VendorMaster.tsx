
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Building, Star, Phone, Mail, ChevronLeft, Eye, ChevronRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, deleteAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

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

const VendorMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
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

    return (
        <div className="p-6 space-y-4">
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
                        <h1 className="text-2xl font-bold text-gray-900">Vendor Master</h1>
                        <p className="text-gray-600">Manage vendors, suppliers, and their details</p>
                    </div>
                </div>
                <Button
                    className="bg-[#C72030] hover:bg-[#A01825]"
                    onClick={handleAddVendor}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Vendor
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Vendors Database</CardTitle>
                            <CardDescription>Complete list of all vendors in the system</CardDescription>
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
                                    placeholder="Search vendors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                            <Button onClick={handleSearch} variant="outline" className="h-10">Search</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingVendors ? (
                        <div className="text-center py-12">
                            <Loader2 className="h-8 w-8 animate-spin text-[#C72030] mx-auto mb-2" />
                            <p className="text-gray-500">Loading vendors...</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor Details</TableHead>
                                    <TableHead>Contact Info</TableHead>
                                    <TableHead>Type & Rating</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredVendors.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                            No vendors found
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredVendors.map((vendor) => (
                                        <TableRow key={vendor.id}>
                                            <TableCell>
                                                <div>
                                                    <div className="flex items-center mb-1">
                                                        <Building className="h-4 w-4 mr-2 text-[#C72030]" />
                                                        <p className="font-medium">{vendor.vendor_name}</p>
                                                    </div>
                                                    {vendor.contact_person && (
                                                        <p className="text-xs text-gray-500">Contact: {vendor.contact_person}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="space-y-1">
                                                    {vendor.email && (
                                                        <div className="flex items-center text-xs">
                                                            <Mail className="h-3 w-3 mr-1" />
                                                            <span className="truncate max-w-32">{vendor.email}</span>
                                                        </div>
                                                    )}
                                                    {vendor.phone && (
                                                        <div className="flex items-center text-xs">
                                                            <Phone className="h-3 w-3 mr-1" />
                                                            <span>{vendor.phone}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div>
                                                    {vendor.vendor_type && (
                                                        <Badge variant="outline" className="mb-1">{vendor.vendor_type}</Badge>
                                                    )}
                                                    {vendor.rating && (
                                                        <div className="flex items-center text-xs text-gray-500">
                                                            <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                            <span>{Number(vendor.rating).toFixed(1)}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="text-sm">
                                                    {vendor.city && <p>{vendor.city}</p>}
                                                    {vendor.state && <p className="text-xs text-gray-500">{vendor.state}</p>}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Select
                                                    value={vendor.status || 'Active'}
                                                    onValueChange={(value) => handleUpdateStatus(vendor.id, value)}
                                                >
                                                    <SelectTrigger className={`w-32 h-8 ${vendor.status?.toLowerCase() === 'active' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-gray-100 text-gray-800 border-gray-200'}`}>
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
                                                    <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/vendors/${vendor.id}`)}>
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditVendor(vendor.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteVendor(vendor.id)}>
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

                    {/* Pagination */}
                    {!loadingVendors && pagination.total_pages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                            <p className="text-xs text-gray-500">
                                Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total_entries)} of {pagination.total_entries} vendors
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
        </div>
    );
};

export default VendorMaster;
