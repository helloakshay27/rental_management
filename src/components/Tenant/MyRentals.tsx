
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MapPin, Phone, Mail, Eye, FileText, CreditCard } from 'lucide-react';

const MyRentals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for tenant's rentals
  const myRentals = [
    {
      id: 'TR001',
      propertyName: 'Sunset Apartments - Unit 2A',
      address: '123 Sunset Blvd, Downtown',
      landlordName: 'John Smith Properties',
      landlordPhone: '+91 98765 43210',
      landlordEmail: 'john@smithproperties.com',
      monthlyRent: 25000,
      securityDeposit: 50000,
      leaseStart: '2024-01-15',
      leaseEnd: '2024-12-31',
      status: 'active',
      nextPaymentDue: '2024-02-01',
      propertyType: '2BHK Apartment'
    },
    {
      id: 'TR002',
      propertyName: 'Green Valley Villa',
      address: '456 Green Valley Road, Suburbs',
      landlordName: 'Sarah Johnson Realty',
      landlordPhone: '+91 87654 32109',
      landlordEmail: 'sarah@johnsonrealty.com',
      monthlyRent: 35000,
      securityDeposit: 70000,
      leaseStart: '2023-08-01',
      leaseEnd: '2025-07-31',
      status: 'active',
      nextPaymentDue: '2024-02-01',
      propertyType: '3BHK Villa'
    },
    {
      id: 'TR003',
      propertyName: 'City Center Office Space',
      address: '789 Business District, City Center',
      landlordName: 'Metro Commercial',
      landlordPhone: '+91 76543 21098',
      landlordEmail: 'info@metrocommercial.com',
      monthlyRent: 45000,
      securityDeposit: 135000,
      leaseStart: '2024-01-01',
      leaseEnd: '2026-12-31',
      status: 'active',
      nextPaymentDue: '2024-02-01',
      propertyType: 'Commercial Office'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredRentals = myRentals.filter(rental => {
    const matchesSearch = rental.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rental.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMonthlyRent = myRentals.reduce((sum, rental) => sum + rental.monthlyRent, 0);
  const totalSecurityDeposit = myRentals.reduce((sum, rental) => sum + rental.securityDeposit, 0);

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-[#f6f4ee]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1a1a1a]/70">Total Properties</p>
                <p className="text-2xl font-bold text-[#1a1a1a]">{myRentals.length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#f6f4ee]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1a1a1a]/70">Monthly Rent</p>
                <p className="text-2xl font-bold text-[#1a1a1a]">₹{totalMonthlyRent.toLocaleString()}</p>
              </div>
              <CreditCard className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#f6f4ee]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1a1a1a]/70">Security Deposits</p>
                <p className="text-2xl font-bold text-[#1a1a1a]">₹{totalSecurityDeposit.toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-yellow-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-[#f6f4ee]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[#1a1a1a]/70">Active Leases</p>
                <p className="text-2xl font-bold text-[#1a1a1a]">{myRentals.filter(r => r.status === 'active').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white">
        <CardHeader className="bg-[#f6f4ee]">
          <CardTitle className="text-[#1a1a1a]">My Rental Properties</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by property, landlord, or address..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-[#1a1a1a]"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-[#1a1a1a]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rentals Table */}
          <div className="border rounded-lg bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-[#f6f4ee]">
                  <TableHead className="text-[#1a1a1a] font-medium">Property Details</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Landlord</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Lease Period</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Monthly Rent</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredRentals.map((rental) => (
                  <TableRow key={rental.id} className="bg-white">
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium text-[#1a1a1a]">{rental.propertyName}</div>
                        <div className="text-sm text-[#1a1a1a]/70 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {rental.address}
                        </div>
                        <div className="text-sm text-[#1a1a1a]/60 mt-1">{rental.propertyType}</div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium text-[#1a1a1a]">{rental.landlordName}</div>
                        <div className="text-sm text-[#1a1a1a]/70 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {rental.landlordPhone}
                        </div>
                        <div className="text-sm text-[#1a1a1a]/70 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {rental.landlordEmail}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="text-sm">
                        <div className="text-[#1a1a1a]">{new Date(rental.leaseStart).toLocaleDateString()} -</div>
                        <div className="text-[#1a1a1a]">{new Date(rental.leaseEnd).toLocaleDateString()}</div>
                        <div className="text-xs text-[#1a1a1a]/60 mt-1">
                          Next payment: {new Date(rental.nextPaymentDue).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#1a1a1a] bg-white">₹{rental.monthlyRent.toLocaleString()}</TableCell>
                    <TableCell className="bg-white">{getStatusBadge(rental.status)}</TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" title="View Details" className="text-[#C72030] hover:bg-[#C72030]/10">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="View Contract" className="text-[#C72030] hover:bg-[#C72030]/10">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Pay Rent" className="text-[#C72030] hover:bg-[#C72030]/10">
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MyRentals;
