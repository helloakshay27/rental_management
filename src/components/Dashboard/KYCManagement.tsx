
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Upload, FileText, CheckCircle, AlertTriangle, Clock, Eye, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const kycData = [
  {
    id: 1,
    tenantName: 'TechCorp Solutions',
    property: 'Mumbai Corporate Tower',
    status: 'completed',
    completionDate: '2024-01-15',
    documents: {
      aadhar: { status: 'verified', uploadDate: '2024-01-10' },
      pan: { status: 'verified', uploadDate: '2024-01-10' },
      bankStatement: { status: 'verified', uploadDate: '2024-01-12' },
      salarySlip: { status: 'verified', uploadDate: '2024-01-12' },
      addressProof: { status: 'verified', uploadDate: '2024-01-11' }
    }
  },
  {
    id: 2,
    tenantName: 'Global Industries',
    property: 'Delhi Business Park',
    status: 'pending',
    completionDate: null,
    documents: {
      aadhar: { status: 'verified', uploadDate: '2024-01-20' },
      pan: { status: 'verified', uploadDate: '2024-01-20' },
      bankStatement: { status: 'pending', uploadDate: null },
      salarySlip: { status: 'rejected', uploadDate: '2024-01-22' },
      addressProof: { status: 'verified', uploadDate: '2024-01-21' }
    }
  },
  {
    id: 3,
    tenantName: 'Innovation Labs',
    property: 'Bangalore Tech Hub',
    status: 'in_progress',
    completionDate: null,
    documents: {
      aadhar: { status: 'verified', uploadDate: '2024-01-25' },
      pan: { status: 'pending', uploadDate: null },
      bankStatement: { status: 'pending', uploadDate: null },
      salarySlip: { status: 'pending', uploadDate: null },
      addressProof: { status: 'verified', uploadDate: '2024-01-25' }
    }
  }
];

const KYCManagement = () => {
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getDocumentStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge className="bg-green-100 text-green-800">Verified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Not Uploaded</Badge>;
    }
  };

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
    setIsDialogOpen(true);
  };

  const handleFileUpload = (documentType) => {
    toast({
      title: "File Upload",
      description: `${documentType} document uploaded successfully.`,
    });
  };

  const completedKYC = kycData.filter(item => item.status === 'completed').length;
  const pendingKYC = kycData.filter(item => item.status === 'pending' || item.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total KYC Records</p>
                <p className="text-2xl font-bold text-[#C72030]">{kycData.length}</p>
              </div>
              <FileText className="h-8 w-8 text-[#C72030]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed KYC</p>
                <p className="text-2xl font-bold text-green-600">{completedKYC}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending KYC</p>
                <p className="text-2xl font-bold text-yellow-600">{pendingKYC}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-[#C72030]">{((completedKYC / kycData.length) * 100).toFixed(0)}%</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-[#C72030]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Records Table */}
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-[#1a1a1a]">KYC Status Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {kycData.map((tenant) => (
              <div key={tenant.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{tenant.tenantName}</h4>
                    <p className="text-sm text-gray-600">Property: {tenant.property}</p>
                    {tenant.completionDate && (
                      <p className="text-xs text-gray-500">Completed: {new Date(tenant.completionDate).toLocaleDateString()}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(tenant.status)}
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(tenant)}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
                
                {/* Document Status Quick View */}
                <div className="mt-3 grid grid-cols-5 gap-2">
                  {Object.entries(tenant.documents).map(([docType, doc]) => (
                    <div key={docType} className="text-center">
                      <p className="text-xs text-gray-500 capitalize">{docType.replace(/([A-Z])/g, ' $1')}</p>
                      {getDocumentStatusBadge(doc.status)}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KYC Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              KYC Details - {selectedTenant?.tenantName}
            </DialogTitle>
          </DialogHeader>
          
          {selectedTenant && (
            <Tabs defaultValue="documents" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="documents">Documents</TabsTrigger>
                <TabsTrigger value="upload">Upload New</TabsTrigger>
              </TabsList>
              
              <TabsContent value="documents" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {Object.entries(selectedTenant.documents).map(([docType, doc]) => (
                    <Card key={docType} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium capitalize">{docType.replace(/([A-Z])/g, ' $1')}</h4>
                            {doc.uploadDate && (
                              <p className="text-sm text-gray-500">Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {getDocumentStatusBadge(doc.status)}
                            {doc.status === 'verified' && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="upload" className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  {['Aadhar Card', 'PAN Card', 'Bank Statement', 'Salary Slip', 'Address Proof'].map((docType) => (
                    <Card key={docType} className="border border-gray-200">
                      <CardContent className="p-4">
                        <div className="space-y-2">
                          <Label htmlFor={docType.toLowerCase().replace(' ', '_')}>{docType}</Label>
                          <div className="flex items-center gap-2">
                            <Input 
                              type="file" 
                              id={docType.toLowerCase().replace(' ', '_')}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="flex-1"
                            />
                            <Button 
                              size="sm" 
                              onClick={() => handleFileUpload(docType)}
                              className="bg-[#C72030] hover:bg-[#A01825]"
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Upload
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KYCManagement;
