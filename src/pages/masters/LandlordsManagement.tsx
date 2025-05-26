
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Phone, Mail, Building } from 'lucide-react';

const LandlordsManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const landlords = [
    {
      id: 'L001',
      name: 'Suresh Enterprises',
      contactPerson: 'Mr. Suresh Gupta',
      email: 'suresh@enterprises.com',
      phone: '+91 98765 43210',
      pan: 'ABCDE1234F',
      gst: '27ABCDE1234F1Z5',
      propertiesCount: 5,
      totalValue: 25000000,
      status: 'Active',
      bankAccount: 'HDFC Bank - ****5678'
    },
    {
      id: 'L002',
      name: 'Sharma Properties',
      contactPerson: 'Mrs. Kavita Sharma',
      email: 'kavita@sharmaproperties.com',
      phone: '+91 87654 32109',
      pan: 'BCDEF2345G',
      gst: '27BCDEF2345G1Z5',
      propertiesCount: 3,
      totalValue: 18000000,
      status: 'Active',
      bankAccount: 'ICICI Bank - ****9012'
    },
    {
      id: 'L003',
      name: 'Metro Real Estate',
      contactPerson: 'Mr. Rajesh Patel',
      email: 'rajesh@metrorealestate.com',
      phone: '+91 76543 21098',
      pan: 'CDEFG3456H',
      gst: '27CDEFG3456H1Z5',
      propertiesCount: 8,
      totalValue: 40000000,
      status: 'Active',
      bankAccount: 'SBI Bank - ****3456'
    }
  ];

  const filteredLandlords = landlords.filter(landlord =>
    landlord.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
    landlord.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Landlords Management</h1>
          <p className="text-gray-600">Manage landlord profiles, properties, and contact details</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Add Landlord
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-white">
            <DialogHeader>
              <DialogTitle>Add New Landlord</DialogTitle>
              <DialogDescription>Enter landlord business and contact information</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="company-name">Company/Business Name</Label>
                <Input id="company-name" placeholder="Enter business name" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-person">Contact Person</Label>
                <Input id="contact-person" placeholder="Enter contact person" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="Enter email" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" placeholder="Enter phone number" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pan">PAN Number</Label>
                <Input id="pan" placeholder="Enter PAN number" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gst">GST Number</Label>
                <Input id="gst" placeholder="Enter GST number" className="bg-white" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Landlord</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Landlords Directory</CardTitle>
              <CardDescription>Complete list of all landlords and property owners</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search landlords..."
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
                <TableHead>Business Details</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Tax Details</TableHead>
                <TableHead>Portfolio</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLandlords.map((landlord) => (
                <TableRow key={landlord.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{landlord.name}</p>
                      <p className="text-sm text-gray-500">Contact: {landlord.contactPerson}</p>
                      <p className="text-sm text-gray-500">ID: {landlord.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <Mail className="h-3 w-3 mr-1" />
                        {landlord.email}
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="h-3 w-3 mr-1" />
                        {landlord.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">PAN: {landlord.pan}</p>
                      <p className="text-sm">GST: {landlord.gst}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="flex items-center text-sm">
                        <Building className="h-3 w-3 mr-1" />
                        {landlord.propertiesCount} Properties
                      </div>
                      <p className="text-sm font-medium">₹{(landlord.totalValue / 10000000).toFixed(1)}Cr</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{landlord.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
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

export default LandlordsManagement;
