
import React, { useState, useEffect } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Edit, Trash2, Shield, Users, Settings, Eye } from 'lucide-react';

import { postAuth, getAuth, putAuth, deleteAuth, patchAuth } from '@/lib/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
  status: string;
  created_at: string;
  updated_at: string;
  users_count: number | null;
  users: any[];
}

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Role Details', sortable: true, draggable: true },
  { key: 'permissions', label: 'Permissions', sortable: false, draggable: true },
  { key: 'users_count', label: 'Users', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const RolesManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
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
      let url = '/roles';
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('status', statusFilter);
      }
      const queryString = params.toString();
      if (queryString) {
        url += `?${queryString}`;
      }
      const data = await getAuth(url);
      if (Array.isArray(data)) {
        setRoles(data);
      } else if (data && typeof data === 'object' && Array.isArray((data as any).roles)) {
        setRoles((data as any).roles);
      } else {
        setRoles([]);
      }
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
  }, [statusFilter]);

  const filteredRoles = (Array.isArray(roles) ? roles : []).filter(role =>
    (role.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description || '').toLowerCase().includes(searchTerm.toLowerCase())
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
        status: roleData.status || (roleData.is_active ? 'Active' : 'Inactive'),
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
          permissions: formData.permissions,
          status: formData.status
        }
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

  const handleDeleteRole = async (roleId: number) => {
    if (window.confirm('Are you sure you want to delete this role?')) {
      try {
        setIsLoading(true);
        await deleteAuth(`/roles/${roleId}`);
        toast.success('Role deleted successfully');
        fetchRoles();
      } catch (error: any) {
        toast.error('Failed to delete role');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (roleId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      await patchAuth(`/roles/${roleId}`, {
        role: { status: newStatus }
      });
      toast.success('Status updated successfully');
      fetchRoles();
    } catch (error: any) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCell = (role: Role, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <div className="flex items-center mb-1">
              <Shield className="h-4 w-4 mr-2 text-brand" />
              <p className="font-medium">{role.name}</p>
            </div>
            <p className="text-brand-body-5 text-brand-text-light">{role.description}</p>
            <p className="text-brand-caption text-brand-text-light">
              Created: {new Date(role.created_at).toLocaleDateString()}
            </p>
          </div>
        );
      case 'permissions':
        return (
          <div className="flex flex-wrap gap-1 max-w-64">
            {(Array.isArray(role.permissions) ? role.permissions : []).slice(0, 3).map((permission) => (
              <Badge key={permission} variant="outline" className="text-brand-caption">
                {permission}
              </Badge>
            ))}
            {Array.isArray(role.permissions) && role.permissions.length > 3 && (
              <Badge variant="outline" className="text-brand-caption">
                +{role.permissions.length - 3} more
              </Badge>
            )}
          </div>
        );
      case 'users_count':
        return (
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span className="font-medium">{role.users_count || 0}</span>
          </div>
        );
      case 'status':
        return (
          <Select
            value={role.status || 'Active'}
            onValueChange={(value) => handleUpdateStatus(role.id, value)}
          >
            <SelectTrigger
              className={`w-32 h-8 ${role.status?.toLowerCase() === 'active'
                ? 'bg-brand-success-bg text-brand-success'
                : 'bg-brand-muted text-brand-text'}`}
            >
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return role[columnKey as keyof Role] as React.ReactNode;
    }
  };

  const renderActions = (role: Role) => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/roles/${role.id}`)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditRole(role.id)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteRole(role.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
        <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Create Role
        </Button>

        <TableFilterDialog
            open={isFilterOpen}
            onOpenChange={setIsFilterOpen}
            onApply={() => setStatusFilter(pendingStatus)}
            onReset={() => {
                setPendingStatus('all');
                setStatusFilter('all');
            }}
        >
            <FilterField label="Status">
                <Select value={pendingStatus} onValueChange={setPendingStatus}>
                    <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </FilterField>
        </TableFilterDialog>
    </div>
  );

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader title="Roles Management" description="Define and manage user roles and responsibilities" backTo="/masters" />
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">{editingRole ? 'Edit Role' : 'Create New Role'}</DialogTitle>
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
                <div className="space-y-2 col-span-2">
                  <Label className="text-gray-900 font-medium">Status *</Label>
                  <div className="flex items-center space-x-6 pt-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'Active'}
                        onChange={() => setFormData(prev => ({ ...prev, status: 'Active' }))}
                        className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                      />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        checked={formData.status === 'Inactive'}
                        onChange={() => setFormData(prev => ({ ...prev, status: 'Inactive' }))}
                        className="w-4 h-4 text-[#C72030] border-gray-300 focus:ring-[#C72030]"
                      />
                      <span className="text-sm text-gray-700">Inactive</span>
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role-description" className="text-gray-900 font-medium">Description</Label>
                  <Textarea
                    id="role-description"
                    placeholder="Enter role description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-white border-gray-300 focus:border-[#C72030] focus:ring-[#C72030] text-gray-900 min-h-[100px]"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-gray-900 font-medium">Permissions</Label>
                  <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto p-4 border-gray-300 rounded-md bg-white">
                    {availablePermissions.map((permission) => (
                      <div key={permission} className="flex items-center space-x-2">
                        <Checkbox
                          id={permission}
                          checked={formData.permissions.includes(permission)}
                          onCheckedChange={() => handlePermissionToggle(permission)}
                          className="border-brand data-[state=checked]:bg-brand data-[state=checked]:border-brand data-[state=checked]:text-white"
                        />
                        <Label htmlFor={permission} className="text-sm text-gray-900 cursor-pointer">{permission}</Label>
                      </div>
                    ))}
                  </div>
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
                className="fm-button-fix fm-button-brand px-6 py-2"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (editingRole ? 'Updating...' : 'Creating...') : (editingRole ? 'Update Role' : 'Create Role')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <EnhancedTable
          data={filteredRoles}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(role) => String(role.id)}
          storageKey="roles-master-table"
          emptyMessage="No roles found"
          loading={loadingRoles}
          loadingMessage="Loading roles..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search roles..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
          setPendingStatus(statusFilter);
          setIsFilterOpen(true);
          }}
          exportFileName="roles"
          pagination={true}
          pageSize={10}
        />
      </div>
    </PageContainer>
  );
};

export default RolesManagement;
