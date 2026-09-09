
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { ArrowLeft, Settings2, Calendar, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

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
            <PageLoader />
        );
    }

    if (!field) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Custom field not found</p>
                    <Button onClick={() => navigate('/masters/lease-custom-fields')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Custom Field Details"
                backTo="/masters/lease-custom-fields"
                actions={
                    <>
                <div className="flex items-center gap-3">
                    <Badge className={field.status === 'Active' ? 'bg-green-600' : 'bg-gray-500'}>
                        {field.status || 'Active'}
                    </Badge>
                    </div>
                    </>
                }
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DetailSection title="Configuration Info">
                        <div className="flex items-start gap-3">
                            <div className="rounded-md bg-brand-light p-2 text-brand">
                                <FileText className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Field Name</p>
                                <p className="text-lg font-medium text-gray-900">{field.name || 'N/A'}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="rounded-md bg-brand-light p-2 text-brand">
                                <Settings2 className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Field Type</p>
                                <Badge variant="secondary" className="text-sm capitalize px-3 py-1 mt-1">
                                    {field.field_type || 'N/A'}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="rounded-md bg-brand-light p-2 text-brand">
                                {field.required ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                            </div>
                            <div>
                                <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Is Required?</p>
                                <p className="font-medium text-gray-900 mt-1">
                                    {field.required ? 'Yes, this field is mandatory' : 'No, this field is optional'}
                                </p>
                            </div>
                        </div>
                </DetailSection>

                <DetailSection title="System Metatdata">
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
                </DetailSection>
            </div>
        </PageContainer>
    );
};

export default LeaseCustomFieldDetailsPage;
