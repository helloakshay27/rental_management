
import React, { useState, useEffect } from 'react';
import { Panel, PanelRow, PanelRank } from '@/components/ui/panel';
import { SectionLoader } from '@/components/ui/loader';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Star, Phone, Mail } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const columns: ColumnConfig[] = [
  { key: 'vendor_name', label: 'Vendor', sortable: true, draggable: true },
  { key: 'vendor_type', label: 'Category', sortable: true, draggable: true },
  { key: 'contact', label: 'Contact', sortable: false, draggable: true },
  { key: 'rating', label: 'Rating', sortable: true, draggable: true },
  { key: 'active_contracts', label: 'Active Contracts', sortable: true, draggable: true },
  { key: 'total_value', label: 'Total Value', sortable: true, draggable: true },
];

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingCategory, setPendingCategory] = useState('all');
  const [vendors, setVendors] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 10,
    total_pages: 1,
    total_entries: 0
  });

  const fetchVendors = async (page = 1) => {
    try {
      setLoading(true);
      let url = `/vendors.json?page=${page}`;
      if (searchTerm) {
        url += `&q[vendor_name_or_vendor_code_cont]=${searchTerm}`;
      }
      if (categoryFilter !== 'all') {
        url += `&q[vendor_type_eq]=${categoryFilter}`;
      }

      const data = await getAuth(url);
      setVendors(data.vendors || []);
      setStats(data.stats || null);
      if (data.pagination) {
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching vendors:', error);
      toast.error('Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors(pagination.current_page);
  }, [pagination.current_page, categoryFilter]);

  // Server-side search: refetch from page 1 whenever the debounced term settles.
  useEffect(() => {
    const handle = setTimeout(() => {
      setPagination(prev => (prev.current_page === 1 ? prev : { ...prev, current_page: 1 }));
      fetchVendors(1);
    }, 400);
    return () => clearTimeout(handle);
  }, [searchTerm]);

  const renderCell = (vendor: any, columnKey: string) => {
    switch (columnKey) {
      case 'vendor_name':
        return (
          <div>
            <div className="text-brand-body-5 font-medium text-brand-text">{vendor.vendor_name}</div>
            <div className="text-brand-caption text-brand-text-light">{vendor.vendor_code}</div>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-1">
            <div className="flex items-center text-brand-caption text-brand-text-light">
              <Phone className="h-3 w-3 mr-1" />
              {vendor.phone}
            </div>
            <div className="flex items-center text-brand-caption text-brand-text-light">
              <Mail className="h-3 w-3 mr-1" />
              {vendor.email}
            </div>
          </div>
        );
      case 'rating':
        return (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-brand-warning fill-current" />
            <span className="text-brand-body-5 font-medium text-brand-text">
              {vendor.rating || 'N/A'}
            </span>
          </div>
        );
      case 'active_contracts':
        return vendor.amc_stats?.active_contracts || 0;
      case 'total_value':
        return (
          <span className="font-semibold text-brand-text">
            ₹{(vendor.amc_stats?.total_value || 0).toLocaleString()}
          </span>
        );
      default:
        return vendor[columnKey];
    }
  };

  const leftActions = (
    <TableFilterDialog
      open={isFilterOpen}
      onOpenChange={setIsFilterOpen}
      onApply={() => setCategoryFilter(pendingCategory)}
      onReset={() => {
        setPendingCategory('all');
        setCategoryFilter('all');
      }}
    >
      <FilterField label="Category">
        <Select value={pendingCategory} onValueChange={setPendingCategory}>
          <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="hvac">HVAC</SelectItem>
            <SelectItem value="elevators">Elevators</SelectItem>
            <SelectItem value="fire-safety">Fire Safety</SelectItem>
            <SelectItem value="security">Security</SelectItem>
            </SelectContent>
        </Select>
      </FilterField>
    </TableFilterDialog>
  );

  return (
    <div className="space-y-5">
      <div>
        <EnhancedTable
          data={vendors}
          columns={columns}
          renderCell={renderCell}
          getItemId={(vendor) => String(vendor.id)}
          storageKey="vendors-table"
          emptyMessage="No vendors found"
          loading={loading}
          loadingMessage="Loading vendors..."
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search vendors..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          leftActions={leftActions}
          onFilterClick={() => {
            setPendingCategory(categoryFilter);
            setIsFilterOpen(true);
          }}
          exportFileName="vendors"
          pagination={true}
          pageSize={pagination.per_page}
          currentPage={pagination.current_page}
          totalPages={pagination.total_pages}
          onPageChange={(page) =>
            setPagination(prev => ({ ...prev, current_page: page }))
          }
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Panel title="Top Performers" description="Highest rated vendors">
          {loading ? (
            <SectionLoader className="py-6" />
          ) : stats?.top_vendors?.length > 0 ? (
            stats.top_vendors.map((vendor: any, index: number) => (
              <PanelRow
                key={index}
                leading={<PanelRank index={index} />}
                label={vendor.name}
                hint="Top Rated"
                value={
                  <>
                    <Star className="h-4 w-4 fill-current text-brand-warning" />
                    {vendor.rating}
                  </>
                }
              />
            ))
          ) : (
            <div className="py-4 text-center text-brand-body-5 text-brand-text-light">
              No performance data
            </div>
          )}
        </Panel>

        <Panel title="Performance Metrics" description="Vendor performance statistics">
          <PanelRow label="Total Vendors" value={stats?.total_vendors || 0} />
          <PanelRow label="AMC Vendors" value={stats?.amc_vendors || 0} />
          <PanelRow
            label="Avg. Rating"
            value={
              <>
                <Star className="h-4 w-4 fill-current text-brand-warning" />
                {stats?.avg_rating || 0}
              </>
            }
          />
        </Panel>
      </div>
    </div>
  );
};

export default VendorManagement;
