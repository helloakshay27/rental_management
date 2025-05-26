
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText, FileImage, File } from 'lucide-react';

export const getDocumentIcon = (type: string) => {
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

export const getTypeBadge = (type: string) => {
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

export const documentTypes = ['contract', 'receipt', 'bill', 'photo', 'insurance', 'inspection'];
