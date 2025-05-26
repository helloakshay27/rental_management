
import React from 'react';
import { Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const IntegrationsTab = () => {
  const integrations = [
    { name: 'QuickBooks', description: 'Sync financial data and accounting', connected: true },
    { name: 'Stripe', description: 'Process rent payments online', connected: true },
    { name: 'Twilio', description: 'Send SMS notifications to tenants', connected: false },
    { name: 'DocuSign', description: 'Electronic signature for lease agreements', connected: false },
    { name: 'Google Calendar', description: 'Sync maintenance schedules', connected: true }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Globe className="h-5 w-5" />
          <span>Integrations</span>
        </CardTitle>
        <CardDescription>Connect third-party services to enhance your workflow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {integrations.map((integration, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900">{integration.name}</h4>
                <p className="text-sm text-gray-600">{integration.description}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  integration.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {integration.connected ? 'Connected' : 'Not Connected'}
                </span>
                <Button variant="outline" size="sm">
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default IntegrationsTab;
