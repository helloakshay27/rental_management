
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { Building, ArrowLeft, User, Mail, Phone, MapPin, Receipt, Star, Landmark, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

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
            <PageLoader />
        );
    }

    if (!vendor) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Vendor not found</p>
                    <Button onClick={() => navigate('/masters/vendors')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Vendor Profile"
                backTo="/masters/vendors"
                actions={
                    <>
                <div className="flex items-center gap-3">
                    <Badge className={vendor.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                        {vendor.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    </div>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <DetailSection
                    title={vendor.vendor_name}
                    className="lg:col-span-2"
                    action={
                        <span className="flex items-center gap-1 text-brand-body-5 font-medium text-brand-text">
                            <Star className="h-4 w-4 fill-brand-warning text-brand-warning" />
                            {Number(vendor.rating || 0).toFixed(1)}
                        </span>
                    }
                >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                            <div className="space-y-5">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Primary Contact</p>
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-md bg-brand-light p-2 text-brand">
                                            <User className="h-4 w-4" />
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
                                        <div className="rounded-md bg-brand-light p-2 text-brand">
                                            <MapPin className="h-4 w-4" />
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
                </DetailSection>

                {/* Statutory & Bank */}
                <div className="space-y-5">
                    <DetailSection title="Statutory Details">
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
                    </DetailSection>

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
        </PageContainer>
    );
};

export default VendorDetailsPage;
