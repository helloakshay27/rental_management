
import React, { useEffect, useState } from 'react';
import { DetailSection, DetailGrid, DetailField } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { CheckCircle2, XCircle } from 'lucide-react';
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 items-start">
                <DetailSection title="Configuration Info" className="mb-0 h-full">
                    <DetailGrid className="lg:grid-cols-2">
                        <DetailField label="Field Name" value={field.name || '-'} />
                        <DetailField
                            label="Field Type"
                            value={
                                <Badge variant="secondary" className="text-xs capitalize px-2 py-0.5">
                                    {field.field_type || '-'}
                                </Badge>
                            }
                        />
                        <DetailField
                            label="Is Required?"
                            value={
                                <span className="inline-flex items-center gap-1.5">
                                    {field.required
                                        ? <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        : <XCircle className="h-4 w-4 text-gray-400" />}
                                    {field.required ? 'Yes, this field is mandatory' : 'No, this field is optional'}
                                </span>
                            }
                        />
                    </DetailGrid>
                </DetailSection>

                <DetailSection title="System Metadata" className="mb-0 h-full">
                    <DetailGrid className="lg:grid-cols-2">
                        <DetailField
                            label="Created At"
                            value={field.created_at ? new Date(field.created_at).toLocaleString() : '-'}
                        />
                        <DetailField
                            label="Last Updated"
                            value={field.updated_at ? new Date(field.updated_at).toLocaleString() : '-'}
                        />
                    </DetailGrid>
                </DetailSection>
            </div>

        </PageContainer>
    );
};

export default LeaseCustomFieldDetailsPage;
