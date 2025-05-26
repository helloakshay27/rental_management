
import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, FileText, PieChart, DollarSign } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line, Pie } from 'recharts';

const Reports = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');

  const revenueData = [
    { month: 'Jan', revenue: 4500000, expenses: 1800000 },
    { month: 'Feb', revenue: 4800000, expenses: 1950000 },
    { month: 'Mar', revenue: 5200000, expenses: 2100000 },
    { month: 'Apr', revenue: 4900000, expenses: 2000000 },
    { month: 'May', revenue: 5500000, expenses: 2200000 },
    { month: 'Jun', revenue: 5800000, expenses: 2350000 }
  ];

  const occupancyData = [
    { month: 'Jan', occupancy: 92 },
    { month: 'Feb', occupancy: 89 },
    { month: 'Mar', occupancy: 95 },
    { month: 'Apr', occupancy: 91 },
    { month: 'May', occupancy: 94 },
    { month: 'Jun', occupancy: 96 }
  ];

  const expenseBreakdown = [
    { name: 'Maintenance', value: 35, amount: 875000 },
    { name: 'Utilities', value: 25, amount: 625000 },
    { name: 'Security', value: 20, amount: 500000 },
    { name: 'Cleaning', value: 15, amount: 375000 },
    { name: 'Others', value: 5, amount: 125000 }
  ];

  const COLORS = ['#C72030', '#FF6B35', '#F7931E', '#FFD23F', '#6BCF7F'];

  const reports = [
    {
      title: 'Monthly Revenue Report',
      description: 'Comprehensive revenue analysis for the current month',
      type: 'Financial',
      lastGenerated: '2 hours ago',
      status: 'Ready'
    },
    {
      title: 'Occupancy Analytics',
      description: 'Property occupancy rates and trends',
      type: 'Operational',
      lastGenerated: '1 day ago',
      status: 'Ready'
    },
    {
      title: 'Maintenance Cost Analysis',
      description: 'Breakdown of maintenance expenses by property',
      type: 'Maintenance',
      lastGenerated: '3 days ago',
      status: 'Ready'
    },
    {
      title: 'Tenant Satisfaction Survey',
      description: 'Quarterly tenant feedback and satisfaction metrics',
      type: 'Customer',
      lastGenerated: '1 week ago',
      status: 'Pending'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Comprehensive insights into your property portfolio performance</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40 bg-white border-gray-200">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button className="bg-[#C72030] hover:bg-[#A01825]">
            <Download className="h-4 w-4 mr-2" />
            Export All
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-white border border-gray-200">
          <TabsTrigger value="overview" className="text-gray-700">Overview</TabsTrigger>
          <TabsTrigger value="financial" className="text-gray-700">Financial</TabsTrigger>
          <TabsTrigger value="operational" className="text-gray-700">Operational</TabsTrigger>
          <TabsTrigger value="custom" className="text-gray-700">Custom Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹3.18Cr</p>
                    <p className="text-sm text-green-600">+12.5% from last month</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-[#C72030]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
                    <p className="text-2xl font-bold text-gray-900">94.2%</p>
                    <p className="text-sm text-green-600">+2.1% from last month</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-[#C72030]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">₹1.27Cr</p>
                    <p className="text-sm text-red-600">+5.3% from last month</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-[#C72030]" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Net Income</p>
                    <p className="text-2xl font-bold text-gray-900">₹1.91Cr</p>
                    <p className="text-sm text-green-600">+18.2% from last month</p>
                  </div>
                  <PieChart className="h-8 w-8 text-[#C72030]" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Revenue vs Expenses</CardTitle>
                <CardDescription>Monthly comparison of revenue and expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#C72030" />
                    <Bar dataKey="expenses" fill="#FF6B35" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Occupancy Trends</CardTitle>
                <CardDescription>Property occupancy rate over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="occupancy" stroke="#C72030" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expense Breakdown</CardTitle>
                <CardDescription>Distribution of operational expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RechartsPieChart>
                    <Pie
                      data={expenseBreakdown}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {expenseBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Financial Summary</CardTitle>
                <CardDescription>Key financial metrics for this period</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {expenseBreakdown.map((expense, index) => (
                    <div key={expense.name} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-4 h-4 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        ></div>
                        <span className="font-medium text-gray-700">{expense.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">₹{(expense.amount / 100000).toFixed(1)}L</p>
                        <p className="text-sm text-gray-500">{expense.value}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="operational" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Occupancy</h3>
                  <p className="text-3xl font-bold text-[#C72030]">94.2%</p>
                  <p className="text-sm text-gray-600 mt-1">Across all properties</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Maintenance Requests</h3>
                  <p className="text-3xl font-bold text-orange-500">23</p>
                  <p className="text-sm text-gray-600 mt-1">This month</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Tenant Satisfaction</h3>
                  <p className="text-3xl font-bold text-green-500">4.6/5</p>
                  <p className="text-sm text-gray-600 mt-1">Average rating</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Available Reports</CardTitle>
              <CardDescription>Generate and download detailed reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reports.map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <FileText className="h-8 w-8 text-[#C72030]" />
                      <div>
                        <h4 className="font-medium text-gray-900">{report.title}</h4>
                        <p className="text-sm text-gray-600">{report.description}</p>
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-xs text-gray-500">Type: {report.type}</span>
                          <span className="text-xs text-gray-500">Last: {report.lastGenerated}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        report.status === 'Ready' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                      }`}>
                        {report.status}
                      </span>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
