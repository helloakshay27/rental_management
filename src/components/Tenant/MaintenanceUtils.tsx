
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { StatusPill } from '@/components/ui/status-pill';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    case 'in-progress':
      return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
    case 'completed':
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    case 'cancelled':
      return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
    default:
      return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
  }
};

/** Same shared state pill (and tone) as the request detail view. */
export const getPriorityBadge = (priority: string) =>
  <StatusPill status={priority || 'Unknown'} />;

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-600" />;
    case 'in-progress':
      return <AlertCircle className="h-4 w-4 text-blue-600" />;
    case 'completed':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    default:
      return <Clock className="h-4 w-4 text-gray-600" />;
  }
};
