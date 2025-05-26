
import React from 'react';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import PaymentRow from './PaymentRow';

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

interface PaymentTableProps {
  payments: Payment[];
  onDownloadReceipt: (paymentId: string) => void;
  onPayNow: (paymentId: string) => void;
}

const PaymentTable: React.FC<PaymentTableProps> = ({ payments, onDownloadReceipt, onPayNow }) => {
  return (
    <div className="border rounded-lg bg-white border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="bg-white border-b border-gray-200">
            <TableHead className="text-[#1a1a1a] font-medium">Property & Landlord</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Type</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Amount</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Due Date</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Payment Date</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
            <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="bg-white">
          {payments.map((payment) => (
            <PaymentRow
              key={payment.id}
              payment={payment}
              onDownloadReceipt={onDownloadReceipt}
              onPayNow={onPayNow}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default PaymentTable;
