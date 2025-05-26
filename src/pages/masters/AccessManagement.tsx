
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Search, Plus, Edit, Trash2, Key, Lock, Unlock, Shield, Calendar } from 'lucide-react';

const AccessManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const accessControls = [
    {
      id: 'AC001',
      user: 'Amit Sharma',
      role: 'Administrator',
      module: 'All Modules',
      permissions: ['Read', 'Write', 'Delete', 'Admin'],
      accessLevel: 'Full Access',
      ipRestriction: 'Any IP',
      timeRestriction: '24/7',
      lastAccess: '2024-01-20 10:30 AM',
      status: 'Active'
    },
    {
      id: 'AC002',
      user: 'Priya Patel',
      role: 'Property Manager',
      module: 'Properties',
      permissions: ['Read', 'Write'],
      accessLevel: 'Module Specific',
      ipRestriction: 'Office Network',
      timeRestriction: '9 AM - 6 PM',
      lastAccess: '2024-01-20 09:15 AM',
      status: 'Active'
    },
    {
      id: 'AC003',
      user: 'Rajesh Kumar',
      role: 'Accountant',
      module: 'Financial Reports',
      permissions: ['Read', 'Write'],
      accessLevel: 'Read/Write',
      ipRestriction: 'Any IP',
      timeRestriction: '8 AM - 8 PM',
      lastAccess: '2024-01-19 05:45 PM',
      status: 'Active'
    },
    {
      id: 'AC004',
      user: 'Neha Singh',
      role: 'Leasing Agent',
      module: 'Tenants',
      permissions: ['Read'],
      accessLevel: 'Read Only',
      ipRestriction: 'Office Network',
      timeRestriction: '9 AM - 5 PM',
      lastAccess: '2024-01-15 02:20 PM',
      status: 'Suspended'
    }
  ];

  const filteredAccess = accessControls.filter(access =>
    access.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    access.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    access.module.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Management</h1>
          <p className="text-gray-600">Control user permissions and access levels</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Configure Access
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Configure User Access</DialogTitle>
              <DialogDescription>Set specific permissions and restrictions for a user</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-select">Select User</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Choose user" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="amit">Amit Sharma</SelectItem>
                    <SelectItem value="priya">Priya Patel</SelectItem>
                    <SelectItem value="rajesh">Rajesh Kumar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="module-select">Module</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select module" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Modules</SelectItem>
                    <SelectItem value="properties">Properties</SelectItem>
                    <SelectItem value="tenants">Tenants</SelectItem>
                    <SelectItem value="financial">Financial Reports</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="access-level">Access Level</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select access level" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="read">Read Only</SelectItem>
                    <SelectItem value="write">Read/Write</SelectItem>
                    <SelectItem value="admin">Admin Access</SelectItem>
                    <SelectItem value="full">Full Access</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ip-restriction">IP Restriction</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select IP restriction" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="any">Any IP</SelectItem>
                    <SelectItem value="office">Office Network Only</SelectItem>
                    <SelectItem value="vpn">VPN Required</SelectItem>
                    <SelectItem value="custom">Custom IP Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-from">Time Restriction From</Label>
                <Input id="time-from" type="time" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time-to">Time Restriction To</Label>
                <Input id="time-to" type="time" className="bg-white" />
              </div>
            </div>
            <div className="flex items-center space-x-2 py-2">
              <Switch id="enable-access" />
              <Label htmlFor="enable-access">Enable Access</Label>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Access Configuration</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
              </div>
              <Shield className="h-8 w-8 text-[#C72030]" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">18</p>
              </div>
              <Unlock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Restricted Access</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
              <Lock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
              <Key className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Access Control Matrix</CardTitle>
              <CardDescription>Detailed view of user permissions and access restrictions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search access controls..."
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
                <TableHead>User & Role</TableHead>
                <TableHead>Module Access</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Restrictions</TableHead>
                <TableHead>Last Access</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccess.map((access) => (
                <TableRow key={access.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{access.user}</p>
                      <p className="text-sm text-gray-500">{access.role}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{access.module}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {access.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">IP: {access.ipRestriction}</p>
                      <p className="text-sm">Time: {access.timeRestriction}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-3 w-3 mr-1" />
                      {access.lastAccess}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={access.status === 'Active' ? 'default' : 'destructive'}>
                      {access.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Lock className="h-4 w-4" />
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

export default AccessManagement;
