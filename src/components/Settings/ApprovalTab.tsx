
import React from 'react';
import { GitBranch } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <GitBranch className="h-5 w-5" />
          <span>Approval Flows & Escalation Matrix</span>
        </CardTitle>
        <CardDescription>Configure approval workflows and escalation paths</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h4 className="font-medium text-gray-900">Active Approval Flows</h4>
          <Button className="bg-[#C72030] hover:bg-[#A01825]">Add New Flow</Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Flow Name</TableHead>
              <TableHead>Threshold</TableHead>
              <TableHead>Approval Levels</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvalFlows.map((flow) => (
              <TableRow key={flow.id}>
                <TableCell>
                  <div>
                    <p className="font-medium">{flow.name}</p>
                    <p className="text-sm text-gray-500">{flow.description}</p>
                  </div>
                </TableCell>
                <TableCell>{flow.threshold}</TableCell>
                <TableCell>{flow.levels} levels</TableCell>
                <TableCell>
                  <Badge variant="default">{flow.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-4">Escalation Settings</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="escalation-time">Default Escalation Time</Label>
              <Select>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select time" />
                </SelectTrigger>
                <SelectContent className="bg-white">
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
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="every-2-days">Every 2 Days</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Approval Settings</Button>
      </CardContent>
    </Card>
  );
};

export default ApprovalTab;
