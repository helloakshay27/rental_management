
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Phone, Mail, Calendar, Shield } from 'lucide-react';

const UsersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const users = [
    {
      id: 'U001',
      name: 'Amit Sharma',
      email: 'amit.sharma@propertyflow.com',
      phone: '+91 98765 43210',
      role: 'Administrator',
      department: 'IT',
      joiningDate: '2023-01-15',
      lastLogin: '2024-01-20 10:30 AM',
      status: 'Active',
      permissions: ['Full Access']
    },
    {
      id: 'U002',
      name: 'Priya Patel',
      email: 'priya.patel@propertyflow.com',
      phone: '+91 87654 32109',
      role: 'Property Manager',
      department: 'Operations',
      joiningDate: '2023-03-10',
      lastLogin: '2024-01-20 09:15 AM',
      status: 'Active',
      permissions: ['Properties', 'Tenants', 'Reports']
    },
    {
      id: 'U003',
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@propertyflow.com',
      phone: '+91 76543 21098',
      role: 'Accountant',
      department: 'Finance',
      joiningDate: '2023-05-20',
      lastLogin: '2024-01-19 05:45 PM',
      status: 'Active',
      permissions: ['Financial Reports', 'OPEX', 'Billing']
    },
    {
      id: 'U004',
      name: 'Neha Singh',
      email: 'neha.singh@propertyflow.com',
      phone: '+91 65432 10987',
      role: 'Leasing Agent',
      department: 'Sales',
      joiningDate: '2023-08-01',
      lastLogin: '2024-01-15 02:20 PM',
      status: 'Inactive',
      permissions: ['Tenants', 'Rental Agreements']
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
          <p className="text-gray-600">Manage system users and their basic information</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>Create a new user account with basic information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name">Full Name</Label>
                <Input id="user-name" placeholder="Enter full name" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email">Email</Label>
                <Input id="user-email" type="email" placeholder="Enter email" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-phone">Phone</Label>
                <Input id="user-phone" placeholder="Enter phone number" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role">Role</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="admin">Administrator</SelectItem>
                    <SelectItem value="manager">Property Manager</SelectItem>
                    <SelectItem value="accountant">Accountant</SelectItem>
                    <SelectItem value="agent">Leasing Agent</SelectItem>
                    <SelectItem value="maintenance">Maintenance Staff</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-department">Department</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="it">IT</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joining-date">Joining Date</Label>
                <Input id="joining-date" type="date" className="bg-white" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#C72030] hover:bg-[#A01825]">Create User</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users Directory</CardTitle>
              <CardDescription>All system users and their account information</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
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
                <TableHead>User Details</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Role & Department</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined: {user.joiningDate}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center mb-1">
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">{user.role}</span>
                      </div>
                      <Badge variant="outline">{user.department}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{user.lastLogin}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.status === 'Active' ? 'default' : 'secondary'}>
                      {user.status}
                    </Badge>
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

export default UsersManagement;
