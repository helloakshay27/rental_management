
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  status: string;
  type: string;
}

interface PaymentSummaryCardsProps {
  payments: Payment[];
}

const PaymentSummaryCards: React.FC<PaymentSummaryCardsProps> = ({ payments }) => {
  const totalPaid = payments
    .filter(p => p.status === 'paid')
    .reduce((sum, p) => sum + p.amount, 0);
  
  const totalPending = payments
    .filter(p => p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1a1a1a]/70">Total Payments</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">{payments.length}</p>
            </div>
            <CreditCard className="h-8 w-8 text-blue-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1a1a1a]/70">Total Paid</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">₹{totalPaid.toLocaleString()}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1a1a1a]/70">Pending</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">₹{totalPending.toLocaleString()}</p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#1a1a1a]/70">This Month</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">{payments.filter(p => p.type === 'rent').length}</p>
            </div>
            <AlertCircle className="h-8 w-8 text-purple-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSummaryCards;
