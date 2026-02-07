
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { ArrowLeft, Settings2, Calendar, FileText, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const LeaseCustomFieldDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [field, setField] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFieldDetails();
    }, [id]);

    const fetchFieldDetails = async () => {
        try {
            setIsLoading(true);
            const response = await getAuth(`/lease_custom_fields/${id}`);
            setField(response?.data || response?.lease_custom_field || response);
        } catch (error) {
            console.error('Failed to fetch custom field details:', error);
            toast.error('Failed to load custom field details');
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

    if (!field) {
        return (
            <div className="p-8 w-full bg-gray-50 min-h-screen">
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Custom field not found</p>
                    <Button onClick={() => navigate('/masters/lease-custom-fields')} className="mt-4">
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
                        onClick={() => navigate('/masters/lease-custom-fields')}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Back to Custom Fields
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Custom Field Details</h1>
                        <p className="text-gray-500">ID: {field.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Badge className={field.status === 'Active' ? 'bg-green-600' : 'bg-gray-500'}>
                        {field.status || 'Active'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Settings2 className="h-5 w-5 text-[#C72030]" />
                            Configuration Info
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                <FileText className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Field Name</p>
                                <p className="text-lg font-medium text-gray-900">{field.name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                <Settings2 className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Field Type</p>
                                <Badge variant="secondary" className="text-sm capitalize px-3 py-1 mt-1">
                                    {field.field_type || 'N/A'}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-2 bg-red-50 rounded-lg text-[#C72030]">
                                {field.required ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Is Required?</p>
                                <p className="font-medium text-gray-900 mt-1">
                                    {field.required ? 'Yes, this field is mandatory' : 'No, this field is optional'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white border border-gray-200 shadow-sm">
                    <CardHeader className="border-b border-gray-100">
                        <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                            <Calendar className="h-5 w-5 text-[#C72030]" />
                            System Metatdata
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Created At</p>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-gray-900 font-medium">
                                    {field.created_at ? new Date(field.created_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Last Updated</p>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                                <p className="text-gray-900 font-medium">
                                    {field.updated_at ? new Date(field.updated_at).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LeaseCustomFieldDetailsPage;
