
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { User, Mail, Phone, MapPin, Building2, Briefcase, FileText, ArrowLeft, Edit, Loader2, Landmark, CreditCard, Receipt } from 'lucide-react';
import { toast } from 'sonner';

const LandlordDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [landlord, setLandlord] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLandlordDetails();
    }, [id]);

    const fetchLandlordDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/landlords/${id}`);
            setLandlord(data?.landlord || data);
        } catch (error) {
            console.error('Failed to fetch landlord details:', error);
            toast.error('Failed to load landlord details');
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

    if (!landlord) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Landlord not found</p>
                    <Button onClick={() => navigate('/masters/landlords')} className="mt-4">
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
                        onClick={() => navigate('/masters/landlords')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Landlords
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Landlord Profile</h1>
                        <p className="text-gray-500">ID: {landlord.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={landlord.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                        {landlord.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Primary Information */}
                <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-2">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Building2 className="h-5 w-5 text-[#C72030]" />
                            Landlord Information
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
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Landlord / Company / Contact Person (LESSOR)</p>
                                        <p className="text-lg font-medium text-gray-900">{landlord.contact_person || landlord.company_name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Email Address</p>
                                        <p className="font-medium text-gray-900">{landlord.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Phone Number</p>
                                        <p className="font-medium text-gray-900">{landlord.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Tax & Legal Information */}
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Receipt className="h-5 w-5 text-[#C72030]" />
                            Tax Details
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">PAN Number</p>
                                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                                    <p className="font-mono font-bold text-gray-900 tracking-wider text-center">{landlord.pan || 'NOT PROVIDED'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">GST Number</p>
                                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                                    <p className="font-mono font-bold text-gray-900 tracking-wider text-center">{landlord.gst || 'NOT PROVIDED'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Aadhar Number</p>
                                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                                    <p className="font-mono font-bold text-gray-900 tracking-wider text-center">
                                        {landlord.aadhaar_number ? landlord.aadhaar_number.replace(/(\d{4})/g, '$1 ').trim() : 'NOT PROVIDED'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Bank Details */}
                {landlord.bank_details && landlord.bank_details.length > 0 && (
                    <Card className="bg-white border border-gray-200 shadow-sm lg:col-span-3">
                        <CardHeader className="border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                                <Landmark className="h-5 w-5 text-[#C72030]" />
                                Bank Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {landlord.bank_details.map((bank: any, index: number) => (
                                    <div key={index} className="p-4 rounded-xl border border-gray-100 bg-gray-50/50 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white rounded-lg shadow-sm">
                                                <CreditCard className="h-5 w-5 text-[#C72030]" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Bank Name</p>
                                                <p className="font-medium text-gray-900">{bank.bank_name || 'N/A'}</p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Account Number</p>
                                                <p className="text-sm font-semibold text-gray-900">{bank.account_number || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">IFSC Code</p>
                                                <p className="text-sm font-semibold text-gray-900">{bank.ifsc_code || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Type</p>
                                                <Badge variant="outline" className="text-[10px] h-5">{bank.account_type || 'N/A'}</Badge>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Branch</p>
                                                <p className="text-sm font-semibold text-gray-900">{bank.bank_branch || 'N/A'}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};

export default LandlordDetailsPage;
