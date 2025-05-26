
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Edit, FileText, Download } from 'lucide-react';

const RentalAgreements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for rental agreements
  const agreements = [
    {
      id: 'RA001',
      propertyName: 'Sunset Apartments - Unit 2A',
      tenantName: 'John Smith',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      monthlyRent: 2500,
      status: 'active',
      securityDeposit: 5000,
      leaseType: 'Annual'
    },
    {
      id: 'RA002',
      propertyName: 'Downtown Plaza - Unit 5B',
      tenantName: 'Sarah Johnson',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      monthlyRent: 3200,
      status: 'active',
      securityDeposit: 6400,
      leaseType: 'Annual'
    },
    {
      id: 'RA003',
      propertyName: 'Green Valley - Unit 1C',
      tenantName: 'Mike Wilson',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      monthlyRent: 1800,
      status: 'expiring',
      securityDeposit: 3600,
      leaseType: 'Annual'
    },
    {
      id: 'RA004',
      propertyName: 'City Center - Unit 3A',
      tenantName: 'Emma Davis',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      monthlyRent: 2800,
      status: 'terminated',
      securityDeposit: 5600,
      leaseType: 'Short-term'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800">Terminated</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Agreements</p>
                <p className="text-2xl font-bold">{agreements.length}</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Leases</p>
                <p className="text-2xl font-bold">{agreements.filter(a => a.status === 'active').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-green-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{agreements.filter(a => a.status === 'expiring').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-yellow-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">₹{agreements.filter(a => a.status === 'active').reduce((sum, a) => sum + a.monthlyRent, 0).toLocaleString()}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-blue-600"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by tenant, property, or agreement ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agreements Table */}
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agreement ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id}>
                    <TableCell className="font-medium">{agreement.id}</TableCell>
                    <TableCell>{agreement.propertyName}</TableCell>
                    <TableCell>{agreement.tenantName}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(agreement.startDate).toLocaleDateString()} -</div>
                        <div>{new Date(agreement.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₹{agreement.monthlyRent.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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

export default RentalAgreements;
