
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ComplianceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const ComplianceFilters = ({ searchTerm, onSearchChange }: ComplianceFiltersProps) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search compliances..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64 bg-white"
        />
      </div>
    </div>
  );
};

export default ComplianceFilters;
