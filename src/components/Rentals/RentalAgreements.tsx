import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsGrid } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Eye, Edit, FileText, Download, CheckCircle, Clock, DollarSign, Plus } from 'lucide-react';
import { toast } from 'sonner';
import EditableAgreementDialog from './EditableAgreementDialog';

const columns: ColumnConfig[] = [
  { key: 'srNo', label: 'Sr. No', sortable: false, draggable: true, width: 80 },
  { key: 'sap_number', label: 'SAP ID', sortable: true, draggable: true },
  { key: 'id', label: 'Agreement ID', sortable: true, draggable: true },
  { key: 'propertyName', label: 'Property', sortable: true, draggable: true },
  { key: 'tenantName', label: 'Tenant', sortable: true, draggable: true },
  { key: 'startDate', label: 'Lease Period', sortable: true, draggable: true },
  { key: 'monthlyRent', label: 'Monthly Rent', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const RentalAgreements = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Mock data for rental agreements
  const agreements = [
    {
      id: 'RA001',
      propertyName: 'Sunset Apartments - Unit 2A',
      tenantName: 'John Smith',
      startDate: '2024-01-15',
      endDate: '2024-12-31',
      monthlyRent: 2500,
      status: 'active',
      securityDeposit: 5000,
      leaseType: 'Annual',
      sap_number: 'SAP000013'
    },
    {
      id: 'RA002',
      propertyName: 'Downtown Plaza - Unit 5B',
      tenantName: 'Sarah Johnson',
      startDate: '2024-03-01',
      endDate: '2025-02-28',
      monthlyRent: 3200,
      status: 'active',
      securityDeposit: 6400,
      leaseType: 'Annual',
      sap_number: 'SAP000014'
    },
    {
      id: 'RA003',
      propertyName: 'Green Valley - Unit 1C',
      tenantName: 'Mike Wilson',
      startDate: '2023-06-01',
      endDate: '2024-05-31',
      monthlyRent: 1800,
      status: 'expiring',
      securityDeposit: 3600,
      leaseType: 'Annual',
      sap_number: 'SAP000015'
    },
    {
      id: 'RA004',
      propertyName: 'City Center - Unit 3A',
      tenantName: 'Emma Davis',
      startDate: '2024-02-01',
      endDate: '2024-07-31',
      monthlyRent: 2800,
      status: 'terminated',
      securityDeposit: 5600,
      leaseType: 'Short-term',
      sap_number: 'SAP000016'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="success">Active</Badge>;
      case 'inactive':
        return <Badge variant="rejected">Inactive</Badge>;
      case 'expiring':
        return <Badge variant="warning">Expiring Soon</Badge>;
      case 'terminated':
        return <Badge variant="rejected">Terminated</Badge>;
      default:
        return <Badge variant="inactive">Unknown</Badge>;
    }
  };

  const filteredAgreements = agreements
    .filter(agreement => {
      const matchesSearch = agreement.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agreement.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (agreement.sap_number && agreement.sap_number.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    // Sr. No is positional, so it is derived after filtering rather than from the source row.
    .map((agreement, index) => ({ ...agreement, srNo: index + 1 }));

  const handleViewEdit = (agreement) => {
    setSelectedAgreement(agreement);
    setIsEditDialogOpen(true);
  };

  const handleDownloadAgreement = (agreement) => {
    toast.success("Download Started", {
      description: `Downloading agreement ${agreement.id}`,
    });
  };

  const handleSummaryCardClick = (filterType) => {
    setStatusFilter(filterType);
    toast.success("Filter Applied", {
      description: `Showing ${filterType === 'all' ? 'all' : filterType} agreements`,
    });
  };

  const renderCell = (agreement: typeof filteredAgreements[number], columnKey: string) => {
    switch (columnKey) {
      case 'srNo':
        return <span className="text-brand-text-light font-medium">{agreement.srNo}</span>;
      case 'sap_number':
        return <span className="font-medium text-brand">{agreement.sap_number || 'N/A'}</span>;
      case 'id':
        return <span className="font-medium">{agreement.id}</span>;
      case 'startDate':
        return (
          <div className="text-brand-body-4">
            <div>{new Date(agreement.startDate).toLocaleDateString()} -</div>
            <div>{new Date(agreement.endDate).toLocaleDateString()}</div>
          </div>
        );
      case 'monthlyRent':
        return <span className="font-medium">₹{agreement.monthlyRent.toLocaleString()}</span>;
      case 'status':
        return getStatusBadge(agreement.status);
      default:
        return agreement[columnKey as keyof typeof agreement];
    }
  };

  const renderActions = (agreement: typeof filteredAgreements[number]) => (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" title="View" onClick={() => handleViewEdit(agreement)}>
        <Eye className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Edit" onClick={() => handleViewEdit(agreement)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Download" onClick={() => handleDownloadAgreement(agreement)}>
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <>
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
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
                </SelectContent>
            </Select>
        </FilterField>
    </TableFilterDialog>
    </>
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard
          title="Total Agreements"
          value={agreements.length}
          icon={<FileText />}
          selected={statusFilter === 'all'}
          onClick={() => handleSummaryCardClick('all')}
        />
        <StatsCard
          title="Active Leases"
          value={agreements.filter(a => a.status === 'active').length}
          icon={<CheckCircle />}
          selected={statusFilter === 'active'}
          onClick={() => handleSummaryCardClick('active')}
        />
        <StatsCard
          title="Expiring Soon"
          value={agreements.filter(a => a.status === 'expiring').length}
          icon={<Clock />}
          selected={statusFilter === 'expiring'}
          onClick={() => handleSummaryCardClick('expiring')}
        />
        <StatsCard
          title="Monthly Revenue"
          value={`₹${agreements
            .filter(a => a.status === 'active')
            .reduce((sum, a) => sum + a.monthlyRent, 0)
            .toLocaleString()}`}
          icon={<DollarSign />}
        />
      </StatsGrid>

      {/* Agreements Table */}
      <div>
        <EnhancedTable
          data={filteredAgreements}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(agreement) => agreement.id}
          storageKey="rental-agreements-table"
          emptyMessage="No agreements found"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by tenant, property, or agreement ID..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
              setPendingStatus(statusFilter);
              setIsFilterOpen(true);
          }}
          exportFileName="rental-agreements"
          pagination={true}
          pageSize={10}
        />
      </div>

      <EditableAgreementDialog
        agreement={selectedAgreement}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default RentalAgreements;
