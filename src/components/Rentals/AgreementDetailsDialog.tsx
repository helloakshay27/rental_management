
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, MapPin, User, DollarSign, FileText, Download, Edit } from 'lucide-react';

interface Agreement {
  id: string;
  propertyName: string;
  tenantName: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: string;
  securityDeposit: number;
  leaseType: string;
}

interface AgreementDetailsDialogProps {
  agreement: Agreement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AgreementDetailsDialog = ({ agreement, open, onOpenChange }: AgreementDetailsDialogProps) => {
  if (!agreement) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800">Terminated</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Agreement Details - {agreement.id}</span>
            {getStatusBadge(agreement.status)}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Property Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-blue-600" />
              Property Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{agreement.propertyName}</p>
              <p className="text-sm text-gray-600 mt-1">Lease Type: {agreement.leaseType}</p>
            </div>
          </div>

          {/* Tenant Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="h-5 w-5 mr-2 text-blue-600" />
              Tenant Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-medium">{agreement.tenantName}</p>
              <p className="text-sm text-gray-600 mt-1">Primary Tenant</p>
            </div>
          </div>

          {/* Financial Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-blue-600" />
              Financial Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Monthly Rent</p>
                <p className="text-xl font-bold text-green-600">₹{agreement.monthlyRent.toLocaleString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Security Deposit</p>
                <p className="text-xl font-bold">₹{agreement.securityDeposit.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Lease Period */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-blue-600" />
              Lease Period
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-medium">{new Date(agreement.startDate).toLocaleDateString()}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">End Date</p>
                <p className="font-medium">{new Date(agreement.endDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="h-4 w-4 mr-2" />
              Download Agreement
            </Button>
            <Button variant="outline" className="flex items-center">
              <Edit className="h-4 w-4 mr-2" />
              Edit Agreement
            </Button>
            <Button variant="outline" className="flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              View Documents
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AgreementDetailsDialog;
