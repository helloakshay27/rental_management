
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Calendar, Send, Eye, DollarSign, AlertCircle, CheckCircle, Clock, CreditCard, ChevronLeft, ChevronRight } from 'lucide-react';
import { postAuth, getAuth } from '@/lib/api';
import { toast } from 'sonner';
import PaymentHistory from '@/components/Tenant/PaymentHistory';

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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-[#C72030]" />
              <div>
                <p className="text-2xl font-bold">{formatCurrency(stats.outstanding)}</p>
                <p className="text-sm text-gray-600">Total Outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.collection_rate}%</p>
                <p className="text-sm text-gray-600">Collection Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="invoices" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="payments" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <CreditCard className="h-4 w-4 mr-2" />
            Payment History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>Track and manage all tenant invoices</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm bg-white"
                />
                <Select value={statusFilter} onValueChange={handleStatusFilterChange}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">Loading invoices...</TableCell>
                    </TableRow>
                  ) : filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">No invoices found</TableCell>
                    </TableRow>
                  ) : filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number || `INV-${invoice.id}`}</TableCell>
                      <TableCell>{invoice.billable?.tenant_name || 'N/A'}</TableCell>
                      <TableCell>{invoice.billable?.property_name || 'N/A'}</TableCell>
                      <TableCell>₹{invoice.amount?.toLocaleString()}</TableCell>
                      <TableCell>{invoice.due_date}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
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
                            className="text-[#C72030] hover:bg-[#C72030]/10"
                            onClick={() => handlePay(invoice)}
                          >
                            <CreditCard className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {!loading && pagination.total_pages > 1 && (
                <div className="flex items-center justify-between mt-6 px-2">
                  <p className="text-sm text-gray-600">
                    Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to {Math.min(pagination.current_page * pagination.per_page, pagination.total_entries)} of {pagination.total_entries} entries
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page - 1)}
                      disabled={pagination.current_page === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(pagination.total_pages, 5) }, (_, i) => {
                        let pageNum = i + 1;
                        // Simple logic for sliding window if total pages > 5
                        if (pagination.total_pages > 5 && pagination.current_page > 3) {
                          pageNum = pagination.current_page - 2 + i;
                          if (pageNum > pagination.total_pages) pageNum = pagination.total_pages - (4 - i);
                        }

                        return (
                          <Button
                            key={pageNum}
                            variant={pagination.current_page === pageNum ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(pageNum)}
                            className={`h-8 w-8 p-0 ${pagination.current_page === pageNum ? "bg-[#C72030] text-white hover:bg-[#A01825]" : ""}`}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.current_page + 1)}
                      disabled={pagination.current_page === pagination.total_pages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <PaymentHistory />
        </TabsContent>
      </Tabs>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Record Invoice Payment</DialogTitle>
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
                className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                  className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
                className="bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900"
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
              className="bg-[#C72030] hover:bg-[#A01825] text-white"
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
