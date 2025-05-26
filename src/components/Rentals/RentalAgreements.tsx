
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Edit, FileText, Download, CheckCircle, Clock, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EditableAgreementDialog from './EditableAgreementDialog';

const RentalAgreements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

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
      leaseType: 'Annual'
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
      leaseType: 'Annual'
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
      leaseType: 'Annual'
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
      leaseType: 'Short-term'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case 'expiring':
        return <Badge className="bg-orange-100 text-orange-800 border-orange-200">Expiring Soon</Badge>;
      case 'terminated':
        return <Badge className="bg-red-100 text-red-800 border-red-200">Terminated</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Unknown</Badge>;
    }
  };

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewEdit = (agreement) => {
    setSelectedAgreement(agreement);
    setIsEditDialogOpen(true);
  };

  const handleDownloadAgreement = (agreement) => {
    toast({
      title: "Download Started",
      description: `Downloading agreement ${agreement.id}`,
    });
  };

  const handleSummaryCardClick = (filterType) => {
    setStatusFilter(filterType);
    toast({
      title: "Filter Applied",
      description: `Showing ${filterType === 'all' ? 'all' : filterType} agreements`,
    });
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200" onClick={() => handleSummaryCardClick('all')}>
          <CardContent className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Agreements</p>
                <p className="text-heading-2 font-semibold text-gray-900">{agreements.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#E74C3C]/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-[#E74C3C]" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200" onClick={() => handleSummaryCardClick('active')}>
          <CardContent className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Active Leases</p>
                <p className="text-heading-2 font-semibold text-gray-900">{agreements.filter(a => a.status === 'active').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200" onClick={() => handleSummaryCardClick('expiring')}>
          <CardContent className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Expiring Soon</p>
                <p className="text-heading-2 font-semibold text-gray-900">{agreements.filter(a => a.status === 'expiring').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-white border border-gray-200">
          <CardContent className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Monthly Revenue</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{agreements.filter(a => a.status === 'active').reduce((sum, a) => sum + a.monthlyRent, 0).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-[#E74C3C]/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-[#E74C3C]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="text-[#1a1a1a]">Rental Agreements</CardTitle>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by tenant, property, or agreement ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border-gray-200"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white border-gray-200">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agreements Table */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-[#1a1a1a] font-medium">Agreement ID</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Property</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Tenant</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Lease Period</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Monthly Rent</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Status</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id} className="hover:bg-gray-50 bg-white border-b border-gray-100">
                    <TableCell className="font-medium bg-white">{agreement.id}</TableCell>
                    <TableCell className="bg-white">{agreement.propertyName}</TableCell>
                    <TableCell className="bg-white">{agreement.tenantName}</TableCell>
                    <TableCell className="bg-white">
                      <div className="text-body">
                        <div>{new Date(agreement.startDate).toLocaleDateString()} -</div>
                        <div>{new Date(agreement.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium bg-white">₹{agreement.monthlyRent.toLocaleString()}</TableCell>
                    <TableCell className="bg-white">{getStatusBadge(agreement.status)}</TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewEdit(agreement)}
                          className="hover:bg-[#E74C3C]/10 hover:text-[#E74C3C]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewEdit(agreement)}
                          className="hover:bg-green-50 hover:text-green-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleDownloadAgreement(agreement)}
                          className="hover:bg-gray-50"
                        >
                          <Download className="h-4 w-4" />
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

      <EditableAgreementDialog 
        agreement={selectedAgreement}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </div>
  );
};

export default RentalAgreements;
