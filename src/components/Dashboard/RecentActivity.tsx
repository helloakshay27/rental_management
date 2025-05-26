
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, FileText } from 'lucide-react';

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
    icon: FileText,
  },
  {
    id: 4,
    type: 'rent_due',
    message: 'Rent payment due for Pune Office in 5 days',
    time: '1 day ago',
    status: 'warning',
    icon: Clock,
  },
];

const RecentActivity = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      case 'info': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIconColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'info': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`p-2 rounded-full ${getIconColor(activity.status)}`}>
                  <Icon size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">{activity.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
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
