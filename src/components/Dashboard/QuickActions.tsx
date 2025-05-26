
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
