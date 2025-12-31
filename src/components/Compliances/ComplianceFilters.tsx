import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ComplianceFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  statusFilter: string;
  onStatusChange: (value: string) => void;
}

const ComplianceFilters = ({ searchTerm, onSearchChange, statusFilter, onStatusChange }: ComplianceFiltersProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40 bg-white">
          <SelectValue placeholder="All Status" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          <SelectItem value="all">All Status</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Pending">Pending</SelectItem>
          <SelectItem value="Overdue">Overdue</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search compliances..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-64 bg-white border-gray-300"
        />
      </div>
    </div>
  );
};

export default ComplianceFilters;
