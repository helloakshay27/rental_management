
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye, Edit, AlertTriangle } from 'lucide-react';

const ContractManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const contracts = [
    { id: 'AMC001', service: 'HVAC Maintenance', vendor: 'CoolAir Services', property: 'Sunset Apartments', startDate: '2023-06-01', endDate: '2024-05-31', value: 15600, status: 'Active', daysToExpiry: 125 },
    { id: 'AMC002', service: 'Elevator Service', vendor: 'LiftTech', property: 'Downtown Plaza', startDate: '2023-03-15', endDate: '2024-03-14', value: 18200, status: 'Expiring Soon', daysToExpiry: 47 },
    { id: 'AMC003', service: 'Fire Safety', vendor: 'SafeGuard Systems', property: 'Green Valley', startDate: '2023-09-01', endDate: '2024-08-31', value: 12400, status: 'Active', daysToExpiry: 218 },
    { id: 'AMC004', service: 'Security System', vendor: 'SecureWatch', property: 'Sunset Apartments', startDate: '2023-01-01', endDate: '2023-12-31', value: 9800, status: 'Expired', daysToExpiry: -25 }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">AMC Contracts</CardTitle>
          <CardDescription className="text-gray-600">Manage all Annual Maintenance Contracts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search contracts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border border-gray-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border border-gray-200">
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

          <div className="border rounded-lg bg-white border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b border-gray-200">
                  <TableHead className="text-gray-900 font-medium">Contract ID</TableHead>
                  <TableHead className="text-gray-900 font-medium">Service</TableHead>
                  <TableHead className="text-gray-900 font-medium">Vendor</TableHead>
                  <TableHead className="text-gray-900 font-medium">Property</TableHead>
                  <TableHead className="text-gray-900 font-medium">Start Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">End Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">Value</TableHead>
                  <TableHead className="text-gray-900 font-medium">Status</TableHead>
                  <TableHead className="text-gray-900 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {contracts.map((contract) => (
                  <TableRow key={contract.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-gray-900 font-medium">{contract.id}</TableCell>
                    <TableCell className="text-gray-700">{contract.service}</TableCell>
                    <TableCell className="text-gray-700">{contract.vendor}</TableCell>
                    <TableCell className="text-gray-700">{contract.property}</TableCell>
                    <TableCell className="text-gray-700">{contract.startDate}</TableCell>
                    <TableCell className="text-gray-700">{contract.endDate}</TableCell>
                    <TableCell className="text-gray-900 font-semibold">${contract.value.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          contract.status === 'Active' ? 'bg-green-100 text-green-800' :
                          contract.status === 'Expiring Soon' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {contract.status}
                        </span>
                        {contract.daysToExpiry <= 60 && contract.daysToExpiry > 0 && (
                          <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
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

export default ContractManagement;
