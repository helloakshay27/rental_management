
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
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

interface PaymentTableProps {
  payments: Payment[];
  onDownloadReceipt: (paymentId: string) => void;
  onPayNow: (paymentId: string) => void;
  leftActions?: React.ReactNode;
  onFilterClick?: () => void;
}

const columns: ColumnConfig[] = [
  { key: 'propertyName', label: 'Property & Landlord', sortable: true, draggable: true },
  { key: 'type', label: 'Type', sortable: true, draggable: true },
  { key: 'amount', label: 'Amount', sortable: true, draggable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true, draggable: true },
  { key: 'paymentDate', label: 'Payment Date', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'paid':
      return <Badge variant="success">Paid</Badge>;
    case 'pending':
      return <Badge variant="pending">Pending</Badge>;
    case 'overdue':
      return <Badge variant="rejected">Overdue</Badge>;
    default:
      return <Badge variant="inactive">Unknown</Badge>;
  }
};

const getPaymentTypeBadge = (type: string) => {
  switch (type) {
    case 'rent':
      return <Badge variant="info">Rent</Badge>;
    case 'maintenance':
      return <Badge variant="warning">Maintenance</Badge>;
    case 'deposit':
      return <Badge variant="tag">Deposit</Badge>;
    default:
      return <Badge variant="outline">Other</Badge>;
  }
};

const PaymentTable: React.FC<PaymentTableProps> = ({ payments, onDownloadReceipt, onPayNow, leftActions, onFilterClick }) => {
  const renderCell = (payment: Payment, columnKey: string) => {
    switch (columnKey) {
      case 'propertyName':
        return (
          <div>
            <div className="font-medium text-brand-text">{payment.propertyName}</div>
            <div className="text-brand-body-5 text-brand-text-light">{payment.landlordName}</div>
            {payment.transactionId && (
              <div className="text-brand-caption text-brand-text-light mt-1">
                ID: {payment.transactionId}
              </div>
            )}
          </div>
        );
      case 'type':
        return getPaymentTypeBadge(payment.type);
      case 'amount':
        return (
          <span className="font-medium text-brand-text">₹{payment.amount.toLocaleString()}</span>
        );
      case 'dueDate':
        return new Date(payment.dueDate).toLocaleDateString();
      case 'paymentDate':
        return payment.paymentDate ? (
          <div>
            <div className="text-brand-text">
              {new Date(payment.paymentDate).toLocaleDateString()}
            </div>
            {payment.paymentMethod && (
              <div className="text-brand-caption text-brand-text-light">
                {payment.paymentMethod}
              </div>
            )}
          </div>
        ) : (
          <span className="text-brand-text-light">-</span>
        );
      case 'status':
        return getStatusBadge(payment.status);
      default:
        return payment[columnKey as keyof Payment];
    }
  };

  const renderActions = (payment: Payment) => (
    <div className="flex items-center gap-2">
      {payment.status === 'paid' ? (
        <Button
          variant="ghost"
          size="sm"
          title="Download Receipt"
          onClick={() => onDownloadReceipt(payment.id)}
        >
          <Download className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          title="Pay Now"
          onClick={() => onPayNow(payment.id)}
        >
          <CreditCard className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  return (
    <EnhancedTable
      data={payments}
      columns={columns}
      renderCell={renderCell}
      renderActions={renderActions}
      getItemId={(payment) => payment.id}
      storageKey="tenant-payments-table"
      leftActions={leftActions}
      onFilterClick={onFilterClick}
      emptyMessage="No payments found"
      searchPlaceholder="Search payments..."
      enableSearch={true}
      enableSelection={false}
      exportFileName="payments"
      pagination={true}
      pageSize={10}
    />
  );
};

export default PaymentTable;
