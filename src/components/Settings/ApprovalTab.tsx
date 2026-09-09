
import React from 'react';
import { GitBranch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Flow Name', sortable: true, draggable: true },
  { key: 'threshold', label: 'Threshold', sortable: true, draggable: true },
  { key: 'levels', label: 'Approval Levels', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const ApprovalTab = () => {
  const approvalFlows = [
    {
      id: 'AF001',
      name: 'Expense Approval',
      description: 'Approval flow for operational expenses',
      threshold: '₹50,000',
      levels: 3,
      status: 'Active'
    },
    {
      id: 'AF002',
      name: 'Lease Agreement',
      description: 'Approval flow for new lease agreements',
      threshold: 'All',
      levels: 2,
      status: 'Active'
    },
    {
      id: 'AF003',
      name: 'Maintenance Requests',
      description: 'Approval flow for high-value maintenance',
      threshold: '₹25,000',
      levels: 2,
      status: 'Active'
    }
  ];

  const renderCell = (flow: typeof approvalFlows[number], columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className="font-medium">{flow.name}</p>
            <p className="text-brand-body-5 text-brand-text-light">{flow.description}</p>
          </div>
        );
      case 'levels':
        return `${flow.levels} levels`;
      case 'status':
        return <Badge variant="active">{flow.status}</Badge>;
      default:
        return flow[columnKey as keyof typeof flow];
    }
  };

  const renderActions = () => (
    <div className="flex space-x-2">
      <Button variant="outline" size="sm">Edit</Button>
      <Button variant="outline" size="sm">Configure</Button>
    </div>
  );

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5" />
          <span>Approval Flows & Escalation Matrix</span>
        </CardTitle>
        <CardDescription>Configure approval workflows and escalation paths</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-brand-text">Active Approval Flows</h4>
          <Button>Add New Flow</Button>
        </div>

        <EnhancedTable
          data={approvalFlows}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(flow) => flow.id}
          storageKey="approval-flows-table"
          emptyMessage="No approval flows configured"
          enableSearch={false}
          enableSelection={false}
          hideTableExport={true}
          pagination={false}
        />

        <div className="border-t border-brand-border pt-6">
          <h4 className="font-medium text-brand-text mb-4">Escalation Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="escalation-time">Default Escalation Time</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24">24 Hours</SelectItem>
                  <SelectItem value="48">48 Hours</SelectItem>
                  <SelectItem value="72">72 Hours</SelectItem>
                  <SelectItem value="168">1 Week</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="every-2-days">Every 2 Days</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button>Save Approval Settings</Button>
      </CardContent>
    </Card>
  );
};

export default ApprovalTab;
