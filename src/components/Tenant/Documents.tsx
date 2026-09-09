
import React, { useState, useEffect } from 'react';
import { SectionLoader } from '@/components/ui/loader';
import { TableFilterDialog, FilterField } from '@/components/enhanced-table/TableFilterDialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Loader2 } from 'lucide-react';
import { getAuth, postAuth } from '@/lib/api';
import { toast } from 'sonner';
import DocumentSummaryCards from './DocumentSummaryCards';
import DocumentTable from './DocumentTable';
import DocumentUploadDialog from './DocumentUploadDialog';

interface DocumentsProps {
  mode?: 'default' | 'compliance';
}

const Documents = ({ mode = 'default' }: DocumentsProps) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState(mode === 'compliance' ? 'compliance' : 'all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [pendingFilter, setPendingFilter] = useState(mode === 'compliance' ? 'compliance' : 'all');
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
    <div className="space-y-5">
      {/* Summary Cards */}
      <DocumentSummaryCards documents={allDocuments} />

      <div>
          {isLoading ? (
            <SectionLoader />
          ) : (
            <DocumentTable
              leftActions={
                <>
                  <Button onClick={handleUploadDocument} className="fm-button-fix fm-button-brand px-6 py-2">
                    <Upload className="w-4 h-4 mr-2" />
                    {mode === 'compliance' ? 'Add Compliance' : 'Upload Document'}
                  </Button>

                  <TableFilterDialog
                    open={isFilterOpen}
                    onOpenChange={setIsFilterOpen}
                    onApply={() => setTypeFilter(pendingFilter)}
                    onReset={() => {
                      setPendingFilter(mode === 'compliance' ? 'compliance' : 'all');
                      setTypeFilter(mode === 'compliance' ? 'compliance' : 'all');
                    }}
                  >
                    <FilterField label="Type">
                      <Select value={pendingFilter} onValueChange={setPendingFilter}>
                        <SelectTrigger className="h-auto border-0 p-0 shadow-none focus:ring-0">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="contract">Contracts</SelectItem>
                        <SelectItem value="receipt">Receipts</SelectItem>
                        <SelectItem value="bill">Bills</SelectItem>
                        <SelectItem value="photo">Photos</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="inspection">Inspection</SelectItem>
                        </SelectContent>
                      </Select>
                    </FilterField>
                  </TableFilterDialog>
                </>
              }
              documents={filteredDocuments}
              onFilterClick={() => {
                setPendingFilter(typeFilter);
                setIsFilterOpen(true);
              }}
              onViewDocument={handleViewDocument}
              onDownloadDocument={handleDownloadDocument}
              onEditDocument={mode === 'compliance' ? handleEditDocument : undefined}
            />
          )}
      </div>

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
