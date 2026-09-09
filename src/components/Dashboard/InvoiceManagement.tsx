
import React, { useState, useEffect } from 'react';
import { StatsGrid } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Calendar, Send, Eye, DollarSign, AlertCircle, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { postAuth, getAuth } from '@/lib/api';
import { toast } from 'sonner';
import PaymentHistory from '@/components/Tenant/PaymentHistory';

const columns: ColumnConfig[] = [
  { key: 'invoice_number', label: 'Invoice ID', sortable: true, draggable: true },
  { key: 'tenant_name', label: 'Tenant', sortable: true, draggable: true },
  { key: 'property_name', label: 'Property', sortable: true, draggable: true },
  { key: 'amount', label: 'Amount', sortable: true, draggable: true },
  { key: 'due_date', label: 'Due Date', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const InvoiceManagement = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    outstanding: 0,
    pending: 0,
    overdue: 0,
    paid: 0,
    collection_rate: 0
  });

  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_entries: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');

  useEffect(() => {
    fetchInvoices();
  }, [pagination.current_page, statusFilter]);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      let url = `/invoices.json?page=${pagination.current_page}`;
      if (statusFilter !== 'all') {
        url += `&q[status_eq]=${statusFilter}`; // Assuming typical Ransack filter for status
      }
      const data = await getAuth(url);
      setInvoices(data.invoices || []);
      setStats(data.pagination?.stats || {
        outstanding: 0,
        pending: 0,
        overdue: 0,
        paid: 0,
        collection_rate: 0
      });
      if (data.pagination) {
        setPagination({
          current_page: data.pagination.current_page,
          per_page: data.pagination.per_page,
          total_pages: data.pagination.total_pages,
          total_entries: data.pagination.total_entries
        });
      }
    } catch (error: any) {
      console.error('Error fetching invoices:', error);
      toast.error("Failed to load invoices");
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, current_page: newPage }));
  };

  const handleStatusFilterChange = (val: string) => {
    setStatusFilter(val);
    setPagination(prev => ({ ...prev, current_page: 1 }));
  };

  const recurringRules = [
    {
      id: 'RR-001',
      property: 'Sunset Apartments - 2A',
      tenant: 'TechCorp Solutions',
      frequency: 'Monthly',
      amount: 125000,
      nextDue: '2024-03-01',
      status: 'active',
      area: 2500,
      ratePerSqFt: 50
    },
    {
      id: 'RR-002',
      property: 'Business Plaza - Floor 3',
      tenant: 'Green Valley Enterprises',
      frequency: 'Monthly',
      amount: 180000,
      nextDue: '2024-03-05',
      status: 'active',
      area: 3600,
      ratePerSqFt: 50
    }
  ];

  const brandTemplates = [
    { id: 'premium', name: 'Premium Corporate', description: 'Professional design with company colors' },
    { id: 'modern', name: 'Modern Minimalist', description: 'Clean and simple layout' },
    { id: 'classic', name: 'Classic Professional', description: 'Traditional business invoice style' }
  ];



  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    invoice_id: '',
    invoice_number: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_type: 'rent',
    transaction_id: '',
    description: ''
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handlePay = (invoice: any) => {
    setPaymentFormData({
      invoice_id: invoice.id.toString(),
      invoice_number: invoice.invoice_number || `INV-${invoice.id}`,
      amount: invoice.amount.toString(),
      payment_date: new Date().toISOString().split('T')[0],
      payment_type: 'rent',
      transaction_id: '',
      description: `Payment for Invoice ${invoice.invoice_number || invoice.id}`
    });
    setIsPaymentModalOpen(true);
  };

  const handlePaymentSubmit = async () => {
    try {
      if (!paymentFormData.transaction_id) {
        toast.error("Please enter a Transaction ID");
        return;
      }

      setIsSubmittingPayment(true);
      const payload = {
        payment: {
          invoice_id: parseInt(paymentFormData.invoice_id),
          amount: parseFloat(paymentFormData.amount),
          payment_date: paymentFormData.payment_date,
          payment_type: paymentFormData.payment_type,
          transaction_id: paymentFormData.transaction_id,
          description: paymentFormData.description
        }
      };

      await postAuth('/payments', payload);
      toast.success("Payment recorded successfully!");
      setIsPaymentModalOpen(false);
      fetchInvoices(); // Refresh after payment
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast.error(error.message || "Failed to record payment");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const searchStr = searchTerm.toLowerCase();
    const matchesSearch = (invoice.billable?.tenant_name?.toLowerCase() || '').includes(searchStr) ||
      (invoice.billable?.property_name?.toLowerCase() || '').includes(searchStr) ||
      (invoice.invoice_number?.toLowerCase() || '').includes(searchStr) ||
      invoice.id.toString().includes(searchStr);
    return matchesSearch;
  });

  const formatCurrency = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)}Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)}L`;
    }
    return `₹${amount.toLocaleString()}`;
  };

  const renderCell = (invoice: any, columnKey: string) => {
    switch (columnKey) {
      case 'invoice_number':
        return <span className="font-medium">{invoice.invoice_number || `INV-${invoice.id}`}</span>;
      case 'tenant_name':
        return invoice.billable?.tenant_name || 'N/A';
      case 'property_name':
        return invoice.billable?.property_name || 'N/A';
      case 'amount':
        return `₹${invoice.amount?.toLocaleString()}`;
      case 'status':
        return getStatusBadge(invoice.status);
      default:
        return invoice[columnKey];
    }
  };

  const leftActions = (
    <TableFilterDialog
      open={isFilterOpen}
      onOpenChange={setIsFilterOpen}
      onApply={() => handleStatusFilterChange(pendingStatus)}
      onReset={() => {
        setPendingStatus('all');
        handleStatusFilterChange('all');
      }}
    >
      <FilterField label="Status">
        <Select value={pendingStatus} onValueChange={setPendingStatus}>
          <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </TableFilterDialog>
  );

  const renderActions = (invoice: any) => (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="sm"
        title="View Details"
        onClick={() => navigate(`/invoicing/${invoice.id}`)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Send Invoice">
        <Send className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Pay"
        className="text-brand"
        onClick={() => handlePay(invoice)}
      >
        <CreditCard className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Outstanding"
          value={formatCurrency(stats.outstanding)}
          icon={<DollarSign />}
        />
        <StatsCard title="Pending Invoices" value={stats.pending} icon={<FileText />} />
        <StatsCard title="Overdue" value={stats.overdue} icon={<AlertCircle />} />
        <StatsCard
          title="Collection Rate"
          value={`${stats.collection_rate}%`}
          icon={<CheckCircle />}
        />
      </StatsGrid>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList>
          <TabsTrigger value="invoices">
            <FileText className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payments">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-5">
          <div>
            <EnhancedTable
              data={filteredInvoices}
              columns={columns}
              renderCell={renderCell}
              renderActions={renderActions}
              getItemId={(invoice) => String(invoice.id)}
              storageKey="invoices-table"
              emptyMessage="No invoices found"
              loading={loading}
              loadingMessage="Loading invoices..."
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Search invoices..."
              disableClientSearch={true}
              enableSearch={true}
              enableSelection={false}
              leftActions={leftActions}
              onFilterClick={() => {
                setPendingStatus(statusFilter);
                setIsFilterOpen(true);
              }}
              exportFileName="invoices"
              pagination={true}
              pageSize={pagination.per_page}
              currentPage={pagination.current_page}
              totalPages={pagination.total_pages}
              onPageChange={(page) =>
                setPagination(prev => ({ ...prev, current_page: page }))
              }
            />
          </div>
        </TabsContent>

        <TabsContent value="payments" className="space-y-5">
          <PaymentHistory />
        </TabsContent>
      </Tabs>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Record Invoice Payment</DialogTitle>
            <DialogDescription>
              Enter the payment details for this invoice.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="invoice_display" className="text-gray-900 font-medium">
                Invoice ID (Record ID)
              </Label>
              <Input
                id="invoice_display"
                value={paymentFormData.invoice_id}
                disabled
                className="bg-gray-50 border-2 border-gray-200 text-gray-500 font-medium"
              />
              <p className="text-xs text-gray-400">Invoice Number: {paymentFormData.invoice_number}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount" className="text-gray-900 font-medium">
                Amount (₹) *
              </Label>
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                className="bg-white border-gray-300 text-gray-900"
                value={paymentFormData.amount}
                onChange={(e) => setPaymentFormData(prev => ({ ...prev, amount: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="payment_date" className="text-gray-900 font-medium">
                  Payment Date
                </Label>
                <Input
                  id="payment_date"
                  type="date"
                  className="bg-white border-gray-300 text-gray-900"
                  value={paymentFormData.payment_date}
                  onChange={(e) => setPaymentFormData(prev => ({ ...prev, payment_date: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="payment_type" className="text-gray-900 font-medium">
                  Payment Type
                </Label>
                <Input
                  id="payment_type"
                  value="rent"
                  disabled
                  className="bg-gray-50 border-2 border-gray-200 text-gray-500 font-medium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transaction_id" className="text-gray-900 font-medium">
                Transaction ID *
              </Label>
              <Input
                id="transaction_id"
                placeholder="UPI / Bank Ref No."
                className="bg-white border-gray-300 text-gray-900"
                value={paymentFormData.transaction_id}
                onChange={(e) => setPaymentFormData(prev => ({ ...prev, transaction_id: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-900 font-medium">
                Description
              </Label>
              <Input
                id="description"
                placeholder="Optional notes"
                className="bg-white border-gray-300 text-gray-900"
                value={paymentFormData.description}
                onChange={(e) => setPaymentFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsPaymentModalOpen(false)}
              className="border-gray-300 text-gray-700"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePaymentSubmit}
              disabled={isSubmittingPayment}
              className="fm-button-fix fm-button-brand px-6 py-2"
            >
              {isSubmittingPayment ? "Processing..." : "Submit Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoiceManagement;
