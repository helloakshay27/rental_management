import React, { useState, useEffect } from 'react';
import MonitorComplianceForm from '@/components/Tenant/MonitorComplianceForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

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
            <div className="flex justify-center items-center h-screen bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
        );
    }

    return (
        <div className="p-8 space-y-6 bg-white min-h-screen">
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
                    <h1 className="text-2xl font-bold text-gray-900">Edit Compliance</h1>
                    <p className="text-sm text-gray-500">Update compliance record information</p>
                </div>
            </div>

            <div className="w-full">
                <MonitorComplianceForm initialData={initialData} isEdit={true} />
            </div>
        </div>
    );
};

export default EditMonitoryCompliancePage;
