
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Plus, Edit, Trash2, Eye, Upload, Palette } from 'lucide-react';

const BrandingManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const brandingProfiles = [
    {
      id: 'B001',
      name: 'Premium Properties Branding',
      properties: ['Sunset Apartments', 'Green Valley Villa'],
      logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100',
      primaryColor: '#C72030',
      secondaryColor: '#1a1a1a',
      companyName: 'Premium Properties Ltd.',
      address: '123 Business District, Mumbai',
      phone: '+91 98765 43210',
      email: 'billing@premiumproperties.com',
      status: 'Active'
    },
    {
      id: 'B002', 
      name: 'Metro Real Estate Branding',
      properties: ['City Center Office'],
      logo: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=100',
      primaryColor: '#2563eb',
      secondaryColor: '#374151',
      companyName: 'Metro Real Estate',
      address: '456 Corporate Tower, Delhi',
      phone: '+91 98765 43211',
      email: 'invoices@metrorealestate.com',
      status: 'Active'
    }
  ];

  const filteredProfiles = brandingProfiles.filter(profile =>
    profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.companyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Branding Management</h1>
          <p className="text-gray-600">Manage branding profiles for invoices and communications</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#C72030] hover:bg-[#A01825]">
              <Plus className="h-4 w-4 mr-2" />
              Add Branding Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl bg-white">
            <DialogHeader>
              <DialogTitle>Create New Branding Profile</DialogTitle>
              <DialogDescription>Set up branding for property invoices and communications</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2 col-span-2">
                <Label htmlFor="profile-name">Profile Name</Label>
                <Input id="profile-name" placeholder="e.g., Premium Properties Branding" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input id="company-name" placeholder="Enter company name" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Billing Email</Label>
                <Input id="email" type="email" placeholder="billing@company.com" className="bg-white" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Company Address</Label>
                <Textarea id="address" placeholder="Enter complete address" className="bg-white" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input id="primary-color" type="color" defaultValue="#C72030" className="w-20 bg-white" />
                  <Input placeholder="#C72030" className="bg-white" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="secondary-color">Secondary Color</Label>
                <div className="flex items-center space-x-2">
                  <Input id="secondary-color" type="color" defaultValue="#1a1a1a" className="w-20 bg-white" />
                  <Input placeholder="#1a1a1a" className="bg-white" />
                </div>
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="logo">Company Logo</Label>
                <Button variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Logo
                </Button>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Branding Profile</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Branding Profiles</CardTitle>
              <CardDescription>Manage invoice branding and company information</CardDescription>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search branding profiles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64 bg-white"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Profile Details</TableHead>
                <TableHead>Company Info</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Brand Colors</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProfiles.map((profile) => (
                <TableRow key={profile.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <img src={profile.logo} alt="Logo" className="w-8 h-8 rounded object-cover" />
                      <div>
                        <p className="font-medium">{profile.name}</p>
                        <p className="text-sm text-gray-500">ID: {profile.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{profile.companyName}</p>
                      <p className="text-sm text-gray-500">{profile.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {profile.properties.map((property, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {property}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: profile.primaryColor }}
                      />
                      <div 
                        className="w-4 h-4 rounded border"
                        style={{ backgroundColor: profile.secondaryColor }}
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">{profile.status}</Badge>
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

export default BrandingManagement;
