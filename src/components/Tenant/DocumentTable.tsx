
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, Eye, Edit } from 'lucide-react';
import { getDocumentIcon, getTypeBadge } from './DocumentUtils';

interface DocumentTableProps {
  documents: any[];
  onViewDocument: (docId: string) => void;
  onDownloadDocument: (docId: string) => void;
  onEditDocument?: (docId: string) => void;
}

const DocumentTable = ({ documents, onViewDocument, onDownloadDocument, onEditDocument }: DocumentTableProps) => {
  return (
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
          {documents.map((doc) => (
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
                    onClick={() => onViewDocument(doc.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  {onEditDocument && (
                    <Button
                      variant="ghost"
                      size="sm"
                      title="Edit Compliance"
                      className="text-[#C72030] hover:bg-[#C72030]/10"
                      onClick={() => onEditDocument(doc.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    title="Download"
                    className="text-[#C72030] hover:bg-[#C72030]/10"
                    onClick={() => onDownloadDocument(doc.id)}
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
  );
};

export default DocumentTable;
