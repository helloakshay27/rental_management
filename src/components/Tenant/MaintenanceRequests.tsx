
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import MaintenanceSummaryCards from './MaintenanceSummaryCards';
import MaintenanceFilters from './MaintenanceFilters';
import MaintenanceTable from './MaintenanceTable';

const MaintenanceRequests = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock data for maintenance requests
  const maintenanceRequests = [
    {
      id: 'MR001',
      propertyName: 'Sunset Apartments - Unit 2A',
      landlordName: 'John Smith Properties',
      issueType: 'Plumbing',
      title: 'Kitchen sink faucet leaking',
      description: 'The kitchen sink faucet has been leaking for the past few days. Water is dripping continuously.',
      priority: 'medium',
      status: 'in-progress',
      createdDate: '2024-01-20',
      assignedTo: 'ABC Plumbing Services',
      estimatedCompletion: '2024-01-25'
    },
    {
      id: 'MR002',
      propertyName: 'Green Valley Villa',
      landlordName: 'Sarah Johnson Realty',
      issueType: 'Electrical',
      title: 'Living room lights not working',
      description: 'All lights in the living room stopped working suddenly. Seems like a wiring issue.',
      priority: 'high',
      status: 'pending',
      createdDate: '2024-01-22',
      assignedTo: null,
      estimatedCompletion: null
    },
    {
      id: 'MR003',
      propertyName: 'City Center Office Space',
      landlordName: 'Metro Commercial',
      issueType: 'HVAC',
      title: 'Air conditioning not cooling properly',
      description: 'The central AC is running but not cooling the space effectively. Temperature remains high.',
      priority: 'high',
      status: 'pending',
      createdDate: '2024-01-23',
      assignedTo: null,
      estimatedCompletion: null
    },
    {
      id: 'MR004',
      propertyName: 'Sunset Apartments - Unit 2A',
      landlordName: 'John Smith Properties',
      issueType: 'General',
      title: 'Balcony door handle broken',
      description: 'The balcony door handle is broken and the door is difficult to open/close.',
      priority: 'low',
      status: 'completed',
      createdDate: '2024-01-10',
      assignedTo: 'XYZ Maintenance',
      estimatedCompletion: '2024-01-15'
    }
  ];

  const handleViewDetails = (requestId: string) => {
    console.log('Viewing details for request:', requestId);
    // Add view details logic here
  };

  const handleViewMessages = (requestId: string) => {
    console.log('Viewing messages for request:', requestId);
    // Add messages logic here
  };

  const handleCreateRequest = () => {
    console.log('Creating new maintenance request');
    // Add create request logic here
  };

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.issueType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <MaintenanceSummaryCards requests={maintenanceRequests} />

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
