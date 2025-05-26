import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Eye, Edit, FileText, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AgreementDetailsDialog from './AgreementDetailsDialog';

const RentalAgreements = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAgreement, setSelectedAgreement] = useState(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
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
        return <Badge variant="accepted">Active</Badge>;
      case 'expiring':
        return <Badge variant="warning">Expiring Soon</Badge>;
      case 'terminated':
        return <Badge variant="rejected">Terminated</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const filteredAgreements = agreements.filter(agreement => {
    const matchesSearch = agreement.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agreement.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || agreement.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (agreement) => {
    setSelectedAgreement(agreement);
    setIsDetailsDialogOpen(true);
  };

  const handleEditAgreement = (agreement) => {
    toast({
      title: "Edit Agreement",
      description: `Opening edit form for agreement ${agreement.id}`,
    });
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
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200" onClick={() => handleSummaryCardClick('all')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Agreements</p>
                <p className="text-heading-2 font-semibold text-gray-900">{agreements.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200" onClick={() => handleSummaryCardClick('active')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Active Leases</p>
                <p className="text-heading-2 font-semibold text-gray-900">{agreements.filter(a => a.status === 'active').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-success/10 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-success"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200" onClick={() => handleSummaryCardClick('expiring')}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Expiring Soon</p>
                <p className="text-heading-2 font-semibold text-gray-900">{agreements.filter(a => a.status === 'expiring').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-warning/10 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-warning"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-card-hover transition-all duration-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Monthly Revenue</p>
                <p className="text-heading-2 font-semibold text-gray-900">₹{agreements.filter(a => a.status === 'active').reduce((sum, a) => sum + a.monthlyRent, 0).toLocaleString()}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <div className="h-6 w-6 rounded-full bg-primary"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Rental Agreements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by tenant, property, or agreement ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent className="bg-white border-tertiary-1 shadow-dropdown">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expiring">Expiring Soon</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Agreements Table */}
          <div className="border border-tertiary-1 rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Agreement ID</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Lease Period</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAgreements.map((agreement) => (
                  <TableRow key={agreement.id} className="hover:bg-base-white">
                    <TableCell className="font-medium">{agreement.id}</TableCell>
                    <TableCell>{agreement.propertyName}</TableCell>
                    <TableCell>{agreement.tenantName}</TableCell>
                    <TableCell>
                      <div className="text-body">
                        <div>{new Date(agreement.startDate).toLocaleDateString()} -</div>
                        <div>{new Date(agreement.endDate).toLocaleDateString()}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">₹{agreement.monthlyRent.toLocaleString()}</TableCell>
                    <TableCell>{getStatusBadge(agreement.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleViewDetails(agreement)}
                          className="hover:bg-primary/10 hover:text-primary"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleEditAgreement(agreement)}
                          className="hover:bg-success/10 hover:text-success-foreground"
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

      <AgreementDetailsDialog 
        agreement={selectedAgreement}
        open={isDetailsDialogOpen}
        onOpenChange={setIsDetailsDialogOpen}
      />
    </div>
  );
};

export default RentalAgreements;
