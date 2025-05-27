
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Calendar, DollarSign, Receipt } from 'lucide-react';

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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Receipt className="h-5 w-5 mr-2 text-[#C72030]" />
                Invoice Rules & Recurring Billing
              </CardTitle>
              <CardDescription>
                Set up automated invoice generation rules based on area, rates, and billing cycles
              </CardDescription>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#C72030] hover:bg-[#A01825]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Invoice Rule
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl bg-white">
                <DialogHeader>
                  <DialogTitle>Create Invoice Rule</DialogTitle>
                  <DialogDescription>Set up recurring billing rules for property charges</DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                  <div className="space-y-2 col-span-2">
                    <Label htmlFor="rule-name">Rule Name</Label>
                    <Input id="rule-name" placeholder="e.g., Monthly Rent - Floor 1" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="property">Property</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select property" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="sunset">Sunset Apartments - Unit 2A</SelectItem>
                        <SelectItem value="green-valley">Green Valley Villa</SelectItem>
                        <SelectItem value="city-center">City Center Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Billing Frequency</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="half-yearly">Half-Yearly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input id="area" type="number" placeholder="e.g., 1200" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate">Rate per sq ft (₹)</Label>
                    <Input id="rate" type="number" placeholder="e.g., 25" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start-date">First Invoice Date</Label>
                    <Input id="start-date" type="date" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date (Optional)</Label>
                    <Input id="end-date" type="date" className="bg-white" />
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
                  <Button className="bg-[#C72030] hover:bg-[#A01825]">Create Rule</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rule Details</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Area & Rate</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-sm text-gray-500">ID: {rule.id}</p>
                      <div className="flex items-center mt-1">
                        {rule.autoGenerate && (
                          <Badge variant="secondary" className="text-xs">Auto</Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{rule.propertyName}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{rule.area} sq ft</p>
                      <p className="text-sm text-gray-500">₹{rule.ratePerSqFt}/sq ft</p>
                      <p className="text-sm font-medium text-[#C72030]">₹{rule.amount.toLocaleString()}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{rule.frequency}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                      <span className="text-sm">{new Date(rule.nextInvoiceDate).toLocaleDateString()}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={rule.status === 'Active' ? 'default' : 'secondary'}
                      className={rule.status === 'Active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {rule.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceRules;
