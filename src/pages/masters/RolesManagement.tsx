
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Search, Plus, Edit, Trash2, Shield, Users, Settings, ChevronLeft, Eye } from 'lucide-react';

import { postAuth, getAuth, putAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
  users_count: number | null;
  users: any[];
}

const RolesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);


  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Active',
    permissions: [] as string[]
  });

  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(true);

  const availablePermissions = [
    'Dashboard', 'Properties', 'Tenants', 'Landlords', 'Rental Management',
    'OPEX', 'Utilities', 'AMC', 'Maintenance', 'Reports', 'Settings', 'Masters',
    'Financial Reports', 'Billing', 'Property Viewing', 'Maintenance Requests'
  ];

  const fetchRoles = async () => {
    try {
      setLoadingRoles(true);
      const data = await getAuth('/roles');
      setRoles(data);
    } catch (error: any) {
      let errorMessage = "Failed to fetch roles";
      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
        errorMessage = error.response.errors.join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setLoadingRoles(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePermissionToggle = (permission: string) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permission)
        ? prev.permissions.filter(p => p !== permission)
        : [...prev.permissions, permission]
    }));
  };

  const handleEditRole = async (roleId: number) => {
    try {
      setIsLoading(true);
      const roleData = await getAuth(`/roles/${roleId}`);

      setEditingRole(roleData);
      setFormData({
        name: roleData.name,
        description: roleData.description,
        status: roleData.is_active ? 'Active' : 'Inactive',
        permissions: roleData.permissions || []
      });
      setIsDialogOpen(true);
    } catch (error: any) {
      toast.error("Failed to fetch role details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingRole(null);
    setFormData({
      name: '',
      description: '',
      status: 'Active',
      permissions: []
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!formData.name.trim()) {
        toast.error("Role name is required");
        return;
      }

      if (formData.permissions.length === 0) {
        toast.error("Please select at least one permission");
        return;
      }

      // Prepare payload
      const payload = {
        role: {
          name: formData.name,
          description: formData.description,
          permissions: formData.permissions
        },
        status: formData.status
      };

      // Make API call
      if (editingRole) {
        await putAuth(`/roles/${editingRole.id}`, payload);
        toast.success("Role updated successfully");
      } else {
        await postAuth('/roles', payload);
        toast.success("Role created successfully");
      }

      // Reset form and close dialog
      handleCloseDialog();

      // Refresh roles list
      fetchRoles();

    } catch (error: any) {
      // Check if error response has errors array
      let errorMessage = editingRole ? "Failed to update role" : "Failed to create role";

      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
        // Join all error messages with newlines
        errorMessage = error.response.errors.join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/masters')}
            className="text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Roles Management</h1>
            <p className="text-gray-600">Define and manage user roles and responsibilities</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-semibold text-xl">{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
              <DialogDescription className="text-gray-600">{editingRole ? 'Update the role details and permissions' : 'Define a new role with specific permissions'}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="role-name" className="text-gray-900 font-medium">Role Name</Label>
                  <Input
                    id="role-name"
                    placeholder="Enter role name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-white border-2 border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-status" className="text-gray-900 font-medium">Status</Label>
                  <select
                    className="w-full p-2 border-2 border-gray-300 rounded-md bg-white text-gray-900 focus:border-[#C72030] focus:ring-[#C72030] focus:outline-none"
                    value={formData.status}
                    onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role-description" className="text-gray-900 font-medium">Description</Label>
                <Textarea
                  id="role-description"
                  placeholder="Enter role description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-white border-2 border-gray-300 focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-gray-900 font-medium">Permissions</Label>
                <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 border-2 border-gray-300 rounded-md bg-white">
                  {availablePermissions.map((permission) => (
                    <div key={permission} className="flex items-center space-x-2">
                      <Checkbox
                        id={permission}
                        checked={formData.permissions.includes(permission)}
                        onCheckedChange={() => handlePermissionToggle(permission)}
                        className="border-2 border-[#C72030] data-[state=checked]:bg-[#C72030] data-[state=checked]:border-[#C72030]"
                      />
                      <Label htmlFor={permission} className="text-sm text-gray-900 cursor-pointer">{permission}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                className="border-2 border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white"
                onClick={handleCloseDialog}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                className="bg-[#C72030] hover:bg-[#A01825] text-white"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (editingRole ? 'Updating...' : 'Creating...') : (editingRole ? 'Update Role' : 'Create Role')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>System Roles</CardTitle>
              <CardDescription >All roles defined in the system with their permissions</CardDescription>
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
              {loadingRoles ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    Loading roles...
                  </TableCell>
                </TableRow>
              ) : filteredRoles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8">
                    No roles found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRoles.map((role) => (
                  <TableRow key={role.id}>
                    <TableCell>
                      <div>
                        <div className="flex items-center mb-1">
                          <Shield className="h-4 w-4 mr-2 text-[#C72030]" />
                          <p className="font-medium">{role.name}</p>
                        </div>
                        <p className="text-sm text-gray-500">{role.description}</p>
                        <p className="text-xs text-gray-400">Created: {new Date(role.created_at).toLocaleDateString()}</p>
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
                        <span className="font-medium">{role.users_count || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`${role.is_active ? 'bg-green-600 hover:bg-green-700' : 'bg-[#C72030] hover:bg-[#A01825]'}`}
                      >
                        {role.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/roles/${role.id}`)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleEditRole(role.id)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RolesManagement;
