
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { User, Mail, Phone, MapPin, Building2, Briefcase, FileText, ArrowLeft, Edit, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

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
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!tenant) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Lessee not found</p>
                    <Button onClick={() => navigate('/masters/tenants')} className="mt-4">
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
                        onClick={() => navigate('/masters/tenants')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Lessees
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Lessee Profile</h1>
                        <p className="text-gray-500">ID: {tenant.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge variant={tenant.status === 'Active' ? 'default' : 'secondary'} className="h-fit py-1 px-3">
                        {tenant.status || 'Active'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Primary Information */}
                <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <User className="h-5 w-5 text-[#C72030]" />
                            Basic Information
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <User className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Full Name</p>
                                        <p className="text-lg font-medium text-gray-900">{tenant.full_name || tenant.name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                                        <p className="font-medium text-gray-900">{tenant.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone Number</p>
                                        <p className="font-medium text-gray-900">{tenant.phone || 'N/A'}</p>
                                        {tenant.alternate_phone && (
                                            <p className="text-sm text-gray-500 mt-1">Alt: {tenant.alternate_phone}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Building2 className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Company Name</p>
                                        <p className="font-medium text-gray-900">{tenant.company_name || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Briefcase className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Designation</p>
                                        <p className="font-medium text-gray-900">{tenant.designation || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Permanent Address</p>
                                        <p className="font-medium text-gray-900 whitespace-pre-wrap">{tenant.permanent_address || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Identity & Legal Information */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <FileText className="h-5 w-5 text-[#C72030]" />
                            Identity Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">PAN Number</p>
                                    <Badge variant="outline" className="text-[10px] h-5 bg-gray-50">Legal</Badge>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                    <p className="text-lg font-bold text-gray-900 tracking-widest">{tenant.pan_number || tenant.pan || 'NOT PROVIDED'}</p>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Aadhar Number</p>
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
                                        <p className="font-medium text-gray-900">{tenant.currentProperty}</p>
                                    </div>
                                    <p className="text-sm text-gray-500 ml-6 mt-1">
                                        {tenant.leaseStart} to {tenant.leaseEnd}
                                    </p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default TenantDetailsPage;
