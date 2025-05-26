
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, FileText, Bell, BarChart3, Settings } from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add Property',
      description: 'Register a new property',
      icon: Plus,
      color: 'bg-blue-500 hover:bg-blue-600',
      href: '/properties'
    },
    {
      title: 'Upload Bills',
      description: 'Upload utility bills',
      icon: Upload,
      color: 'bg-emerald-500 hover:bg-emerald-600',
      href: '/utilities'
    },
    {
      title: 'New Agreement',
      description: 'Create rental agreement',
      icon: FileText,
      color: 'bg-purple-500 hover:bg-purple-600',
      href: '/rentals'
    },
    {
      title: 'Set Reminder',
      description: 'Configure notifications',
      icon: Bell,
      color: 'bg-amber-500 hover:bg-amber-600',
      href: '/notifications'
    },
    {
      title: 'View Reports',
      description: 'Generate analytics',
      icon: BarChart3,
      color: 'bg-indigo-500 hover:bg-indigo-600',
      href: '/reports'
    },
    {
      title: 'Settings',
      description: 'System configuration',
      icon: Settings,
      color: 'bg-gray-500 hover:bg-gray-600',
      href: '/settings'
    }
  ];

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="outline"
                className={`h-24 flex flex-col items-center justify-center space-y-2 border-2 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200`}
              >
                <Icon size={24} className="text-blue-600" />
                <div className="text-center">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
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
