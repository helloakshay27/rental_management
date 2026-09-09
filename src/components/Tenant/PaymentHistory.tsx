import React, { useState, useEffect, useCallback } from 'react';
import { SectionLoader } from '@/components/ui/loader';
import { StatsGrid } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { CreditCard, DollarSign, Clock, CheckCircle } from 'lucide-react';
import PaymentTable from './PaymentTable';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const PaymentHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingFilter, setPendingFilter] = useState('all');
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAuth('/payments.json');
      console.log('Fetched payments:', data);

      const rawPayments = Array.isArray(data) ? data : (data.payments || []);

      // Map API data to UI structure
      const mappedPayments = rawPayments.map((p: any) => ({
        id: p.id.toString(),
        propertyName: p.invoice?.lease?.property_name || p.property_name || 'N/A',
        landlordName: p.invoice?.lease?.landlord_name || p.landlord_name || 'N/A',
        amount: parseFloat(p.amount),
        paymentDate: p.payment_date,
        dueDate: p.invoice?.due_date || p.payment_date,
        status: p.status || 'paid',
        paymentMethod: p.payment_method || 'N/A',
        transactionId: p.transaction_id,
        type: p.payment_type || 'rent'
      }));

      setPayments(mappedPayments);
    } catch (error: any) {
      console.error('Failed to fetch payments:', error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

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
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard title="Total Payments" value={payments.length} icon={<CreditCard />} />
        <StatsCard
          title="Total Paid"
          value={`₹${totalPaid.toLocaleString()}`}
          icon={<CheckCircle />}
        />
        <StatsCard
          title="Pending Amount"
          value={`₹${totalPending.toLocaleString()}`}
          icon={<Clock />}
        />
        <StatsCard
          title="This Month"
          value={`₹${payments
            .filter(
              (p) =>
                p.paymentDate &&
                new Date(p.paymentDate).getMonth() === new Date().getMonth()
            )
            .reduce((sum, p) => sum + p.amount, 0)
            .toLocaleString()}`}
          icon={<DollarSign />}
        />
      </StatsGrid>

      <div>
          {loading ? (
            <SectionLoader />
          ) : (
            <PaymentTable
              payments={filteredPayments}
              onFilterClick={() => {
                setPendingFilter(statusFilter);
                setIsFilterOpen(true);
              }}
              onDownloadReceipt={handleDownloadReceipt}
              onPayNow={handlePayNow}
              leftActions={
                <TableFilterDialog
                  open={isFilterOpen}
                  onOpenChange={setIsFilterOpen}
                  onApply={() => setStatusFilter(pendingFilter)}
                  onReset={() => {
                    setPendingFilter('all');
                    setStatusFilter('all');
                  }}
                >
                  <FilterField label="Status">
                    <Select value={pendingFilter} onValueChange={setPendingFilter}>
                      <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </FilterField>
                </TableFilterDialog>
              }
            />
          )}
      </div>
    </div>
  );
};

export default PaymentHistory;
