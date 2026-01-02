import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Calendar, FileText, User, Building, IndianRupee, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const AmcContractDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [contract, setContract] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchContract = async () => {
            try {
                setLoading(true);
                const data = await getAuth(`/amc_contracts/${id}.json`);
                setContract(data);
            } catch (error) {
                console.error('Failed to fetch contract details:', error);
                toast.error('Failed to load contract details');
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchContract();
        }
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C72030]"></div>
            </div>
        );
    }

    if (!contract) {
        return (
            <div className="p-8 text-center">
                <h2 className="text-xl font-semibold text-gray-900">Contract not found</h2>
                <Button variant="link" onClick={() => navigate('/amc')} className="mt-4 text-[#C72030]">Back to List</Button>
            </div>
        );
    }

    const getDaysToExpiry = (endDate: string) => {
        if (!endDate) return 0;
        const end = new Date(endDate);
        const today = new Date();
        const diffTime = end.getTime() - today.getTime();
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const daysToExpiry = getDaysToExpiry(contract.end_date);

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="max-w-8xl mx-auto space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/amc')} className="p-0 hover:bg-transparent">
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                AMC Contract #{contract.id}
                                <Badge className={`text-sm font-medium capitalize ${contract.status === 'active' ? 'bg-green-100 text-green-800' :
                                    contract.status === 'expired' ? 'bg-red-100 text-red-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                    {contract.status}
                                </Badge>
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">Created on {new Date(contract.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate(`/amc/edit/${id}`)}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Contract
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-[#C72030]" />
                                    Service & Property Details
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Service Type</p>
                                        <p className="text-base font-medium text-gray-900">{contract.service_type}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Contract Status</p>
                                        <div className="flex items-center gap-2">
                                            <p className="text-base font-medium text-gray-900 capitalize">{contract.status}</p>
                                            {daysToExpiry <= 60 && daysToExpiry > 0 && contract.status === 'active' && (
                                                <span className="flex items-center text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded">
                                                    <AlertTriangle className="h-3 w-3 mr-1" />
                                                    Expiring in {daysToExpiry} days
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                                        <div className="flex items-start gap-3">
                                            <Building className="h-5 w-5 text-gray-400 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-gray-900 mb-1">Property Details</p>
                                                <p className="text-sm text-gray-600">{contract.site?.name}</p>
                                                <p className="text-sm text-gray-500">{contract.site?.address}, {contract.site?.city}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <IndianRupee className="h-5 w-5 text-[#C72030]" />
                                    Financials & Terms
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Contract Value</p>
                                        <p className="text-xl font-bold text-gray-900">₹{parseFloat(contract.contract_value).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Annual Cost</p>
                                        <p className="text-xl font-bold text-gray-900">₹{parseFloat(contract.annual_cost).toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Payment Terms</p>
                                        <p className="text-base font-medium text-gray-900">{contract.payment_terms || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Renewal Policy</p>
                                        <div className="flex items-center gap-2">
                                            {contract.auto_renewal ? (
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                            ) : (
                                                <div className="h-2 w-2 rounded-full bg-gray-300" />
                                            )}
                                            <p className="text-base font-medium text-gray-900">
                                                {contract.auto_renewal ? 'Auto-Renewal Enabled' : 'Manual Renewal'}
                                            </p>
                                        </div>
                                        {contract.auto_renewal && (
                                            <p className="text-xs text-gray-500 mt-1">Notice period: {contract.renewal_notice_days} days</p>
                                        )}
                                    </div>
                                </div>

                                {contract.terms_conditions && (
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm font-medium text-gray-700 mb-2">Terms & Conditions</p>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{contract.terms_conditions}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <User className="h-5 w-5 text-[#C72030]" />
                                    Vendor Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-base font-bold text-gray-900">{contract.vendor?.name || contract.vendor?.vendor_name || 'Unknown Vendor'}</p>
                                    <Badge variant="outline" className="mt-2 text-xs text-gray-500">
                                        ID: {contract.vendor_id}
                                    </Badge>
                                </div>

                                {contract.vendor?.contact_person && (
                                    <div className="pt-2 border-t border-gray-100">
                                        <p className="text-xs text-gray-500">Contact Person</p>
                                        <p className="text-sm font-medium text-gray-900">{contract.vendor.contact_person}</p>
                                    </div>
                                )}

                                {contract.vendor?.email && (
                                    <div>
                                        <p className="text-xs text-gray-500">Email</p>
                                        <p className="text-sm font-medium text-gray-900">{contract.vendor.email}</p>
                                    </div>
                                )}

                                {contract.vendor?.phone && (
                                    <div>
                                        <p className="text-xs text-gray-500">Phone</p>
                                        <p className="text-sm font-medium text-gray-900">{contract.vendor.phone}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="border-gray-200">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-[#C72030]" />
                                    Important Dates
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">Start Date</p>
                                    <p className="text-sm font-medium text-gray-900">{contract.start_date}</p>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className="text-sm text-gray-500">End Date</p>
                                    <p className="text-sm font-medium text-gray-900">{contract.end_date}</p>
                                </div>
                                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                                    <p className="text-sm text-gray-500">Duration</p>
                                    <p className="text-sm font-medium text-gray-900">
                                        {contract.start_date && contract.end_date ? (
                                            Math.ceil((new Date(contract.end_date).getTime() - new Date(contract.start_date).getTime()) / (1000 * 60 * 60 * 24))
                                        ) : 0} days
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {contract.remarks && (
                            <Card className="border-gray-200 bg-yellow-50/50">
                                <CardHeader>
                                    <CardTitle className="text-sm font-semibold text-gray-800">Remarks</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 italic">"{contract.remarks}"</p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AmcContractDetail;
