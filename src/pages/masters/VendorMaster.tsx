
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Building, Star, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from '@/lib/api';
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
    is_active: boolean;
    created_by: number;
    bank_detail?: BankDetail;
    created_at: string;
    updated_at: string;
}

const VendorMaster = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [loadingVendors, setLoadingVendors] = useState(true);

    const fetchVendors = async () => {
        try {
            setLoadingVendors(true);
            const data = await getAuth('/vendors');
            if (Array.isArray(data)) {
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
        fetchVendors();
    }, []);

    const filteredVendors = vendors.filter(vendor =>
        vendor.vendor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        vendor.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleEditVendor = (vendorId: number) => {
        navigate(`/masters/vendors/edit/${vendorId}`);
    };

    const handleAddVendor = () => {
        navigate('/masters/vendors/add');
    };

    return (
        <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Vendor Master</h1>
                    <p className="text-gray-600">Manage vendors, suppliers, and their details</p>
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
                            <div className="relative">
                                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search vendors..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 w-64 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loadingVendors ? (
                        <div className="text-center py-8 text-gray-500">Loading vendors...</div>
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
                                                <Badge className={vendor.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                                                    {vendor.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center space-x-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleEditVendor(vendor.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-red-600">
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

export default VendorMaster;
