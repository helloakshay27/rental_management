
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Calendar, Send, Eye, DollarSign, AlertCircle, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { postAuth } from '@/lib/api';
import { toast } from 'sonner';
import PaymentHistory from '@/components/Tenant/PaymentHistory';

const InvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  const handlePay = (invoice: any) => {
    setPaymentFormData({
      invoice_id: invoice.id.toString().replace('INV-2024-', ''), // Using record ID (simulated from mock)
      invoice_number: invoice.id,
      amount: invoice.amount.toString(),
      payment_date: new Date().toISOString().split('T')[0],
      payment_type: 'rent',
      transaction_id: '',
      description: `Payment for Invoice ${invoice.id}`
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
    } catch (error: any) {
      console.error('Error submitting payment:', error);
      toast.error(error.message || "Failed to record payment");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  const invoices = [
    {
      id: 'INV-2024-001',
      tenantName: 'TechCorp Solutions',
      property: 'Sunset Apartments - 2A',
      amount: 125000,
      dueDate: '2024-02-01',
      status: 'pending',
      issueDate: '2024-01-01',
      area: 2500,
      ratePerSqFt: 50,
      period: 'January 2024',
      recurringRule: 'Monthly',
      brandTemplate: 'Premium Corporate'
    },
    {
      id: 'INV-2024-002',
      tenantName: 'Green Valley Enterprises',
      property: 'Business Plaza - Floor 3',
      amount: 180000,
      dueDate: '2024-02-05',
      status: 'overdue',
      issueDate: '2024-01-05',
      area: 3600,
      ratePerSqFt: 50,
      period: 'January 2024',
      recurringRule: 'Monthly',
      brandTemplate: 'Modern Minimalist'
    },
    {
      id: 'INV-2024-003',
      tenantName: 'Innovation Hub Ltd',
      property: 'Tech Tower - Suite 401',
      amount: 95000,
      dueDate: '2024-01-28',
      status: 'paid',
      issueDate: '2023-12-28',
      area: 1900,
      ratePerSqFt: 50,
      period: 'December 2023',
      recurringRule: 'Monthly',
      brandTemplate: 'Classic Professional'
    }
  ];

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

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-[#C72030]" />
              <div>
                <p className="text-2xl font-bold">₹4.2Cr</p>
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
                <p className="text-2xl font-bold">156</p>
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
                <p className="text-2xl font-bold">23</p>
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
                <p className="text-2xl font-bold">89.2%</p>
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
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
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.tenantName}</TableCell>
                      <TableCell>{invoice.property}</TableCell>
                      <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm" title="View Details">
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
