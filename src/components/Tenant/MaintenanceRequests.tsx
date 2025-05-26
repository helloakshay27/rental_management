
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Eye, MessageCircle, Clock, CheckCircle, AlertCircle, Wrench } from 'lucide-react';

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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'in-progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-blue-600" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Requests</p>
                <p className="text-heading-2 font-semibold text-gray-900">{maintenanceRequests.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Wrench className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Pending</p>
                <p className="text-heading-2 font-semibold text-gray-900">{maintenanceRequests.filter(r => r.status === 'pending').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">In Progress</p>
                <p className="text-heading-2 font-semibold text-gray-900">{maintenanceRequests.filter(r => r.status === 'in-progress').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <AlertCircle className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Completed</p>
                <p className="text-heading-2 font-semibold text-gray-900">{maintenanceRequests.filter(r => r.status === 'completed').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by title, property, or issue type..."
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
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Maintenance Requests Table */}
          <div className="border rounded-lg bg-white border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-[#1a1a1a] font-medium">Request Details</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Property</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Priority</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Assigned To</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredRequests.map((request) => (
                  <TableRow key={request.id} className="bg-white border-b border-gray-100">
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium flex items-center gap-2">
                          {getStatusIcon(request.status)}
                          {request.title}
                        </div>
                        <div className="text-sm text-[#1a1a1a]/70 mt-1">{request.issueType}</div>
                        <div className="text-xs text-[#1a1a1a]/60 mt-1">
                          Created: {new Date(request.createdDate).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium text-[#1a1a1a]">{request.propertyName}</div>
                        <div className="text-sm text-[#1a1a1a]/70">{request.landlordName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">{getPriorityBadge(request.priority)}</TableCell>
                    <TableCell className="bg-white">{getStatusBadge(request.status)}</TableCell>
                    <TableCell className="bg-white">
                      <div>
                        {request.assignedTo ? (
                          <div>
                            <div className="text-sm text-[#1a1a1a]">{request.assignedTo}</div>
                            {request.estimatedCompletion && (
                              <div className="text-xs text-[#1a1a1a]/60">
                                ETA: {new Date(request.estimatedCompletion).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#1a1a1a]/60">Not assigned</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="View Details"
                          className="text-[#C72030] hover:bg-[#C72030]/10"
                          onClick={() => handleViewDetails(request.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Messages"
                          className="text-[#C72030] hover:bg-[#C72030]/10"
                          onClick={() => handleViewMessages(request.id)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MaintenanceRequests;
