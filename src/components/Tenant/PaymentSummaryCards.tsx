
import React from 'react';
import { StatsGrid } from '@/components/ui/page';
import { StatsCard } from '@/components/ui/stats-card';
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
    <StatsGrid>
      <StatsCard title="Total Payments" value={payments.length} icon={<CreditCard />} />
      <StatsCard
        title="Total Paid"
        value={`₹${totalPaid.toLocaleString()}`}
        icon={<CheckCircle />}
      />
      <StatsCard
        title="Pending"
        value={`₹${totalPending.toLocaleString()}`}
        icon={<Clock />}
      />
      <StatsCard
        title="This Month"
        value={payments.filter(p => p.type === 'rent').length}
        icon={<AlertCircle />}
      />
    </StatsGrid>
  );
};

export default PaymentSummaryCards;
