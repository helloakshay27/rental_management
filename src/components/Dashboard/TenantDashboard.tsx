import React, { useState, useEffect } from 'react';
import { Home, CreditCard, Calendar, AlertTriangle, FileText, Clock, CheckCircle, DollarSign, TrendingUp, MapPin, Users, Building, Shield, Wrench, Loader2 } from 'lucide-react';
import StatCard from './StatCard';
import QuickActions from './QuickActions';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TenantIncomeExpenseChart from './TenantIncomeExpenseChart';
import TenantLeaseExpiryChart from './TenantLeaseExpiryChart';
import SecurityDepositAnalytics from './SecurityDepositAnalytics';
import TenantRegionalAnalytics from './TenantRegionalAnalytics';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const TenantDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [securityDepositsData, setSecurityDepositsData] = useState<any>(null);
  const [regionalDashboardData, setRegionalDashboardData] = useState<any>(null);
  const [loadingSecurity, setLoadingSecurity] = useState(false);
  const [loadingRegional, setLoadingRegional] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const data = await getAuth('/tenants/dashboard');
        setDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();

    const fetchSecurityDeposits = async () => {
      try {
        setLoadingSecurity(true);
        const data = await getAuth('/tenants/security_deposits_dashboard.json');
        setSecurityDepositsData(data);
      } catch (error) {
        console.error('Failed to fetch security deposits data:', error);
      } finally {
        setLoadingSecurity(false);
      }
    };

    const fetchRegionalData = async () => {
      try {
        setLoadingRegional(true);
        const data = await getAuth('/tenants/regional_dashboard.json');
        setRegionalDashboardData(data);
      } catch (error) {
        console.error('Failed to fetch regional data:', error);
      } finally {
        setLoadingRegional(false);
      }
    };

    fetchSecurityDeposits();
    fetchRegionalData();
  }, []);

  // Mock data for large-scale tenant operations (will be replaced by API data)
  const upcomingPayments = dashboardData?.upcoming_payments || [
    {
      id: 1,
      property: 'Mumbai Corporate Tower - Floor 15',
      landlord: 'Prestige Properties Ltd',
      amount: 850000,
      dueDate: '2024-06-01',
      status: 'upcoming',
      region: 'Mumbai'
    },
    {
      id: 2,
      property: 'Delhi Business Park - Building A',
      landlord: 'DLF Commercial',
      amount: 1200000,
      dueDate: '2024-06-03',
      status: 'due_soon',
      region: 'Delhi'
    },
    {
      id: 3,
      property: 'Bangalore Tech Hub - Block C',
      landlord: 'Brigade Group',
      amount: 750000,
      dueDate: '2024-06-05',
      status: 'upcoming',
      region: 'Bangalore'
    }
  ];

  const criticalAlerts = dashboardData?.critical_alerts || [
    {
      id: 1,
      type: 'lease_expiry',
      property: 'Chennai IT Park - Wing B',
      message: 'Lease expires in 15 days',
      urgency: 'high',
      region: 'Chennai'
    },
    {
      id: 2,
      type: 'compliance',
      property: 'Pune Commercial Complex',
      message: 'Fire safety compliance due',
      urgency: 'medium',
      region: 'Pune'
    },
    {
      id: 3,
      type: 'escalation',
      property: 'Hyderabad Business Center',
      message: 'Rent escalation effective next month',
      urgency: 'low',
      region: 'Hyderabad'
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
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">High</Badge>;
      case 'medium':
        return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Low</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Normal</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Stats Grid for Large-Scale Operations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={dashboardData?.summary?.total_properties ?? 0}
          change={dashboardData?.summary?.total_properties_change}
          changeType="positive"
          icon={Building}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Active Leases"
          value={dashboardData?.summary?.active_leases ?? 0}
          change={dashboardData?.summary?.active_leases_change}
          changeType="warning"
          icon={FileText}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Monthly Rent Expense"
          value={`₹${dashboardData?.summary?.monthly_rent_expense?.amount_in_cr ?? 0}Cr`}
          change={dashboardData?.summary?.monthly_rent_expense_change}
          changeType="neutral"
          icon={DollarSign}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Pending Actions"
          value={dashboardData?.summary?.pending_actions ?? 0}
          change={dashboardData?.summary?.pending_actions_change}
          changeType="negative"
          icon={AlertTriangle}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
      </div>

      {/* Quick Actions for Tenant Operations */}
      <QuickActions />

      {/* Tabbed Analytics Section */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="overview" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="deposits" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Security Deposits
          </TabsTrigger>
          <TabsTrigger value="regional" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <MapPin className="h-4 w-4 mr-2" />
            Regional
          </TabsTrigger>

        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Regional Analytics and Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <TenantIncomeExpenseChart data={dashboardData?.monthly_expense_analysis} />
            <TenantLeaseExpiryChart data={dashboardData?.charts?.lease_expiry_distribution} />
          </div>

          {/* Critical Alerts and Upcoming Payments */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Critical Alerts */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  Critical Alerts & Compliance
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <div className="space-y-4">
                  {(dashboardData?.critical_alerts || []).length > 0 ? (
                    dashboardData.critical_alerts.map((alert: any) => (
                      <div key={alert.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-red-400">
                        <div>
                          <p className="font-medium text-gray-900">{alert.property}</p>
                          <p className="text-sm text-gray-600">{alert.message}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {alert.region}
                          </p>
                        </div>
                        <div>
                          {getUrgencyBadge(alert.urgency)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      No critical alerts at this time
                    </div>
                  )}
                  <Button className="w-full bg-[#C72030] hover:bg-[#A01825] text-white">
                    View All Alerts
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Rent Payments */}
            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Upcoming Rent Payments
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <div className="space-y-4">
                  {(dashboardData?.upcoming_rent_payments || []).length > 0 ? (
                    dashboardData.upcoming_rent_payments.map((payment: any) => (
                      <div key={payment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{payment.property}</p>
                          <p className="text-sm text-gray-600">Landlord: {payment.landlord}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" />
                            {payment.region} • Due: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg">₹{((payment.amount || 0) / 100000).toFixed(1)}L</p>
                          {getStatusBadge(payment.status)}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                      No upcoming rent payments
                    </div>
                  )}
                  <Button className="w-full bg-[#C72030] hover:bg-[#A01825] text-white">
                    Bulk Payment Processing
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Portfolio Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Regional Distribution
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <div className="space-y-3">
                  {(dashboardData?.regional_distribution || []).map((region: any, index: number) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{region.city}</span>
                      <span className="font-medium">{region.properties} properties</span>
                    </div>
                  ))}
                  {(dashboardData?.regional_distribution || []).length === 0 && (
                    <div className="text-sm text-gray-500 italic">No regional data available</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Landlord Partners
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Partners</span>
                    <span className="font-medium">{dashboardData?.landlord_partners?.total_partners || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Corporate Partners</span>
                    <span className="font-medium">{dashboardData?.landlord_partners?.corporate_partners || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Individual Owners</span>
                    <span className="font-medium">{dashboardData?.landlord_partners?.individual_owners || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">New This Quarter</span>
                    <span className="font-medium text-green-600">+{dashboardData?.landlord_partners?.new_this_quarter || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-200">
              <CardHeader className="bg-white border-b border-gray-200">
                <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Lease Schedule
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-white p-6">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expiring in 30 days</span>
                    <span className="font-medium text-red-600">{dashboardData?.lease_schedule?.expiring_in_30_days || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Expiring in 90 days</span>
                    <span className="font-medium text-orange-600">{dashboardData?.lease_schedule?.expiring_in_90_days || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Renewals Pending</span>
                    <span className="font-medium">{dashboardData?.lease_schedule?.renewals_pending || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Auto-Renewals</span>
                    <span className="font-medium text-green-600">{dashboardData?.lease_schedule?.auto_renewals || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="deposits" className="space-y-6">
          <SecurityDepositAnalytics data={securityDepositsData} loading={loadingSecurity} />
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <TenantRegionalAnalytics data={regionalDashboardData} loading={loadingRegional} />
        </TabsContent>
      </Tabs>

      {/* Recent Activity for Tenant Operations */}
     
    </div>
  );
};

export default TenantDashboard;
