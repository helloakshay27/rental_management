
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Calendar, Users } from 'lucide-react';

const PropertyStatusOverview = () => {
  const properties = [
    {
      id: 1,
      name: 'Mumbai Head Office',
      location: 'Bandra Kurla Complex',
      status: 'Active',
      tenants: 1,
      area: '5,200 sq ft',
      renewalDate: '2024-07-15',
      monthlyRent: 125000
    },
    {
      id: 2,
      name: 'Delhi Warehouse',
      location: 'Gurgaon',
      status: 'Active',
      tenants: 1,
      area: '12,000 sq ft',
      renewalDate: '2024-08-20',
      monthlyRent: 85000
    },
    {
      id: 3,
      name: 'Bangalore Tech Center',
      location: 'Electronic City',
      status: 'Active',
      tenants: 1,
      area: '8,500 sq ft',
      renewalDate: '2024-09-10',
      monthlyRent: 95000
    },
    {
      id: 4,
      name: 'Chennai Retail Store',
      location: 'Express Avenue',
      status: 'Vacant',
      tenants: 0,
      area: '2,800 sq ft',
      renewalDate: null,
      monthlyRent: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Vacant': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Property Status Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="font-semibold text-gray-900 text-lg">{property.name}</h3>
                <Badge className={getStatusColor(property.status)}>
                  {property.status}
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin size={14} className="mr-2 text-blue-500" />
                  {property.location}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Building2 size={14} className="mr-2 text-blue-500" />
                  {property.area}
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Users size={14} className="mr-2 text-blue-500" />
                  {property.tenants} tenant{property.tenants !== 1 ? 's' : ''}
                </div>
                {property.renewalDate && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-2 text-blue-500" />
                    Renewal: {new Date(property.renewalDate).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {property.status === 'Active' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-lg font-bold text-gray-900">
                    ₹{property.monthlyRent.toLocaleString()}/month
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyStatusOverview;
