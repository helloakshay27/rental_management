
import React from 'react';
import { Building2, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/Dashboard/StatCard';
import IncomeExpenseChart from '@/components/Dashboard/IncomeExpenseChart';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import UpcomingRenewals from '@/components/Dashboard/UpcomingRenewals';
import PropertyStatusOverview from '@/components/Dashboard/PropertyStatusOverview';
import QuickActions from '@/components/Dashboard/QuickActions';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6 bg-white min-h-full">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Property Dashboard</h1>
          <p className="text-[#1a1a1a]/70 mt-2">Welcome back! Here's your property portfolio overview.</p>
        </div>
      </div>

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
          title="Active Agreements"
          value={18}
          change="3 expiring soon"
          changeType="warning"
          icon={FileText}
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

export default Dashboard;
