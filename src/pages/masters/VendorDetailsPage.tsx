
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { Building, ArrowLeft, Loader2, User, Mail, Phone, MapPin, Receipt, Star, Landmark, CreditCard } from 'lucide-react';
import { toast } from 'sonner';

const VendorDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [vendor, setVendor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchVendorDetails();
    }, [id]);

    const fetchVendorDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/vendors/${id}`);
            setVendor(data?.vendor || data);
        } catch (error) {
            console.error('Failed to fetch vendor details:', error);
            toast.error('Failed to load vendor details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!vendor) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Vendor not found</p>
                    <Button onClick={() => navigate('/masters/vendors')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/masters/vendors')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Vendors
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Vendor Profile</h1>
                        <p className="text-gray-500">ID: {vendor.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={vendor.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                        {vendor.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <Card className="lg:col-span-2 bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100 bg-gray-50/30">
                        <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold text-gray-900">
                                <Building className="h-6 w-6 text-[#C72030]" />
                                {vendor.vendor_name}
                            </CardTitle>
                            <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full border border-yellow-100">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-bold text-yellow-700">{Number(vendor.rating || 0).toFixed(1)}</span>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Primary Contact</p>
                                    <div className="flex items-center gap-4">
                                        <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                            <User className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{vendor.contact_person || 'N/A'}</p>
                                            <p className="text-sm text-gray-500 lowercase">{vendor.vendor_type || 'General Vendor'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm font-medium">{vendor.email || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="h-4 w-4" />
                                        <span className="text-sm font-medium">{vendor.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6 border-t md:border-t-0 md:border-l border-gray-100 md:pl-10 pt-6 md:pt-0">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Business Address</p>
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                                            <MapPin className="h-5 w-5" />
                                        </div>
                                        <div className="text-sm text-gray-700 leading-relaxed font-medium">
                                            {vendor.address || 'Address not provided'}<br />
                                            {vendor.city}, {vendor.state} {vendor.postal_code}<br />
                                            {vendor.country}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Statutory & Bank */}
                <div className="space-y-6">
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-gray-500">Statutory Details</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                                    <Receipt className="h-3 w-3" /> GSTIN
                                </span>
                                <span className="text-sm font-mono font-bold text-gray-900">{vendor.gst_number || '---'}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span className="text-xs font-semibold text-gray-400 flex items-center gap-2 uppercase tracking-wider">
                                    <Receipt className="h-3 w-3" /> PAN
                                </span>
                                <span className="text-sm font-mono font-bold text-gray-900">{vendor.pan_number || '---'}</span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-[#C72030]/5 p-4 border-b border-gray-100 flex items-center gap-2">
                            <Landmark className="h-4 w-4 text-[#C72030]" />
                            <span className="text-xs font-semibold uppercase tracking-wider text-[#C72030]">Bank Information</span>
                        </div>
                        <CardContent className="p-6">
                            {vendor.bank_detail ? (
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Bank Institution</p>
                                        <p className="text-sm font-bold text-gray-900">{vendor.bank_detail.bank_name}</p>
                                    </div>
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <CreditCard className="h-5 w-5 text-gray-400" />
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Account Details</p>
                                            <p className="text-sm font-mono font-bold text-gray-900 tracking-tight">{vendor.bank_detail.account_number}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">IFSC</p>
                                            <p className="text-xs font-bold text-gray-900">{vendor.bank_detail.ifsc_code}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Type</p>
                                            <p className="text-xs font-bold text-gray-900">{vendor.bank_detail.account_type}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">Branch</p>
                                        <p className="text-xs font-medium text-gray-600">{vendor.bank_detail.bank_branch}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <p className="text-xs text-gray-400 italic">No bank records found</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default VendorDetailsPage;
