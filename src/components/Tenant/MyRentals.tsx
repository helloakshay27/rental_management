
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, MapPin, Phone, Mail, Eye, FileText, CreditCard, Home, Users, DollarSign, CheckCircle, Edit } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, getToken } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const MyRentals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(false);
  const [myRentals, setMyRentals] = useState<any[]>([]);
  const navigate = useNavigate();

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(false);
  const [paymentFormData, setPaymentFormData] = useState({
    invoice_id: '',
    amount: '',
    payment_date: new Date().toISOString().split('T')[0],
    payment_type: 'rent',
    transaction_id: '',
    description: ''
  });

  const renderValue = (val: any) => {
    if (val === null || val === undefined) return '';
    if (typeof val === 'object') return val.name || val.id?.toString() || JSON.stringify(val);
    return val.toString();
  };



  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-yellow-100 text-yellow-800">Expiring Soon</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const handleViewDetails = (rentalId: string) => {
    console.log('Viewing details for rental:', rentalId);
    // Add navigation or modal logic here
    navigate(`/rental/${rentalId}`);
  };

  const handleEdit = (rentalId: string) => {
    console.log('Viewing contract for rental:', rentalId);
    navigate(`/rental/edit/${rentalId}`);
    // Add contract viewing logic here
  };

  const handlePayRent = async (rental: any) => {
    console.log('Initiating payment for rental:', rental.id);
    setPaymentFormData({
      invoice_id: '',
      amount: (rental.monthly_rent || rental.basic_rent || '').toString(),
      payment_date: new Date().toISOString().split('T')[0],
      payment_type: 'rent',
      transaction_id: '',
      description: `Rent payment for ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}`
    });
    setIsPaymentModalOpen(true);

    // Fetch invoices for this lease
    try {
      setLoadingInvoices(true);
      const data = await getAuth(`/invoices.json?q[lease_id_eq]=${rental.id}`);
      if (Array.isArray(data)) {
        setInvoices(data);
      } else if (data?.invoices) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error);
      toast.error("Failed to load invoices for this rental.");
    } finally {
      setLoadingInvoices(false);
    }
  };

  const handlePaymentSubmit = async () => {
    try {
      if (!paymentFormData.invoice_id || !paymentFormData.amount || !paymentFormData.transaction_id) {
        toast.error("Please fill in all required fields (Invoice, Amount, and Transaction ID).");
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

  const filteredRentals = myRentals.filter(rental => {
    const propertyName = rental.property?.name || '';
    const landlordName = rental.property?.landlord?.company_name || rental.property?.landlord?.contact_person || rental.tenant?.company_name || '';
    const address = rental.property?.address || '';

    const matchesSearch = propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      landlordName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (rental.sap_number && rental.sap_number.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (rental.lease_number && rental.lease_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || rental.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalMonthlyRent = myRentals.reduce((sum, rental) => sum + parseFloat(rental.monthly_rent || rental.basic_rent || 0), 0);
  const totalSecurityDeposit = myRentals.reduce((sum, rental) => sum + parseFloat(rental.security_deposit || 0), 0);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const response = await getAuth('/leases');
        setMyRentals(response.leases || []);
      } catch (error) {
        console.error('Error fetching rentals:', error);
        setMyRentals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, []);

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Properties</p>
                <p className="text-heading-2 font-semibold text-gray-900">{myRentals.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Home className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Monthly Rent</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{totalMonthlyRent.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Security Deposits</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{totalSecurityDeposit.toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Active Leases</p>
                <p className="text-heading-2 font-semibold text-gray-900">{myRentals.filter(r => r.status === 'active').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <CardContent className="bg-white pt-6 px-0 mx-0">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by property, landlord, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white text-[#1a1a1a] border border-gray-200"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48 bg-white text-[#1a1a1a] border border-gray-200">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="expiring">Expiring Soon</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Rentals Table */}
        <div className="border rounded-lg bg-white border-gray-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 border-b border-gray-200">
                <TableHead className="text-[#1a1a1a] font-medium w-[80px]">Sr. No</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">SAP ID</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Unique Code</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Property Details</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Landlord</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Lease Period</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Monthly Rent</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
                <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-white">
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    Loading rentals...
                  </TableCell>
                </TableRow>
              ) : filteredRentals.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    No rentals found
                  </TableCell>
                </TableRow>
              ) : (
                filteredRentals.map((rental, index) => (
                  <TableRow key={rental.id} className="bg-white border-b border-gray-100">
                    <TableCell className="bg-white text-gray-500 font-medium">{index + 1}</TableCell>
                    <TableCell className="bg-white">
                      <div className="font-medium text-[#c72030]">
                        {renderValue(rental.sap_number)}
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="font-medium text-[#1a1a1a]">
                        {renderValue(rental.lease_number)}
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium text-[#1a1a1a]">
                          {renderValue(rental.property?.name || rental.lease_number)}
                        </div>
                        <div className="text-sm text-[#1a1a1a]/70 flex items-center mt-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {renderValue(rental.property?.address)}
                        </div>
                        <div className="text-sm text-[#1a1a1a]/60 mt-1">
                          {renderValue(rental.property?.city)} {renderValue(rental.property?.state)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium text-[#1a1a1a]">
                          {renderValue(rental.property?.landlord?.company_name || rental.property?.landlord?.contact_person || rental.tenant?.company_name)}
                        </div>
                        <div className="text-sm text-[#1a1a1a]/70 flex items-center mt-1">
                          <Phone className="h-3 w-3 mr-1" />
                          {renderValue(rental.property?.landlord?.phone || rental.tenant?.phone)}
                        </div>
                        <div className="text-sm text-[#1a1a1a]/70 flex items-center mt-1">
                          <Mail className="h-3 w-3 mr-1" />
                          {renderValue(rental.property?.landlord?.email || rental.tenant?.email)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="text-sm">
                        <div className="text-[#1a1a1a]">
                          {rental.start_date ? new Date(rental.start_date).toLocaleDateString() : 'N/A'} -
                        </div>
                        <div className="text-[#1a1a1a]">
                          {rental.end_date ? new Date(rental.end_date).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-xs text-[#1a1a1a]/60 mt-1">
                          Rent due: Day {renderValue(rental.rent_due_date)} of month
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-[#1a1a1a] bg-white">
                      ₹{parseFloat(rental.monthly_rent || rental.basic_rent || 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="bg-white">{getStatusBadge(rental.status)}</TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Details"
                          className="text-[#C72030] hover:bg-[#C72030]/10"
                          onClick={() => handleViewDetails(rental.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="View Contract"
                          className="text-[#C72030] hover:bg-[#C72030]/10"
                          onClick={() => handleEdit(String(rental.id))}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          title="Pay Rent"
                          className="text-[#C72030] hover:bg-[#C72030]/10"
                          onClick={() => handlePayRent(rental)}
                        >
                          <CreditCard className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">Record Rent Payment</DialogTitle>
            <DialogDescription>
              Enter the details of your rent payment below.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="invoice_id" className="text-gray-900 font-medium">
                Select Invoice *
              </Label>
              <Select
                value={paymentFormData.invoice_id}
                onValueChange={(value) => setPaymentFormData(prev => ({ ...prev, invoice_id: value }))}
              >
                <SelectTrigger className="w-full bg-white border-2 border-gray-300 hover:border-[#C72030] focus:border-[#C72030] focus:ring-[#C72030] text-gray-900">
                  <SelectValue placeholder={loadingInvoices ? "Loading invoices..." : "Select Invoice"} />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {invoices.length === 0 && !loadingInvoices ? (
                    <div className="p-2 text-sm text-gray-500 text-center">No invoices found</div>
                  ) : (
                    invoices.map((inv) => (
                      <SelectItem key={inv.id} value={inv.id.toString()}>
                        {inv.invoice_number} (₹{inv.total_amount || inv.amount})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
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

export default MyRentals;
