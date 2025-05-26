
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import DocumentSummaryCards from './DocumentSummaryCards';
import DocumentFilters from './DocumentFilters';
import DocumentTable from './DocumentTable';

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

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.landlordName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

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
      <DocumentSummaryCards documents={documents} />

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
          <DocumentFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
          />

          <DocumentTable
            documents={filteredDocuments}
            onViewDocument={handleViewDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Documents;
