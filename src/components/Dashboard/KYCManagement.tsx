
import React, { useState } from 'react';
import { StatsGrid } from '@/components/ui/page';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus, Upload, FileText, CheckCircle, AlertCircle, Clock, User, Building } from 'lucide-react';

interface KYCDocument {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  size: string;
}

interface KYCProfile {
  id: string;
  tenantName: string;
  property: string;
  completionPercentage: number;
  status: 'complete' | 'incomplete' | 'under_review';
  lastUpdated: string;
  documents: KYCDocument[];
  personalInfo: {
    aadhar: string;
    pan: string;
    phone: string;
    email: string;
  };
}

const profileColumns: ColumnConfig[] = [
  { key: 'tenantName', label: 'Tenant', sortable: true, draggable: true },
  { key: 'property', label: 'Property', sortable: true, draggable: true },
  { key: 'completionPercentage', label: 'Progress', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
  { key: 'lastUpdated', label: 'Last Updated', sortable: true, draggable: true },
];

const KYCManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState('all');

  const kycProfiles: KYCProfile[] = [
    {
      id: 'KYC-001',
      tenantName: 'TechCorp Solutions',
      property: 'Sunset Apartments - 2A',
      completionPercentage: 95,
      status: 'complete',
      lastUpdated: '2024-01-15',
      personalInfo: {
        aadhar: '1234-5678-9012',
        pan: 'ABCDE1234F',
        phone: '+91 98765 43210',
        email: 'contact@techcorp.com'
      },
      documents: [
        { id: 'doc1', name: 'Aadhar Card.pdf', type: 'identity', status: 'approved', uploadDate: '2024-01-10', size: '2.1 MB' },
        { id: 'doc2', name: 'PAN Card.pdf', type: 'identity', status: 'approved', uploadDate: '2024-01-10', size: '1.8 MB' },
        { id: 'doc3', name: 'Bank Statement.pdf', type: 'financial', status: 'approved', uploadDate: '2024-01-12', size: '5.2 MB' },
        { id: 'doc4', name: 'GST Certificate.pdf', type: 'business', status: 'pending', uploadDate: '2024-01-15', size: '1.5 MB' }
      ]
    },
    {
      id: 'KYC-002',
      tenantName: 'Green Valley Enterprises',
      property: 'Business Plaza - Floor 3',
      completionPercentage: 78,
      status: 'under_review',
      lastUpdated: '2024-01-18',
      personalInfo: {
        aadhar: '2345-6789-0123',
        pan: 'BCDEF2345G',
        phone: '+91 87654 32109',
        email: 'admin@greenvalley.com'
      },
      documents: [
        { id: 'doc5', name: 'Aadhar Card.pdf', type: 'identity', status: 'approved', uploadDate: '2024-01-15', size: '2.3 MB' },
        { id: 'doc6', name: 'PAN Card.pdf', type: 'identity', status: 'approved', uploadDate: '2024-01-15', size: '1.9 MB' },
        { id: 'doc7', name: 'Bank Statement.pdf', type: 'financial', status: 'rejected', uploadDate: '2024-01-16', size: '4.8 MB' },
        { id: 'doc8', name: 'MOA Certificate.pdf', type: 'business', status: 'pending', uploadDate: '2024-01-18', size: '3.2 MB' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge className="bg-green-100 text-green-700">Complete</Badge>;
      case 'incomplete':
        return <Badge className="bg-red-100 text-red-700">Incomplete</Badge>;
      case 'under_review':
        return <Badge className="bg-yellow-100 text-yellow-700">Under Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const getDocumentStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const filteredProfiles = kycProfiles.filter(profile => {
    const matchesSearch = profile.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         profile.property.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || profile.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const renderProfileCell = (profile: KYCProfile, columnKey: string) => {
    switch (columnKey) {
      case 'tenantName':
        return (
          <div>
            <p className="font-medium">{profile.tenantName}</p>
            <p className="text-brand-body-5 text-brand-text-light">{profile.personalInfo.email}</p>
          </div>
        );
      case 'completionPercentage':
        return (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-brand-body-5">{profile.completionPercentage}%</span>
            </div>
            <Progress value={profile.completionPercentage} className="w-24" />
          </div>
        );
      case 'status':
        return getStatusBadge(profile.status);
      default:
        return profile[columnKey as keyof KYCProfile] as React.ReactNode;
    }
  };

  const renderProfileActions = () => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm">View</Button>
      <Button variant="ghost" size="sm">Review</Button>
    </div>
  );

  const profileLeftActions = (
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
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="incomplete">Incomplete</SelectItem>
            <SelectItem value="under_review">Under Review</SelectItem>
          </SelectContent>
        </Select>
      </FilterField>
    </TableFilterDialog>
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard title="Total Profiles" value={156} icon={<User />} />
        <StatsCard title="Complete KYC" value={142} icon={<CheckCircle />} />
        <StatsCard title="Under Review" value={8} icon={<Clock />} />
        <StatsCard title="Incomplete" value={6} icon={<AlertCircle />} />
      </StatsGrid>

      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profiles">
            <User className="h-4 w-4 mr-2" />
            KYC Profiles
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Document Review
          </TabsTrigger>
          <TabsTrigger value="compliance">
            <Building className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <Card className="bg-white">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>KYC Profiles</CardTitle>
                  <CardDescription>Manage tenant KYC documentation and compliance</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="fm-button-fix fm-button-brand px-6 py-2">
                      <Plus className="h-4 w-4 mr-2" />
                      New KYC Profile
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                      <DialogTitle>Create KYC Profile</DialogTitle>
                      <DialogDescription>Initialize KYC process for new tenant</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="tenantName">Tenant Name</Label>
                        <Input id="tenantName" placeholder="Enter tenant name" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property">Property</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="sunset">Sunset Apartments - 2A</SelectItem>
                            <SelectItem value="plaza">Business Plaza - Floor 3</SelectItem>
                            <SelectItem value="tower">Tech Tower - Suite 401</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Enter phone number" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="aadhar">Aadhar Number</Label>
                        <Input id="aadhar" placeholder="Enter Aadhar number" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pan">PAN Number</Label>
                        <Input id="pan" placeholder="Enter PAN number" className="bg-white" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
                      <Button className="fm-button-fix fm-button-brand px-6 py-2">Create Profile</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <EnhancedTable
                data={filteredProfiles}
                columns={profileColumns}
                renderCell={renderProfileCell}
                renderActions={renderProfileActions}
                getItemId={(profile) => String(profile.id)}
                storageKey="kyc-profiles-table"
                emptyMessage="No KYC profiles found"
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                searchPlaceholder="Search tenants..."
                disableClientSearch={true}
                enableSearch={true}
                enableSelection={false}
                leftActions={profileLeftActions}
                onFilterClick={() => {
                  setPendingStatus(statusFilter);
                  setIsFilterOpen(true);
                }}
                exportFileName="kyc-profiles"
                pagination={true}
                pageSize={10}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Document Review Queue</CardTitle>
              <CardDescription>Review and approve submitted documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {kycProfiles.map((profile) =>
                  profile.documents
                    .filter(doc => doc.status === 'pending')
                    .map((document) => (
                      <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-4">
                          {getDocumentStatusIcon(document.status)}
                          <div>
                            <p className="font-medium">{document.name}</p>
                            <p className="text-sm text-gray-500">
                              {profile.tenantName} • {profile.property}
                            </p>
                            <p className="text-sm text-gray-500">
                              Uploaded: {document.uploadDate} • {document.size}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                          <Button variant="outline" size="sm" className="text-red-600">
                            Reject
                          </Button>
                          <Button size="sm" className="fm-button-fix fm-button-brand px-6 py-2">
                            Approve
                          </Button>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Overview</CardTitle>
              <CardDescription>Monitor KYC compliance across all properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-brand-h2 font-bold text-green-600 mb-2">91.0%</div>
                  <p className="text-sm text-gray-600">Overall Compliance Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-brand-h2 font-bold text-yellow-600 mb-2">8</div>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-brand-h2 font-bold text-red-600 mb-2">6</div>
                  <p className="text-sm text-gray-600">Non-compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KYCManagement;
