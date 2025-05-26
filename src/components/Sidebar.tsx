
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Building2, 
  FileText, 
  User,
  DollarSign, 
  Zap, 
  Wrench, 
  Bell, 
  BarChart3, 
  Settings,
  ChevronLeft,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/' },
    { icon: Building2, label: 'Properties', path: '/properties' },
    { icon: UserCheck, label: 'Landlord Dashboard', path: '/rentals' },
    { icon: User, label: 'Tenant Dashboard', path: '/tenant-dashboard' },
    { icon: DollarSign, label: 'OPEX Management', path: '/opex' },
    { icon: Zap, label: 'Utilities', path: '/utilities' },
    { icon: Wrench, label: 'AMC Management', path: '/amc' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={cn(
      "bg-[#1B2B3D] transition-all duration-300 flex flex-col h-screen",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-[#2A3F54]">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-heading-3 font-semibold text-white">PropertyFlow</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-gray-300 hover:bg-[#2A3F54] hover:text-white"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center p-3 rounded-lg transition-all duration-200 font-medium",
                    isActive 
                      ? "bg-[#E74C3C] text-white shadow-sm" 
                      : "text-gray-300 hover:bg-[#2A3F54] hover:text-white"
                  )}
                >
                  <Icon size={20} />
                  {!isCollapsed && (
                    <span className="ml-3">{item.label}</span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
