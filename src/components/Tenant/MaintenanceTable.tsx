
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
}

const MaintenanceTable = ({
  requests,
  onViewDetails,
  onViewMessages
}: MaintenanceTableProps) => {
  return (
    <div className="border rounded-lg bg-white border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 border-b border-gray-200">
            <TableHead className="text-[#1a1a1a] font-medium">Request Details</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Property</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Priority</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Assigned To</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {requests.map((request) => (
            <TableRow key={request.id} className="bg-white border-b border-gray-100">
              <TableCell className="bg-white">
                <div>
                  <div className="font-medium flex items-center gap-2">
                    {getStatusIcon(request.status)}
                    {request.title}
                  </div>
                  <div className="text-sm text-[#1a1a1a]/70 mt-1">{request.issueType}</div>
                  <div className="text-xs text-[#1a1a1a]/60 mt-1">
                    Created: {new Date(request.createdDate).toLocaleDateString()}
                  </div>
                </div>
              </TableCell>
              <TableCell className="bg-white">
                <div>
                  <div className="font-medium text-[#1a1a1a]">{request.propertyName}</div>
                  <div className="text-sm text-[#1a1a1a]/70">{request.landlordName}</div>
                </div>
              </TableCell>
              <TableCell className="bg-white">{getPriorityBadge(request.priority)}</TableCell>
              <TableCell className="bg-white">{getStatusBadge(request.status)}</TableCell>
              <TableCell className="bg-white">
                <div>
                  {request.assignedTo ? (
                    <div>
                      <div className="text-sm text-[#1a1a1a]">{request.assignedTo}</div>
                      {request.estimatedCompletion && (
                        <div className="text-xs text-[#1a1a1a]/60">
                          ETA: {new Date(request.estimatedCompletion).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-[#1a1a1a]/60">Not assigned</span>
                  )}
                </div>
              </TableCell>
              <TableCell className="bg-white">
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="View Details"
                    className="text-[#C72030] hover:bg-[#C72030]/10"
                    onClick={() => onViewDetails(request.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    title="Messages"
                    className="text-[#C72030] hover:bg-[#C72030]/10"
                    onClick={() => onViewMessages(request.id)}
                  >
                    <MessageCircle className="h-4 w-4" />
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

export default MaintenanceTable;
