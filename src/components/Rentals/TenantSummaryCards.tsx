
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  status: string;
  emergencyContact: string;
  profession: string;
}

interface TenantSummaryCardsProps {
  tenants: Tenant[];
}

const TenantSummaryCards = ({ tenants }: TenantSummaryCardsProps) => {
  const activeTenants = tenants.filter(t => t.status === 'active').length;
  const noticeGivenTenants = tenants.filter(t => t.status === 'notice_given').length;
  const occupancyRate = Math.round((activeTenants / tenants.length) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">Total Tenants</p>
              <p className="text-heading-2 font-semibold text-gray-900">{tenants.length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">Active Tenants</p>
              <p className="text-heading-2 font-semibold text-gray-900">{activeTenants}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <UserCheck className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">Notice Given</p>
              <p className="text-heading-2 font-semibold text-gray-900">{noticeGivenTenants}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <UserX className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">Occupancy Rate</p>
              <p className="text-heading-2 font-semibold text-gray-900">{occupancyRate}%</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantSummaryCards;
