
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Eye, Download, CreditCard } from 'lucide-react';

const BillManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const bills = [
    { id: 'BILL001', date: '2024-01-15', property: 'Sunset Apartments', utility: 'Electricity', provider: 'PowerCorp', amount: 2286, dueDate: '2024-01-25', status: 'Due Soon' },
    { id: 'BILL002', date: '2024-01-12', property: 'Downtown Plaza', utility: 'Water', provider: 'AquaCity', amount: 168, dueDate: '2024-01-28', status: 'Pending' },
    { id: 'BILL003', date: '2024-01-10', property: 'Green Valley', utility: 'Gas', provider: 'GasPlus', amount: 425, dueDate: '2024-02-02', status: 'Scheduled' },
    { id: 'BILL004', date: '2024-01-08', property: 'Sunset Apartments', utility: 'Internet', provider: 'NetConnect', amount: 299, dueDate: '2024-01-20', status: 'Paid' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Utility Bills</CardTitle>
          <CardDescription className="text-gray-600">Manage and track all utility bills</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search bills..."
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
                <SelectItem value="due-soon">Due Soon</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="border rounded-lg bg-white border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b border-gray-200">
                  <TableHead className="text-gray-900 font-medium">Bill ID</TableHead>
                  <TableHead className="text-gray-900 font-medium">Property</TableHead>
                  <TableHead className="text-gray-900 font-medium">Utility</TableHead>
                  <TableHead className="text-gray-900 font-medium">Provider</TableHead>
                  <TableHead className="text-gray-900 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-900 font-medium">Due Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">Status</TableHead>
                  <TableHead className="text-gray-900 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {bills.map((bill) => (
                  <TableRow key={bill.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-gray-900 font-medium">{bill.id}</TableCell>
                    <TableCell className="text-gray-700">{bill.property}</TableCell>
                    <TableCell className="text-gray-700">{bill.utility}</TableCell>
                    <TableCell className="text-gray-700">{bill.provider}</TableCell>
                    <TableCell className="text-gray-900 font-semibold">${bill.amount}</TableCell>
                    <TableCell className="text-gray-700">{bill.dueDate}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        bill.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        bill.status === 'Due Soon' ? 'bg-red-100 text-red-800' :
                        bill.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {bill.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Download className="h-4 w-4" />
                        </Button>
                        {bill.status !== 'Paid' && (
                          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-800">
                            <CreditCard className="h-4 w-4" />
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

export default BillManagement;
