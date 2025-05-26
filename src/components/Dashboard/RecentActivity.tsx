
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, FileText, Upload, DollarSign } from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'lease_expiry',
    message: 'Lease agreement for Mumbai Office expires in 30 days',
    time: '2 hours ago',
    status: 'warning',
    icon: AlertTriangle,
  },
  {
    id: 2,
    type: 'amc_completed',
    message: 'AMC service completed for Delhi Warehouse - Fire Safety',
    time: '4 hours ago',
    status: 'success',
    icon: CheckCircle,
  },
  {
    id: 3,
    type: 'utility_bill',
    message: 'New electricity bill uploaded for Bangalore Store',
    time: '6 hours ago',
    status: 'info',
    icon: Upload,
  },
  {
    id: 4,
    type: 'rent_due',
    message: 'Rent payment due for Pune Office in 5 days',
    time: '1 day ago',
    status: 'warning',
    icon: DollarSign,
  },
  {
    id: 5,
    type: 'document_upload',
    message: 'New rental agreement signed for Chennai Store',
    time: '2 days ago',
    status: 'success',
    icon: FileText,
  },
];

const RecentActivity = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-amber-100 text-amber-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-amber-600 bg-amber-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`p-3 rounded-full ${getIconColor(activity.status)}`}>
                  <Icon size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <Badge variant="secondary" className={getStatusColor(activity.status)}>
                  {activity.status}
                </Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
