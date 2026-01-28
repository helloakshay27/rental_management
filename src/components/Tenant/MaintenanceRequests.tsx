
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MaintenanceSummaryCards from './MaintenanceSummaryCards';
import MaintenanceFilters from './MaintenanceFilters';
import MaintenanceTable from './MaintenanceTable';
import { getAuth } from '@/lib/api';

const MaintenanceRequests = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <MaintenanceSummaryCards requests={requests} />

      {/* Main Content Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#1a1a1a]">Maintenance Requests</CardTitle>
            <Button
              className="bg-[#C72030] hover:bg-[#A01825]"
              onClick={handleCreateRequest}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Request
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-white pt-6">
          <MaintenanceFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <MaintenanceTable
            requests={filteredRequests}
            onViewDetails={handleViewDetails}
            onViewMessages={handleViewMessages}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceRequests;
