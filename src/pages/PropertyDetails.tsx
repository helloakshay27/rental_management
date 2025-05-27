import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Calendar, ArrowLeft, Edit, Trash2, FileText, Users, DollarSign, FileCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AddPropertyComplianceDialog from '@/components/Properties/AddPropertyComplianceDialog';

// Mock data - in real app this would come from API
const properties = [
  {
    id: 1,
    name: 'Mumbai Head Office',
    type: 'Office',
    location: 'Bandra Kurla Complex, Mumbai',
    area: '5,200 sq ft',
    status: 'Active',
    monthlyRent: 125000,
    leaseExpiry: '2024-07-15',
    image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400',
    description: 'Premium office space in the heart of Mumbai\'s business district.',
    owner: 'ABC Properties Ltd.',
    tenantContact: '+91 98765 43210',
    depositAmount: 375000,
    agreementDate: '2022-07-15',
  },
  {
    id: 2,
    name: 'Delhi Warehouse',
    type: 'Warehouse',
    location: 'Gurgaon, Delhi NCR',
    area: '12,000 sq ft',
    status: 'Active',
    monthlyRent: 85000,
    leaseExpiry: '2024-08-20',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400',
    description: 'Large warehouse facility with excellent connectivity.',
    owner: 'Delhi Industrial Estate',
    tenantContact: '+91 98765 43211',
    depositAmount: 255000,
    agreementDate: '2022-08-20',
  },
  {
    id: 3,
    name: 'Bangalore Tech Center',
    type: 'Office',
    location: 'Electronic City, Bangalore',
    area: '8,500 sq ft',
    status: 'Active',
    monthlyRent: 95000,
    leaseExpiry: '2024-09-10',
    image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
    description: 'Modern tech office in prime IT corridor.',
    owner: 'Bangalore Tech Parks',
    tenantContact: '+91 98765 43212',
    depositAmount: 285000,
    agreementDate: '2022-09-10',
  },
  {
    id: 4,
    name: 'Chennai Retail Store',
    type: 'Retail',
    location: 'Express Avenue, Chennai',
    area: '2,800 sq ft',
    status: 'Vacant',
    monthlyRent: 0,
    leaseExpiry: null,
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400',
    description: 'Prime retail space in popular shopping destination.',
    owner: 'Chennai Mall Properties',
    tenantContact: null,
    depositAmount: 0,
    agreementDate: null,
  },
];

// Mock compliance data for properties
const propertyCompliances = {
  1: [
    {
      id: 'PC001',
      complianceId: 'C001',
      name: 'Fire Safety NOC',
      type: 'Safety',
      status: 'Active',
      issueDate: '2023-01-15',
      expiryDate: '2025-01-15',
      renewalNotice: 30,
      daysToExpiry: 120,
      authority: 'Fire Department',
      certificateNumber: 'FS-2023-001',
      documents: ['fire-noc-2023.pdf', 'fire-safety-plan.pdf']
    },
    {
      id: 'PC002',
      complianceId: 'C002',
      name: 'Municipal Operating License',
      type: 'Operating',
      status: 'Expiring Soon',
      issueDate: '2022-06-01',
      expiryDate: '2024-06-01',
      renewalNotice: 60,
      daysToExpiry: 15,
      authority: 'Municipal Corporation',
      certificateNumber: 'MOL-2022-456',
      documents: ['operating-license-2022.pdf']
    }
  ],
  2: [
    {
      id: 'PC003',
      complianceId: 'C003',
      name: 'Environmental Clearance',
      type: 'Environmental',
      status: 'Active',
      issueDate: '2023-03-10',
      expiryDate: '2026-03-10',
      renewalNotice: 90,
      daysToExpiry: 450,
      authority: 'Pollution Control Board',
      certificateNumber: 'ENV-2023-789',
      documents: ['environmental-clearance-2023.pdf']
    }
  ]
};

const PropertyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showAddComplianceDialog, setShowAddComplianceDialog] = useState(false);
  const [compliances, setCompliances] = useState(propertyCompliances[parseInt(id || '0')] || []);
  
  const property = properties.find(p => p.id === parseInt(id || '0'));
  
  if (!property) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h1>
          <Button onClick={() => navigate('/properties')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Properties
          </Button>
        </div>
      </div>
    );
  }

  const handleAddCompliance = (complianceData: any) => {
    console.log('Adding compliance:', complianceData);
    setCompliances(prev => [...prev, complianceData]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Vacant': return 'bg-yellow-100 text-yellow-800';
      case 'Maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Expiring Soon': return 'bg-yellow-100 text-yellow-800';
      case 'Expired': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getComplianceIcon = (status: string) => {
    switch (status) {
      case 'Active': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'Expiring Soon': return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'Expired': return <AlertTriangle className="h-4 w-4 text-red-600" />;
      default: return <FileCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/properties')}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{property.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <Badge className={getStatusColor(property.status)}>
                {property.status}
              </Badge>
              <span className="text-gray-600">{property.type}</span>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline">
            <Edit className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Property Image and Basic Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-0">
              <img
                src={property.image}
                alt={property.name}
                className="w-full h-64 object-cover rounded-t-lg"
              />
              <div className="p-6">
                <p className="text-gray-600">{property.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="mr-2 h-5 w-5" />
                Property Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Area:</span>
                <span className="font-medium">{property.area}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Type:</span>
                <span className="font-medium">{property.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Owner:</span>
                <span className="font-medium">{property.owner}</span>
              </div>
              {property.status === 'Active' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Monthly Rent:</span>
                    <span className="font-medium">₹{property.monthlyRent.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Deposit:</span>
                    <span className="font-medium">₹{property.depositAmount.toLocaleString()}</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{property.location}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="compliances">Compliances</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Lease Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {property.agreementDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Agreement Date:</span>
                    <span className="font-medium">{new Date(property.agreementDate).toLocaleDateString()}</span>
                  </div>
                )}
                {property.leaseExpiry && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lease Expiry:</span>
                    <span className="font-medium">{new Date(property.leaseExpiry).toLocaleDateString()}</span>
                  </div>
                )}
                {property.tenantContact && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Contact:</span>
                    <span className="font-medium">{property.tenantContact}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="mr-2 h-4 w-4" />
                  View Agreement
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2 h-4 w-4" />
                  Payment History
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule Maintenance
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Financial details and payment history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents & Agreements</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Property documents and lease agreements will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliances">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileCheck className="mr-2 h-5 w-5" />
                  Property Compliances
                </div>
                <Button 
                  size="sm" 
                  className="bg-[#C72030] hover:bg-[#A01825]"
                  onClick={() => setShowAddComplianceDialog(true)}
                >
                  Add Compliance
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {compliances.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Compliance</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Validity</TableHead>
                      <TableHead>Authority</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {compliances.map((compliance) => (
                      <TableRow key={compliance.id}>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getComplianceIcon(compliance.status)}
                            <div>
                              <p className="font-medium">{compliance.name}</p>
                              <p className="text-sm text-gray-500">Cert: {compliance.certificateNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{compliance.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={getComplianceStatusColor(compliance.status)}>
                            {compliance.status}
                          </Badge>
                          {compliance.daysToExpiry <= compliance.renewalNotice && compliance.status !== 'Expired' && (
                            <p className="text-xs text-yellow-600 mt-1">
                              Expires in {compliance.daysToExpiry} days
                            </p>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>Issue: {new Date(compliance.issueDate).toLocaleDateString()}</p>
                            <p>Expiry: {new Date(compliance.expiryDate).toLocaleDateString()}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm">{compliance.authority}</p>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8">
                  <FileCheck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No compliances assigned to this property</p>
                  <Button 
                    className="mt-4 bg-[#C72030] hover:bg-[#A01825]"
                    onClick={() => setShowAddComplianceDialog(true)}
                  >
                    Add First Compliance
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <Card>
            <CardHeader>
              <CardTitle>Maintenance History</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Maintenance requests and history will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Compliance Dialog */}
      <AddPropertyComplianceDialog
        isOpen={showAddComplianceDialog}
        onClose={() => setShowAddComplianceDialog(false)}
        onSave={handleAddCompliance}
        propertyId={id || ''}
      />
    </div>
  );
};

export default PropertyDetails;
