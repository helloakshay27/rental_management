
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, Activity, TrendingUp } from 'lucide-react';

const UtilityReporting = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">Utility Reports</CardTitle>
          <CardDescription className="text-gray-600">Generate comprehensive utility usage and cost reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200">
              <BarChart3 className="h-6 w-6 mb-2 text-[#C72030]" />
              <span className="text-sm text-gray-700">Usage Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200">
              <Activity className="h-6 w-6 mb-2 text-[#C72030]" />
              <span className="text-sm text-gray-700">Efficiency Analysis</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200">
              <TrendingUp className="h-6 w-6 mb-2 text-[#C72030]" />
              <span className="text-sm text-gray-700">Cost Trends</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Standard Reports</CardTitle>
            <CardDescription className="text-gray-600">Pre-configured utility reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Monthly Consumption Summary',
                'Property Comparison Report',
                'Utility Cost Analysis',
                'Efficiency Benchmarking',
                'Billing Reconciliation'
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-sm text-gray-700">{report}</span>
                  <Button variant="ghost" size="sm" className="text-[#C72030] hover:text-[#A01825]">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Analytics Dashboard</CardTitle>
            <CardDescription className="text-gray-600">Interactive utility analytics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Usage Trends</h4>
                <p className="text-xs text-gray-600 mb-3">View consumption patterns and identify anomalies</p>
                <Button size="sm" className="bg-[#C72030] hover:bg-[#A01825]">View Dashboard</Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Cost Optimization</h4>
                <p className="text-xs text-gray-600 mb-3">Analyze costs and identify savings opportunities</p>
                <Button size="sm" variant="outline" className="border-gray-200">Analyze Costs</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UtilityReporting;
