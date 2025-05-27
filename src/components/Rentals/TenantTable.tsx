
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Edit, Phone, Mail, MapPin } from 'lucide-react';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone: string;
  propertyName: string;
  leaseStart: string;
  leaseEnd: string;
  rent: number;
  status: string;
  emergencyContact: string;
  profession: string;
}

interface TenantTableProps {
  tenants: Tenant[];
  onViewTenant: (tenantId: string) => void;
  onEditTenant: (tenantId: string) => void;
  onCallTenant: (tenantId: string, phone: string) => void;
  onEmailTenant: (tenantId: string, email: string) => void;
}

const TenantTable = ({ 
  tenants, 
  onViewTenant, 
  onEditTenant, 
  onCallTenant, 
  onEmailTenant 
}: TenantTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'notice_given':
        return <Badge className="bg-yellow-100 text-yellow-800">Notice Given</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <TableHead className="text-[#1a1a1a] font-medium">Tenant Details</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Contact Info</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Property</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Lease Period</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Monthly Rent</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {tenants.map((tenant) => (
            <TableRow key={tenant.id} className="hover:bg-gray-50 bg-white border-b border-gray-100">
              <TableCell className="bg-white">
                <div>
                  <div className="font-medium">{tenant.name}</div>
                  <div className="text-sm text-gray-600">{tenant.profession}</div>
                  <div className="text-xs text-gray-500">ID: {tenant.id}</div>
                </div>
              </TableCell>
              <TableCell className="bg-white">
                <div className="space-y-1">
                  <div className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-1 text-gray-400" />
                    {tenant.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="h-3 w-3 mr-1 text-gray-400" />
                    {tenant.phone}
                  </div>
                </div>
              </TableCell>
              <TableCell className="bg-white">
                <div className="flex items-center text-sm">
                  <MapPin className="h-3 w-3 mr-1 text-gray-400" />
                  {tenant.propertyName}
                </div>
              </TableCell>
              <TableCell className="bg-white">
                <div className="text-sm">
                  <div>{new Date(tenant.leaseStart).toLocaleDateString()} -</div>
                  <div>{new Date(tenant.leaseEnd).toLocaleDateString()}</div>
                </div>
              </TableCell>
              <TableCell className="font-medium bg-white">₹{tenant.rent.toLocaleString()}</TableCell>
              <TableCell className="bg-white">{getStatusBadge(tenant.status)}</TableCell>
              <TableCell className="bg-white">
                <div className="flex items-center gap-0.5">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-[#E74C3C]/10 hover:text-[#E74C3C] p-1"
                    onClick={() => onViewTenant(tenant.id)}
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-green-50 hover:text-green-600 p-1"
                    onClick={() => onEditTenant(tenant.id)}
                    title="Edit Tenant"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-blue-50 hover:text-blue-600 p-1"
                    onClick={() => onCallTenant(tenant.id, tenant.phone)}
                    title="Call Tenant"
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="hover:bg-purple-50 hover:text-purple-600 p-1"
                    onClick={() => onEmailTenant(tenant.id, tenant.email)}
                    title="Email Tenant"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TenantTable;
