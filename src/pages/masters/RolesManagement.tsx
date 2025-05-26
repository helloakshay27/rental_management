
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Shield, Users, Settings } from 'lucide-react';

const RolesManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const roles = [
    {
      id: 'R001',
      name: 'Administrator',
      description: 'Full system access with all permissions',
      userCount: 2,
      permissions: ['Dashboard', 'Properties', 'Tenants', 'Landlords', 'OPEX', 'Utilities', 'AMC', 'Reports', 'Settings', 'Masters'],
      status: 'Active',
      createdDate: '2023-01-01'
    },
    {
      id: 'R002',
      name: 'Property Manager',
      description: 'Manage properties, tenants, and rental operations',
      userCount: 5,
      permissions: ['Dashboard', 'Properties', 'Tenants', 'Rental Management', 'Maintenance', 'Reports'],
      status: 'Active',
      createdDate: '2023-01-01'
    },
    {
      id: 'R003',
      name: 'Accountant',
      description: 'Financial management and reporting access',
      userCount: 3,
      permissions: ['Dashboard', 'OPEX', 'Utilities', 'Financial Reports', 'Billing'],
      status: 'Active',
      createdDate: '2023-01-01'
    },
    {
      id: 'R004',
      name: 'Leasing Agent',
      description: 'Tenant management and leasing operations',
      userCount: 4,
      permissions: ['Dashboard', 'Tenants', 'Rental Agreements', 'Property Viewing'],
      status: 'Active',
      createdDate: '2023-02-15'
    },
    {
      id: 'R005',
      name: 'Maintenance Staff',
      description: 'Maintenance request management',
      userCount: 6,
      permissions: ['Dashboard', 'Maintenance Requests', 'AMC Management'],
      status: 'Active',
      createdDate: '2023-03-01'
    }
  ];

  const availablePermissions = [
    'Dashboard', 'Properties', 'Tenants', 'Landlords', 'Rental Management', 
    'OPEX', 'Utilities', 'AMC', 'Maintenance', 'Reports', 'Settings', 'Masters',
    'Financial Reports', 'Billing', 'Property Viewing', 'Maintenance Requests'
  ];

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Roles Management</h1>
          <p className="text-gray-600">Define and manage user roles and responsibilities</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle>Create New Role</DialogTitle>
              <DialogDescription>Define a new role with specific permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name">Role Name</Label>
                  <Input id="role-name" placeholder="Enter role name" className="bg-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-status">Status</Label>
                  <select className="w-full p-2 border border-gray-200 rounded-md bg-white">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description">Description</Label>
                <Textarea id="role-description" placeholder="Enter role description" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto p-2 border border-gray-200 rounded-md">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox id={permission} />
                      <Label htmlFor={permission} className="text-sm">{permission}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#C72030] hover:bg-[#A01825]">Create Role</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Roles</CardTitle>
              <CardDescription>All roles defined in the system with their permissions</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search roles..."
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
                <TableHead>Role Details</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Users</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>
                    <div>
                      <div className="flex items-center mb-1">
                        <Shield className="h-4 w-4 mr-2 text-[#C72030]" />
                        <p className="font-medium">{role.name}</p>
                      </div>
                      <p className="text-sm text-gray-500">{role.description}</p>
                      <p className="text-xs text-gray-400">Created: {role.createdDate}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-64">
                      {role.permissions.slice(0, 3).map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                      {role.permissions.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.permissions.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span className="font-medium">{role.userCount}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{role.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
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

export default RolesManagement;
