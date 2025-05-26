
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, DollarSign, Clock, CheckCircle } from 'lucide-react';
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

  const totalPaid = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Payments</p>
                <p className="text-heading-2 font-semibold text-gray-900">{payments.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Paid</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{totalPaid.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Pending Amount</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{totalPending.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">This Month</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{payments.filter(p => p.paymentDate && new Date(p.paymentDate).getMonth() === new Date().getMonth()).reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
