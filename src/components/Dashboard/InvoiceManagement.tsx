
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, FileText, Calendar, Send, Eye, DollarSign, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const InvoiceManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const invoices = [
    {
      id: 'INV-2024-001',
      tenantName: 'TechCorp Solutions',
      property: 'Sunset Apartments - 2A',
      amount: 125000,
      dueDate: '2024-02-01',
      status: 'pending',
      issueDate: '2024-01-01',
      area: 2500,
      ratePerSqFt: 50,
      period: 'January 2024',
      recurringRule: 'Monthly',
      brandTemplate: 'Premium Corporate'
    },
    {
      id: 'INV-2024-002',
      tenantName: 'Green Valley Enterprises',
      property: 'Business Plaza - Floor 3',
      amount: 180000,
      dueDate: '2024-02-05',
      status: 'overdue',
      issueDate: '2024-01-05',
      area: 3600,
      ratePerSqFt: 50,
      period: 'January 2024',
      recurringRule: 'Monthly',
      brandTemplate: 'Modern Minimalist'
    },
    {
      id: 'INV-2024-003',
      tenantName: 'Innovation Hub Ltd',
      property: 'Tech Tower - Suite 401',
      amount: 95000,
      dueDate: '2024-01-28',
      status: 'paid',
      issueDate: '2023-12-28',
      area: 1900,
      ratePerSqFt: 50,
      period: 'December 2023',
      recurringRule: 'Monthly',
      brandTemplate: 'Classic Professional'
    }
  ];

  const recurringRules = [
    {
      id: 'RR-001',
      property: 'Sunset Apartments - 2A',
      tenant: 'TechCorp Solutions',
      frequency: 'Monthly',
      amount: 125000,
      nextDue: '2024-03-01',
      status: 'active',
      area: 2500,
      ratePerSqFt: 50
    },
    {
      id: 'RR-002',
      property: 'Business Plaza - Floor 3',
      tenant: 'Green Valley Enterprises',
      frequency: 'Monthly',
      amount: 180000,
      nextDue: '2024-03-05',
      status: 'active',
      area: 3600,
      ratePerSqFt: 50
    }
  ];

  const brandTemplates = [
    { id: 'premium', name: 'Premium Corporate', description: 'Professional design with company colors' },
    { id: 'modern', name: 'Modern Minimalist', description: 'Clean and simple layout' },
    { id: 'classic', name: 'Classic Professional', description: 'Traditional business invoice style' }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-100 text-green-700">Paid</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-700">Overdue</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-700">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         invoice.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-[#C72030]" />
              <div>
                <p className="text-2xl font-bold">₹4.2Cr</p>
                <p className="text-sm text-gray-600">Total Outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">156</p>
                <p className="text-sm text-gray-600">Pending Invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold">23</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">89.2%</p>
                <p className="text-sm text-gray-600">Collection Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="invoices" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="invoices" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            Invoices
          </TabsTrigger>
          <TabsTrigger value="recurring" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <Calendar className="h-4 w-4 mr-2" />
            Recurring Rules
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <Eye className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Invoice Management</CardTitle>
                  <CardDescription>Track and manage all tenant invoices</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#C72030] hover:bg-[#A01825]">
                      <Plus className="h-4 w-4 mr-2" />
                      Create Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                      <DialogTitle>Create New Invoice</DialogTitle>
                      <DialogDescription>Generate invoice for tenant</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="property">Property</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="sunset">Sunset Apartments - 2A</SelectItem>
                            <SelectItem value="plaza">Business Plaza - Floor 3</SelectItem>
                            <SelectItem value="tower">Tech Tower - Suite 401</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tenant">Tenant</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select tenant" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                            <SelectItem value="green">Green Valley Enterprises</SelectItem>
                            <SelectItem value="innovation">Innovation Hub Ltd</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="area">Area (Sq Ft)</Label>
                        <Input id="area" placeholder="Enter area" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rate">Rate per Sq Ft</Label>
                        <Input id="rate" placeholder="Enter rate" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="period">Billing Period</Label>
                        <Input id="period" placeholder="e.g., January 2024" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input id="dueDate" type="date" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="template">Brand Template</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            {brandTemplates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="recurring">Recurring</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="none">One-time</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Save as Draft</Button>
                      <Button className="bg-[#C72030] hover:bg-[#A01825]">Generate Invoice</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <Input
                  placeholder="Search invoices..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="max-w-sm bg-white"
                />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-48 bg-white">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{invoice.tenantName}</TableCell>
                      <TableCell>{invoice.property}</TableCell>
                      <TableCell>₹{invoice.amount.toLocaleString()}</TableCell>
                      <TableCell>{invoice.dueDate}</TableCell>
                      <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recurring" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recurring Invoice Rules</CardTitle>
                  <CardDescription>Automate invoice generation with recurring rules</CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-[#C72030] hover:bg-[#A01825]">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Rule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl bg-white">
                    <DialogHeader>
                      <DialogTitle>Create Recurring Rule</DialogTitle>
                      <DialogDescription>Set up automatic invoice generation</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-2 gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="ruleProperty">Property</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select property" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="sunset">Sunset Apartments - 2A</SelectItem>
                            <SelectItem value="plaza">Business Plaza - Floor 3</SelectItem>
                            <SelectItem value="tower">Tech Tower - Suite 401</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ruleTenant">Tenant</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select tenant" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="techcorp">TechCorp Solutions</SelectItem>
                            <SelectItem value="green">Green Valley Enterprises</SelectItem>
                            <SelectItem value="innovation">Innovation Hub Ltd</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select>
                          <SelectTrigger className="bg-white">
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent className="bg-white">
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="quarterly">Quarterly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Start Date</Label>
                        <Input id="startDate" type="date" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ruleArea">Area (Sq Ft)</Label>
                        <Input id="ruleArea" placeholder="Enter area" className="bg-white" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ruleRate">Rate per Sq Ft</Label>
                        <Input id="ruleRate" placeholder="Enter rate" className="bg-white" />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline">Cancel</Button>
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
                    <TableHead>Rule ID</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Tenant</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Next Due</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recurringRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell className="font-medium">{rule.id}</TableCell>
                      <TableCell>{rule.property}</TableCell>
                      <TableCell>{rule.tenant}</TableCell>
                      <TableCell>{rule.frequency}</TableCell>
                      <TableCell>₹{rule.amount.toLocaleString()}</TableCell>
                      <TableCell>{rule.nextDue}</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700">Active</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Clock className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Branding Templates</CardTitle>
              <CardDescription>Customize invoice appearance for different properties</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {brandTemplates.map((template) => (
                  <Card key={template.id} className="border-2 hover:border-[#C72030] transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div className="h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Template Preview</span>
                        </div>
                        <div>
                          <h3 className="font-semibold">{template.name}</h3>
                          <p className="text-sm text-gray-600">{template.description}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button size="sm" className="flex-1 bg-[#C72030] hover:bg-[#A01825]">
                            Customize
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Collection Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>On-time Payments</span>
                    <span className="font-semibold">89.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Late Payments</span>
                    <span className="font-semibold">8.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Defaults</span>
                    <span className="font-semibold">2.3%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>This Month</span>
                    <span className="font-semibold">₹2.8Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Month</span>
                    <span className="font-semibold">₹2.6Cr</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Growth</span>
                    <span className="font-semibold text-green-600">+7.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvoiceManagement;
