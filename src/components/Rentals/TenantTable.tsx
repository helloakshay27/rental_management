
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
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
  leftActions?: React.ReactNode;
  onFilterClick?: () => void;
}

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Tenant Details', sortable: true, draggable: true },
  { key: 'email', label: 'Contact Info', sortable: true, draggable: true },
  { key: 'propertyName', label: 'Property', sortable: true, draggable: true },
  { key: 'leaseStart', label: 'Lease Period', sortable: true, draggable: true },
  { key: 'rent', label: 'Monthly Rent', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const TenantTable = ({
  tenants,
  onViewTenant,
  onEditTenant,
  onCallTenant,
  onEmailTenant,
  leftActions,
  onFilterClick
}: TenantTableProps) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="active">Active</Badge>;
      case 'notice_given':
        return <Badge variant="pending">Notice Given</Badge>;
      case 'inactive':
        return <Badge variant="inactive">Inactive</Badge>;
      default:
        return <Badge variant="inactive">Unknown</Badge>;
    }
  };

  const renderCell = (tenant: Tenant, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <div className="font-medium">{tenant.name}</div>
            <div className="text-brand-body-5 text-brand-text-light">{tenant.profession}</div>
            <div className="text-brand-caption text-brand-text-light">ID: {tenant.id}</div>
          </div>
        );
      case 'email':
        return (
          <div className="space-y-1">
            <div className="flex items-center text-brand-body-5">
              <Mail className="h-3 w-3 mr-1 text-brand-text-light" />
              {tenant.email}
            </div>
            <div className="flex items-center text-brand-body-5">
              <Phone className="h-3 w-3 mr-1 text-brand-text-light" />
              {tenant.phone}
            </div>
          </div>
        );
      case 'propertyName':
        return (
          <div className="flex items-center text-brand-body-5">
            <MapPin className="h-3 w-3 mr-1 text-brand-text-light" />
            {tenant.propertyName}
          </div>
        );
      case 'leaseStart':
        return (
          <div className="text-brand-body-5">
            <div>{new Date(tenant.leaseStart).toLocaleDateString()} -</div>
            <div>{new Date(tenant.leaseEnd).toLocaleDateString()}</div>
          </div>
        );
      case 'rent':
        return <span className="font-medium">₹{tenant.rent.toLocaleString()}</span>;
      case 'status':
        return getStatusBadge(tenant.status);
      default:
        return tenant[columnKey as keyof Tenant];
    }
  };

  const renderActions = (tenant: Tenant) => (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewTenant(tenant.id)}
        title="View Details"
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEditTenant(tenant.id)}
        title="Edit Tenant"
      >
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCallTenant(tenant.id, tenant.phone)}
        title="Call Tenant"
      >
        <Phone className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onEmailTenant(tenant.id, tenant.email)}
        title="Email Tenant"
      >
        <Mail className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <EnhancedTable
      data={tenants}
      columns={columns}
      renderCell={renderCell}
      renderActions={renderActions}
      getItemId={(tenant) => tenant.id}
      storageKey="tenants-table"
      leftActions={leftActions}
      onFilterClick={onFilterClick}
      emptyMessage="No tenants found"
      searchPlaceholder="Search tenants..."
      enableSearch={true}
      enableSelection={false}
      hideTableExport={false}
      exportFileName="tenants"
      pagination={true}
      pageSize={10}
    />
  );
};

export default TenantTable;
