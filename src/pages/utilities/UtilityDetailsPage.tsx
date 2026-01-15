
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowLeft, Edit, Loader2, Zap, Building, Hash, Calendar, DollarSign, Activity, CheckCircle, XCircle } from 'lucide-react';
import { getAuth, getToken } from '@/lib/api';
import { toast } from 'sonner';

const UtilityDetailsPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [utility, setUtility] = useState<any>(null);
    const [propertyName, setPropertyName] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUtility = async () => {
            try {
                setIsLoading(true);
                const res = await getAuth(`/utilities/${id}.json`);
                const data = res?.utility || res;
                setUtility(data);

                // Fetch property details if site_id is available
                if (data && data.site_id) {
                    try {
                        const siteRes = await getAuth(`/pms/sites/${data.site_id}.json`);
                        if (siteRes?.site) {
                            setPropertyName(siteRes.site.name);
                        } else if (siteRes?.name) {
                            setPropertyName(siteRes.name);
                        }
                    } catch (err) {
                        console.error("Failed to fetch site details", err);
                    }
                }

            } catch (error) {
                console.error('Failed to fetch utility details:', error);
                toast.error('Failed to load utility details');
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchUtility();
        }
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    if (!utility) {
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50 flex-col gap-4">
                <p className="text-gray-500">Utility not found</p>
                <Button onClick={() => navigate('/utilities')}>Back to Utilities</Button>
            </div>
        );
    }

    return (
        <div className="p-8 w-full bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" onClick={() => navigate('/utilities')} className="p-0 hover:bg-transparent">
                            <ArrowLeft className="h-6 w-6 text-gray-600" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Utility Details</h1>
                            <p className="text-sm text-gray-500">View detailed information about this utility service</p>
                        </div>
                    </div>
                    <Button
                        onClick={() => navigate(`/utilities/edit/${id}`)}
                        className="bg-[#C72030] hover:bg-[#A01825] text-white"
                    >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Utility
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Info Card */}
                    <Card className="col-span-1 lg:col-span-2 bg-white border border-gray-200 shadow-sm overflow-hidden">
                        <div className="h-1 bg-[#C72030]"></div>
                        <CardHeader className="border-b border-gray-100">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Zap className="h-5 w-5 text-[#C72030]" />
                                        {utility.provider}
                                    </CardTitle>
                                    <CardDescription>{utility.utility_type}</CardDescription>
                                </div>
                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${utility.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                    {utility.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                                    {utility.is_active ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                        <Building className="h-4 w-4" /> Property
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">{propertyName || 'Loading...'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                        <Hash className="h-4 w-4" /> Meter Number
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">{utility.meter_number || 'N/A'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                        <DollarSign className="h-4 w-4" /> Monthly Cost (Est.)
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">₹{utility.monthly_cost?.toLocaleString() || '0'}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-sm text-gray-500 font-medium flex items-center gap-2">
                                        <Calendar className="h-4 w-4" /> Last Updated
                                    </p>
                                    <p className="text-lg font-semibold text-gray-900">
                                        {utility.updated_at ? new Date(utility.updated_at).toLocaleDateString() : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats / Quick Actions Card */}
                    <Card className="bg-white border border-gray-200 shadow-sm">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <Activity className="h-5 w-5 text-[#C72030]" />
                                Quick Actions
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-[#C72030]">
                                <Calendar className="h-4 w-4 mr-2" />
                                View Billing History
                            </Button>
                            <Button variant="outline" className="w-full justify-start text-gray-700 hover:bg-gray-50 hover:text-[#C72030]">
                                <Activity className="h-4 w-4 mr-2" />
                                Track Consumption
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default UtilityDetailsPage;
