
import React, { useState, useEffect } from 'react';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Eye, Edit, AlertTriangle, Plus } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const columns: ColumnConfig[] = [
  { key: 'contract_number', label: 'Contract ID', sortable: true, draggable: true },
  { key: 'service_type', label: 'Service', sortable: true, draggable: true },
  { key: 'vendor', label: 'Vendor', sortable: true, draggable: true },
  { key: 'site', label: 'Property', sortable: true, draggable: true },
  { key: 'start_date', label: 'Start Date', sortable: true, draggable: true },
  { key: 'end_date', label: 'End Date', sortable: true, draggable: true },
  { key: 'contract_value', label: 'Value', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const ContractManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [contracts, setContracts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_entries: 0
  });

  const fetchContracts = async (page = 1) => {
    try {
      setIsLoading(true);
      let url = `/amc_contracts.json?page=${page}`;

      if (statusFilter !== 'all') {
        url += `&q[status_eq]=${statusFilter}`;
      }

      if (searchTerm) {
        url += `&q[service_type_or_vendor_vendor_name_or_site_name_cont]=${searchTerm}`;
      }

      const data = await getAuth(url);

      const contractsData = data.contracts || data.amc_contracts;

      if (contractsData) {
        setContracts(contractsData);
        if (data.pagination) {
          setPagination(data.pagination);
        }
      } else if (Array.isArray(data)) {
        setContracts(data);
      } else {
        setContracts([]);
      }
    } catch (error) {
      console.error('Failed to fetch contracts:', error);
      toast.error('Failed to load AMC contracts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts(pagination.current_page);
  }, [statusFilter, pagination.current_page]);

  // Server-side search: refetch from page 1 whenever the debounced term settles.
  useEffect(() => {
    const handle = setTimeout(() => {
      setPagination(prev => (prev.current_page === 1 ? prev : { ...prev, current_page: 1 }));
      fetchContracts(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const getDaysToExpiry = (endDate: string) => {
    if (!endDate) return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const renderCell = (contract: any, columnKey: string) => {
    switch (columnKey) {
      case 'contract_number':
        return (
          <span className="font-medium text-brand-text">
            {contract.contract_number || `AMC${contract.id}`}
          </span>
        );
      case 'vendor':
        return contract.vendor?.vendor_name || contract.vendor?.name || 'N/A';
      case 'site':
        return contract.site?.name || 'N/A';
      case 'contract_value':
        return (
          <span className="font-semibold text-brand-text">
            ₹{parseFloat(contract.contract_value || 0).toLocaleString()}
          </span>
        );
      case 'status': {
        const daysToExpiry = getDaysToExpiry(contract.end_date);
        return (
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-1 rounded-full text-brand-caption font-medium capitalize ${
                contract.status === 'active'
                  ? 'bg-brand-success-bg text-brand-success'
                  : contract.status === 'expired'
                  ? 'bg-brand-error-bg text-brand-error'
                  : 'bg-brand-muted text-brand-text'
              }`}
            >
              {contract.status}
            </span>
            {daysToExpiry <= 60 && daysToExpiry > 0 && contract.status === 'active' && (
              <AlertTriangle className="h-4 w-4 text-brand-warning" />
            )}
          </div>
        );
      }
      default:
        return contract[columnKey];
    }
  };

  const renderActions = (contract: any) => (
    <div className="flex space-x-2">
      <Button
        variant="ghost"
        size="sm"
        title="View"
        onClick={() => navigate(`/amc/${contract.id}`)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Edit"
        onClick={() => navigate(`/amc/edit/${contract.id}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button onClick={() => navigate('/amc/new')} className="fm-button-fix fm-button-brand px-6 py-2">
        <Plus className="w-4 h-4 mr-2" />
        Add AMC Contract
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
                  <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
              </Select>
          </FilterField>
      </TableFilterDialog>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <EnhancedTable
          data={contracts}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(contract) => String(contract.id)}
          storageKey="amc-contracts-table"
          emptyMessage="No contracts found"
          loading={isLoading}
          loadingMessage="Loading contracts..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search contracts..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
              setPendingStatus(statusFilter);
              setIsFilterOpen(true);
          }}
          exportFileName="amc-contracts"
          pagination={true}
          pageSize={pagination.per_page}
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={(page) =>
            setPagination(prev => ({ ...prev, current_page: page }))
          }
        />
      </div>
    </div>
  );
};

export default ContractManagement;
