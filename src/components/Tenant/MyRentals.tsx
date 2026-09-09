
import React, { useState, useEffect } from 'react';
import { StatsGrid } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { MapPin, Phone, Mail, Eye, CreditCard, Home, DollarSign, CheckCircle, Edit, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAuth, postAuth, getToken } from '@/lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from 'sonner';

const columns: ColumnConfig[] = [
  { key: 'srNo', label: 'Sr. No', sortable: false, draggable: true, width: 80 },
  { key: 'sap_number', label: 'SAP ID', sortable: true, draggable: true },
  { key: 'lease_number', label: 'Unique Code', sortable: true, draggable: true },
  { key: 'property', label: 'Property Details', sortable: true, draggable: true },
  { key: 'landlord', label: 'Landlord', sortable: false, draggable: true },
  { key: 'start_date', label: 'Lease Period', sortable: true, draggable: true },
  { key: 'monthly_rent', label: 'Monthly Rent', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const MyRentals = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const [myRentals, setMyRentals] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>({
    total_properties: 0,
    total_monthly_rent: 0,
    total_security_deposits: 0,
    active_leases: 0
  });
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
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Inactive</Badge>;
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
    return matchesSearch;
  });

  // Keep these as fallback or for filtered views if needed, 
  // but we'll prioritize the summary from API for the top cards.
  const totalMonthlyRent = parseFloat(summary.total_monthly_rent || 0);
  const totalSecurityDeposit = parseFloat(summary.total_security_deposits || 0);

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        setLoading(true);
        const path = statusFilter === 'all'
          ? '/leases.json'
          : `/leases.json?status=${statusFilter}`;
        const response = await getAuth(path);
        setMyRentals(response.leases || []);
        if (response.summary) {
          setSummary(response.summary);
        }
      } catch (error) {
        console.error('Error fetching rentals:', error);
        setMyRentals([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRentals();
  }, [statusFilter]);

  /** Sr. No is positional, so it is derived from the filtered order. */
  const rentalRows = filteredRentals.map((rental, index) => ({ ...rental, srNo: index + 1 }));

  const renderCell = (rental: any, columnKey: string) => {
    switch (columnKey) {
      case 'srNo':
        return <span className="text-brand-text-light font-medium">{rental.srNo}</span>;
      case 'sap_number':
        return <div className="font-medium text-brand">{renderValue(rental.sap_number)}</div>;
      case 'lease_number':
        return <div className="font-medium text-brand-text">{renderValue(rental.lease_number)}</div>;
      case 'property':
        return (
          <div>
            <div className="font-medium text-brand-text">
              {renderValue(rental.property?.name || rental.lease_number)}
            </div>
            <div className="text-brand-body-5 text-brand-text-light flex items-center mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              {renderValue(rental.property?.address)}
            </div>
            <div className="text-brand-body-5 text-brand-text-light mt-1">
              {renderValue(rental.property?.city)} {renderValue(rental.property?.state)}
            </div>
          </div>
        );
      case 'landlord':
        return (
          <div>
            <div className="font-medium text-brand-text">
              {renderValue(rental.property?.landlord?.company_name || rental.property?.landlord?.contact_person || rental.tenant?.company_name)}
            </div>
            <div className="text-brand-body-5 text-brand-text-light flex items-center mt-1">
              <Phone className="h-3 w-3 mr-1" />
              {renderValue(rental.property?.landlord?.phone || rental.tenant?.phone)}
            </div>
            <div className="text-brand-body-5 text-brand-text-light flex items-center mt-1">
              <Mail className="h-3 w-3 mr-1" />
              {renderValue(rental.property?.landlord?.email || rental.tenant?.email)}
            </div>
          </div>
        );
      case 'start_date':
        return (
          <div className="text-brand-body-5">
            <div className="text-brand-text">
              {rental.start_date ? new Date(rental.start_date).toLocaleDateString() : 'N/A'} -
            </div>
            <div className="text-brand-text">
              {rental.end_date ? new Date(rental.end_date).toLocaleDateString() : 'N/A'}
            </div>
            <div className="text-brand-caption text-brand-text-light mt-1">
              Rent due: Day {renderValue(rental.rent_due_date)} of month
            </div>
          </div>
        );
      case 'monthly_rent':
        return (
          <span className="font-medium text-brand-text">
            ₹{parseFloat(rental.monthly_rent || rental.basic_rent || 0).toLocaleString()}
          </span>
        );
      case 'status':
        return getStatusBadge(rental.status);
      default:
        return rental[columnKey];
    }
  };

  const renderActions = (rental: any) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" title="View Details" onClick={() => handleViewDetails(rental.id)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="View Contract" onClick={() => handleEdit(String(rental.id))}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Pay Rent" onClick={() => handlePayRent(rental)}>
        <CreditCard className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button onClick={() => navigate('/rental/new')} className="fm-button-fix fm-button-brand px-6 py-2">
        <Plus className="w-4 h-4 mr-2" />
        Add Rental Agreement
      </Button>

      <TableFilterDialog
          open={isFilterOpen}
          onOpenChange={setIsFilterOpen}
          onApply={() => setStatusFilter(pendingStatus)}
          onReset={() => {
              setPendingStatus('all');
              setStatusFilter('all');
          }}
      >
          <FilterField label="Status">
              <Select value={pendingStatus} onValueChange={setPendingStatus}>
                  <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
                      <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="expiring_soon">Expiring Soon</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
              </Select>
          </FilterField>
      </TableFilterDialog>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Properties"
          value={summary.total_properties}
          icon={<Home />}
        />
        <StatsCard
          title="Monthly Rent"
          value={`₹${totalMonthlyRent.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign />}
        />
        <StatsCard
          title="Security Deposits"
          value={`₹${totalSecurityDeposit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<CreditCard />}
        />
        <StatsCard
          title="Active Leases"
          value={summary.active_leases}
          icon={<CheckCircle />}
        />
      </StatsGrid>

      <div>
        <EnhancedTable
          data={rentalRows}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(rental) => String(rental.id)}
          storageKey="my-rentals-table"
          emptyMessage="No rentals found"
          loading={loading}
          loadingMessage="Loading rentals..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by property, landlord, or address..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
              setPendingStatus(statusFilter);
              setIsFilterOpen(true);
          }}
          exportFileName="my-rentals"
          pagination={true}
          pageSize={10}
        />
      </div>

      <Dialog open={isPaymentModalOpen} onOpenChange={setIsPaymentModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-brand-body-2 font-semibold text-brand-text">Record Rent Payment</DialogTitle>
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
                <SelectTrigger className="w-full bg-white border-gray-300 text-gray-900">
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

export default MyRentals;
