
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Search, Filter, Download, Edit, Trash2 } from 'lucide-react';

const ExpenseTracking = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const expenses = [
    { id: 'EXP001', date: '2024-01-15', property: 'Sunset Apartments', category: 'Maintenance', description: 'HVAC Repair', vendor: 'CoolAir Services', amount: 850, status: 'Approved' },
    { id: 'EXP002', date: '2024-01-14', property: 'Downtown Plaza', category: 'Utilities', description: 'Electricity Bill', vendor: 'PowerCorp', amount: 1240, status: 'Paid' },
    { id: 'EXP003', date: '2024-01-12', property: 'Green Valley', category: 'Security', description: 'Security Service', vendor: 'SecureGuard', amount: 620, status: 'Pending' },
    { id: 'EXP004', date: '2024-01-10', property: 'Sunset Apartments', category: 'Cleaning', description: 'Cleaning Supplies', vendor: 'CleanCorp', amount: 180, status: 'Approved' }
  ];

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Expense Tracking</CardTitle>
          <CardDescription className="text-gray-600">Track and manage all operational expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search expenses..."
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
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="border rounded-lg bg-white border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-white border-b border-gray-200">
                  <TableHead className="text-gray-900 font-medium">Expense ID</TableHead>
                  <TableHead className="text-gray-900 font-medium">Date</TableHead>
                  <TableHead className="text-gray-900 font-medium">Property</TableHead>
                  <TableHead className="text-gray-900 font-medium">Category</TableHead>
                  <TableHead className="text-gray-900 font-medium">Description</TableHead>
                  <TableHead className="text-gray-900 font-medium">Vendor</TableHead>
                  <TableHead className="text-gray-900 font-medium">Amount</TableHead>
                  <TableHead className="text-gray-900 font-medium">Status</TableHead>
                  <TableHead className="text-gray-900 font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {expenses.map((expense) => (
                  <TableRow key={expense.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <TableCell className="text-gray-900 font-medium">{expense.id}</TableCell>
                    <TableCell className="text-gray-700">{expense.date}</TableCell>
                    <TableCell className="text-gray-700">{expense.property}</TableCell>
                    <TableCell className="text-gray-700">{expense.category}</TableCell>
                    <TableCell className="text-gray-700">{expense.description}</TableCell>
                    <TableCell className="text-gray-700">{expense.vendor}</TableCell>
                    <TableCell className="text-gray-900 font-semibold">${expense.amount}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        expense.status === 'Paid' ? 'bg-green-100 text-green-800' :
                        expense.status === 'Approved' ? 'bg-blue-100 text-blue-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {expense.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
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

export default ExpenseTracking;
