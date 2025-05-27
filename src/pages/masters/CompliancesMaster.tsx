
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, AlertTriangle, Calendar, FileText, Building2 } from 'lucide-react';

const CompliancesMaster = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCompliance, setEditingCompliance] = useState(null);

  const compliances = [
    {
      id: 'C001',
      name: 'Fire Safety NOC',
      type: 'Safety',
      description: 'Fire Department No Objection Certificate',
      validityPeriod: 12, // months
      applicablePropertyTypes: ['Residential', 'Commercial'],
      specificProperties: [],
      renewalNotice: 30, // days before expiry
      status: 'Active',
      documents: ['Fire NOC Certificate', 'Fire Safety Plan'],
      authority: 'Fire Department',
      cost: '₹5,000',
      createdDate: '2024-01-15'
    },
    {
      id: 'C002',
      name: 'Municipal Operating License',
      type: 'Operating',
      description: 'Local municipal operating permission',
      validityPeriod: 24, // months
      applicablePropertyTypes: ['Commercial'],
      specificProperties: ['P003'],
      renewalNotice: 60, // days before expiry
      status: 'Active',
      documents: ['Operating License', 'Property Tax Receipt'],
      authority: 'Municipal Corporation',
      cost: '₹10,000',
      createdDate: '2024-02-01'
    },
    {
      id: 'C003',
      name: 'Environmental Clearance',
      type: 'Environmental',
      description: 'Environmental impact clearance certificate',
      validityPeriod: 36, // months
      applicablePropertyTypes: ['Warehouse'],
      specificProperties: [],
      renewalNotice: 90, // days before expiry
      status: 'Active',
      documents: ['Environmental Certificate', 'Pollution Control Board NOC'],
      authority: 'Pollution Control Board',
      cost: '₹15,000',
      createdDate: '2024-03-10'
    }
  ];

  const filteredCompliances = compliances.filter(compliance =>
    compliance.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compliance.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    compliance.authority.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEditCompliance = (compliance) => {
    setEditingCompliance(compliance);
  };

  const handleDeleteCompliance = (compliance) => {
    console.log('Delete compliance:', compliance.id);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800';
      case 'Inactive': return 'bg-gray-100 text-gray-800';
      case 'Expiring': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliances Master</h1>
          <p className="text-gray-600">Manage property compliance requirements and tracking</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Add Compliance
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle>Add New Compliance</DialogTitle>
              <DialogDescription>Create a new compliance requirement</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="compliance-name">Compliance Name</Label>
                <Input id="compliance-name" placeholder="e.g., Fire Safety NOC" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compliance-type">Compliance Type</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="operating">Operating</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="tax">Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" placeholder="Brief description of the compliance" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="validity-period">Validity Period (Months)</Label>
                <Input id="validity-period" type="number" placeholder="e.g., 12" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="renewal-notice">Renewal Notice (Days)</Label>
                <Input id="renewal-notice" type="number" placeholder="e.g., 30" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="authority">Issuing Authority</Label>
                <Input id="authority" placeholder="e.g., Fire Department" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cost">Approximate Cost</Label>
                <Input id="cost" placeholder="e.g., ₹5,000" className="bg-white" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="property-types">Applicable Property Types</Label>
                <Select>
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="Select property types" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="warehouse">Warehouse</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Compliance</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Compliance Requirements</CardTitle>
              <CardDescription>Manage all compliance requirements and their applicability</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search compliances..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Compliance Details</TableHead>
                <TableHead>Type & Authority</TableHead>
                <TableHead>Validity & Cost</TableHead>
                <TableHead>Applicable To</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompliances.map((compliance) => (
                <TableRow key={compliance.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{compliance.name}</p>
                      <p className="text-sm text-gray-500">ID: {compliance.id}</p>
                      <p className="text-sm text-gray-500">{compliance.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Badge variant="outline" className="mb-1">{compliance.type}</Badge>
                      <p className="text-sm text-gray-600">{compliance.authority}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center text-sm mb-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{compliance.validityPeriod} months</span>
                      </div>
                      <p className="text-sm text-gray-600">{compliance.cost}</p>
                      <p className="text-xs text-gray-500">{compliance.renewalNotice} days notice</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      {compliance.applicablePropertyTypes.length > 0 && (
                        <div className="mb-1">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <Building2 className="h-3 w-3 mr-1" />
                            Property Types:
                          </div>
                          {compliance.applicablePropertyTypes.map((type) => (
                            <Badge key={type} variant="secondary" className="text-xs mr-1 mb-1">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      )}
                      {compliance.specificProperties.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-500">Specific Properties: {compliance.specificProperties.join(', ')}</p>
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(compliance.status)}>
                      {compliance.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEditCompliance(compliance)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDeleteCompliance(compliance)}>
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

      {/* Edit Compliance Dialog */}
      <Dialog open={!!editingCompliance} onOpenChange={() => setEditingCompliance(null)}>
        <DialogContent className="max-w-3xl bg-white">
          <DialogHeader>
            <DialogTitle>Edit Compliance</DialogTitle>
            <DialogDescription>Update compliance information</DialogDescription>
          </DialogHeader>
          {editingCompliance && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-compliance-name">Compliance Name</Label>
                <Input id="edit-compliance-name" defaultValue={editingCompliance.name} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-compliance-type">Compliance Type</Label>
                <Select defaultValue={editingCompliance.type.toLowerCase()}>
                  <SelectTrigger className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="operating">Operating</SelectItem>
                    <SelectItem value="environmental">Environmental</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                    <SelectItem value="tax">Tax</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="edit-description">Description</Label>
                <Input id="edit-description" defaultValue={editingCompliance.description} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-validity-period">Validity Period (Months)</Label>
                <Input id="edit-validity-period" type="number" defaultValue={editingCompliance.validityPeriod} className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-renewal-notice">Renewal Notice (Days)</Label>
                <Input id="edit-renewal-notice" type="number" defaultValue={editingCompliance.renewalNotice} className="bg-white" />
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setEditingCompliance(null)}>Cancel</Button>
            <Button className="bg-[#C72030] hover:bg-[#A01825]" onClick={() => setEditingCompliance(null)}>Update Compliance</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompliancesMaster;
