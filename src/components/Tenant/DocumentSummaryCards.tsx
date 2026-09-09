
import React from 'react';
import { StatsGrid } from '@/components/ui/page';
import { StatsCard } from '@/components/ui/stats-card';
import { FileText, Folder, FileImage, File } from 'lucide-react';

interface DocumentSummaryCardsProps {
  documents: any[];
}

const DocumentSummaryCards = ({ documents }: DocumentSummaryCardsProps) => {
  const totalSize = documents.reduce((sum, doc) => sum + parseFloat(doc.fileSize), 0);

  return (
    <StatsGrid>
      <StatsCard title="Total Documents" value={documents.length} icon={<FileText />} />
      <StatsCard
        title="Contracts"
        value={documents.filter(d => d.type === 'contract').length}
        icon={<Folder />}
      />
      <StatsCard
        title="Photos"
        value={documents.filter(d => d.type === 'photo').length}
        icon={<FileImage />}
      />
      <StatsCard title="Total Size" value={`${totalSize.toFixed(1)} MB`} icon={<File />} />
    </StatsGrid>
  );
};

export default DocumentSummaryCards;
