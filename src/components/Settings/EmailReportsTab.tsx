
import React from 'react';
import { Send, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Report Name', sortable: true, draggable: true },
  { key: 'frequency', label: 'Frequency', sortable: true, draggable: true },
  { key: 'time', label: 'Schedule', sortable: true, draggable: true },
  { key: 'recipients', label: 'Recipients', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const EmailReportsTab = () => {
  const emailReports = [
    {
      id: 'ER001',
      name: 'Daily Revenue Summary',
      description: 'Daily revenue and collection summary',
      frequency: 'Daily',
      time: '08:00 AM',
      recipients: 'admin@propertyflow.com',
      status: 'Active'
    },
    {
      id: 'ER002',
      name: 'Weekly Occupancy Report',
      description: 'Weekly property occupancy analytics',
      frequency: 'Weekly',
      time: 'Monday 09:00 AM',
      recipients: 'reports@propertyflow.com',
      status: 'Active'
    },
    {
      id: 'ER003',
      name: 'Monthly Financial Report',
      description: 'Comprehensive monthly financial analysis',
      frequency: 'Monthly',
      time: '1st Day 10:00 AM',
      recipients: 'finance@propertyflow.com',
      status: 'Active'
    }
  ];

  const renderCell = (report: typeof emailReports[number], columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className="font-medium">{report.name}</p>
            <p className="text-brand-body-5 text-brand-text-light">{report.description}</p>
          </div>
        );
      case 'recipients':
        return <span className="block max-w-48 truncate">{report.recipients}</span>;
      case 'status':
        return <Badge variant="active">{report.status}</Badge>;
      default:
        return report[columnKey as keyof typeof report];
    }
  };

  const renderActions = () => (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm">Edit</Button>
      <Button variant="outline" size="sm">Test</Button>
    </div>
  );

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Send className="h-5 w-5" />
          <span>Email Reports & Cron Settings</span>
        </CardTitle>
        <CardDescription>Configure automated email reports and scheduling</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-brand-text">Scheduled Email Reports</h4>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Report
          </Button>
        </div>

        <EnhancedTable
          data={emailReports}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(report) => report.id}
          storageKey="email-reports-table"
          emptyMessage="No scheduled reports"
          enableSearch={false}
          enableSelection={false}
          hideTableExport={true}
          pagination={false}
        />

        <div className="border-t border-brand-border pt-6">
          <h4 className="font-medium text-brand-text mb-4">SMTP Configuration</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="smtp-host">SMTP Host</Label>
              <Input id="smtp-host" placeholder="smtp.gmail.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-port">SMTP Port</Label>
              <Input id="smtp-port" placeholder="587" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-username">Username</Label>
              <Input id="smtp-username" placeholder="your-email@domain.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="smtp-password">Password</Label>
              <Input id="smtp-password" type="password" placeholder="Your password" />
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-2">
              <Switch id="smtp-ssl" />
              <Label htmlFor="smtp-ssl">Enable SSL/TLS</Label>
            </div>
          </div>
        </div>

        <div className="border-t border-brand-border pt-6">
          <h4 className="font-medium text-brand-text mb-4">Global Settings</h4>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="enable-reports">Enable Automated Reports</Label>
                <p className="text-brand-body-5 text-brand-text-light">Master switch for all email reports</p>
              </div>
              <Switch id="enable-reports" defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="retry-failed">Retry Failed Deliveries</Label>
                <p className="text-brand-body-5 text-brand-text-light">Automatically retry failed email deliveries</p>
              </div>
              <Switch id="retry-failed" defaultChecked />
            </div>
          </div>
        </div>

        <Button>Save Email Settings</Button>
      </CardContent>
    </Card>
  );
};

export default EmailReportsTab;
