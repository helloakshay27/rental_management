
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Search, Plus, Upload, FileText, CheckCircle, AlertCircle, Clock, User, Building } from 'lucide-react';

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

const KYCManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-[#C72030]" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-gray-600">Total Profiles</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">142</p>
                <p className="text-sm text-gray-600">Complete KYC</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-gray-600">Under Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">6</p>
                <p className="text-sm text-gray-600">Incomplete</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profiles" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="profiles" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <User className="h-4 w-4 mr-2" />
            KYC Profiles
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Document Review
          </TabsTrigger>
          <TabsTrigger value="compliance" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <Building className="h-4 w-4 mr-2" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profiles" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>KYC Profiles</CardTitle>
                  <CardDescription>Manage tenant KYC documentation and compliance</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#C72030] hover:bg-[#A01825]">
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
                      <Button className="bg-[#C72030] hover:bg-[#A01825]">Create Profile</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search tenants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="incomplete">Incomplete</SelectItem>
                    <SelectItem value="under_review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProfiles.map((profile) => (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{profile.tenantName}</p>
                          <p className="text-sm text-gray-500">{profile.personalInfo.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{profile.property}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="text-sm">{profile.completionPercentage}%</span>
                          </div>
                          <Progress value={profile.completionPercentage} className="w-24" />
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(profile.status)}</TableCell>
                      <TableCell>{profile.lastUpdated}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            Review
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
                          <Button size="sm" className="bg-[#C72030] hover:bg-[#A01825]">
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
                  <div className="text-3xl font-bold text-green-600 mb-2">91.0%</div>
                  <p className="text-sm text-gray-600">Overall Compliance Rate</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">8</div>
                  <p className="text-sm text-gray-600">Pending Reviews</p>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">6</div>
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
