
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, MapPin, Home, Calendar } from 'lucide-react';

const PropertiesMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const properties = [
    {
      id: 'P001',
      name: 'Sunset Apartments',
      type: 'Residential',
      address: '123 MG Road, Bangalore',
      landlord: 'Suresh Enterprises',
      totalUnits: 20,
      occupiedUnits: 18,
      totalArea: '15000 sq ft',
      constructionYear: 2020,
      amenities: ['Parking', 'Security', 'Elevator', 'Generator'],
      status: 'Active',
      rentRange: '₹20,000 - ₹35,000'
    },
    {
      id: 'P002',
      name: 'Green Valley Villa',
      type: 'Villa',
      address: '456 Whitefield, Bangalore',
      landlord: 'Sharma Properties',
      totalUnits: 1,
      occupiedUnits: 1,
      totalArea: '3500 sq ft',
      constructionYear: 2019,
      amenities: ['Garden', 'Swimming Pool', 'Parking', 'Security'],
      status: 'Active',
      rentRange: '₹60,000 - ₹80,000'
    },
    {
      id: 'P003',
      name: 'City Center Office',
      type: 'Commercial',
      address: '789 Brigade Road, Bangalore',
      landlord: 'Metro Real Estate',
      totalUnits: 10,
      occupiedUnits: 8,
      totalArea: '25000 sq ft',
      constructionYear: 2021,
      amenities: ['Conference Room', 'Cafeteria', 'Parking', 'AC'],
      status: 'Active',
      rentRange: '₹150 - ₹200 /sq ft'
    }
  ];

  const filteredProperties = properties.filter(property =>
    property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.landlord.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Properties Master</h1>
          <p className="text-gray-600">Central property database with all property details</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle>Add New Property</DialogTitle>
              <DialogDescription>Enter complete property information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="property-name">Property Name</Label>
                <Input id="property-name" placeholder="Enter property name" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="property-type">Property Type</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" placeholder="Enter complete address" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="landlord">Landlord</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select landlord" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="suresh">Suresh Enterprises</SelectItem>
                    <SelectItem value="sharma">Sharma Properties</SelectItem>
                    <SelectItem value="metro">Metro Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-units">Total Units</Label>
                <Input id="total-units" type="number" placeholder="Enter total units" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="total-area">Total Area</Label>
                <Input id="total-area" placeholder="e.g., 15000 sq ft" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="construction-year">Construction Year</Label>
                <Input id="construction-year" type="number" placeholder="e.g., 2020" className="bg-white" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Property</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Properties Database</CardTitle>
              <CardDescription>Complete inventory of all properties in the system</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search properties..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Property Details</TableHead>
                <TableHead>Location & Type</TableHead>
                <TableHead>Landlord</TableHead>
                <TableHead>Occupancy</TableHead>
                <TableHead>Rent Range</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProperties.map((property) => (
                <TableRow key={property.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{property.name}</p>
                      <p className="text-sm text-gray-500">ID: {property.id}</p>
                      <p className="text-sm text-gray-500">Built: {property.constructionYear}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center text-sm mb-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate max-w-32">{property.address}</span>
                      </div>
                      <Badge variant="outline">{property.type}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="font-medium text-sm">{property.landlord}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{property.occupiedUnits}/{property.totalUnits}</p>
                      <p className="text-sm text-gray-500">
                        {Math.round((property.occupiedUnits / property.totalUnits) * 100)}% occupied
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm font-medium">{property.rentRange}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{property.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertiesMaster;
