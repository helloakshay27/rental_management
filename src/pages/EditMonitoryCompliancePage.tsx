import React, { useState, useEffect } from 'react';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer } from '@/components/ui/page';
import MonitorComplianceForm from '@/components/Tenant/MonitorComplianceForm';
import { ChevronLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Heading, Text } from '@/components/ui/typography';

const EditMonitoryCompliancePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [initialData, setInitialData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchComplianceDetails();
    }, [id]);

    const fetchComplianceDetails = async () => {
        try {
            setIsLoading(true);
            const data = await getAuth(`/property_compliances/${id}.json`);
            setInitialData(data);
        } catch (error) {
            console.error('Failed to fetch details', error);
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

    return (
        <PageContainer>
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate('/compliance')}
                    className="text-gray-500 hover:text-gray-700"
                >
                    <ChevronLeft className="h-6 w-6" />
                </Button>
                <div>
                    <Heading level="h1">Edit Compliance</Heading>
                    <Text size="sm" variant="muted">Update compliance record information</Text>
                </div>
            </div>

            <div className="w-full">
                <MonitorComplianceForm initialData={initialData} isEdit={true} />
            </div>
        </PageContainer>
    );
};

export default EditMonitoryCompliancePage;
