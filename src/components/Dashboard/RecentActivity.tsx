
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, AlertTriangle, CheckCircle, FileText, Upload, DollarSign, Calendar, Users, MapPin } from 'lucide-react';

// Enhanced activities for both landlord and tenant perspectives
const activities = [
  {
    id: 1,
    type: 'payment_processed',
    message: 'Rent payment processed for Mumbai Corporate Tower - ₹8.5L',
    time: '1 hour ago',
    status: 'success',
    icon: DollarSign,
    region: 'Mumbai'
  },
  {
    id: 2,
    type: 'lease_expiry_alert',
    message: 'Lease for Chennai IT Park expires in 15 days - Renewal needed',
    time: '2 hours ago',
    status: 'warning',
    icon: AlertTriangle,
    region: 'Chennai'
  },
  {
    id: 3,
    type: 'compliance_update',
    message: 'Fire safety compliance completed for Bangalore Tech Hub',
    time: '4 hours ago',
    status: 'success',
    icon: CheckCircle,
    region: 'Bangalore'
  },
  {
    id: 4,
    type: 'new_property_added',
    message: 'New property onboarded in Pune - Commercial Complex Block B',
    time: '6 hours ago',
    status: 'info',
    icon: Upload,
    region: 'Pune'
  },
  {
    id: 5,
    type: 'escalation_notice',
    message: 'Rent escalation notice received for Delhi Business Park - 12% increase',
    time: '1 day ago',
    status: 'warning',
    icon: Calendar,
    region: 'Delhi'
  },
  {
    id: 6,
    type: 'landlord_meeting',
    message: 'Quarterly review meeting scheduled with DLF Commercial',
    time: '1 day ago',
    status: 'info',
    icon: Users,
    region: 'Multiple'
  },
  {
    id: 7,
    type: 'document_upload',
    message: 'Updated lease agreement signed for Hyderabad Business Center',
    time: '2 days ago',
    status: 'success',
    icon: FileText,
    region: 'Hyderabad'
  },
  {
    id: 8,
    type: 'regional_analysis',
    message: 'Q2 regional expense analysis report generated',
    time: '3 days ago',
    status: 'info',
    icon: MapPin,
    region: 'All Regions'
  }
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
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Recent Activity</CardTitle>
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
                  <p className="text-sm font-medium text-[#1a1a1a]">{activity.message}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock size={12} className="text-gray-400" />
                    <p className="text-xs text-gray-500">{activity.time}</p>
                    {activity.region && (
                      <>
                        <span className="text-gray-300">•</span>
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <MapPin size={10} />
                          {activity.region}
                        </p>
                      </>
                    )}
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
