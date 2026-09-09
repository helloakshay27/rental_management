import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Upload, FileText, Bell, BarChart3, Settings, CreditCard, Calendar, AlertTriangle, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ElementType;
  href: string;
}

const QuickActions = () => {
  const navigate = useNavigate();

  // Different actions based on current dashboard context
  const landlordActions: QuickAction[] = [
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

  const tenantActions: QuickAction[] = [
    {
      title: 'Pay Rent',
      description: 'Process rent payments',
      icon: CreditCard,
      href: '/rental-dashboard'
    },
    {
      title: 'Lease Tracker',
      description: 'Track lease expiries',
      icon: Calendar,
      href: '/rentals'
    },
    {
      title: 'Property',
      description: 'View all properties',
      icon: Search,
      href: '/masters/properties'
    },
    {
      title: 'Compliance',
      description: 'Track compliance status',
      icon: AlertTriangle,
      href: '/compliance'
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                type="button"
                onClick={() => navigate(action.href)}
                className={cn(
                  // A tall multi-line tile is its own shape, not a Button
                  // variant — the shared Button forces one row, a fixed height
                  // and 16px icons, which is what pushed the icon and caption
                  // outside the border here.
                  'group flex h-full flex-col items-center justify-start gap-2 rounded-lg p-4 text-center',
                  'border border-brand-card-border bg-brand-card',
                  'transition-all duration-200 hover:border-brand hover:shadow-system-md',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2'
                )}
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md bg-brand-stat-icon transition-colors group-hover:bg-brand-light">
                  <Icon className="h-5 w-5 text-brand" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-brand-body-4 font-semibold text-brand-text">
                    {action.title}
                  </span>
                  <span className="text-brand-caption text-brand-text-light">
                    {action.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
