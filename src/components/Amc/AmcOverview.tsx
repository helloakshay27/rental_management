import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wrench, Calendar, AlertTriangle, CheckCircle } from 'lucide-react';

const AmcOverview = () => {
  const stats = [
    { title: 'Active Contracts', value: '24', change: '+3', icon: Wrench },
    { title: 'Total AMC Value', value: '$125,600', change: '+8%', icon: Calendar },
    { title: 'Due for Renewal', value: '6', change: 'Next 3 months', icon: AlertTriangle },
    { title: 'Services Completed', value: '89%', change: 'This month', icon: CheckCircle }
  ];

  const recentServices = [
    { service: 'HVAC Maintenance', property: 'Sunset Apartments', vendor: 'CoolAir Services', date: '2024-01-15', status: 'Completed' },
    { service: 'Elevator Service', property: 'Downtown Plaza', vendor: 'LiftTech', date: '2024-01-14', status: 'In Progress' },
    { service: 'Fire Safety Check', property: 'Green Valley', vendor: 'SafeGuard Systems', date: '2024-01-12', status: 'Scheduled' },
    { service: 'Pest Control', property: 'Sunset Apartments', vendor: 'BugAway', date: '2024-01-10', status: 'Completed' }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="bg-white border border-gray-200">
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
              {[
                { category: 'HVAC Systems', contracts: 8, value: '$45,200' },
                { category: 'Elevators', contracts: 6, value: '$32,400' },
                { category: 'Fire Safety', contracts: 4, value: '$18,600' },
                { category: 'Security Systems', contracts: 3, value: '$15,200' },
                { category: 'Pest Control', contracts: 3, value: '$14,200' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 bg-white">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{item.category}</div>
                    <div className="text-xs text-gray-500">{item.contracts} contracts</div>
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{item.value}</div>
                </div>
              ))}
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
              {recentServices.map((service, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 bg-white">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{service.service}</div>
                    <div className="text-xs text-gray-500">{service.property} • {service.vendor}</div>
                    <div className="text-xs text-gray-400">{service.date}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    service.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    service.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AmcOverview;
