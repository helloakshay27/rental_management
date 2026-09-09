
import React, { useState, useEffect } from 'react';
import { PageLoader } from '@/components/ui/loader';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Zap, Building, Hash, Calendar, DollarSign, Activity, CheckCircle, XCircle } from 'lucide-react';
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
            <PageLoader />
        );
    }

    if (!utility) {
        return (
            <div className="flex justify-center items-center h-screen bg-white flex-col gap-4">
                <p className="text-gray-500">Utility not found</p>
                <Button onClick={() => navigate('/utilities')}>Back to Utilities</Button>
            </div>
        );
    }

    // Label/value pair, matching the reference module's details grid.
    const Field = ({ icon: Icon, label, value }: { icon: any; label: string; value: React.ReactNode }) => (
        <div className="space-y-1">
            <p className="text-sm text-gray-500 flex items-center gap-2">
                <Icon className="h-4 w-4" /> {label}
            </p>
            <p className="text-[14px] font-medium text-brand-text">{value}</p>
        </div>
    );

    return (
        <div className="p-6">
            <button
                type="button"
                onClick={() => navigate('/utilities')}
                className="flex items-center gap-2 text-sm text-gray-700 hover:text-gray-900"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Utilities</span>
            </button>

            <div className="mb-6 mt-2 flex items-center justify-between">
                <h1 className="text-brand-body-1 font-bold text-[#1a1a1a]">UTILITY DETAILS</h1>
                <Button
                    onClick={() => navigate(`/utilities/edit/${id}`)}
                    variant="outline"
                    className="fm-button-fix px-6 py-2"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                </Button>
            </div>

            <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-lg text-black flex items-center gap-2">
                            <Zap className="h-5 w-5 text-brand" />
                            UTILITY CONNECTION DETAILS
                        </CardTitle>
                        <span
                            className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${utility.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                }`}
                        >
                            {utility.is_active ? <CheckCircle className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                            {utility.is_active ? 'Active' : 'Inactive'}
                        </span>
                    </div>
                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Field icon={Zap} label="Provider / Company" value={utility.provider || 'N/A'} />
                        <Field icon={Activity} label="Utility Type" value={utility.utility_type || 'N/A'} />
                        <Field icon={Building} label="Property" value={propertyName || 'N/A'} />
                        <Field icon={Hash} label="Meter Number" value={utility.meter_number || 'N/A'} />
                        <Field
                            icon={DollarSign}
                            label="Monthly Cost (Est.)"
                            value={`₹${utility.monthly_cost?.toLocaleString() || '0'}`}
                        />
                        <Field
                            icon={Calendar}
                            label="Last Updated"
                            value={utility.updated_at ? new Date(utility.updated_at).toLocaleDateString() : 'N/A'}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6 border-[#D9D9D9] bg-[#F6F7F7]">
                <CardHeader className="bg-[#F6F4EE] mb-4">
                    <CardTitle className="text-lg text-black flex items-center gap-2">
                        <Activity className="h-5 w-5 text-brand" />
                        QUICK ACTIONS
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex flex-wrap gap-4 mb-6">
                        <Button variant="outline" className="fm-button-fix px-6 py-2">
                            <Calendar className="w-4 h-4 mr-2" />
                            View Billing History
                        </Button>
                        <Button variant="outline" className="fm-button-fix px-6 py-2">
                            <Activity className="w-4 h-4 mr-2" />
                            Track Consumption
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default UtilityDetailsPage;
