
import React, { useEffect, useState } from 'react';
import { DetailSection, DetailGrid, DetailField } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const LandlordDetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [landlord, setLandlord] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchLandlordDetails();
    }, [id]);

    const fetchLandlordDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/landlords/${id}`);
            setLandlord(data?.landlord || data);
        } catch (error) {
            console.error('Failed to fetch landlord details:', error);
            toast.error('Failed to load landlord details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <PageLoader />
        );
    }

    if (!landlord) {
        return (
            <PageContainer>
                <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
                    <p className="text-gray-500">Landlord not found</p>
                    <Button onClick={() => navigate('/masters/landlords')} className="mt-4">
                        Go Back
                    </Button>
                </div>
            </PageContainer>
        );
    }

    return (
        <PageContainer>
            <PageHeader
                title="Landlord Profile"
                backTo="/masters/landlords"
                actions={
                    <>
                <div className="flex items-center gap-3">
                    <Badge className={landlord.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500 hover:bg-gray-600'}>
                        {landlord.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    </div>
                    </>
                }
            />

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 items-start">
                {/* Primary Information */}
                <DetailSection title="Landlord Information" className="mb-0 lg:col-span-2">
                    <DetailGrid className="lg:grid-cols-3">
                        <DetailField
                            label="Landlord / Company / Contact Person (Lessor)"
                            value={landlord.contact_person || landlord.company_name || '-'}
                        />
                        <DetailField label="Email Address" value={landlord.email || '-'} />
                        <DetailField label="Phone Number" value={landlord.phone || '-'} />
                    </DetailGrid>
                </DetailSection>

                {/* Tax & Legal Information */}
                <DetailSection title="Tax Details" className="mb-0">
                    <DetailGrid className="sm:grid-cols-1 lg:grid-cols-1">
                        <DetailField
                            label="PAN Number"
                            value={<span className="font-mono tracking-wider">{landlord.pan || 'Not provided'}</span>}
                        />
                        <DetailField
                            label="GST Number"
                            value={<span className="font-mono tracking-wider">{landlord.gst || 'Not provided'}</span>}
                        />
                        <DetailField
                            label="Aadhar Number"
                            value={
                                <span className="font-mono tracking-wider">
                                    {landlord.aadhaar_number
                                        ? landlord.aadhaar_number.replace(/(\d{4})/g, '$1 ').trim()
                                        : 'Not provided'}
                                </span>
                            }
                        />
                    </DetailGrid>
                </DetailSection>

                {/* Bank Details */}
                {landlord.bank_details?.length > 0 && (
                    <DetailSection title="Bank Information" className="mb-0 lg:col-span-3">
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {landlord.bank_details.map((bank: any, index: number) => (
                                <div
                                    key={index}
                                    className="rounded-md border border-brand-border bg-white p-4"
                                >
                                    <DetailGrid className="lg:grid-cols-2">
                                        <DetailField label="Bank Name" value={bank.bank_name || '-'} />
                                        <DetailField label="Branch" value={bank.bank_branch || '-'} />
                                        <DetailField
                                            label="Account Number"
                                            value={<span className="break-all font-mono">{bank.account_number || '-'}</span>}
                                        />
                                        <DetailField
                                            label="IFSC Code"
                                            value={<span className="break-all font-mono">{bank.ifsc_code || '-'}</span>}
                                        />
                                        <DetailField
                                            label="Account Type"
                                            value={<span className="capitalize">{bank.account_type || '-'}</span>}
                                        />
                                    </DetailGrid>
                                </div>
                            ))}
                        </div>
                    </DetailSection>
                )}
            </div>
        </PageContainer>
    );
};

export default LandlordDetailsPage;
