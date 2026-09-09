
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { MapPin, ArrowLeft, Globe, Hash, Info } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

const StateDetailsPage = () => {
    const { id } = useParams();
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
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Hash className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">State Code</p>
                                        <p className="text-[14px] font-medium text-brand-text">{state.code || 'N/A'}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Info className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Metadata Status</p>
                                        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 font-bold">Verified</Badge>
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

                <Card className="bg-[#C72030] border-none shadow-xl text-white overflow-hidden relative">
                    <div className="absolute -right-16 -top-16 opacity-10">
                        <Globe className="h-64 w-64" />
                    </div>
                    <CardHeader className="pb-4">
                        <CardTitle className="text-lg font-bold flex items-center gap-2">
                            <Globe className="h-5 w-5" />
                            Country Association
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6">
                        {state.country ? (
                            <>
                                <div>
                                    <p className="text-white/60 text-xs uppercase font-semibold tracking-wider mb-1">Parent Country</p>
                                    <p className="text-brand-body-1 font-bold truncate">{state.country.name}</p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <p className="text-white/60 text-[10px] uppercase font-semibold mb-1 tracking-wider">Alpha Code</p>
                                        <p className="text-lg font-mono font-bold">{state.country.code}</p>
                                    </div>
                                    <div className="flex-1 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                        <p className="text-white/60 text-[10px] uppercase font-semibold mb-1 tracking-wider">Country ID</p>
                                        <p className="text-lg font-mono font-bold">#{state.country.id}</p>
                                    </div>
                                </div>
                                <Button
                                    variant="secondary"
                                    className="w-full bg-white text-[#C72030] hover:bg-gray-100 font-bold"
                                    onClick={() => navigate(`/masters/countries/${state.country.id}`)}
                                >
                                    View Country Details
                                </Button>
                            </>
                        ) : (
                            <div className="py-8 text-center text-white/50 italic">
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
