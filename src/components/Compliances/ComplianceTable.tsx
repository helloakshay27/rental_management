
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
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Expiring': return 'bg-yellow-100 text-yellow-800';
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
                <p className="font-medium">{compliance.name}</p>
                <p className="text-sm text-gray-500">ID: {compliance.id}</p>
                <p className="text-sm text-gray-500">{compliance.description}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <Badge variant="outline" className="mb-1">{compliance.type}</Badge>
                <p className="text-sm text-gray-600">{compliance.authority}</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                <div className="flex items-center text-sm mb-1">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{compliance.validityPeriod} months</span>
                </div>
                <p className="text-sm text-gray-600">{compliance.cost}</p>
                <p className="text-xs text-gray-500">{compliance.renewalNotice} days notice</p>
              </div>
            </TableCell>
            <TableCell>
              <div>
                {compliance.applicablePropertyTypes.length > 0 && (
                  <div className="mb-1">
                    <div className="flex items-center text-xs text-gray-500 mb-1">
                      <Building2 className="h-3 w-3 mr-1" />
                      Property Types:
                    </div>
                    {compliance.applicablePropertyTypes.map((type: string) => (
                      <Badge key={type} variant="secondary" className="text-xs mr-1 mb-1">
                        {type}
                      </Badge>
                    ))}
                  </div>
                )}
                {compliance.specificProperties.length > 0 && (
                  <div>
                    <p className="text-xs text-gray-500">Specific Properties: {compliance.specificProperties.join(', ')}</p>
                  </div>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge className={getStatusColor(compliance.status)}>
                {compliance.status}
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
