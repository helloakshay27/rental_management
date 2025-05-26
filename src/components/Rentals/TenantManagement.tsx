
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Edit, Phone, Mail, MapPin, Plus, Users, UserCheck, UserX, TrendingUp } from 'lucide-react';

const TenantManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for tenants
  const tenants = [
    {
      id: 'T001',
      name: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+91 98765 43210',
      propertyName: 'Sunset Apartments - Unit 2A',
      leaseStart: '2024-01-15',
      leaseEnd: '2024-12-31',
      rent: 2500,
      status: 'active',
      emergencyContact: 'Jane Smith - +91 98765 43211',
      profession: 'Software Engineer'
    },
    {
      id: 'T002',
      name: 'Sarah Johnson',
      email: 'sarah.j@email.com',
      phone: '+91 98765 43212',
      propertyName: 'Downtown Plaza - Unit 5B',
      leaseStart: '2024-03-01',
      leaseEnd: '2025-02-28',
      rent: 3200,
      status: 'active',
      emergencyContact: 'Robert Johnson - +91 98765 43213',
      profession: 'Marketing Manager'
    },
    {
      id: 'T003',
      name: 'Mike Wilson',
      email: 'mike.wilson@email.com',
      phone: '+91 98765 43214',
      propertyName: 'Green Valley - Unit 1C',
      leaseStart: '2023-06-01',
      leaseEnd: '2024-05-31',
      rent: 1800,
      status: 'notice_given',
      emergencyContact: 'Lisa Wilson - +91 98765 43215',
      profession: 'Teacher'
    },
    {
      id: 'T004',
      name: 'Emma Davis',
      email: 'emma.davis@email.com',
      phone: '+91 98765 43216',
      propertyName: 'City Center - Unit 3A',
      leaseStart: '2024-02-01',
      leaseEnd: '2024-07-31',
      rent: 2800,
      status: 'inactive',
      emergencyContact: 'Tom Davis - +91 98765 43217',
      profession: 'Consultant'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'notice_given':
        return <Badge className="bg-yellow-100 text-yellow-800">Notice Given</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredTenants = tenants.filter(tenant => 
    tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tenant.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Tenants</p>
                <p className="text-heading-2 font-semibold text-gray-900">{tenants.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Active Tenants</p>
                <p className="text-heading-2 font-semibold text-gray-900">{tenants.filter(t => t.status === 'active').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Notice Given</p>
                <p className="text-heading-2 font-semibold text-gray-900">{tenants.filter(t => t.status === 'notice_given').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <UserX className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Occupancy Rate</p>
                <p className="text-heading-2 font-semibold text-gray-900">{Math.round((tenants.filter(t => t.status === 'active').length / tenants.length) * 100)}%</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tenant Management */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#1a1a1a]">Tenant Directory</CardTitle>
            <Button className="bg-[#C72030] hover:bg-[#A01825] text-white">
              <Plus className="h-4 w-4 mr-2" />
              Add New Tenant
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search tenants by name, email, or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>
          </div>

          {/* Tenants Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-[#1a1a1a] font-medium">Tenant Details</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Contact Info</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Property</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Lease Period</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Monthly Rent</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredTenants.map((tenant) => (
                  <TableRow key={tenant.id} className="hover:bg-gray-50 bg-white border-b border-gray-100">
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium">{tenant.name}</div>
                        <div className="text-sm text-gray-600">{tenant.profession}</div>
                        <div className="text-xs text-gray-500">ID: {tenant.id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-3 w-3 mr-1 text-gray-400" />
                          {tenant.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-3 w-3 mr-1 text-gray-400" />
                          {tenant.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                        {tenant.propertyName}
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="text-sm">
                        <div>{new Date(tenant.leaseStart).toLocaleDateString()} -</div>
                        <div>{new Date(tenant.leaseEnd).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium bg-white">₹{tenant.rent.toLocaleString()}</TableCell>
                    <TableCell className="bg-white">{getStatusBadge(tenant.status)}</TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-[#E74C3C]/10 hover:text-[#E74C3C]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
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

export default TenantManagement;
