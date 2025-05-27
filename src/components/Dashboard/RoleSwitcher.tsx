
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, User } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: 'landlord' | 'tenant';
  onRoleChange: (role: 'landlord' | 'tenant') => void;
}

const RoleSwitcher = ({ currentRole, onRoleChange }: RoleSwitcherProps) => {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      <Button
        variant={currentRole === 'landlord' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRoleChange('landlord')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          currentRole === 'landlord'
            ? 'bg-[#C72030] text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
        }`}
      >
        <Users className="h-4 w-4" />
        Landlord
      </Button>
      <Button
        variant={currentRole === 'tenant' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRoleChange('tenant')}
        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
          currentRole === 'tenant'
            ? 'bg-[#C72030] text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-900 hover:bg-white'
        }`}
      >
        <User className="h-4 w-4" />
        Tenant
      </Button>
    </div>
  );
};

export default RoleSwitcher;
