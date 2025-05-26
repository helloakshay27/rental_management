
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, Filter } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import AddPropertyDialog from '@/components/Properties/AddPropertyDialog';

const properties = [
  {
    id: 1,
    name: 'Mumbai Head Office',
    type: 'Office',
    location: 'Bandra Kurla Complex, Mumbai',
    area: '5,200 sq ft',
    status: 'Active',
    monthlyRent: 125000,
    leaseExpiry: '2024-07-15',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
  },
  {
    id: 2,
    name: 'Delhi Warehouse',
    type: 'Warehouse',
    location: 'Gurgaon, Delhi NCR',
    area: '12,000 sq ft',
    status: 'Active',
    monthlyRent: 85000,
    leaseExpiry: '2024-08-20',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
  },
  {
    id: 3,
    name: 'Bangalore Tech Center',
    type: 'Office',
    location: 'Electronic City, Bangalore',
    area: '8,500 sq ft',
    status: 'Active',
    monthlyRent: 95000,
    leaseExpiry: '2024-09-10',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
  },
  {
    id: 4,
    name: 'Chennai Retail Store',
    type: 'Retail',
    location: 'Express Avenue, Chennai',
    area: '2,800 sq ft',
    status: 'Vacant',
    monthlyRent: 0,
    leaseExpiry: null,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
  },
];

const Properties = () => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Vacant': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePropertyClick = (propertyId: number) => {
    navigate(`/properties/${propertyId}`);
  };

  const handlePropertyAdded = () => {
    // In a real app, this would refresh the properties list
    console.log('Property added - refreshing list');
  };

  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#D5DbDB]">Properties</h1>
          <p className="text-[#D5DbDB]/80 mt-2">Manage your property portfolio</p>
        </div>
        <AddPropertyDialog onPropertyAdded={handlePropertyAdded} />
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input placeholder="Search properties..." className="w-full bg-white border-gray-200 text-[#D5DbDB] placeholder-gray-400" />
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <Card 
            key={property.id} 
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => handlePropertyClick(property.id)}
          >
            <div className="aspect-video w-full overflow-hidden rounded-t-lg">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-[#D5DbDB]">{property.name}</h3>
                <Badge className={getStatusColor(property.status)}>
                  {property.status}
                </Badge>
              </div>
              
              <div className="space-y-2 text-sm text-[#D5DbDB]/80">
                <div className="flex items-center">
                  <Building2 size={14} className="mr-2" />
                  {property.type} • {property.area}
                </div>
                <div className="flex items-center">
                  <MapPin size={14} className="mr-2" />
                  {property.location}
                </div>
                {property.leaseExpiry && (
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2" />
                    Lease expires: {new Date(property.leaseExpiry).toLocaleDateString()}
                  </div>
                )}
              </div>
              
              {property.status === 'Active' && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-lg font-semibold text-[#D5DbDB]">
                    ₹{property.monthlyRent.toLocaleString()}/month
                  </p>
                </div>
              )}
              
              <div className="mt-4 flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePropertyClick(property.id);
                  }}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit action
                  }}
                >
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Properties;
