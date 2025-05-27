
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BarChart3, PieChart, TrendingUp, FileText, Calendar, Settings } from 'lucide-react';

const OpexReporting = () => {
  return (
    <div className="space-y-6">
      <Card className="bg-white border border-gray-200">
        <CardHeader className="bg-gray-50 border-b border-gray-200">
          <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
            <FileText className="h-5 w-5 text-[#C72030]" />
            Financial Reports
          </CardTitle>
          <CardDescription className="text-[#D5DbDB]">Generate comprehensive OPEX reports</CardDescription>
        </CardHeader>
        <CardContent className="bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200 bg-[#f6f4ee] hover:bg-gray-50">
              <BarChart3 className="h-6 w-6 mb-2 text-[#C72030]" />
              <span className="text-sm text-[#1a1a1a]">Monthly Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200 bg-[#f6f4ee] hover:bg-gray-50">
              <PieChart className="h-6 w-6 mb-2 text-[#C72030]" />
              <span className="text-sm text-[#1a1a1a]">Category Breakdown</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center border-gray-200 bg-[#f6f4ee] hover:bg-gray-50">
              <TrendingUp className="h-6 w-6 mb-2 text-[#C72030]" />
              <span className="text-sm text-[#1a1a1a]">Trend Analysis</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Download className="h-5 w-5 text-[#C72030]" />
              Quick Reports
            </CardTitle>
            <CardDescription className="text-[#D5DbDB]">Pre-configured report templates</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-3">
              {[
                'Property-wise OPEX Summary',
                'Vendor Performance Report',
                'Budget Variance Analysis',
                'Year-over-Year Comparison',
                'Expense Category Trends'
              ].map((report, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-[#f6f4ee] bg-[#f6f4ee]">
                  <span className="text-sm text-[#1a1a1a]">{report}</span>
                  <Button variant="ghost" size="sm" className="text-[#C72030] hover:text-[#A01825] hover:bg-white">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-gray-200">
          <CardHeader className="bg-gray-50 border-b border-gray-200">
            <CardTitle className="text-[#1a1a1a] flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#C72030]" />
              Custom Reports
            </CardTitle>
            <CardDescription className="text-[#D5DbDB]">Build reports with custom parameters</CardDescription>
          </CardHeader>
          <CardContent className="bg-white">
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg bg-[#f6f4ee]">
                <h4 className="text-sm font-medium text-[#1a1a1a] mb-2 flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-[#C72030]" />
                  Report Builder
                </h4>
                <p className="text-xs text-[#D5DbDB] mb-3">Create custom reports with specific date ranges, properties, and categories</p>
                <Button size="sm" className="bg-[#C72030] hover:bg-[#A01825] text-white">Launch Builder</Button>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg bg-[#f6f4ee]">
                <h4 className="text-sm font-medium text-[#1a1a1a] mb-2 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#C72030]" />
                  Scheduled Reports
                </h4>
                <p className="text-xs text-[#D5DbDB] mb-3">Set up automated report delivery to stakeholders</p>
                <Button size="sm" variant="outline" className="border-gray-200 text-[#1a1a1a] hover:bg-white">Configure</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OpexReporting;
