
import React from 'react';
import { Building2, DollarSign, Users, AlertTriangle, TrendingUp, MapPin, Calendar, FileText, Shield, Wrench, Receipt } from 'lucide-react';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LandlordVacancyChart from './LandlordVacancyChart';
import LandlordRevenueChart from './LandlordRevenueChart';
import LandlordRegionalAnalytics from './LandlordRegionalAnalytics';
import LandlordPortfolioSummary from './LandlordPortfolioSummary';
import LandlordMaintenanceChart from './LandlordMaintenanceChart';
import LandlordRentRollChart from './LandlordRentRollChart';
import FitoutAnalytics from './FitoutAnalytics';
import SecurityDepositAnalytics from './SecurityDepositAnalytics';
import KYCManagement from './KYCManagement';
import InvoiceManagement from './InvoiceManagement';

const LandlordAnalyticalDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Enhanced Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Portfolio Value"
          value="₹245.8Cr"
          change="+12.5% YoY"
          changeType="positive"
          icon={Building2}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Monthly Revenue"
          value="₹2.8Cr"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Occupancy Rate"
          value="94.2%"
          change="2.1% below target"
          changeType="warning"
          icon={Users}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Active Issues"
          value={23}
          change="5 critical items"
          changeType="negative"
          icon={AlertTriangle}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
      </div>

      {/* Additional KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Average Rent/SqFt"
          value="₹125"
          change="+15.2% YoY"
          changeType="positive"
          icon={TrendingUp}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Properties Across"
          value="12 Cities"
          change="2 new cities added"
          changeType="positive"
          icon={MapPin}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Lease Renewals Due"
          value={18}
          change="Next 90 days"
          changeType="warning"
          icon={Calendar}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Compliance Score"
          value="87%"
          change="3% improvement"
          changeType="positive"
          icon={FileText}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Portfolio Summary */}
      <LandlordPortfolioSummary />

      {/* Tabbed Analytics Section */}
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-white border border-gray-200 rounded-lg p-1">
          <TabsTrigger value="analytics" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="fitout" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <Wrench className="h-4 w-4 mr-2" />
            Fitout & Lockin
          </TabsTrigger>
          <TabsTrigger value="deposits" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <Shield className="h-4 w-4 mr-2" />
            Security Deposits
          </TabsTrigger>
          <TabsTrigger value="invoicing" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <Receipt className="h-4 w-4 mr-2" />
            Invoicing
          </TabsTrigger>
          <TabsTrigger value="kyc" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <FileText className="h-4 w-4 mr-2" />
            KYC Management
          </TabsTrigger>
          <TabsTrigger value="regional" className="text-[#1a1a1a] data-[state=active]:bg-[#C72030] data-[state=active]:text-white">
            <MapPin className="h-4 w-4 mr-2" />
            Regional
          </TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="space-y-8">
          {/* Analytics Charts - Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LandlordRevenueChart />
            <LandlordVacancyChart />
          </div>

          {/* Analytics Charts - Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <LandlordMaintenanceChart />
            <LandlordRentRollChart />
          </div>
        </TabsContent>

        <TabsContent value="fitout" className="space-y-6">
          <FitoutAnalytics />
        </TabsContent>

        <TabsContent value="deposits" className="space-y-6">
          <SecurityDepositAnalytics />
        </TabsContent>

        <TabsContent value="invoicing" className="space-y-6">
          <InvoiceManagement />
        </TabsContent>

        <TabsContent value="kyc" className="space-y-6">
          <KYCManagement />
        </TabsContent>

        <TabsContent value="regional" className="space-y-6">
          <LandlordRegionalAnalytics />
        </TabsContent>
      </Tabs>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8">
        <RecentActivity />
      </div>
    </div>
  );
};

export default LandlordAnalyticalDashboard;
