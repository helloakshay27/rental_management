
import React, { useState } from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Plus, Edit, Trash2, Eye, Phone, Mail, Calendar, Shield } from 'lucide-react';
import { getAuth, postAuth, patchAuth, deleteAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { Heading, Text } from '@/components/ui/typography';

interface UserRole {
  id: number;
  name: string;
}

interface User {
  id: number;
  full_name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joining_date: string;
  status: string;
  is_active: boolean;
  roles: UserRole[];
  created_at: string;
  updated_at: string;
}

const columns: ColumnConfig[] = [
  { key: 'full_name', label: 'User Details', sortable: true, draggable: true },
  { key: 'email', label: 'Contact Info', sortable: true, draggable: true },
  { key: 'roles', label: 'Role & Department', sortable: false, draggable: true },
  { key: 'updated_at', label: 'Last Activity', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const UsersManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [users, setUsers] = useState<User[]>([]); // To store fetched users
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role_id: '',
    department: '',
    joining_date: '',
    status: 'Active'
  });

  const fetchUsers = async () => {
    try {
      let url = '/users';
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
        setUsers(data);
      } else {
        // Handle case where data might be wrapped
        setUsers([]);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Failed to load users');
    }
  };

  const handleEditUser = async (userId: number) => {
    try {
      setIsLoading(true);
      const userData = await getAuth(`/users/${userId}`);

      setEditingUser(userData);

      // Map data to form
      setFormData({
        full_name: userData.full_name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        role_id: userData.roles && userData.roles.length > 0 ? userData.roles[0].id.toString() : '',
        department: userData.department || '',
        joining_date: userData.joining_date || '',
        status: userData.status || 'Active'
      });

      setIsDialogOpen(true);
    } catch (error) {
      toast.error('Failed to fetch user details');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
    const fetchRoles = async () => {
      try {
        const data = await getAuth('/roles');
        if (Array.isArray(data.roles)) {
          setRolesList(data.roles);
        }
      } catch (error) {
        console.error('Failed to fetch roles', error);
        toast.error('Failed to load roles');
      }
    };
    fetchRoles();
  }, [statusFilter]);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role_id: '',
      department: '',
      joining_date: '',
      status: 'Active'
    });
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      // Validation
      if (!formData.full_name || !formData.email || !formData.role_id) {
        toast.error("Please fill in all required fields (Name, Email, Role)");
        return;
      }

      const payload = {
        user: {
          full_name: formData.full_name,
          email: formData.email,
          phone: formData.phone,
          role_ids: [parseInt(formData.role_id)],
          department: formData.department,
          joining_date: formData.joining_date,
          status: formData.status
        }
      };

      if (editingUser) {
        await patchAuth(`/users/${editingUser.id}`, payload);
        toast.success("User updated successfully");
      } else {
        await postAuth('/users', payload);
        toast.success("User created successfully");
      }

      // Reset and Close
      handleCloseDialog();
      fetchUsers(); // Refresh list

    } catch (error: any) {
      let errorMessage = editingUser ? "Failed to update user" : "Failed to create user";
      if (error.response && error.response.errors && Array.isArray(error.response.errors)) {
        errorMessage = error.response.errors.join(", ");
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setIsLoading(true);
        await deleteAuth(`/users/${userId}`);
        toast.success('User deleted successfully');
        fetchUsers();
      } catch (error: any) {
        toast.error('Failed to delete user');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleUpdateStatus = async (userId: number, newStatus: string) => {
    try {
      setIsLoading(true);
      await patchAuth(`/users/${userId}`, {
        user: { status: newStatus }
      });
      toast.success('Status updated successfully');
      fetchUsers();
    } catch (error: any) {
      toast.error('Failed to update status');
    } finally {
      setIsLoading(false);
    }
  };


  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCell = (user: User, columnKey: string) => {
    switch (columnKey) {
      case 'full_name':
        return (
          <div>
            <p className="font-medium">{user.full_name}</p>
            <p className="text-brand-body-5 text-brand-text-light">ID: {user.id}</p>
            <div className="flex items-center text-brand-body-5 text-brand-text-light">
              <Calendar className="h-3 w-3 mr-1" />
              Joined: {user.joining_date ? new Date(user.joining_date).toLocaleDateString() : 'N/A'}
            </div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-1">
            <div className="flex items-center text-brand-body-5">
              <Mail className="h-3 w-3 mr-1" />
              {user.email || 'N/A'}
            </div>
            <div className="flex items-center text-brand-body-5">
              <Phone className="h-3 w-3 mr-1" />
              {user.phone || 'N/A'}
            </div>
          </div>
        );
      case 'roles':
        return (
          <div>
            <div className="flex items-center mb-1">
              <Shield className="h-3 w-3 mr-1" />
              <span className="font-medium text-brand-body-5">
                {user.roles && user.roles.length > 0
                  ? user.roles.map(r => r.name).join(', ')
                  : 'No Role'}
              </span>
            </div>
            <Badge variant="outline">{user.department || 'General'}</Badge>
          </div>
        );
      case 'updated_at':
        return (
          <div className="text-brand-body-5">
            <p className="text-brand-text">Updated</p>
            <p className="text-brand-text-light text-brand-caption">
              {new Date(user.updated_at).toLocaleDateString()}
            </p>
          </div>
        );
      case 'status':
        return (
          <Select
            value={user.status || 'Active'}
            onValueChange={(value) => handleUpdateStatus(user.id, value)}
          >
            <SelectTrigger
              className={`w-32 h-8 ${user.status?.toLowerCase() === 'active'
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
        return user[columnKey as keyof User] as React.ReactNode;
    }
  };

  const renderActions = (user: User) => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" title="View" onClick={() => navigate(`/masters/users/${user.id}`)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => handleEditUser(user.id)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Delete" className="text-brand-error" onClick={() => handleDeleteUser(user.id)}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
        <Button onClick={() => setIsDialogOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
            <Plus className="w-4 h-4 mr-2" />
            Add User
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
        <PageHeader title="Users Management" description="Manage system users and their basic information" backTo="/masters" />
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription className="text-gray-600">{editingUser ? 'Update user account information' : 'Create a new user account with basic information'}</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="user-name" className="text-gray-900 font-medium">Full Name</Label>
                <Input
                  id="user-name"
                  placeholder="Enter full name"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-email" className="text-gray-900 font-medium">Email</Label>
                <Input
                  id="user-email"
                  type="email"
                  placeholder="Enter email"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-phone" className="text-gray-900 font-medium">Phone</Label>
                <Input
                  id="user-phone"
                  placeholder="Enter phone number"
                  className="bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-role" className="text-gray-900 font-medium">Role</Label>
                <Select
                  value={formData.role_id}
                  onValueChange={(value) => setFormData({ ...formData, role_id: value })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    {rolesList.map((role) => (
                      <SelectItem key={role.id} value={role.id.toString()}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="user-department" className="text-gray-900 font-medium">Department</Label>
                <Select
                  value={formData.department}
                  onValueChange={(value) => setFormData({ ...formData, department: value })}
                >
                  <SelectTrigger className="bg-white border-gray-300 text-gray-900">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Operations">Operations</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Maintenance">Maintenance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joining-date" className="text-gray-900 font-medium">Joining Date</Label>
                <Input
                  id="joining-date"
                  type="date"
                  className="bg-white border-gray-300 text-gray-900"
                  value={formData.joining_date}
                  onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" className="border-red-600 text-red-600 hover:bg-red-50 hover:text-red-700" onClick={handleCloseDialog}>Cancel</Button>
              <Button className="fm-button-fix fm-button-brand px-6 py-2" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update User' : 'Create User')}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <EnhancedTable
          data={filteredUsers}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(user) => String(user.id)}
          storageKey="users-master-table"
          emptyMessage="No users found"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search users..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
          setPendingStatus(statusFilter);
          setIsFilterOpen(true);
          }}
          exportFileName="users"
          pagination={true}
          pageSize={10}
        />
      </div>
    </PageContainer>
  );
};

export default UsersManagement;
