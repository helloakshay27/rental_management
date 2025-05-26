
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock } from 'lucide-react';

const renewals = [
  {
    id: 1,
    property: 'Mumbai Head Office',
    location: 'Bandra Kurla Complex, Mumbai',
    expiryDate: '2024-07-15',
    daysLeft: 30,
    monthlyRent: 125000,
    status: 'urgent',
  },
  {
    id: 2,
    property: 'Delhi Warehouse',
    location: 'Gurgaon, Delhi NCR',
    expiryDate: '2024-08-20',
    daysLeft: 65,
    monthlyRent: 85000,
    status: 'upcoming',
  },
  {
    id: 3,
    property: 'Bangalore Tech Center',
    location: 'Electronic City, Bangalore',
    expiryDate: '2024-09-10',
    daysLeft: 86,
    monthlyRent: 95000,
    status: 'upcoming',
  },
];

const UpcomingRenewals = () => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'upcoming': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getUrgencyIcon = (daysLeft: number) => {
    if (daysLeft <= 30) return '🔴';
    if (daysLeft <= 60) return '🟡';
    return '🟢';
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Upcoming Lease Renewals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renewals.map((renewal) => (
            <div key={renewal.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">{getUrgencyIcon(renewal.daysLeft)}</span>
                    <h4 className="font-semibold text-gray-900 text-lg">{renewal.property}</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin size={14} className="mr-2 text-blue-500" />
                      {renewal.location}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar size={14} className="mr-2 text-blue-500" />
                      Expires: {new Date(renewal.expiryDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock size={14} className="mr-2 text-blue-500" />
                      {renewal.daysLeft} days remaining
                    </div>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-3">
                    Monthly Rent: ₹{renewal.monthlyRent.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-3">
                  <Badge className={getStatusColor(renewal.status)}>
                    {renewal.status === 'urgent' ? 'URGENT' : 'UPCOMING'}
                  </Badge>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Renew
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingRenewals;
