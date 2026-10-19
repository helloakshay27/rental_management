
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { getAuth } from '@/lib/api';
import { MapPin, ArrowLeft, Globe, Hash, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';
import { trackViewed } from '@/utils/analytics';

const StateDetailsPage = () => {
    const { id } = useParams();

    // Detail screens are the app's read funnel: report the view once per record.
    useEffect(() => {
        trackViewed('State', { record_id: id, source: 'detail_page' });
    }, [id]);
    const navigate = useNavigate();
    const [state, setState] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchStateDetails();
    }, [id]);

    const fetchStateDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/pms/states/${id}`);
            setState(data?.state || data);
        } catch (error) {
            console.error('Failed to fetch state details:', error);
            toast.error('Failed to load state details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (!state) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">State not found</p>
                    <Button onClick={() => navigate('/masters/states')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title="State Details" backTo="/masters/states" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DetailSection title="Administrative Division" className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-[#F5F4F0] p-2 text-[rgba(26,26,24,0.72)]">
                                        <Hash className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">State Code</p>
                                        <p className="text-[14px] font-medium text-brand-text">{state.code || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-[#F5F4F0] p-2 text-[rgba(26,26,24,0.72)]">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Metadata Status</p>
                                        <StatusPill status="Verified" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200 pb-2">System Logs</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Record Created</span>
                                        <span className="text-sm font-semibold text-gray-900">{new Date(state.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Last Modified</span>
                                        <span className="text-sm font-semibold text-gray-900">{new Date(state.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                </DetailSection>

                <Card className="bg-white overflow-hidden relative">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-[14px] font-semibold text-[#1A1A18] flex items-center gap-2">
                            <Globe className="h-[18px] w-[18px] text-[rgba(26,26,24,0.72)]" />
                            Country Association
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6">
                        {state.country ? (
                            <>
                                <div>
                                    <p className="text-[12px] font-semibold text-[rgba(26,26,24,0.62)] mb-1">Parent Country</p>
                                    <p className="text-[18px] font-semibold text-[#1A1A18] truncate">{state.country.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-[#F5F4F0] rounded-[12px] p-4">
                                        <p className="text-[12px] font-semibold text-[rgba(26,26,24,0.62)] mb-1">Alpha Code</p>
                                        <p className="text-[15px] font-mono font-semibold text-[#1A1A18]">{state.country.code}</p>
                                    </div>
                                    <div className="flex-1 bg-[#F5F4F0] rounded-[12px] p-4">
                                        <p className="text-[12px] font-semibold text-[rgba(26,26,24,0.62)] mb-1">Country ID</p>
                                        <p className="text-[15px] font-mono font-semibold text-[#1A1A18]">#{state.country.id}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate(`/masters/countries/${state.country.id}`)}
                                >
                                    View Country Details
                                </Button>
                            </>
                        ) : (
                            <div className="py-8 text-center text-[rgba(26,26,24,0.62)] italic">
                                No country association found for this state record.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default StateDetailsPage;
