
import React from 'react';
import { Building2, DollarSign, Users, AlertTriangle, TrendingUp, MapPin, Calendar, FileText } from 'lucide-react';
import StatCard from './StatCard';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import LandlordVacancyChart from './LandlordVacancyChart';
import LandlordRevenueChart from './LandlordRevenueChart';
import LandlordRegionalAnalytics from './LandlordRegionalAnalytics';
import LandlordPortfolioSummary from './LandlordPortfolioSummary';
import LandlordMaintenanceChart from './LandlordMaintenanceChart';
import LandlordRentRollChart from './LandlordRentRollChart';

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

      {/* Regional Analytics */}
      <LandlordRegionalAnalytics />

      {/* Recent Activity */}
      <div className="grid grid-cols-1 gap-8">
        <RecentActivity />
      </div>
    </div>
  );
};

export default LandlordAnalyticalDashboard;
