
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin } from 'lucide-react';

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
      case 'upcoming': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Lease Renewals</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {renewals.map((renewal) => (
            <div key={renewal.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900">{renewal.property}</h4>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin size={14} className="mr-1" />
                    {renewal.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <Calendar size={14} className="mr-1" />
                    Expires: {new Date(renewal.expiryDate).toLocaleDateString()}
                  </div>
                  <p className="text-sm font-medium text-gray-900 mt-2">
                    Monthly Rent: ₹{renewal.monthlyRent.toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getStatusColor(renewal.status)}>
                    {renewal.daysLeft} days left
                  </Badge>
                  <Button size="sm" variant="outline">
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
