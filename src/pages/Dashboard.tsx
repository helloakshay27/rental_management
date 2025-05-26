
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
    <div className="p-8 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
        <h1 className="text-4xl font-bold">Property Dashboard</h1>
        <p className="text-blue-100 mt-2 text-lg">Welcome back! Here's your property portfolio overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={24}
          change="+2 this month"
          changeType="positive"
          icon={Building2}
          color="bg-gradient-to-r from-blue-500 to-blue-600"
        />
        <StatCard
          title="Active Agreements"
          value={18}
          change="3 expiring soon"
          changeType="warning"
          icon={FileText}
          color="bg-gradient-to-r from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Monthly Income"
          value="₹12.5L"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
          color="bg-gradient-to-r from-purple-500 to-purple-600"
        />
        <StatCard
          title="Pending Actions"
          value={7}
          change="2 urgent items"
          changeType="negative"
          icon={AlertTriangle}
          color="bg-gradient-to-r from-red-500 to-red-600"
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
