
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Star, Phone, Mail, MapPin } from 'lucide-react';

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const vendors = [
    { id: 'VND001', name: 'CoolAir Services', category: 'HVAC', phone: '+1-555-0123', email: 'contact@coolair.com', rating: 4.8, activeContracts: 8, totalValue: 45200 },
    { id: 'VND002', name: 'LiftTech', category: 'Elevators', phone: '+1-555-0124', email: 'service@lifttech.com', rating: 4.9, activeContracts: 6, totalValue: 32400 },
    { id: 'VND003', name: 'SafeGuard Systems', category: 'Fire Safety', phone: '+1-555-0125', email: 'info@safeguard.com', rating: 4.6, activeContracts: 4, totalValue: 18600 },
    { id: 'VND004', name: 'SecureWatch', category: 'Security', phone: '+1-555-0126', email: 'support@securewatch.com', rating: 4.7, activeContracts: 3, totalValue: 15200 }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Vendor Directory</CardTitle>
          <CardDescription className="text-gray-600">Manage service providers and contractors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search vendors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900 border border-gray-200"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-gray-900 border border-gray-200">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="hvac">HVAC</SelectItem>
                <SelectItem value="elevators">Elevators</SelectItem>
                <SelectItem value="fire-safety">Fire Safety</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg bg-white border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b border-gray-200">
                  <TableHead className="text-gray-900 font-medium">Vendor</TableHead>
                  <TableHead className="text-gray-900 font-medium">Category</TableHead>
                  <TableHead className="text-gray-900 font-medium">Contact</TableHead>
                  <TableHead className="text-gray-900 font-medium">Rating</TableHead>
                  <TableHead className="text-gray-900 font-medium">Active Contracts</TableHead>
                  <TableHead className="text-gray-900 font-medium">Total Value</TableHead>
                  <TableHead className="text-gray-900 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {vendors.map((vendor) => (
                  <TableRow key={vendor.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                        <div className="text-xs text-gray-500">{vendor.id}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{vendor.category}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          {vendor.phone}
                        </div>
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          {vendor.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900">{vendor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-700">{vendor.activeContracts}</TableCell>
                    <TableCell className="text-gray-900 font-semibold">${vendor.totalValue.toLocaleString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="border-gray-200">
                          View Profile
                        </Button>
                        <Button variant="ghost" size="sm" className="text-[#C72030] hover:text-[#A01825]">
                          Contact
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Top Performers</CardTitle>
            <CardDescription className="text-gray-600">Highest rated vendors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendors.sort((a, b) => b.rating - a.rating).slice(0, 3).map((vendor, index) => (
                <div key={vendor.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">{vendor.name}</div>
                      <div className="text-xs text-gray-500">{vendor.category}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900">{vendor.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Performance Metrics</CardTitle>
            <CardDescription className="text-gray-600">Vendor performance statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Average Rating</span>
                <span className="text-lg font-semibold text-gray-900">4.75</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Response Time</span>
                <span className="text-lg font-semibold text-gray-900">2.3 hrs</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm text-green-600">Completion Rate</span>
                <span className="text-lg font-semibold text-green-700">94.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorManagement;
