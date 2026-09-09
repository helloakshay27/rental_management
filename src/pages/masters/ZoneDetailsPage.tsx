import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { MapPinned, ArrowLeft, Map, Hash, Info, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

const ZoneDetailsPage = () => {
    const { id } = useParams();
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
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Hash className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Zone Code</p>
                                        <p className="text-[14px] font-medium text-brand-text">{zone.code || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Description</p>
                                        <p className="text-[14px] font-medium text-brand-text">{zone.description || 'No description provided'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Status</p>
                                        <Badge variant="outline" className={`${zone.is_active ? 'border-green-200 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-700'} font-bold`}>
                                            {zone.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
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

                <Card className="bg-[#C72030] border-none shadow-xl text-white overflow-hidden relative">
                    <div className="absolute -right-16 -top-16 opacity-10">
                        <Map className="h-64 w-64" />
                    </div>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Map className="h-5 w-5" />
                            Region Association
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6">
                        {zone.region ? (
                            <>
                                <div>
                                    <p className="text-white/60 text-xs uppercase font-semibold tracking-wider mb-1">Parent Region</p>
                                    <p className="text-brand-body-1 font-bold truncate">{zone.region.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <p className="text-white/60 text-[10px] uppercase font-semibold mb-1 tracking-wider">Region Code</p>
                                        <p className="text-lg font-mono font-bold">{zone.region.code}</p>
                                    </div>
                                    <div className="flex-1 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <p className="text-white/60 text-[10px] uppercase font-semibold mb-1 tracking-wider">Region ID</p>
                                        <p className="text-lg font-mono font-bold">#{zone.region.id}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-[#C72030] hover:bg-gray-100 font-bold"
                                    onClick={() => navigate(`/masters/regions/${zone.region.id}`)}
                                >
                                    View Region Details
                                </Button>
                            </>
                        ) : (
                            <div className="py-8 text-center text-white/50 italic">
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
