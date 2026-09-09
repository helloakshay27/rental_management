
import React, { useState, useEffect } from 'react';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Button } from '@/components/ui/button';
import { Eye, Edit, Zap, Plus } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const columns: ColumnConfig[] = [
  { key: 'utility_type', label: 'Type', sortable: true, draggable: true },
  { key: 'provider', label: 'Provider', sortable: true, draggable: true },
  { key: 'meter_number', label: 'Meter No.', sortable: true, draggable: true },
  { key: 'monthly_cost', label: 'Est. Cost', sortable: true, draggable: true },
  { key: 'is_active', label: 'Status', sortable: true, draggable: true },
];

const BillManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');
  const [utilities, setUtilities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUtilities = async () => {
      try {
        setIsLoading(true);
        const res = await getAuth('/utilities.json');
        // The API returns { utilities: [...] } or just [...]
        const data = res?.utilities || res || [];
        setUtilities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to fetch utilities:', error);
        toast.error('Failed to load utilities');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUtilities();
  }, []);

  const filteredUtilities = utilities.filter(utility => {
    const matchesSearch =
      utility.provider?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utility.utility_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      utility.meter_number?.toLowerCase().includes(searchTerm.toLowerCase());

    // For now, 'status' isn't explicitly on the utility model other than is_active
    // We can map 'active'/'inactive' to statusFilter if desired, or assume 'all' for now
    // If utility has a status field, we would use it here.
    const matchesStatus = statusFilter === 'all' ||
      (statusFilter === 'active' && utility.is_active) ||
      (statusFilter === 'inactive' && !utility.is_active);

    return matchesSearch && matchesStatus;
  });

  const renderCell = (utility: any, columnKey: string) => {
    switch (columnKey) {
      case 'utility_type':
        return <span className="font-medium text-brand-text">{utility.utility_type}</span>;
      case 'meter_number':
        return utility.meter_number || '-';
      case 'monthly_cost':
        return (
          <span className="font-semibold text-brand-text">
            ₹{utility.monthly_cost?.toLocaleString()}
          </span>
        );
      case 'is_active':
        return (
          <span
            className={`px-2 py-1 rounded-full text-brand-caption font-medium ${
              utility.is_active
                ? 'bg-brand-success-bg text-brand-success'
                : 'bg-brand-muted text-brand-text'
            }`}
          >
            {utility.is_active ? 'Active' : 'Inactive'}
          </span>
        );
      default:
        return utility[columnKey];
    }
  };

  const renderActions = (utility: any) => (
    <div className="flex justify-end space-x-2">
      <Button
        variant="ghost"
        size="sm"
        title="View"
        onClick={() => navigate(`/utilities/${utility.id}`)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        title="Edit"
        onClick={() => navigate(`/utilities/edit/${utility.id}`)}
      >
        <Edit className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <div className="flex items-center gap-2">
      <Button
        onClick={() => navigate('/utilities/new')}
        className="fm-button-fix fm-button-brand px-6 py-2"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Utility
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
          data={filteredUtilities}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(utility) => String(utility.id)}
          storageKey="utilities-table"
          emptyMessage="No utilities found."
          loading={isLoading}
          loadingMessage="Loading utilities..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search provider, type, meter number..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
              setPendingStatus(statusFilter);
              setIsFilterOpen(true);
          }}
          exportFileName="utilities"
          pagination={true}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default BillManagement;
