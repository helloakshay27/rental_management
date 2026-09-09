
import React, { useEffect, useState } from 'react';
import { DetailHeader, DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { Globe, ArrowLeft, Landmark, Coins, Hash, Flag } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

const CountryDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [country, setCountry] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCountryDetails();
    }, [id]);

    const fetchCountryDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/pms/countries/${id}`);
            setCountry(data?.country || data);
        } catch (error) {
            console.error('Failed to fetch country details:', error);
            toast.error('Failed to load country details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (!country) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Country not found</p>
                    <Button onClick={() => navigate('/masters/countries')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Country Details"
                backTo="/masters/countries"
                actions={
                    <>
                <div className="flex items-center gap-3">
                    <Badge className={country.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-red-500 hover:bg-red-600'}>
                        {country.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    </div>
                    </>
                }
            />

            <DetailHeader
                id={country.code}
                title={country.name}
                meta={<span>Official Region Member</span>}
            />

            <DetailSection title="Country Information">
                    <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100">
                        <div className="space-y-5 p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-md bg-brand-light p-2 text-brand">
                                    <Hash className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">ISO Numeric Code</p>
                                    <p className="text-lg font-bold text-gray-900">{country.iso_code || '---'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="rounded-md bg-brand-light p-2 text-brand">
                                    <Landmark className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Phone Dial Code</p>
                                    <p className="text-lg font-bold text-gray-900">{country.phone_code || '---'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5 p-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-md bg-brand-light p-2 text-brand">
                                    <Coins className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Primary Currency</p>
                                    <p className="text-lg font-bold text-gray-900">{country.currency_code || '---'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="rounded-md bg-brand-light p-2 text-brand">
                                    <Flag className="h-5 w-5 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-3">Geopolitical Status</p>
                                    <Badge className={country.is_active ? 'bg-green-100 text-green-700 border-none' : 'bg-red-100 text-red-700 border-none'}>
                                        {country.is_active ? 'Operational' : 'Restricted'}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                        <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
                            <span>Last system audit: {new Date(country.updated_at).toLocaleDateString()}</span>
                            <span>Recorded since: {new Date(country.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
            </DetailSection>
        </PageContainer>
    );
};

export default CountryDetailsPage;
