
import React, { useState, useEffect } from 'react';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MaintenanceSummaryCards from './MaintenanceSummaryCards';
import MaintenanceTable from './MaintenanceTable';
import { getAuth } from '@/lib/api';

const MaintenanceRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingFilter, setPendingFilter] = useState('all');
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const data = await getAuth('/maintenance_requests.json');
        const items = data.maintenance_requests || data || [];

        // Map API response to table format
        const mappedItems = Array.isArray(items) ? items.map((item: any) => ({
          id: item.id.toString(),
          propertyName: item.site?.name || 'N/A',
          landlordName: item.site?.landlord?.name || 'N/A', // Assuming site has landlord relation
          issueType: item.issue_type,
          title: item.title,
          description: item.description,
          priority: item.priority,
          status: item.status,
          createdDate: item.created_at || new Date().toISOString(),
          assignedTo: item.assigned_to || null,
          estimatedCompletion: item.estimated_completion_date || null
        })) : [];

        setRequests(mappedItems);
      } catch (error) {
        console.error('Failed to fetch maintenance requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleViewDetails = (requestId: string) => {
    navigate(`/maintenance/${requestId}`);
  };

  const handleViewMessages = (requestId: string) => {
    console.log('Viewing messages for request:', requestId);
    // Future implementation
  };

  const handleCreateRequest = () => {
    navigate('/maintenance/new');
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.issueType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <MaintenanceSummaryCards requests={requests} />

      <div>
        <MaintenanceTable
          requests={filteredRequests}
          onFilterClick={() => {
            setPendingFilter(statusFilter);
            setIsFilterOpen(true);
          }}
          onViewDetails={handleViewDetails}
          onViewMessages={handleViewMessages}
          leftActions={
            <>
              <Button onClick={handleCreateRequest} className="fm-button-fix fm-button-brand px-6 py-2">
                <Plus className="w-4 h-4 mr-2" />
                New Request
              </Button>

              <TableFilterDialog
              open={isFilterOpen}
              onOpenChange={setIsFilterOpen}
              onApply={() => setStatusFilter(pendingFilter)}
              onReset={() => {
                setPendingFilter('all');
                setStatusFilter('all');
              }}
            >
              <FilterField label="Status">
                <Select value={pendingFilter} onValueChange={setPendingFilter}>
                  <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </FilterField>
              </TableFilterDialog>
            </>
          }
        />
      </div>
    </div>
  );
};

export default MaintenanceRequests;
