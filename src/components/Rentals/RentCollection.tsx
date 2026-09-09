
import React, { useState } from 'react';
import { StatsGrid } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Download, Send, CheckCircle, AlertCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';

const columns: ColumnConfig[] = [
  { key: 'tenantName', label: 'Tenant', sortable: true, draggable: true },
  { key: 'propertyName', label: 'Property', sortable: true, draggable: true },
  { key: 'dueDate', label: 'Due Date', sortable: true, draggable: true },
  { key: 'amount', label: 'Amount Due', sortable: true, draggable: true },
  { key: 'paidAmount', label: 'Paid Amount', sortable: true, draggable: true },
  { key: 'paidDate', label: 'Payment Date', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const RentCollection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [monthFilter, setMonthFilter] = useState('current');

  // Mock data for rent collection
  const rentRecords = [
    {
      id: 'RC001',
      tenantName: 'John Smith',
      propertyName: 'Sunset Apartments - Unit 2A',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 2500,
      paidAmount: 2500,
      paidDate: '2024-04-28',
      status: 'paid',
      paymentMethod: 'Bank Transfer',
      lateFee: 0
    },
    {
      id: 'RC002',
      tenantName: 'Sarah Johnson',
      propertyName: 'Downtown Plaza - Unit 5B',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 3200,
      paidAmount: 3200,
      paidDate: '2024-05-01',
      status: 'paid',
      paymentMethod: 'UPI',
      lateFee: 0
    },
    {
      id: 'RC003',
      tenantName: 'Mike Wilson',
      propertyName: 'Green Valley - Unit 1C',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 1800,
      paidAmount: 0,
      paidDate: null,
      status: 'overdue',
      paymentMethod: null,
      lateFee: 90
    },
    {
      id: 'RC004',
      tenantName: 'Emma Davis',
      propertyName: 'City Center - Unit 3A',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 2800,
      paidAmount: 1500,
      paidDate: '2024-05-02',
      status: 'partial',
      paymentMethod: 'Cheque',
      lateFee: 0
    },
    {
      id: 'RC005',
      tenantName: 'Alex Brown',
      propertyName: 'Riverside - Unit 4A',
      month: 'May 2024',
      dueDate: '2024-05-01',
      amount: 2200,
      paidAmount: 0,
      paidDate: null,
      status: 'pending',
      paymentMethod: null,
      lateFee: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="success" className="flex items-center gap-1 w-fit">
          <CheckCircle className="h-3 w-3" />
          Paid
        </Badge>;
      case 'overdue':
        return <Badge variant="rejected" className="flex items-center gap-1 w-fit">
          <AlertCircle className="h-3 w-3" />
          Overdue
        </Badge>;
      case 'partial':
        return <Badge variant="pending" className="flex items-center gap-1 w-fit">
          <Clock className="h-3 w-3" />
          Partial
        </Badge>;
      case 'pending':
        return <Badge variant="info" className="flex items-center gap-1 w-fit">
          <Clock className="h-3 w-3" />
          Pending
        </Badge>;
      default:
        return <Badge variant="inactive">Unknown</Badge>;
    }
  };

  const filteredRecords = rentRecords.filter(record => {
    const matchesSearch = record.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.propertyName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRent = rentRecords.reduce((sum, record) => sum + record.amount, 0);
  const collectedRent = rentRecords.reduce((sum, record) => sum + record.paidAmount, 0);
  const overdueAmount = rentRecords.filter(r => r.status === 'overdue').reduce((sum, record) => sum + record.amount, 0);
  const lateFees = rentRecords.reduce((sum, record) => sum + record.lateFee, 0);

  const renderCell = (record: typeof rentRecords[number], columnKey: string) => {
    switch (columnKey) {
      case 'tenantName':
        return <span className="font-medium">{record.tenantName}</span>;
      case 'dueDate':
        return new Date(record.dueDate).toLocaleDateString();
      case 'amount':
        return (
          <div>
            <div className="font-medium">₹{record.amount.toLocaleString()}</div>
            {record.lateFee > 0 && (
              <div className="text-brand-caption text-brand-error">+ ₹{record.lateFee} late fee</div>
            )}
          </div>
        );
      case 'paidAmount':
        return (
          <span className="font-medium">
            {record.paidAmount > 0 ? `₹${record.paidAmount.toLocaleString()}` : '-'}
          </span>
        );
      case 'paidDate':
        return record.paidDate ? new Date(record.paidDate).toLocaleDateString() : '-';
      case 'status':
        return getStatusBadge(record.status);
      default:
        return record[columnKey as keyof typeof record];
    }
  };

  const renderActions = (record: typeof rentRecords[number]) => (
    <div className="flex items-center gap-1">
      {record.status !== 'paid' && (
        <Button variant="ghost" size="sm">
          Record Payment
        </Button>
      )}
      {record.status === 'overdue' && (
        <Button variant="ghost" size="sm" title="Send reminder">
          <Send className="h-4 w-4" />
        </Button>
      )}
    </div>
  );

  const leftActions = (
    <div className="flex flex-col md:flex-row gap-2">
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
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
              </Select>
          </FilterField>
      </TableFilterDialog>
      <Select value={monthFilter} onValueChange={setMonthFilter}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Select month" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="current">May 2024</SelectItem>
          <SelectItem value="previous">April 2024</SelectItem>
          <SelectItem value="march">March 2024</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Rent Due"
          value={`₹${totalRent.toLocaleString()}`}
          icon={<DollarSign />}
        />
        <StatsCard
          title="Collected"
          value={`₹${collectedRent.toLocaleString()}`}
          icon={<CheckCircle />}
          footer={
            <p className="mt-0.5 text-brand-caption text-brand-success">
              {totalRent ? Math.round((collectedRent / totalRent) * 100) : 0}% collected
            </p>
          }
        />
        <StatsCard
          title="Overdue Amount"
          value={`₹${overdueAmount.toLocaleString()}`}
          icon={<AlertCircle />}
          footer={
            <p className="mt-0.5 text-brand-caption text-brand-error">
              {rentRecords.filter(r => r.status === 'overdue').length} properties
            </p>
          }
        />
        <StatsCard
          title="Late Fees"
          value={`₹${lateFees.toLocaleString()}`}
          icon={<TrendingUp />}
        />
      </StatsGrid>

      {/* Rent Collection Table */}
      <div>
        <EnhancedTable
          data={filteredRecords}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(record) => record.id}
          storageKey="rent-collection-table"
          emptyMessage="No rent records found"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by tenant or property..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={
            <>
              {leftActions}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send Reminders
            </Button>
            </>
          }
          onFilterClick={() => {
              setPendingStatus(statusFilter);
              setIsFilterOpen(true);
          }}
          exportFileName="rent-collection"
          pagination={true}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default RentCollection;
