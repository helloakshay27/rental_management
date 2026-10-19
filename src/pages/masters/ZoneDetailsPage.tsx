import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusPill } from '@/components/ui/status-pill';
import { getAuth } from '@/lib/api';
import { MapPinned, ArrowLeft, Map, Hash, Info, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';
import { trackViewed } from '@/utils/analytics';

const ZoneDetailsPage = () => {
    const { id } = useParams();

    // Detail screens are the app's read funnel: report the view once per record.
    useEffect(() => {
        trackViewed('Zone', { record_id: id, source: 'detail_page' });
    }, [id]);
    const navigate = useNavigate();
    const [zone, setZone] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchZoneDetails();
    }, [id]);

    const fetchZoneDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/pms/zones/${id}`);
            setZone(data?.pms_zone || data);
        } catch (error) {
            console.error('Failed to fetch zone details:', error);
            toast.error('Failed to load zone details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (!zone) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Zone not found</p>
                    <Button onClick={() => navigate('/masters/zones')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader title="Zone Details" backTo="/masters/zones" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <DetailSection title="Zone Information" className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-[#F5F4F0] p-2 text-[rgba(26,26,24,0.72)]">
                                        <Hash className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Zone Code</p>
                                        <p className="text-[14px] font-medium text-brand-text">{zone.code || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-[#F5F4F0] p-2 text-[rgba(26,26,24,0.72)]">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Description</p>
                                        <p className="text-[14px] font-medium text-brand-text">{zone.description || 'No description provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-[#F5F4F0] p-2 text-[rgba(26,26,24,0.72)]">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Status</p>
                                        <StatusPill status={zone.is_active ? 'Active' : 'Inactive'} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider border-b border-gray-200 pb-2">System Logs</p>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Record Created</span>
                                        <span className="text-sm font-semibold text-gray-900">{new Date(zone.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">Last Modified</span>
                                        <span className="text-sm font-semibold text-gray-900">{new Date(zone.updated_at).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                </DetailSection>

                <Card className="bg-white overflow-hidden relative">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-[14px] font-semibold text-[#1A1A18] flex items-center gap-2">
                            <Map className="h-[18px] w-[18px] text-[rgba(26,26,24,0.72)]" />
                            Region Association
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6">
                        {zone.region ? (
                            <>
                                <div>
                                    <p className="text-[12px] font-semibold text-[rgba(26,26,24,0.62)] mb-1">Parent Region</p>
                                    <p className="text-[18px] font-semibold text-[#1A1A18] truncate">{zone.region.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-[#F5F4F0] rounded-[12px] p-4">
                                        <p className="text-[12px] font-semibold text-[rgba(26,26,24,0.62)] mb-1">Region Code</p>
                                        <p className="text-[15px] font-mono font-semibold text-[#1A1A18]">{zone.region.code}</p>
                                    </div>
                                    <div className="flex-1 bg-[#F5F4F0] rounded-[12px] p-4">
                                        <p className="text-[12px] font-semibold text-[rgba(26,26,24,0.62)] mb-1">Region ID</p>
                                        <p className="text-[15px] font-mono font-semibold text-[#1A1A18]">#{zone.region.id}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate(`/masters/regions/${zone.region.id}`)}
                                >
                                    View Region Details
                                </Button>
                            </>
                        ) : (
                            <div className="py-8 text-center text-[rgba(26,26,24,0.62)] italic">
                                No region association found for this zone record.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </PageContainer>
    );
};

export default ZoneDetailsPage;
