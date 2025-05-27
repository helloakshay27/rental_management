
import React from 'react';
import { Home, CreditCard, Calendar, AlertTriangle, FileText, Clock, CheckCircle, DollarSign } from 'lucide-react';
import StatCard from './StatCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const TenantDashboard = () => {
  // Mock data for tenant view
  const upcomingPayments = [
    {
      id: 1,
      property: 'Sunset Apartments - Unit 2A',
      amount: 2500,
      dueDate: '2024-06-01',
      status: 'upcoming'
    },
    {
      id: 2,
      property: 'Downtown Plaza - Unit 5B',
      amount: 3200,
      dueDate: '2024-06-05',
      status: 'due_soon'
    }
  ];

  const recentMaintenanceRequests = [
    {
      id: 1,
      property: 'Sunset Apartments - Unit 2A',
      issue: 'Air conditioning not working',
      status: 'in_progress',
      date: '2024-05-20'
    },
    {
      id: 2,
      property: 'Downtown Plaza - Unit 5B',
      issue: 'Leaky faucet in kitchen',
      status: 'completed',
      date: '2024-05-15'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>;
      case 'upcoming':
        return <Badge className="bg-gray-100 text-gray-800">Upcoming</Badge>;
      case 'due_soon':
        return <Badge className="bg-orange-100 text-orange-800">Due Soon</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Rentals"
          value={2}
          change="No changes"
          changeType="neutral"
          icon={Home}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Rent Due This Month"
          value="₹5.7L"
          change="2 payments pending"
          changeType="warning"
          icon={CreditCard}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Maintenance Requests"
          value={3}
          change="1 in progress"
          changeType="neutral"
          icon={AlertTriangle}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Lease Expiry"
          value="8 months"
          change="Next expiry: Dec 2024"
          changeType="positive"
          icon={Calendar}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
      </div>

      {/* Upcoming Payments and Maintenance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Payments */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Upcoming Rent Payments
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-4">
              {upcomingPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{payment.property}</p>
                    <p className="text-sm text-gray-600">Due: {new Date(payment.dueDate).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">₹{payment.amount.toLocaleString()}</p>
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              ))}
              <Button className="w-full bg-[#C72030] hover:bg-[#A01825] text-white">
                Make Payment
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Maintenance Requests */}
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-white border-b border-gray-200">
            <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Maintenance Requests
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white p-6">
            <div className="space-y-4">
              {recentMaintenanceRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{request.issue}</p>
                    <p className="text-sm text-gray-600">{request.property}</p>
                    <p className="text-xs text-gray-500">Requested: {new Date(request.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-[#C72030] text-[#C72030] hover:bg-[#C72030] hover:text-white">
                Submit New Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Documents and Lease Information */}
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-white border-b border-gray-200">
          <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Documents & Updates
          </CardTitle>
        </CardHeader>
        <CardContent className="bg-white p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Lease Agreement</h4>
              <p className="text-sm text-gray-600 mb-2">Sunset Apartments - Unit 2A</p>
              <Button variant="ghost" size="sm" className="text-[#C72030] p-1">
                <FileText className="h-4 w-4 mr-2" />
                View Document
              </Button>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Rent Receipt</h4>
              <p className="text-sm text-gray-600 mb-2">May 2024 Payment</p>
              <Button variant="ghost" size="sm" className="text-[#C72030] p-1">
                <FileText className="h-4 w-4 mr-2" />
                Download Receipt
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantDashboard;
