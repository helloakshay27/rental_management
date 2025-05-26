
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface DocumentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  typeFilter: string;
  setTypeFilter: (value: string) => void;
}

const DocumentFilters = ({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter
}: DocumentFiltersProps) => {
  return (
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
  );
};

export default DocumentFilters;
