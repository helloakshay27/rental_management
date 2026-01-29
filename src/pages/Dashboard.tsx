
import React from 'react';
import TenantDashboard from '@/components/Dashboard/TenantDashboard';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Tenant Dashboard</h1>
          <p className="text-[#1a1a1a]/70 mt-2">Track your rentals, payments, and maintenance requests</p>
        </div>
      </div>

      {/* Tenant Dashboard Content */}
      <TenantDashboard />
    </div>
  );
};

export default Dashboard;
