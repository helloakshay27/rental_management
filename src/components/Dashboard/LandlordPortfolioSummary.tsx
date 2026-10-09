
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, MapPin, Calendar, DollarSign, Users, AlertTriangle } from 'lucide-react';
import { StatsCard } from '@/components/ui/stats-card';

const LandlordPortfolioSummary = () => {
  const portfolioMetrics = [
    {
      category: 'Property Types',
      data: [
        { type: 'Office Spaces', count: 128, percentage: 62, revenue: 1.8 },
        { type: 'Retail Units', count: 45, percentage: 22, revenue: 0.6 },
        { type: 'Warehouses', count: 33, percentage: 16, revenue: 0.4 }
      ]
    },
    {
      category: 'Lease Terms',
      data: [
        { type: 'Long-term (5+ years)', count: 89, percentage: 43, status: 'stable' },
        { type: 'Medium-term (2-5 years)', count: 76, percentage: 37, status: 'stable' },
        { type: 'Short-term (<2 years)', count: 41, percentage: 20, status: 'attention' }
      ]
    }
  ];

  const urgentItems = [
    { type: 'Lease Renewals', count: 18, deadline: '90 days', priority: 'high' },
    { type: 'Maintenance Issues', count: 12, deadline: '30 days', priority: 'medium' },
    { type: 'Compliance Updates', count: 8, deadline: '60 days', priority: 'high' },
    { type: 'Rent Reviews', count: 25, deadline: '45 days', priority: 'medium' }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="bg-white border border-gray-200">
      <CardHeader>
        <CardTitle className="text-brand-body-1 font-bold text-[#1a1a1a]">Portfolio Summary & Alerts</CardTitle>
        <p className="text-sm text-gray-600">Comprehensive overview of your property portfolio</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Portfolio Breakdown */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Portfolio Breakdown</h3>
            {portfolioMetrics.map((metric) => (
              <div key={metric.category} className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                <h4 className="font-medium text-[#1a1a1a] mb-4">{metric.category}</h4>
                <div className="space-y-3">
                  {metric.data.map((item) => (
                    <div key={item.type} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building2 size={16} className="text-blue-500" />
                        <span className="text-sm text-gray-700">{item.type}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-sm font-medium text-[#1a1a1a]">{item.count}</span>
                        <Badge variant="secondary" className="text-xs">
                          {item.percentage}%
                        </Badge>
                        {item.revenue && (
                          <span className="text-xs text-green-600 font-medium">
                            ₹{item.revenue}Cr
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Urgent Actions Required */}
          <div className="space-y-5">
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Urgent Actions Required</h3>
            <div className="space-y-4">
              {urgentItems.map((item) => (
                <div key={item.type} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle size={18} className="text-amber-500 mt-1" />
                      <div>
                        <h4 className="font-medium text-[#1a1a1a]">{item.type}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.count} items requiring attention
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Calendar size={14} className="text-blue-500" />
                          <span className="text-xs text-gray-500">Within {item.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <Badge className={getPriorityColor(item.priority)}>
                      {item.priority.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Key Metrics Summary */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatsCard title="Monthly Revenue" value="₹2.8Cr" icon={<DollarSign />} />
          <StatsCard title="Total Properties" value={206} icon={<Building2 />} />
          <StatsCard title="Occupancy Rate" value="94.2%" icon={<Users />} />
          <StatsCard title="Cities Covered" value={12} icon={<MapPin />} />
        </div>
      </CardContent>
    </Card>
  );
};

export default LandlordPortfolioSummary;
