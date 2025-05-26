
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Calendar, Search, FileText, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const LeaseRenewals = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for lease renewals
  const renewals = [
    {
      id: 'LR001',
      tenantName: 'Mike Wilson',
      propertyName: 'Green Valley - Unit 1C',
      currentLeaseEnd: '2024-05-31',
      daysUntilExpiry: 5,
      currentRent: 1800,
      proposedRent: 1950,
      renewalStatus: 'pending_tenant',
      renewalTerm: '12 months',
      noticeGiven: false
    },
    {
      id: 'LR002',
      tenantName: 'David Kim',
      propertyName: 'Hilltop Residency - Unit 3B',
      currentLeaseEnd: '2024-06-15',
      daysUntilExpiry: 20,
      currentRent: 2200,
      proposedRent: 2400,
      renewalStatus: 'under_negotiation',
      renewalTerm: '12 months',
      noticeGiven: false
    },
    {
      id: 'LR003',
      tenantName: 'Lisa Anderson',
      propertyName: 'Metro Heights - Unit 7A',
      currentLeaseEnd: '2024-07-10',
      daysUntilExpiry: 45,
      currentRent: 2800,
      proposedRent: 3000,
      renewalStatus: 'draft',
      renewalTerm: '24 months',
      noticeGiven: false
    },
    {
      id: 'LR004',
      tenantName: 'Robert Chen',
      propertyName: 'Parkside Villa - Unit 2C',
      currentLeaseEnd: '2024-08-20',
      daysUntilExpiry: 86,
      currentRent: 3500,
      proposedRent: 3700,
      renewalStatus: 'renewed',
      renewalTerm: '12 months',
      noticeGiven: false
    },
    {
      id: 'LR005',
      tenantName: 'Maria Rodriguez',
      propertyName: 'Sunset View - Unit 5D',
      currentLeaseEnd: '2024-04-30',
      daysUntilExpiry: -26,
      currentRent: 2100,
      proposedRent: 2200,
      renewalStatus: 'notice_given',
      renewalTerm: '6 months',
      noticeGiven: true
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'renewed':
        return <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          Renewed
        </Badge>;
      case 'pending_tenant':
        return <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Pending Tenant
        </Badge>;
      case 'under_negotiation':
        return <Badge className="bg-blue-100 text-blue-800 flex items-center gap-1">
          <FileText className="h-3 w-3" />
          Negotiating
        </Badge>;
      case 'notice_given':
        return <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          Notice Given
        </Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Draft</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getDaysUntilExpiryBadge = (days: number) => {
    if (days < 0) {
      return <Badge className="bg-red-100 text-red-800">Expired</Badge>;
    } else if (days <= 30) {
      return <Badge className="bg-orange-100 text-orange-800">{days} days</Badge>;
    } else if (days <= 60) {
      return <Badge className="bg-yellow-100 text-yellow-800">{days} days</Badge>;
    } else {
      return <Badge className="bg-green-100 text-green-800">{days} days</Badge>;
    }
  };

  const filteredRenewals = renewals.filter(renewal => 
    renewal.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    renewal.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-2xl font-bold">{renewals.filter(r => r.daysUntilExpiry <= 30 && r.daysUntilExpiry >= 0).length}</p>
                <p className="text-xs text-orange-600">Within 30 days</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <Clock className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Response</p>
                <p className="text-2xl font-bold">{renewals.filter(r => r.renewalStatus === 'pending_tenant').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Under Negotiation</p>
                <p className="text-2xl font-bold">{renewals.filter(r => r.renewalStatus === 'under_negotiation').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <FileText className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Renewed</p>
                <p className="text-2xl font-bold">{renewals.filter(r => r.renewalStatus === 'renewed').length}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lease Renewals Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lease Renewals & Expirations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by tenant or property..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Property</TableHead>
                  <TableHead>Current Lease End</TableHead>
                  <TableHead>Days Until Expiry</TableHead>
                  <TableHead>Current Rent</TableHead>
                  <TableHead>Proposed Rent</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRenewals.map((renewal) => (
                  <TableRow key={renewal.id}>
                    <TableCell className="font-medium">{renewal.tenantName}</TableCell>
                    <TableCell>{renewal.propertyName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(renewal.currentLeaseEnd).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>{getDaysUntilExpiryBadge(renewal.daysUntilExpiry)}</TableCell>
                    <TableCell className="font-medium">₹{renewal.currentRent.toLocaleString()}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">₹{renewal.proposedRent.toLocaleString()}</div>
                        <div className="text-xs text-green-600">
                          +{Math.round(((renewal.proposedRent - renewal.currentRent) / renewal.currentRent) * 100)}%
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(renewal.renewalStatus)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {renewal.renewalStatus === 'draft' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            Send Offer
                          </Button>
                        )}
                        {renewal.renewalStatus === 'pending_tenant' && (
                          <Button variant="ghost" size="sm" className="text-orange-600">
                            Follow Up
                          </Button>
                        )}
                        {renewal.renewalStatus === 'under_negotiation' && (
                          <Button variant="ghost" size="sm" className="text-blue-600">
                            Negotiate
                          </Button>
                        )}
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaseRenewals;
