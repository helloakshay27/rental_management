
import React from 'react';
import { TableCell, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, CreditCard } from 'lucide-react';

interface Payment {
  id: string;
  propertyName: string;
  landlordName: string;
  amount: number;
  paymentDate: string | null;
  dueDate: string;
  status: string;
  paymentMethod: string | null;
  transactionId: string | null;
  type: string;
}

interface PaymentRowProps {
  payment: Payment;
  onDownloadReceipt: (paymentId: string) => void;
  onPayNow: (paymentId: string) => void;
}

const PaymentRow: React.FC<PaymentRowProps> = ({ payment, onDownloadReceipt, onPayNow }) => {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getPaymentTypeBadge = (type: string) => {
    switch (type) {
      case 'rent':
        return <Badge variant="outline" className="text-blue-600 border-blue-200">Rent</Badge>;
      case 'maintenance':
        return <Badge variant="outline" className="text-orange-600 border-orange-200">Maintenance</Badge>;
      case 'deposit':
        return <Badge variant="outline" className="text-purple-600 border-purple-200">Deposit</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <TableRow className="bg-white">
      <TableCell className="bg-white">
        <div>
          <div className="font-medium text-[#1a1a1a]">{payment.propertyName}</div>
          <div className="text-sm text-[#1a1a1a]/70">{payment.landlordName}</div>
          {payment.transactionId && (
            <div className="text-xs text-[#1a1a1a]/60 mt-1">ID: {payment.transactionId}</div>
          )}
        </div>
      </TableCell>
      <TableCell className="bg-white">{getPaymentTypeBadge(payment.type)}</TableCell>
      <TableCell className="font-medium text-[#1a1a1a] bg-white">₹{payment.amount.toLocaleString()}</TableCell>
      <TableCell className="text-[#1a1a1a] bg-white">{new Date(payment.dueDate).toLocaleDateString()}</TableCell>
      <TableCell className="bg-white">
        {payment.paymentDate ? (
          <div>
            <div className="text-[#1a1a1a]">{new Date(payment.paymentDate).toLocaleDateString()}</div>
            {payment.paymentMethod && (
              <div className="text-xs text-[#1a1a1a]/60">{payment.paymentMethod}</div>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </TableCell>
      <TableCell className="bg-white">{getStatusBadge(payment.status)}</TableCell>
      <TableCell className="bg-white">
        <div className="flex items-center gap-2">
          {payment.status === 'paid' ? (
            <Button 
              variant="ghost" 
              size="sm" 
              title="Download Receipt" 
              className="text-[#C72030] hover:bg-[#C72030]/10"
              onClick={() => onDownloadReceipt(payment.id)}
            >
              <Download className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="ghost" 
              size="sm" 
              title="Pay Now" 
              className="text-[#C72030] hover:bg-[#C72030]/10"
              onClick={() => onPayNow(payment.id)}
            >
              <CreditCard className="h-4 w-4" />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};

export default PaymentRow;
