
import React, { useState } from 'react';
import { PageContainer, StatsGrid, PageHeader } from '@/components/ui/page';
import { StatsCard } from '@/components/ui/stats-card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Key, Lock, Unlock, Shield, Calendar } from 'lucide-react';
import { Heading, Text } from '@/components/ui/typography';

const columns: ColumnConfig[] = [
  { key: 'user', label: 'User & Role', sortable: true, draggable: true },
  { key: 'module', label: 'Module Access', sortable: true, draggable: true },
  { key: 'permissions', label: 'Permissions', sortable: false, draggable: true },
  { key: 'ipRestriction', label: 'Restrictions', sortable: false, draggable: true },
  { key: 'lastAccess', label: 'Last Access', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const AccessManagement = () => {
  const navigate = useNavigate();
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

  const renderCell = (access: typeof accessControls[number], columnKey: string) => {
    switch (columnKey) {
      case 'user':
        return (
          <div>
            <p className="font-medium">{access.user}</p>
            <p className="text-brand-body-5 text-brand-text-light">{access.role}</p>
          </div>
        );
      case 'module':
        return <Badge variant="outline">{access.module}</Badge>;
      case 'permissions':
        return (
          <div className="flex flex-wrap gap-1">
            {access.permissions.map((permission) => (
              <Badge key={permission} variant="secondary" className="text-brand-caption">
                {permission}
              </Badge>
            ))}
          </div>
        );
      case 'ipRestriction':
        return (
          <div>
            <p className="text-brand-body-5">IP: {access.ipRestriction}</p>
            <p className="text-brand-body-5">Time: {access.timeRestriction}</p>
          </div>
        );
      case 'lastAccess':
        return (
          <div className="flex items-center text-brand-body-5">
            <Calendar className="h-3 w-3 mr-1" />
            {access.lastAccess}
          </div>
        );
      case 'status':
        return (
          <Badge variant={access.status === 'Active' ? 'active' : 'rejected'}>
            {access.status}
          </Badge>
        );
      default:
        return access[columnKey as keyof typeof access] as React.ReactNode;
    }
  };

  const renderActions = () => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" title="Edit">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Revoke" className="text-brand-error">
        <Lock className="h-4 w-4" />
      </Button>
    </div>
  );

  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const leftActions = (
    <Button onClick={() => setIsConfigOpen(true)} className="fm-button-fix fm-button-brand px-6 py-2">
      <Plus className="w-4 h-4 mr-2" />
      Configure Access
    </Button>
  );

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <PageHeader title="Access Management" description="Control user permissions and access levels" backTo="/masters" />
        <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
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
              <Button variant="outline" className="fm-button-fix px-6 py-2">Cancel</Button>
              <Button className="fm-button-fix fm-button-brand px-6 py-2">Save Access Configuration</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <StatsGrid>
        <StatsCard title="Total Users" value={24} icon={<Shield />} />
        <StatsCard title="Active Sessions" value={18} icon={<Unlock />} />
        <StatsCard title="Restricted Access" value={3} icon={<Lock />} />
        <StatsCard title="Suspended" value={1} icon={<Key />} />
      </StatsGrid>

      <div>
        <EnhancedTable
        data={filteredAccess}
        columns={columns}
        renderCell={renderCell}
        renderActions={renderActions}
        getItemId={(access) => String(access.id)}
        storageKey="access-control-table"
        leftActions={leftActions}
        emptyMessage="No access controls found"
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search access controls..."
        disableClientSearch={true}
        enableSearch={true}
        enableSelection={false}
        exportFileName="access-controls"
        pagination={true}
        pageSize={10}
        />
      </div>
    </PageContainer>
  );
};

export default AccessManagement;
