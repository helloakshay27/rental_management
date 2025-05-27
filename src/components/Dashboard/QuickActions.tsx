
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, FileText, Bell, BarChart3, Settings, CreditCard, Calendar, MapPin, AlertTriangle, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const QuickActions = () => {
  const navigate = useNavigate();

  // Different actions based on current dashboard context
  const landlordActions = [
    {
      title: 'Add Property',
      description: 'Register a new property',
      icon: Plus,
      href: '/masters/properties'
    },
    {
      title: 'Upload Bills',
      description: 'Upload utility bills',
      icon: Upload,
      href: '/utilities'
    },
    {
      title: 'New Agreement',
      description: 'Create rental agreement',
      icon: FileText,
      href: '/rentals'
    },
    {
      title: 'Set Reminder',
      description: 'Configure notifications',
      icon: Bell,
      href: '/notifications'
    },
    {
      title: 'View Reports',
      description: 'Generate analytics',
      icon: BarChart3,
      href: '/reports'
    },
    {
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      href: '/settings'
    }
  ];

  const tenantActions = [
    {
      title: 'Pay Rent',
      description: 'Process rent payments',
      icon: CreditCard,
      href: '/tenant-dashboard'
    },
    {
      title: 'Lease Tracker',
      description: 'Track lease expiries',
      icon: Calendar,
      href: '/tenant-dashboard'
    },
    {
      title: 'Property Search',
      description: 'Find new properties',
      icon: Search,
      href: '/properties'
    },
    {
      title: 'Regional Analysis',
      description: 'View regional trends',
      icon: MapPin,
      href: '/reports'
    },
    {
      title: 'Compliance Check',
      description: 'Monitor compliance',
      icon: AlertTriangle,
      href: '/tenant-dashboard'
    },
    {
      title: 'Landlord Relations',
      description: 'Manage relationships',
      icon: Users,
      href: '/masters/landlords'
    }
  ];

  // Determine which actions to show (this could be dynamic based on user role)
  const currentPath = window.location.pathname;
  const isOnMainDashboard = currentPath === '/';
  
  // For the main dashboard, we'll show different actions based on the active role
  // This could be enhanced to check actual user context
  const actions = isOnMainDashboard ? landlordActions : tenantActions;

  const handleActionClick = (href: string) => {
    navigate(href);
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#1a1a1a]">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center space-y-2 border-2 hover:border-[#C72030] hover:bg-[#C72030]/10 transition-all duration-200`}
                onClick={() => handleActionClick(action.href)}
              >
                <Icon size={24} className="text-[#C72030]" />
                <div className="text-center">
                  <p className="text-sm font-medium text-[#1a1a1a]">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
