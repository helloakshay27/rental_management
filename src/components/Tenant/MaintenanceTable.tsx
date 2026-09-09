
import React from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Eye, MessageCircle } from 'lucide-react';
import { getStatusBadge, getPriorityBadge, getStatusIcon } from './MaintenanceUtils';

interface MaintenanceRequest {
  id: string;
  propertyName: string;
  landlordName: string;
  issueType: string;
  title: string;
  description: string;
  priority: string;
  status: string;
  createdDate: string;
  assignedTo: string | null;
  estimatedCompletion: string | null;
}

interface MaintenanceTableProps {
  requests: MaintenanceRequest[];
  onViewDetails: (requestId: string) => void;
  onViewMessages: (requestId: string) => void;
  leftActions?: React.ReactNode;
  onFilterClick?: () => void;
}

const columns: ColumnConfig[] = [
  { key: 'title', label: 'Request Details', sortable: true, draggable: true },
  { key: 'propertyName', label: 'Property', sortable: true, draggable: true },
  { key: 'priority', label: 'Priority', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
  { key: 'assignedTo', label: 'Assigned To', sortable: true, draggable: true },
];

const MaintenanceTable = ({
  requests,
  onViewDetails,
  onViewMessages, leftActions, onFilterClick }: MaintenanceTableProps) => {
  const renderCell = (request: MaintenanceRequest, columnKey: string) => {
    switch (columnKey) {
      case 'title':
        return (
          <div>
            <div className="font-medium flex items-center gap-2">
              {getStatusIcon(request.status)}
              {request.title}
            </div>
            <div className="text-brand-body-5 text-brand-text-light mt-1">{request.issueType}</div>
            <div className="text-brand-caption text-brand-text-light mt-1">
              Created: {new Date(request.createdDate).toLocaleDateString()}
            </div>
          </div>
        );
      case 'propertyName':
        return (
          <div>
            <div className="font-medium text-brand-text">{request.propertyName}</div>
            <div className="text-brand-body-5 text-brand-text-light">{request.landlordName}</div>
          </div>
        );
      case 'priority':
        return getPriorityBadge(request.priority);
      case 'status':
        return getStatusBadge(request.status);
      case 'assignedTo':
        return request.assignedTo ? (
          <div>
            <div className="text-brand-body-5 text-brand-text">{request.assignedTo}</div>
            {request.estimatedCompletion && (
              <div className="text-brand-caption text-brand-text-light">
                ETA: {new Date(request.estimatedCompletion).toLocaleDateString()}
              </div>
            )}
          </div>
        ) : (
          <span className="text-brand-text-light">Not assigned</span>
        );
      default:
        return request[columnKey as keyof MaintenanceRequest];
    }
  };

  const renderActions = (request: MaintenanceRequest) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        title="View Details"
        onClick={() => onViewDetails(request.id)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Messages"
        onClick={() => onViewMessages(request.id)}
      >
        <MessageCircle className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <EnhancedTable
      data={requests}
      columns={columns}
      renderCell={renderCell}
      renderActions={renderActions}
      getItemId={(request) => request.id}
      storageKey="tenant-maintenance-table"
      leftActions={leftActions}
      onFilterClick={onFilterClick}
      emptyMessage="No maintenance requests found"
      searchPlaceholder="Search requests..."
      enableSearch={true}
      enableSelection={false}
      exportFileName="maintenance-requests"
      pagination={true}
      pageSize={10}
    />
  );
};

export default MaintenanceTable;
