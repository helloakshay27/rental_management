
import React, { useEffect, useState } from 'react';
import { DetailHeader, DetailSection, DetailGrid, DetailField } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

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
                <DetailGrid className="lg:grid-cols-4">
                    <DetailField label="ISO Numeric Code" value={country.iso_code || '-'} />
                    <DetailField label="Phone Dial Code" value={country.phone_code || '-'} />
                    <DetailField label="Primary Currency" value={country.currency_code || '-'} />
                    <DetailField
                        label="Geopolitical Status"
                        value={
                            <Badge className={country.is_active ? 'bg-green-100 text-green-700 border-none' : 'bg-red-100 text-red-700 border-none'}>
                                {country.is_active ? 'Operational' : 'Restricted'}
                            </Badge>
                        }
                    />
                </DetailGrid>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 pt-3 text-[12px] text-brand-text-light">
                    <span>Last system audit: {country.updated_at ? new Date(country.updated_at).toLocaleDateString() : '-'}</span>
                    <span>Recorded since: {country.created_at ? new Date(country.created_at).toLocaleDateString() : '-'}</span>
                </div>
            </DetailSection>
        </PageContainer>
    );
};

export default CountryDetailsPage;
