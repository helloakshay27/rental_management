
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Calendar, AlertTriangle, CheckCircle, Loader2, DollarSign } from 'lucide-react';
import { getAuth } from '@/lib/api';
import { toast } from 'sonner';

const AmcOverview = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await getAuth('/amc_contracts/dashboard.json');
        setData(response);
      } catch (error) {
        console.error('Error fetching AMC dashboard:', error);
        toast.error('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      title: 'Active Contracts',
      value: data?.stats?.active_contracts || '0',
      change: data?.stats?.active_change || 'Overall',
      icon: Wrench
    },
    {
      title: 'Total AMC Value',
      value: `₹${(data?.stats?.total_value || 0).toLocaleString()}`,
      change: data?.stats?.value_change || 'Annual',
      icon: DollarSign
    },
    {
      title: 'Due for Renewal',
      value: data?.stats?.due_for_renewal || '0',
      change: 'Next 60 days',
      icon: AlertTriangle
    },
    {
      title: 'Services Completed',
      value: `${data?.stats?.completion_rate || 0}%`,
      change: 'Success rate',
      icon: CheckCircle
    }
  ];

  const recentServices = data?.recent_services || [];
  const contractSummary = data?.category_distribution || [];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-[#f6f4ee] border border-gray-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                <Icon className="h-4 w-4 text-[#C72030]" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Contract Summary</CardTitle>
            <CardDescription className="text-gray-600">AMC contracts by category</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
                </div>
              ) : contractSummary.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No data available</div>
              ) : (
                contractSummary.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 bg-white">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{item.category}</div>
                      <div className="text-xs text-gray-500">{item.count} contracts</div>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">₹{(item.value || 0).toLocaleString()}</div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Services</CardTitle>
            <CardDescription className="text-gray-600">Latest maintenance activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
                </div>
              ) : recentServices.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No recent activities</div>
              ) : (
                recentServices.map((service: any, index: number) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 bg-white">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{service.service_type || service.description}</div>
                      <div className="text-xs text-gray-500">{service.site_name || service.property} • {service.vendor_name || service.vendor}</div>
                      <div className="text-xs text-gray-400">{service.date || service.schedule_date}</div>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${['completed', 'finished'].includes(service.status?.toLowerCase()) ? 'bg-green-100 text-green-800' :
                        ['in progress', 'ongoing'].includes(service.status?.toLowerCase()) ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                      }`}>
                      {service.status}
                    </span>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmcOverview;
