import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import PaymentSummaryCards from './PaymentSummaryCards';
import PaymentFilters from './PaymentFilters';
import PaymentTable from './PaymentTable';

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for payment history
  const payments = [
    {
      id: 'PAY001',
      propertyName: 'Sunset Apartments - Unit 2A',
      landlordName: 'John Smith Properties',
      amount: 25000,
      paymentDate: '2024-01-15',
      dueDate: '2024-01-01',
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      transactionId: 'TXN123456789',
      type: 'rent'
    },
    {
      id: 'PAY002',
      propertyName: 'Green Valley Villa',
      landlordName: 'Sarah Johnson Realty',
      amount: 35000,
      paymentDate: '2024-01-01',
      dueDate: '2024-01-01',
      status: 'paid',
      paymentMethod: 'UPI',
      transactionId: 'UPI987654321',
      type: 'rent'
    },
    {
      id: 'PAY003',
      propertyName: 'City Center Office Space',
      landlordName: 'Metro Commercial',
      amount: 45000,
      paymentDate: null,
      dueDate: '2024-02-01',
      status: 'pending',
      paymentMethod: null,
      transactionId: null,
      type: 'rent'
    },
    {
      id: 'PAY004',
      propertyName: 'Sunset Apartments - Unit 2A',
      landlordName: 'John Smith Properties',
      amount: 2500,
      paymentDate: '2024-01-10',
      dueDate: '2024-01-05',
      status: 'paid',
      paymentMethod: 'Credit Card',
      transactionId: 'CC567890123',
      type: 'maintenance'
    }
  ];

  const handleDownloadReceipt = (paymentId: string) => {
    console.log('Downloading receipt for payment:', paymentId);
    // Add download logic here
  };

  const handlePayNow = (paymentId: string) => {
    console.log('Initiating payment for:', paymentId);
    // Add payment logic here
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 bg-white">
      <PaymentSummaryCards payments={payments} />

      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200 pb-6">
          <CardTitle className="text-[#1a1a1a]">Payment History</CardTitle>
        </CardHeader>
        <CardContent className="bg-white pt-6">
          <PaymentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <PaymentTable
            payments={filteredPayments}
            onDownloadReceipt={handleDownloadReceipt}
            onPayNow={handlePayNow}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentHistory;
