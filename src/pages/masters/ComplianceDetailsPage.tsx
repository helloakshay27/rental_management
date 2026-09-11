
import React, { useEffect, useState } from 'react';
import { DetailHeader, DetailSection, DetailGrid, DetailField } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';
import { trackViewed } from '@/utils/analytics';

const ComplianceDetailsPage = () => {
    const { id } = useParams();

    // Detail screens are the app's read funnel: report the view once per record.
    useEffect(() => {
        trackViewed('Compliance Requirement', { record_id: id, source: 'detail_page' });
    }, [id]);
    const navigate = useNavigate();
    const [compliance, setCompliance] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplianceDetails();
    }, [id]);

    const fetchComplianceDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/compliance_requirements/${id}`);
            setCompliance(data);
        } catch (error) {
            console.error('Failed to fetch compliance details:', error);
            toast.error('Failed to load compliance details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (!compliance) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Compliance requirement not found</p>
                    <Button onClick={() => navigate('/masters/compliances')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    const getStatusVariant = (status: string) => {
        const s = status?.toLowerCase();
        if (s === 'active' || s === 'completed') return 'bg-green-600';
        if (s === 'pending') return 'bg-yellow-600';
        if (s === 'overdue') return 'bg-red-600';
        return 'bg-gray-500';
    };

    return (
        <PageContainer>
            <PageHeader
                title="Compliance Requirement"
                backTo="/masters/compliances"
                actions={
                    <Badge className={`${getStatusVariant(compliance.status)} text-white`}>
                        {compliance.status?.toUpperCase() || 'UNKNOWN'}
                    </Badge>
                }
            />

            <DetailHeader
                id={compliance.requirement_type}
                title={compliance.title}
                meta={<span>{compliance.description || 'No detailed description provided.'}</span>}
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-start">
                <DetailSection title="Requirement Details" className="mb-0 lg:col-span-2">
                    <DetailGrid className="lg:grid-cols-3">
                        <DetailField label="Regulatory Body" value={compliance.regulatory_body || '-'} />
                        <DetailField label="Responsible Party" value={compliance.responsible_party || 'Unassigned'} />
                        <DetailField label="Notification Period" value={`${compliance.reminder_days || 0} Days Prior`} />
                        <DetailField label="Recurring" value={compliance.is_recurring ? 'Yes, recurring requirement' : 'No'} />
                        <DetailField
                            className="sm:col-span-2 lg:col-span-3"
                            label="Applicability Scope"
                            value={
                                compliance.property_types?.length ? (
                                    <span className="flex flex-wrap gap-2">
                                        {compliance.property_types.map((type: any) => (
                                            <Badge key={type.id} variant="secondary" className="text-xs font-medium">
                                                {type.name}
                                            </Badge>
                                        ))}
                                    </span>
                                ) : (
                                    'Universal Applicability'
                                )
                            }
                        />
                    </DetailGrid>
                </DetailSection>

                <div className="space-y-4">
                    <DetailSection title="Validity & Economics" className="mb-0">
                        <DetailGrid className="grid-cols-2 lg:grid-cols-2">
                            <DetailField label="Validity Term" value={`${compliance.validity_months || 0} Months`} />
                            <DetailField label="Approx Cost" value={`₹ ${compliance.approx_cost || '0'}`} />
                            <DetailField
                                label="Targeted Due Date"
                                value={compliance.due_date ? new Date(compliance.due_date).toLocaleDateString() : '-'}
                            />
                            {compliance.completion_date && (
                                <DetailField
                                    label="Execution Proof Date"
                                    value={new Date(compliance.completion_date).toLocaleDateString()}
                                />
                            )}
                        </DetailGrid>
                    </DetailSection>

                    <DetailSection
                        title="Document Registry"
                        className="mb-0"
                        action={
                            <Badge variant="outline" className="rounded-full text-xs">
                                {compliance.documents?.length || 0} Files
                            </Badge>
                        }
                    >
                        {compliance.documents?.length ? (
                            <p className="text-[13px] text-brand-text">Document handling system active</p>
                        ) : (
                            <p className="text-[13px] text-brand-text-light">No supporting documents uploaded to this master record.</p>
                        )}
                    </DetailSection>
                </div>
            </div>
        </PageContainer>
    );
};

export default ComplianceDetailsPage;
