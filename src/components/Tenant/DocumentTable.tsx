
import React from 'react';
import { Button } from '@/components/ui/button';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Download, Eye, Edit } from 'lucide-react';
import { getDocumentIcon, getTypeBadge } from './DocumentUtils';

interface DocumentTableProps {
  documents: any[];
  onViewDocument: (docId: string) => void;
  onDownloadDocument: (docId: string) => void;
  onEditDocument?: (docId: string) => void;
  leftActions?: React.ReactNode;
  onFilterClick?: () => void;
}

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Document', sortable: true, draggable: true },
  { key: 'type', label: 'Type', sortable: true, draggable: true },
  { key: 'propertyName', label: 'Property', sortable: true, draggable: true },
  { key: 'uploadDate', label: 'Upload Date', sortable: true, draggable: true },
  { key: 'fileType', label: 'File Info', sortable: true, draggable: true },
];

const DocumentTable = ({ documents, onViewDocument, onDownloadDocument, onEditDocument, leftActions, onFilterClick }: DocumentTableProps) => {
  const renderCell = (doc: any, columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div className="flex items-center gap-3">
            {getDocumentIcon(doc.type)}
            <div>
              <div className="font-medium text-brand-text">{doc.name}</div>
              <div className="text-brand-caption text-brand-text-light">ID: {doc.id}</div>
            </div>
          </div>
        );
      case 'type':
        return getTypeBadge(doc.type);
      case 'propertyName':
        return (
          <div>
            <div className="font-medium text-brand-text">{doc.propertyName}</div>
            <div className="text-brand-body-5 text-brand-text-light">{doc.landlordName}</div>
          </div>
        );
      case 'uploadDate':
        return new Date(doc.uploadDate).toLocaleDateString();
      case 'fileType':
        return (
          <div>
            <div className="text-brand-body-5 text-brand-text">{doc.fileType}</div>
            <div className="text-brand-caption text-brand-text-light">{doc.fileSize}</div>
          </div>
        );
      default:
        return doc[columnKey];
    }
  };

  const renderActions = (doc: any) => (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        title="View Document"
        onClick={() => onViewDocument(doc.id)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      {onEditDocument && (
        <Button
          variant="ghost"
          size="sm"
          title="Edit Compliance"
          onClick={() => onEditDocument(doc.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        title="Download"
        onClick={() => onDownloadDocument(doc.id)}
      >
        <Download className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <EnhancedTable
      data={documents}
      columns={columns}
      renderCell={renderCell}
      renderActions={renderActions}
      getItemId={(doc) => doc.id}
      storageKey="tenant-documents-table"
      leftActions={leftActions}
      onFilterClick={onFilterClick}
      emptyMessage="No documents found"
      searchPlaceholder="Search documents..."
      enableSearch={true}
      enableSelection={false}
      exportFileName="documents"
      pagination={true}
      pageSize={10}
    />
  );
};

export default DocumentTable;
