
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto bg-white min-h-full">
      {/* Header Section */}
      <div className="bg-[#f6f4ee] rounded-2xl p-8 border border-gray-200">
        <h1 className="text-4xl font-bold text-[#D5DbDB]">Property Dashboard</h1>
        <p className="text-[#D5DbDB]/80 mt-2 text-lg">Welcome back! Here's your property portfolio overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={24}
          change="+2 this month"
          changeType="positive"
          icon={Building2}
          color="bg-[#f6f4ee]"
        />
        <StatCard
          title="Active Agreements"
          value={18}
          change="3 expiring soon"
          changeType="warning"
          icon={FileText}
          color="bg-[#f6f4ee]"
        />
        <StatCard
          title="Monthly Income"
          value="₹12.5L"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
          color="bg-[#f6f4ee]"
        />
        <StatCard
          title="Pending Actions"
          value={7}
          change="2 urgent items"
          changeType="negative"
          icon={AlertTriangle}
          color="bg-[#f6f4ee]"
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
