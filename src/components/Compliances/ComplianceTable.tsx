
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Calendar, Building2 } from 'lucide-react';

interface ComplianceTableProps {
  compliances: any[];
  onEdit: (compliance: any) => void;
  onDelete: (compliance: any) => void;
}

const ComplianceTable = ({ compliances, onEdit, onDelete }: ComplianceTableProps) => {
  const getStatusColor = (status: string) => {
    const normalizedStatus = status?.toLowerCase();
    switch (normalizedStatus) {
      case 'active':
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Compliance Details</TableHead>
          <TableHead>Type & Authority</TableHead>
          <TableHead>Validity & Cost</TableHead>
          <TableHead>Applicable To</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {compliances.map((compliance) => (
          <TableRow key={compliance.id}>
            <TableCell>
              <div>
                <p className="font-medium">{compliance.title}</p>
                <p className="text-sm text-gray-500">ID: {compliance.id}</p>
                <p className="text-sm text-gray-500">{compliance.description}</p>
                {compliance.responsible_party && (
                  <p className="text-xs text-gray-400">Responsible: {compliance.responsible_party}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <Badge variant="outline" className="mb-1">{compliance.requirement_type}</Badge>
                <p className="text-sm text-gray-600">{compliance.regulatory_body || 'N/A'}</p>
                {compliance.due_date && (
                  <p className="text-xs text-gray-500">Due: {new Date(compliance.due_date).toLocaleDateString()}</p>
                )}
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="flex items-center text-sm mb-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{compliance.validity_months || 'N/A'} months</span>
                </div>
                <p className="text-sm text-gray-600">₹{compliance.approx_cost || '0'}</p>
                <p className="text-xs text-gray-500">{compliance.reminder_days || 0} days notice</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                {compliance.property_types && compliance.property_types.length > 0 && (
                  <div className="mb-1">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Building2 className="h-3 w-3 mr-1" />
                      Property Types:
                    </div>
                    {compliance.property_types.map((propertyType: any) => (
                      <Badge key={propertyType.id} variant="secondary" className="text-xs mr-1 mb-1">
                        {propertyType.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(compliance.status)}>
                {compliance.status ? compliance.status.charAt(0).toUpperCase() + compliance.status.slice(1) : 'Unknown'}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onEdit(compliance)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600" onClick={() => onDelete(compliance)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default ComplianceTable;
