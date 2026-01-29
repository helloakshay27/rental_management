import React from 'react';
import MonitorComplianceForm from '@/components/Tenant/MonitorComplianceForm';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const AddMonitoryCompliancePage = () => {
    const navigate = useNavigate();

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
                    <h1 className="text-2xl font-bold text-gray-900">Add Compliance</h1>
                    <p className="text-sm text-gray-500">Create a new compliance record</p>
                </div>
            </div>

            <div className="w-full">
                <MonitorComplianceForm />
            </div>
        </div>
    );
};

export default AddMonitoryCompliancePage;
