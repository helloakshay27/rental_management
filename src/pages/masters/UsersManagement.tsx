
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Phone, Mail, Calendar, Shield, ChevronLeft } from 'lucide-react';
import { getAuth, postAuth, patchAuth } from '@/lib/api';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

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

const UsersManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
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
    joining_date: ''
  });

  const fetchUsers = async () => {
    try {
      const data = await getAuth('/users');
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
        joining_date: userData.joining_date || ''
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
        if (Array.isArray(data)) {
          setRolesList(data);
        }
      } catch (error) {
        console.error('Failed to fetch roles', error);
        toast.error('Failed to load roles');
      }
    };
    fetchRoles();
  }, []);

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
          joining_date: formData.joining_date
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

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({
      full_name: '',
      email: '',
      phone: '',
      role_id: '',
      department: '',
      joining_date: ''
    });
  };



  const filteredUsers = users.filter(user =>
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
            <p className="text-gray-600">Manage system users and their basic information</p>
          </div>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => !open && handleCloseDialog()}>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-semibold text-xl">{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
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
              <Button className="bg-[#C72030] hover:bg-[#A01825] text-white" onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? (editingUser ? 'Updating...' : 'Creating...') : (editingUser ? 'Update User' : 'Create User')}
              </Button>
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
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-3 w-3 mr-1" />
                        Joined: {user.joining_date ? new Date(user.joining_date).toLocaleDateString() : 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {user.email || 'N/A'}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {user.phone || 'N/A'}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center mb-1">
                        <Shield className="h-3 w-3 mr-1" />
                        <span className="font-medium text-sm">
                          {user.roles && user.roles.length > 0
                            ? user.roles.map(r => r.name).join(', ')
                            : 'No Role'}
                        </span>
                      </div>
                      <Badge variant="outline">{user.department || 'General'}</Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p className="text-gray-900">Updated</p>
                      <p className="text-gray-500 text-xs">{new Date(user.updated_at).toLocaleDateString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={user.status === 'active' ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-500'}
                    >
                      {user.status ? user.status.charAt(0).toUpperCase() + user.status.slice(1) : 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => navigate(`/masters/users/${user.id}`)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleEditUser(user.id)}>
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
