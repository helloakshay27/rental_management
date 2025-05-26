
import React from 'react';
import { Building2, FileText, DollarSign, AlertTriangle } from 'lucide-react';
import StatCard from '@/components/Dashboard/StatCard';
import IncomeExpenseChart from '@/components/Dashboard/IncomeExpenseChart';
import RecentActivity from '@/components/Dashboard/RecentActivity';
import UpcomingRenewals from '@/components/Dashboard/UpcomingRenewals';

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's your property portfolio overview.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Properties"
          value={24}
          change="+2 this month"
          changeType="positive"
          icon={Building2}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Agreements"
          value={18}
          change="3 expiring soon"
          changeType="warning"
          icon={FileText}
          color="bg-green-500"
        />
        <StatCard
          title="Monthly Income"
          value="₹12.5L"
          change="+8.2% from last month"
          changeType="positive"
          icon={DollarSign}
          color="bg-purple-500"
        />
        <StatCard
          title="Pending Actions"
          value={7}
          change="2 urgent items"
          changeType="negative"
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Charts and Data */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <IncomeExpenseChart />
        <UpcomingRenewals />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <RecentActivity />
      </div>
    </div>
  );
};

export default Dashboard;
