
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { User, Mail, Phone, MapPin, Building2, Briefcase, FileText, ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

const TenantDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tenant, setTenant] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchTenantDetails();
    }, [id]);

    const fetchTenantDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/tenants/${id}`);
            // Check for nested tenant object or direct response
            setTenant(data?.tenant || data);
        } catch (error) {
            console.error('Failed to fetch lessee details:', error);
            toast.error('Failed to load lessee details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (!tenant) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Lessee not found</p>
                    <Button onClick={() => navigate('/masters/tenants')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Lessee Profile"
                backTo="/masters/tenants"
                actions={
                    <>
                <div className="flex items-center gap-3">
                    <Badge variant={tenant.status === 'Active' ? 'default' : 'secondary'} className="h-fit py-1 px-3">
                        {tenant.status || 'Active'}
                    </Badge>
                    </div>
                    </>
                }
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Primary Information */}
                <DetailSection title="Basic Information" className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Full Name</p>
                                        <p className="text-lg font-medium text-gray-900">{tenant.full_name || tenant.name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Email Address</p>
                                        <p className="text-[14px] font-medium text-brand-text">{tenant.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Phone Number</p>
                                        <p className="text-[14px] font-medium text-brand-text">{tenant.phone || 'N/A'}</p>
                                        {tenant.alternate_phone && (
                                            <p className="text-sm text-gray-500 mt-1">Alt: {tenant.alternate_phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Building2 className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Company Name</p>
                                        <p className="text-[14px] font-medium text-brand-text">{tenant.company_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Briefcase className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Designation</p>
                                        <p className="text-[14px] font-medium text-brand-text">{tenant.designation || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <MapPin className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Permanent Address</p>
                                        <p className="font-medium text-gray-900 whitespace-pre-wrap">{tenant.permanent_address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                </DetailSection>

                {/* Identity & Legal Information */}
                <DetailSection title="Identity Details">
                        <div className="space-y-5">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">PAN Number</p>
                                    <Badge variant="outline" className="text-[10px] h-5 bg-gray-50">Legal</Badge>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-lg font-bold text-gray-900 tracking-widest">{tenant.pan_number || tenant.pan || 'NOT PROVIDED'}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Aadhar Number</p>
                                    <Badge variant="outline" className="text-[10px] h-5 bg-gray-50">Identity</Badge>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-lg font-bold text-gray-900 tracking-widest">
                                        {tenant.aadhar_number ? tenant.aadhar_number.replace(/(\d{4})/g, '$1 ').trim() : 'NOT PROVIDED'}
                                    </p>
                                </div>
                            </div>

                            {tenant.currentProperty && (
                                <div className="pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-2">Current Lease</p>
                                    <div className="flex items-center gap-2">
                                        <Building2 className="h-4 w-4 text-gray-400" />
                                        <p className="text-[14px] font-medium text-brand-text">{tenant.currentProperty}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 ml-6 mt-1">
                                        {tenant.leaseStart} to {tenant.leaseEnd}
                                    </p>
                                </div>
                            )}
                        </div>
                </DetailSection>
            </div>
        </PageContainer>
    );
};

export default TenantDetailsPage;
