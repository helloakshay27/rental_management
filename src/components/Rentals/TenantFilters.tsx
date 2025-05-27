
import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface TenantFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

const TenantFilters = ({ searchTerm, onSearchChange }: TenantFiltersProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search tenants by name, email, or property..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default TenantFilters;
