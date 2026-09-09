
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StatsGrid } from '@/components/ui/page';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatsCard } from '@/components/ui/stats-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { EnhancedTable } from '@/components/enhanced-table/EnhancedTable';
import { ColumnConfig } from '@/hooks/useEnhancedTable';
import { Calendar, FileText, Clock, AlertTriangle, CheckCircle, Plus } from 'lucide-react';

const columns: ColumnConfig[] = [
  { key: 'tenantName', label: 'Tenant', sortable: true, draggable: true },
  { key: 'propertyName', label: 'Property', sortable: true, draggable: true },
  { key: 'currentLeaseEnd', label: 'Current Lease End', sortable: true, draggable: true },
  { key: 'daysUntilExpiry', label: 'Days Until Expiry', sortable: true, draggable: true },
  { key: 'currentRent', label: 'Current Rent', sortable: true, draggable: true },
  { key: 'proposedRent', label: 'Proposed Rent', sortable: true, draggable: true },
  { key: 'renewalStatus', label: 'Status', sortable: true, draggable: true },
];

const LeaseRenewals = () => {
  const navigate = useNavigate();
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
        return <Badge variant="success" className="flex items-center gap-1 w-fit">
          <CheckCircle className="h-3 w-3" />
          Renewed
        </Badge>;
      case 'pending_tenant':
        return <Badge variant="pending" className="flex items-center gap-1 w-fit">
          <Clock className="h-3 w-3" />
          Pending Tenant
        </Badge>;
      case 'under_negotiation':
        return <Badge variant="info" className="flex items-center gap-1 w-fit">
          <FileText className="h-3 w-3" />
          Negotiating
        </Badge>;
      case 'notice_given':
        return <Badge variant="rejected" className="flex items-center gap-1 w-fit">
          <AlertTriangle className="h-3 w-3" />
          Notice Given
        </Badge>;
      case 'draft':
        return <Badge variant="inactive">Draft</Badge>;
      default:
        return <Badge variant="inactive">Unknown</Badge>;
    }
  };

  const getDaysUntilExpiryBadge = (days: number) => {
    if (days < 0) {
      return <Badge variant="rejected">Expired</Badge>;
    } else if (days <= 30) {
      return <Badge variant="warning">{days} days</Badge>;
    } else if (days <= 60) {
      return <Badge variant="pending">{days} days</Badge>;
    } else {
      return <Badge variant="success">{days} days</Badge>;
    }
  };

  const filteredRenewals = renewals.filter(renewal =>
    renewal.tenantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    renewal.propertyName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const renderCell = (renewal: typeof renewals[number], columnKey: string) => {
    switch (columnKey) {
      case 'tenantName':
        return <span className="font-medium">{renewal.tenantName}</span>;
      case 'currentLeaseEnd':
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-brand-text-light" />
            {new Date(renewal.currentLeaseEnd).toLocaleDateString()}
          </div>
        );
      case 'daysUntilExpiry':
        return getDaysUntilExpiryBadge(renewal.daysUntilExpiry);
      case 'currentRent':
        return <span className="font-medium">₹{renewal.currentRent.toLocaleString()}</span>;
      case 'proposedRent':
        return (
          <div>
            <div className="font-medium">₹{renewal.proposedRent.toLocaleString()}</div>
            <div className="text-brand-caption text-brand-success">
              +{Math.round(((renewal.proposedRent - renewal.currentRent) / renewal.currentRent) * 100)}%
            </div>
          </div>
        );
      case 'renewalStatus':
        return getStatusBadge(renewal.renewalStatus);
      default:
        return renewal[columnKey as keyof typeof renewal];
    }
  };

  const renderActions = (renewal: typeof renewals[number]) => (
    <div className="flex items-center gap-1">
      {renewal.renewalStatus === 'draft' && (
        <Button variant="ghost" size="sm">Send Offer</Button>
      )}
      {renewal.renewalStatus === 'pending_tenant' && (
        <Button variant="ghost" size="sm">Follow Up</Button>
      )}
      {renewal.renewalStatus === 'under_negotiation' && (
        <Button variant="ghost" size="sm">Negotiate</Button>
      )}
      <Button variant="ghost" size="sm" title="View document">
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  );

  const leftActions = (
    <Button onClick={() => navigate('/rental/new')} className="fm-button-fix fm-button-brand px-6 py-2">
      <Plus className="w-4 h-4 mr-2" />
      New Renewal
    </Button>
  );

  return (
    <div className="space-y-5">
      {/* Summary Cards */}
      <StatsGrid>
        <StatsCard
          title="Expiring Soon"
          value={renewals.filter(r => r.daysUntilExpiry <= 30 && r.daysUntilExpiry >= 0).length}
          icon={<Clock />}
          footer={
            <p className="mt-0.5 text-brand-caption text-brand-warning">Within 30 days</p>
          }
        />
        <StatsCard
          title="Pending Response"
          value={renewals.filter(r => r.renewalStatus === 'pending_tenant').length}
          icon={<AlertTriangle />}
        />
        <StatsCard
          title="Under Negotiation"
          value={renewals.filter(r => r.renewalStatus === 'under_negotiation').length}
          icon={<FileText />}
        />
        <StatsCard
          title="Renewed"
          value={renewals.filter(r => r.renewalStatus === 'renewed').length}
          icon={<CheckCircle />}
        />
      </StatsGrid>

      {/* Lease Renewals Table */}
      <div>
        <EnhancedTable
          data={filteredRenewals}
          columns={columns}
          renderCell={renderCell}
          renderActions={renderActions}
          getItemId={(renewal) => renewal.id}
          storageKey="lease-renewals-table"
          leftActions={leftActions}
          emptyMessage="No lease renewals found"
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Search by tenant or property..."
          disableClientSearch={true}
          enableSearch={true}
          enableSelection={false}
          exportFileName="lease-renewals"
          pagination={true}
          pageSize={10}
        />
      </div>
    </div>
  );
};

export default LeaseRenewals;
