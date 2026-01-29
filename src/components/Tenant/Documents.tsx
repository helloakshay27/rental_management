
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { getAuth, postAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import DocumentSummaryCards from './DocumentSummaryCards';
import DocumentFilters from './DocumentFilters';
import DocumentTable from './DocumentTable';
import DocumentUploadDialog from './DocumentUploadDialog';

interface DocumentsProps {
  mode?: 'default' | 'compliance';
}

const Documents = ({ mode = 'default' }: DocumentsProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(mode === 'compliance' ? 'compliance' : 'all');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [complianceDocs, setComplianceDocs] = useState<any[]>([]);

  useEffect(() => {
    if (mode === 'compliance') {
      fetchComplianceDocuments();
    }
  }, [mode]);

  const fetchComplianceDocuments = async () => {
    try {
      setIsLoading(true);
      const data = await getAuth('/property_compliances.json');
      if (Array.isArray(data)) {
        // Map API data to Document structure expected by Table
        const mappedDocs = data.map(item => ({
          id: item.id?.toString() || 'N/A',
          name: item.document_name || 'Unnamed Document',
          type: 'compliance',
          propertyName: item.site?.name || 'N/A',
          landlordName: 'N/A',
          uploadDate: item.created_at || new Date().toISOString(),
          fileSize: 'N/A',
          fileType: item.document_name?.split('.').pop()?.toUpperCase() || 'FILE',
          downloadUrl: item.document_url || '#',
          status: item.status || 'pending'
        }));
        setComplianceDocs(mappedDocs);
      }
    } catch (error) {
      console.error('Failed to fetch compliance documents:', error);
      toast.error('Failed to load compliance documents');
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for other documents
  const mockDocuments = [
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
    }
  ];

  // Combine mock data with fetched data depending on mode
  const allDocuments = mode === 'compliance' ? complianceDocs : mockDocuments;

  const filteredDocuments = allDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doc.propertyName && doc.propertyName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (doc.landlordName && doc.landlordName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const handleViewDocument = async (docId: string) => {
    if (mode === 'compliance') {
      navigate(`/compliance/view/${docId}`);
    } else {
      console.log('Viewing document:', docId);
    }
  };

  const handleEditDocument = async (docId: string) => {
    if (mode === 'compliance') {
      navigate(`/compliance/edit/${docId}`);
    }
  };

  const handleDownloadDocument = (docId: string) => {
    const doc = allDocuments.find(d => d.id.toString() === docId.toString());
    if (doc?.downloadUrl && doc.downloadUrl !== '#') {
      window.open(doc.downloadUrl, '_blank');
    } else {
      toast.error('No download URL available');
    }
  };

  const handleUploadDocument = () => {
    if (mode === 'compliance') {
      navigate('/compliance/new');
    } else {
      setIsUploadDialogOpen(true);
    }
  };

  const handleUpload = async (data: any) => {
    try {
      console.log('Uploading document:', data);
      setIsUploadDialogOpen(false);

      if (mode === 'compliance' && data) {
        // data can be null if it was an edit that handled its own refresh
        await postAuth('/property_compliances', data);
        toast.success('Compliance document submitted successfully');
        fetchComplianceDocuments(); // Refresh the list
      } else if (mode === 'compliance' && !data) {
        fetchComplianceDocuments(); // Refresh after edit
      } else {
        // Handle generic document upload if needed
        toast.success('Document uploaded successfully');
      }
    } catch (error: any) {
      console.error('Failed to upload:', error);
      toast.error(error.message || 'Failed to submit document');
    }
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Summary Cards */}
      <DocumentSummaryCards documents={allDocuments} />

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
              {mode === 'compliance' ? 'Add Compliance' : 'Upload Document'}
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

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
            </div>
          ) : (
            <DocumentTable
              documents={filteredDocuments}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
              onEditDocument={mode === 'compliance' ? handleEditDocument : undefined}
            />
          )}
        </CardContent>
      </Card>

      {mode !== 'compliance' && (
        <DocumentUploadDialog
          isOpen={isUploadDialogOpen}
          onClose={() => setIsUploadDialogOpen(false)}
          onUpload={handleUpload}
        />
      )}
    </div>
  );
};

export default Documents;
