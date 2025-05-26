
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wrench, Clock, AlertCircle, CheckCircle } from 'lucide-react';

interface MaintenanceRequest {
  id: string;
  status: string;
}

interface MaintenanceSummaryCardsProps {
  requests: MaintenanceRequest[];
}

const MaintenanceSummaryCards = ({ requests }: MaintenanceSummaryCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">Total Requests</p>
              <p className="text-heading-2 font-semibold text-gray-900">{requests.length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Wrench className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">Pending</p>
              <p className="text-heading-2 font-semibold text-gray-900">{requests.filter(r => r.status === 'pending').length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">In Progress</p>
              <p className="text-heading-2 font-semibold text-gray-900">{requests.filter(r => r.status === 'in-progress').length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
        <CardContent className="p-6 bg-[#f6f4ee]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-body text-gray-600">Completed</p>
              <p className="text-heading-2 font-semibold text-gray-900">{requests.filter(r => r.status === 'completed').length}</p>
            </div>
            <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceSummaryCards;
