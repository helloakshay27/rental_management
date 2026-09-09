
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Edit, Trash2, Calendar, Building2, Eye } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComplianceTableProps {
  compliances: any[];
  onEdit: (compliance: any) => void;
  onDelete: (compliance: any) => void;
  onView: (id: number) => void;
  onStatusUpdate: (id: number, status: string) => void;
  leftActions?: React.ReactNode;
  onFilterClick?: () => void;
}

const columns: ColumnConfig[] = [
  { key: 'title', label: 'Compliance Details', sortable: true, draggable: true },
  { key: 'requirement_type', label: 'Type & Authority', sortable: true, draggable: true },
  { key: 'validity_months', label: 'Validity & Cost', sortable: true, draggable: true },
  { key: 'property_types', label: 'Applicable To', sortable: false, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const ComplianceTable = ({ compliances, onEdit, onDelete, onView, onStatusUpdate, leftActions, onFilterClick }: ComplianceTableProps) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'active':
      case 'completed': return 'bg-brand-success-bg text-brand-success';
      case 'pending': return 'bg-brand-warning-light text-brand-text';
      case 'overdue': return 'bg-brand-error-bg text-brand-error';
      case 'inactive': return 'bg-brand-muted text-brand-text';
      default: return 'bg-brand-muted text-brand-text';
    }
  };

  const renderCell = (compliance: any, columnKey: string) => {
    switch (columnKey) {
      case 'title':
        return (
          <div>
            <p className="font-medium">{compliance.title}</p>
            <p className="text-brand-body-5 text-brand-text-light">ID: {compliance.id}</p>
            <p className="text-brand-body-5 text-brand-text-light">{compliance.description}</p>
            {compliance.responsible_party && (
              <p className="text-brand-caption text-brand-text-light">
                Responsible: {compliance.responsible_party}
              </p>
            )}
          </div>
        );
      case 'requirement_type':
        return (
          <div>
            <Badge variant="outline" className="mb-1">{compliance.requirement_type}</Badge>
            <p className="text-brand-body-5 text-brand-text-light">
              {compliance.regulatory_body || 'N/A'}
            </p>
            {compliance.due_date && (
              <p className="text-brand-caption text-brand-text-light">
                Due: {new Date(compliance.due_date).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      case 'validity_months':
        return (
          <div>
            <div className="flex items-center text-brand-body-5 mb-1">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{compliance.validity_months || 'N/A'} months</span>
            </div>
            <p className="text-brand-body-5 text-brand-text-light">
              ₹{compliance.approx_cost || '0'}
            </p>
            <p className="text-brand-caption text-brand-text-light">
              {compliance.reminder_days || 0} days notice
            </p>
          </div>
        );
      case 'property_types':
        return (
          <div>
            {compliance.property_types && compliance.property_types.length > 0 && (
              <div className="mb-1">
                <div className="flex items-center text-brand-caption text-brand-text-light mb-1">
                  <Building2 className="h-3 w-3 mr-1" />
                  Property Types:
                </div>
                {compliance.property_types.map((propertyType: any) => (
                  <Badge key={propertyType.id} variant="secondary" className="text-brand-caption mr-1 mb-1">
                    {propertyType.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        );
      case 'status':
        return (
          <Select
            value={compliance.status ? compliance.status.charAt(0).toUpperCase() + compliance.status.slice(1).toLowerCase() : 'Active'}
            onValueChange={(value) => onStatusUpdate(compliance.id, value)}
          >
            <SelectTrigger className={`w-32 h-8 ${getStatusColor(compliance.status)} border-2`}>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        );
      default:
        return compliance[columnKey];
    }
  };

  const renderActions = (compliance: any) => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" title="View" onClick={() => onView(compliance.id)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => onEdit(compliance)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Delete"
        className="text-brand-error"
        onClick={() => onDelete(compliance)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <EnhancedTable
      data={compliances}
      columns={columns}
      renderCell={renderCell}
      renderActions={renderActions}
      getItemId={(compliance) => String(compliance.id)}
      storageKey="compliances-table"
      leftActions={leftActions}
      onFilterClick={onFilterClick}
      emptyMessage="No compliances found"
      searchPlaceholder="Search compliances..."
      enableSearch={true}
      enableSelection={false}
      exportFileName="compliances"
      pagination={true}
      pageSize={10}
    />
  );
};

export default ComplianceTable;
