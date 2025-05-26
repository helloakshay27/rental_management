
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Folder, FileImage, File } from 'lucide-react';

interface DocumentSummaryCardsProps {
  documents: any[];
}

const DocumentSummaryCards = ({ documents }: DocumentSummaryCardsProps) => {
  const totalSize = documents.reduce((sum, doc) => sum + parseFloat(doc.fileSize), 0);

  return (
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
  );
};

export default DocumentSummaryCards;
