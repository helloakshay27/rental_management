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
  UserCheck,
  Database,
  Receipt,
  ShieldCheck,
  Hammer
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
    { icon: Home, label: 'Dashboard', path: '/dashboard' },
    // { icon: UserCheck, label: 'Lessor Dashboard', path: '/rentals' },
    // { icon: User, label: 'Lessee Dashboard', path: '/tenant-dashboard' },

    { icon: Home, label: 'Rental Agreement', path: '/rental-dashboard' },
    { icon: ShieldCheck, label: 'Monitor Compliance', path: '/monitor-compliance' },


    { icon: DollarSign, label: 'OPEX Management', path: '/opex' },
    { icon: Zap, label: 'Utilities', path: '/utilities' },
    { icon: Wrench, label: 'AMC Management', path: '/amc' },
    { icon: Hammer, label: 'Maintenance', path: '/maintenance' },
    { icon: Receipt, label: 'Invoicing', path: '/invoicing' },
    { icon: Database, label: 'Masters', path: '/masters' },
    { icon: Bell, label: 'Notifications', path: '/notifications' },
    // { icon: BarChart3, label: 'Reports', path: '/reports' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className={cn(
      "bg-[#f6f4ee] transition-all duration-300 flex flex-col h-screen border-r border-gray-200",
      isCollapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h2 className="text-heading-3 font-semibold text-[#1a1a1a]">PropertyFlow</h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="text-[#1a1a1a] hover:bg-gray-100 hover:text-[#1a1a1a]"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
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
                      ? "bg-[#C72030] text-white shadow-sm"
                      : "text-[#1a1a1a] hover:bg-gray-100 hover:text-[#1a1a1a]"
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
