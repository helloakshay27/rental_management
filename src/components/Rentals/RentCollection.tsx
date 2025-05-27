
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Send, CheckCircle, AlertCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

const RentCollection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('current');

  // Mock data for rent collection
  const rentRecords = [
    {
      id: 'RC001',
      tenantName: 'John Smith',
      propertyName: 'Sunset Apartments - Unit 2A',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 2500,
      paidAmount: 2500,
      paidDate: '2024-04-28',
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      lateFee: 0
    },
    {
      id: 'RC002',
      tenantName: 'Sarah Johnson',
      propertyName: 'Downtown Plaza - Unit 5B',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 3200,
      paidAmount: 3200,
      paidDate: '2024-05-01',
      status: 'paid',
      paymentMethod: 'UPI',
      lateFee: 0
    },
    {
      id: 'RC003',
      tenantName: 'Mike Wilson',
      propertyName: 'Green Valley - Unit 1C',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 1800,
      paidAmount: 0,
      paidDate: null,
      status: 'overdue',
      paymentMethod: null,
      lateFee: 90
    },
    {
      id: 'RC004',
      tenantName: 'Emma Davis',
      propertyName: 'City Center - Unit 3A',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 2800,
      paidAmount: 1500,
      paidDate: '2024-05-02',
      status: 'partial',
      paymentMethod: 'Cheque',
      lateFee: 0
    },
    {
      id: 'RC005',
      tenantName: 'Alex Brown',
      propertyName: 'Riverside - Unit 4A',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 2200,
      paidAmount: 0,
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      lateFee: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Paid
        </Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>;
      case 'partial':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Partial
        </Badge>;
      case 'pending':
        return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const filteredRecords = rentRecords.filter(record => {
    const matchesSearch = record.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRent = rentRecords.reduce((sum, record) => sum + record.amount, 0);
  const collectedRent = rentRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const overdueAmount = rentRecords.filter(r => r.status === 'overdue').reduce((sum, record) => sum + record.amount, 0);
  const lateFees = rentRecords.reduce((sum, record) => sum + record.lateFee, 0);

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Rent Due</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{totalRent.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Collected</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{collectedRent.toLocaleString()}</p>
                <p className="text-xs text-green-600">{Math.round((collectedRent/totalRent)*100)}% collected</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Overdue Amount</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{overdueAmount.toLocaleString()}</p>
                <p className="text-xs text-red-600">{rentRecords.filter(r => r.status === 'overdue').length} properties</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-red-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Late Fees</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{lateFees.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rent Collection Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#1a1a1a]">Rent Collection - May 2024</CardTitle>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="p-1">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" size="sm" className="p-1">
                <Send className="h-4 w-4 mr-2" />
                Send Reminders
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by tenant or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="partial">Partial</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select value={monthFilter} onValueChange={setMonthFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-gray-200">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="current">May 2024</SelectItem>
                <SelectItem value="previous">April 2024</SelectItem>
                <SelectItem value="march">March 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-[#1a1a1a] font-medium">Tenant</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Property</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Due Date</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Amount Due</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Paid Amount</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Payment Date</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredRecords.map((record) => (
                  <TableRow key={record.id} className="hover:bg-gray-50 bg-white border-b border-gray-100">
                    <TableCell className="font-medium bg-white">{record.tenantName}</TableCell>
                    <TableCell className="bg-white">{record.propertyName}</TableCell>
                    <TableCell className="bg-white">{new Date(record.dueDate).toLocaleDateString()}</TableCell>
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium">₹{record.amount.toLocaleString()}</div>
                        {record.lateFee > 0 && (
                          <div className="text-xs text-red-600">+ ₹{record.lateFee} late fee</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium bg-white">
                      {record.paidAmount > 0 ? `₹${record.paidAmount.toLocaleString()}` : '-'}
                    </TableCell>
                    <TableCell className="bg-white">
                      {record.paidDate ? new Date(record.paidDate).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="bg-white">{getStatusBadge(record.status)}</TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-1">
                        {record.status !== 'paid' && (
                          <Button variant="ghost" size="sm" className="text-blue-600 p-1">
                            Record Payment
                          </Button>
                        )}
                        {record.status === 'overdue' && (
                          <Button variant="ghost" size="sm" className="text-orange-600 p-1">
                            <Send className="h-4 w-4" />
                          </Button>
                        )}
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

export default RentCollection;
