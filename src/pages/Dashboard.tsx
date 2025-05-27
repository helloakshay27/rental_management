
import React, { useState } from 'react';
import LandlordDashboard from '@/components/Dashboard/LandlordDashboard';
import TenantDashboard from '@/components/Dashboard/TenantDashboard';
import RoleSwitcher from '@/components/Dashboard/RoleSwitcher';

const Dashboard = () => {
  const [currentRole, setCurrentRole] = useState<'landlord' | 'tenant'>('landlord');

  const handleRoleChange = (role: 'landlord' | 'tenant') => {
    setCurrentRole(role);
  };

  const getDashboardTitle = () => {
    return currentRole === 'landlord' ? 'Landlord Dashboard' : 'Tenant Dashboard';
  };

  const getDashboardDescription = () => {
    return currentRole === 'landlord' 
      ? 'Manage your properties, tenants, and rental income'
      : 'Track your rentals, payments, and maintenance requests';
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">{getDashboardTitle()}</h1>
          <p className="text-[#1a1a1a]/70 mt-2">{getDashboardDescription()}</p>
        </div>
        <RoleSwitcher currentRole={currentRole} onRoleChange={handleRoleChange} />
      </div>

      {/* Role-based Dashboard Content */}
      {currentRole === 'landlord' ? <LandlordDashboard /> : <TenantDashboard />}
    </div>
  );
};

export default Dashboard;
