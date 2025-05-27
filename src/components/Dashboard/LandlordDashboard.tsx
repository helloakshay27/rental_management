
import React from 'react';
import { Building2, FileText, DollarSign, AlertTriangle, Users, Calendar, TrendingUp, Home } from 'lucide-react';
import StatCard from './StatCard';
import IncomeExpenseChart from './IncomeExpenseChart';
import RecentActivity from './RecentActivity';
import UpcomingRenewals from './UpcomingRenewals';
import PropertyStatusOverview from './PropertyStatusOverview';
import QuickActions from './QuickActions';

const LandlordDashboard = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={24}
          change="+2 this month"
          changeType="positive"
          icon={Building2}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Active Tenants"
          value={18}
          change="3 leases expiring soon"
          changeType="warning"
          icon={Users}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Monthly Income"
          value="₹12.5L"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
        <StatCard
          title="Pending Actions"
          value={7}
          change="2 urgent items"
          changeType="negative"
          icon={AlertTriangle}
          color="bg-[#C72030]"
          backgroundColor="bg-[#f6f4ee]"
        />
      </div>

      {/* Quick Actions */}
      <QuickActions />

      {/* Property Status Overview */}
      <PropertyStatusOverview />

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <IncomeExpenseChart />
        <UpcomingRenewals />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8">
        <RecentActivity />
      </div>
    </div>
  );
};

export default LandlordDashboard;
