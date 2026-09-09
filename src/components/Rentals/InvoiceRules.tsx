
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Calendar, Receipt } from 'lucide-react';

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Rule Details', sortable: true, draggable: true },
  { key: 'propertyName', label: 'Property', sortable: true, draggable: true },
  { key: 'area', label: 'Area & Rate', sortable: true, draggable: true },
  { key: 'frequency', label: 'Frequency', sortable: true, draggable: true },
  { key: 'nextInvoiceDate', label: 'Next Invoice', sortable: true, draggable: true },
  { key: 'status', label: 'Status', sortable: true, draggable: true },
];

const InvoiceRules = ({ propertyId }: { propertyId?: string }) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const invoiceRules = [
    {
      id: 'IR001',
      name: 'Monthly Rent - Floor 1',
      propertyName: 'Sunset Apartments - Unit 2A',
      ruleType: 'Recurring',
      frequency: 'Monthly',
      amount: 25000,
      area: 1200,
      ratePerSqFt: 20.83,
      nextInvoiceDate: '2024-06-01',
      status: 'Active',
      autoGenerate: true
    },
    {
      id: 'IR002',
      name: 'Quarterly Maintenance',
      propertyName: 'Green Valley Villa',
      ruleType: 'Recurring',
      frequency: 'Quarterly',
      amount: 15000,
      area: 3500,
      ratePerSqFt: 4.29,
      nextInvoiceDate: '2024-07-01',
      status: 'Active',
      autoGenerate: true
    },
    {
      id: 'IR003',
      name: 'Annual Property Tax',
      propertyName: 'City Center Office',
      ruleType: 'Recurring',
      frequency: 'Annually',
      amount: 120000,
      area: 2500,
      ratePerSqFt: 48,
      nextInvoiceDate: '2025-01-01',
      status: 'Active',
      autoGenerate: false
    }
  ];

  const renderCell = (rule: typeof invoiceRules[number], columnKey: string) => {
    switch (columnKey) {
      case 'name':
        return (
          <div>
            <p className="font-medium">{rule.name}</p>
            <p className="text-brand-body-5 text-brand-text-light">ID: {rule.id}</p>
            <div className="flex items-center mt-1">
              {rule.autoGenerate && (
                <Badge variant="secondary" className="text-brand-caption">Auto</Badge>
              )}
            </div>
          </div>
        );
      case 'propertyName':
        return <p className="text-brand-body-5">{rule.propertyName}</p>;
      case 'area':
        return (
          <div>
            <p className="font-medium">{rule.area} sq ft</p>
            <p className="text-brand-body-5 text-brand-text-light">₹{rule.ratePerSqFt}/sq ft</p>
            <p className="text-brand-body-5 font-medium text-brand">₹{rule.amount.toLocaleString()}</p>
          </div>
        );
      case 'frequency':
        return <Badge variant="outline">{rule.frequency}</Badge>;
      case 'nextInvoiceDate':
        return (
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-1 text-brand-text-light" />
            <span className="text-brand-body-5">
              {new Date(rule.nextInvoiceDate).toLocaleDateString()}
            </span>
          </div>
        );
      case 'status':
        return (
          <Badge variant={rule.status === 'Active' ? 'active' : 'inactive'}>
            {rule.status}
          </Badge>
        );
      default:
        return rule[columnKey as keyof typeof rule];
    }
  };

  const renderActions = () => (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" size="sm" title="Edit">
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" title="Delete" className="text-brand-error">
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="space-y-5">
      <Card className="bg-white">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-brand" />
                Invoice Rules & Recurring Billing
              </CardTitle>
              <CardDescription>
                Set up automated invoice generation rules based on area, rates, and billing cycles
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Invoice Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Invoice Rule</DialogTitle>
                  <DialogDescription>Set up recurring billing rules for property charges</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input id="rule-name" placeholder="e.g., Monthly Rent - Floor 1" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property">Property</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sunset">Sunset Apartments - Unit 2A</SelectItem>
                        <SelectItem value="green-valley">Green Valley Villa</SelectItem>
                        <SelectItem value="city-center">City Center Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Billing Frequency</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input id="area" type="number" placeholder="e.g., 1200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate per sq ft (₹)</Label>
                    <Input id="rate" type="number" placeholder="e.g., 25" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-date">First Invoice Date</Label>
                    <Input id="start-date" type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date (Optional)</Label>
                    <Input id="end-date" type="date" />
                  </div>
                  <div className="space-y-2 col-span-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="auto-generate" />
                      <Label htmlFor="auto-generate">Auto-generate and send invoices</Label>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                  <Button>Create Rule</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedTable
            data={invoiceRules}
            columns={columns}
            renderCell={renderCell}
            renderActions={renderActions}
            getItemId={(rule) => rule.id}
            storageKey="invoice-rules-table"
            emptyMessage="No invoice rules configured"
            searchPlaceholder="Search invoice rules..."
            enableSearch={true}
            enableSelection={false}
            exportFileName="invoice-rules"
            pagination={true}
            pageSize={10}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceRules;
