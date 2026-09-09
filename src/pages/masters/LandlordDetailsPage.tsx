
import React, { useEffect, useState } from 'react';
import { DetailSection } from '@/components/ui/detail-section';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getAuth } from '@/lib/api';
import { User, Mail, Phone, MapPin, Building2, Briefcase, FileText, ArrowLeft, Edit, Landmark, CreditCard, Receipt } from 'lucide-react';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Primary Information */}
                <DetailSection title="Landlord Information" className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <User className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Landlord / Company / Contact Person (LESSOR)</p>
                                        <p className="text-lg font-medium text-gray-900">{landlord.contact_person || landlord.company_name || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Mail className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Email Address</p>
                                        <p className="text-[14px] font-medium text-brand-text">{landlord.email || 'N/A'}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="rounded-md bg-brand-light p-2 text-brand">
                                        <Phone className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">Phone Number</p>
                                        <p className="text-[14px] font-medium text-brand-text">{landlord.phone || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                </DetailSection>

                {/* Tax & Legal Information */}
                <DetailSection title="Tax Details">
                        <div className="space-y-5">
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">PAN Number</p>
                                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                                    <p className="font-mono font-bold text-gray-900 tracking-wider text-center">{landlord.pan || 'NOT PROVIDED'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">GST Number</p>
                                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                                    <p className="font-mono font-bold text-gray-900 tracking-wider text-center">{landlord.gst || 'NOT PROVIDED'}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">Aadhar Number</p>
                                <div className="p-2 bg-gray-50 rounded border border-gray-100">
                                    <p className="font-mono font-bold text-gray-900 tracking-wider text-center">
                                        {landlord.aadhaar_number ? landlord.aadhaar_number.replace(/(\d{4})/g, '$1 ').trim() : 'NOT PROVIDED'}
                                    </p>
                                </div>
                            </div>
                        </div>
                </DetailSection>

                {/* Bank Details */}
                {landlord.bank_details && landlord.bank_details.length > 0 && (
                    <DetailSection title="Bank Information">
                        {/* One card per row: this section sits in the narrow
                            right-hand column, where a 2–3 column grid squeezed
                            each card to ~120px and the labels overlapped. */}
                        <div className="space-y-3">
                            {landlord.bank_details.map((bank: any, index: number) => (
                                <div
                                    key={index}
                                    className="space-y-3 rounded-md border border-brand-border bg-white p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="rounded-md bg-brand-light p-2 text-brand">
                                            <CreditCard className="h-4 w-4" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">
                                                Bank Name
                                            </p>
                                            <p className="truncate text-[14px] font-medium text-brand-text">
                                                {bank.bank_name || 'N/A'}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">
                                                Account Number
                                            </p>
                                            <p className="break-all text-[14px] font-medium text-brand-text">
                                                {bank.account_number || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">
                                                IFSC Code
                                            </p>
                                            <p className="break-all text-[14px] font-medium text-brand-text">
                                                {bank.ifsc_code || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">
                                                Type
                                            </p>
                                            <p className="text-[14px] font-medium capitalize text-brand-text">
                                                {bank.account_type || 'N/A'}
                                            </p>
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-[12px] font-semibold uppercase tracking-wider text-brand-text-light">
                                                Branch
                                            </p>
                                            <p className="text-[14px] font-medium text-brand-text">
                                                {bank.bank_branch || 'N/A'}
                                            </p>
                                        </div>
                                    </div>
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
