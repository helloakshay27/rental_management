
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Download, Upload, FileText, FileImage, File, Eye, Folder } from 'lucide-react';

const Documents = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock data for documents
  const documents = [
    {
      id: 'DOC001',
      name: 'Rental Agreement - Sunset Apartments',
      type: 'contract',
      propertyName: 'Sunset Apartments - Unit 2A',
      landlordName: 'John Smith Properties',
      uploadDate: '2024-01-15',
      fileSize: '2.5 MB',
      fileType: 'PDF',
      downloadUrl: '#'
    },
    {
      id: 'DOC002',
      name: 'Security Deposit Receipt',
      type: 'receipt',
      propertyName: 'Sunset Apartments - Unit 2A',
      landlordName: 'John Smith Properties',
      uploadDate: '2024-01-15',
      fileSize: '0.8 MB',
      fileType: 'PDF',
      downloadUrl: '#'
    },
    {
      id: 'DOC003',
      name: 'Property Inspection Report',
      type: 'inspection',
      propertyName: 'Green Valley Villa',
      landlordName: 'Sarah Johnson Realty',
      uploadDate: '2023-08-01',
      fileSize: '15.2 MB',
      fileType: 'PDF',
      downloadUrl: '#'
    },
    {
      id: 'DOC004',
      name: 'Utility Bills - January 2024',
      type: 'bill',
      propertyName: 'City Center Office Space',
      landlordName: 'Metro Commercial',
      uploadDate: '2024-01-31',
      fileSize: '1.2 MB',
      fileType: 'PDF',
      downloadUrl: '#'
    },
    {
      id: 'DOC005',
      name: 'Property Photos - Move-in',
      type: 'photo',
      propertyName: 'Green Valley Villa',
      landlordName: 'Sarah Johnson Realty',
      uploadDate: '2023-08-01',
      fileSize: '25.8 MB',
      fileType: 'ZIP',
      downloadUrl: '#'
    },
    {
      id: 'DOC006',
      name: 'Insurance Policy',
      type: 'insurance',
      propertyName: 'Sunset Apartments - Unit 2A',
      landlordName: 'John Smith Properties',
      uploadDate: '2024-01-20',
      fileSize: '3.1 MB',
      fileType: 'PDF',
      downloadUrl: '#'
    }
  ];

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'photo':
        return <FileImage className="h-5 w-5 text-blue-600" />;
      case 'contract':
      case 'receipt':
      case 'bill':
      case 'insurance':
      case 'inspection':
        return <FileText className="h-5 w-5 text-green-600" />;
      default:
        return <File className="h-5 w-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type: string) => {
    const typeMap = {
      contract: { label: 'Contract', color: 'bg-blue-100 text-blue-800' },
      receipt: { label: 'Receipt', color: 'bg-green-100 text-green-800' },
      bill: { label: 'Bill', color: 'bg-yellow-100 text-yellow-800' },
      photo: { label: 'Photos', color: 'bg-purple-100 text-purple-800' },
      insurance: { label: 'Insurance', color: 'bg-orange-100 text-orange-800' },
      inspection: { label: 'Inspection', color: 'bg-teal-100 text-teal-800' }
    };
    
    const config = typeMap[type as keyof typeof typeMap] || { label: 'Other', color: 'bg-gray-100 text-gray-800' };
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.landlordName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const documentTypes = ['contract', 'receipt', 'bill', 'photo', 'insurance', 'inspection'];
  const totalSize = documents.reduce((sum, doc) => sum + parseFloat(doc.fileSize), 0);

  const handleViewDocument = (docId: string) => {
    console.log('Viewing document:', docId);
    // Add view document logic here
  };

  const handleDownloadDocument = (docId: string) => {
    console.log('Downloading document:', docId);
    // Add download logic here
  };

  const handleUploadDocument = () => {
    console.log('Opening upload dialog');
    // Add upload logic here
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Documents</p>
                <p className="text-heading-2 font-semibold text-gray-900">{documents.length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Contracts</p>
                <p className="text-heading-2 font-semibold text-gray-900">{documents.filter(d => d.type === 'contract').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Folder className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Photos</p>
                <p className="text-heading-2 font-semibold text-gray-900">{documents.filter(d => d.type === 'photo').length}</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                <FileImage className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-all duration-200 bg-[#f6f4ee] border border-gray-200">
          <CardContent className="p-6 bg-[#f6f4ee]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-body text-gray-600">Total Size</p>
                <p className="text-heading-2 font-semibold text-gray-900">{totalSize.toFixed(1)} MB</p>
              </div>
              <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                <File className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Card */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200 pb-6">
          <div className="flex justify-between items-center">
            <CardTitle className="text-[#1a1a1a]">Documents</CardTitle>
            <Button 
              className="bg-[#C72030] hover:bg-[#A01825]"
              onClick={handleUploadDocument}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Document
            </Button>
          </div>
        </CardHeader>
        <CardContent className="bg-white pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by document name, property, or landlord..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-[#1a1a1a] border border-gray-200"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48 bg-white text-[#1a1a1a] border border-gray-200">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="contract">Contracts</SelectItem>
                <SelectItem value="receipt">Receipts</SelectItem>
                <SelectItem value="bill">Bills</SelectItem>
                <SelectItem value="photo">Photos</SelectItem>
                <SelectItem value="insurance">Insurance</SelectItem>
                <SelectItem value="inspection">Inspection</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Documents Table */}
          <div className="border rounded-lg bg-white border-gray-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="text-[#1a1a1a] font-medium">Document</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Type</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Property</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Upload Date</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">File Info</TableHead>
                  <TableHead className="text-[#1a1a1a] font-medium">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="bg-white">
                {filteredDocuments.map((doc) => (
                  <TableRow key={doc.id} className="bg-white border-b border-gray-100">
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-3">
                        {getDocumentIcon(doc.type)}
                        <div>
                          <div className="font-medium text-[#1a1a1a]">{doc.name}</div>
                          <div className="text-xs text-[#1a1a1a]/60">ID: {doc.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">{getTypeBadge(doc.type)}</TableCell>
                    <TableCell className="bg-white">
                      <div>
                        <div className="font-medium text-[#1a1a1a]">{doc.propertyName}</div>
                        <div className="text-sm text-[#1a1a1a]/70">{doc.landlordName}</div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white text-[#1a1a1a]">{new Date(doc.uploadDate).toLocaleDateString()}</TableCell>
                    <TableCell className="bg-white">
                      <div>
                        <div className="text-sm text-[#1a1a1a]">{doc.fileType}</div>
                        <div className="text-xs text-[#1a1a1a]/60">{doc.fileSize}</div>
                      </div>
                    </TableCell>
                    <TableCell className="bg-white">
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="View Document"
                          className="text-[#C72030] hover:bg-[#C72030]/10"
                          onClick={() => handleViewDocument(doc.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          title="Download"
                          className="text-[#C72030] hover:bg-[#C72030]/10"
                          onClick={() => handleDownloadDocument(doc.id)}
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
    </div>
  );
};

export default Documents;
