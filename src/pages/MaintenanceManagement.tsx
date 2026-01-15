
import React from 'react';
import MaintenanceRequests from '@/components/Tenant/MaintenanceRequests';

const MaintenanceManagement = () => {
    return (
        <div className="p-6 space-y-6 bg-white min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Maintenance Management</h1>
                    <p className="text-[#1a1a1a]/70 mt-2">Track and manage all maintenance requests from tenants</p>
                </div>
            </div>

            <MaintenanceRequests />
        </div>
    );
};

export default MaintenanceManagement;
