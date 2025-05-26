import React, { useState } from 'react';
import { User, Shield, Bell, Palette, Database, Globe, Key, Mail, Clock, GitBranch, Send, Cron } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('profile');

  const approvalFlows = [
    {
      id: 'AF001',
      name: 'Expense Approval',
      description: 'Approval flow for operational expenses',
      threshold: '₹50,000',
      levels: 3,
      status: 'Active'
    },
    {
      id: 'AF002',
      name: 'Lease Agreement',
      description: 'Approval flow for new lease agreements',
      threshold: 'All',
      levels: 2,
      status: 'Active'
    },
    {
      id: 'AF003',
      name: 'Maintenance Requests',
      description: 'Approval flow for high-value maintenance',
      threshold: '₹25,000',
      levels: 2,
      status: 'Active'
    }
  ];

  const emailReports = [
    {
      id: 'ER001',
      name: 'Daily Revenue Summary',
      description: 'Daily revenue and collection summary',
      frequency: 'Daily',
      time: '08:00 AM',
      recipients: 'admin@propertyflow.com',
      status: 'Active'
    },
    {
      id: 'ER002',
      name: 'Weekly Occupancy Report',
      description: 'Weekly property occupancy analytics',
      frequency: 'Weekly',
      time: 'Monday 09:00 AM',
      recipients: 'reports@propertyflow.com',
      status: 'Active'
    },
    {
      id: 'ER003',
      name: 'Monthly Financial Report',
      description: 'Comprehensive monthly financial analysis',
      frequency: 'Monthly',
      time: '1st Day 10:00 AM',
      recipients: 'finance@propertyflow.com',
      status: 'Active'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account and application preferences</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white border border-gray-200 grid w-full grid-cols-8">
          <TabsTrigger value="profile" className="text-gray-700">Profile</TabsTrigger>
          <TabsTrigger value="security" className="text-gray-700">Security</TabsTrigger>
          <TabsTrigger value="notifications" className="text-gray-700">Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="text-gray-700">Appearance</TabsTrigger>
          <TabsTrigger value="integrations" className="text-gray-700">Integrations</TabsTrigger>
          <TabsTrigger value="billing" className="text-gray-700">Billing</TabsTrigger>
          <TabsTrigger value="approval" className="text-gray-700">Approvals</TabsTrigger>
          <TabsTrigger value="email-reports" className="text-gray-700">Email Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
              <CardDescription>Update your personal and contact information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-[#C72030] text-white text-lg font-medium">JD</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p className="text-sm text-gray-500 mt-1">JPG, GIF or PNG. 1MB max.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue="John" className="bg-white border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" defaultValue="Doe" className="bg-white border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" defaultValue="john.doe@example.com" className="bg-white border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+1 (555) 123-4567" className="bg-white border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" defaultValue="PropertyFlow Management" className="bg-white border-gray-200" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select defaultValue="manager">
                    <SelectTrigger className="bg-white border-gray-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="admin">Administrator</SelectItem>
                      <SelectItem value="manager">Property Manager</SelectItem>
                      <SelectItem value="agent">Leasing Agent</SelectItem>
                      <SelectItem value="maintenance">Maintenance Staff</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  placeholder="Tell us about yourself..."
                  defaultValue="Experienced property manager with over 10 years in real estate management."
                  className="bg-white border-gray-200"
                />
              </div>

              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Change Password</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" className="bg-white border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" className="bg-white border-gray-200" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input id="confirmPassword" type="password" className="bg-white border-gray-200" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Enable 2FA</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <Switch />
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Session Management</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Current Session</p>
                      <p className="text-sm text-gray-500">Chrome on macOS • Active now</p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Mobile App</p>
                      <p className="text-sm text-gray-500">iOS App • Last active 2 hours ago</p>
                    </div>
                    <Button variant="outline" size="sm">Revoke</Button>
                  </div>
                </div>
              </div>

              <Button className="bg-[#C72030] hover:bg-[#A01825]">Update Security Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Notification Preferences</span>
              </CardTitle>
              <CardDescription>Choose how you want to be notified about important events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-notifications">Payment Reminders</Label>
                      <p className="text-sm text-gray-500">Get notified about overdue payments</p>
                    </div>
                    <Switch id="payment-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="maintenance-notifications">Maintenance Requests</Label>
                      <p className="text-sm text-gray-500">New maintenance requests from tenants</p>
                    </div>
                    <Switch id="maintenance-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="lease-notifications">Lease Renewals</Label>
                      <p className="text-sm text-gray-500">Upcoming lease expirations</p>
                    </div>
                    <Switch id="lease-notifications" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="report-notifications">Monthly Reports</Label>
                      <p className="text-sm text-gray-500">Automated monthly performance reports</p>
                    </div>
                    <Switch id="report-notifications" />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="urgent-push">Urgent Alerts</Label>
                      <p className="text-sm text-gray-500">Emergency maintenance or critical issues</p>
                    </div>
                    <Switch id="urgent-push" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="payment-push">Payment Confirmations</Label>
                      <p className="text-sm text-gray-500">Rent payment confirmations</p>
                    </div>
                    <Switch id="payment-push" defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Notification Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Appearance Settings</span>
              </CardTitle>
              <CardDescription>Customize the look and feel of your dashboard</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Theme</h4>
                <Select defaultValue="light">
                  <SelectTrigger className="w-48 bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="auto">Auto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Dashboard Layout</h4>
                <Select defaultValue="compact">
                  <SelectTrigger className="w-48 bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="compact">Compact</SelectItem>
                    <SelectItem value="comfortable">Comfortable</SelectItem>
                    <SelectItem value="spacious">Spacious</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Language</h4>
                <Select defaultValue="en">
                  <SelectTrigger className="w-48 bg-white border-gray-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Appearance Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Integrations</span>
              </CardTitle>
              <CardDescription>Connect third-party services to enhance your workflow</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { name: 'QuickBooks', description: 'Sync financial data and accounting', connected: true },
                  { name: 'Stripe', description: 'Process rent payments online', connected: true },
                  { name: 'Twilio', description: 'Send SMS notifications to tenants', connected: false },
                  { name: 'DocuSign', description: 'Electronic signature for lease agreements', connected: false },
                  { name: 'Google Calendar', description: 'Sync maintenance schedules', connected: true }
                ].map((integration, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">{integration.name}</h4>
                      <p className="text-sm text-gray-600">{integration.description}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        integration.connected ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {integration.connected ? 'Connected' : 'Not Connected'}
                      </span>
                      <Button variant="outline" size="sm">
                        {integration.connected ? 'Disconnect' : 'Connect'}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>Billing & Subscription</span>
              </CardTitle>
              <CardDescription>Manage your subscription and billing information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900">Professional Plan</h4>
                    <p className="text-sm text-blue-700">$99/month • Billed annually</p>
                  </div>
                  <Button variant="outline" size="sm">Upgrade Plan</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Payment Method</h4>
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/25</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Billing History</h4>
                <div className="space-y-3">
                  {[
                    { date: 'Nov 1, 2024', amount: '$99.00', status: 'Paid' },
                    { date: 'Oct 1, 2024', amount: '$99.00', status: 'Paid' },
                    { date: 'Sep 1, 2024', amount: '$99.00', status: 'Paid' }
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-600">{invoice.date}</span>
                        <span className="font-medium text-gray-900">{invoice.amount}</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">{invoice.status}</span>
                        <Button variant="ghost" size="sm">Download</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GitBranch className="h-5 w-5" />
                <span>Approval Flows & Escalation Matrix</span>
              </CardTitle>
              <CardDescription>Configure approval workflows and escalation paths</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Active Approval Flows</h4>
                <Button className="bg-[#C72030] hover:bg-[#A01825]">Add New Flow</Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Flow Name</TableHead>
                    <TableHead>Threshold</TableHead>
                    <TableHead>Approval Levels</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {approvalFlows.map((flow) => (
                    <TableRow key={flow.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{flow.name}</p>
                          <p className="text-sm text-gray-500">{flow.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{flow.threshold}</TableCell>
                      <TableCell>{flow.levels} levels</TableCell>
                      <TableCell>
                        <Badge variant="default">{flow.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Configure</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Escalation Settings</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="escalation-time">Default Escalation Time</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="24">24 Hours</SelectItem>
                        <SelectItem value="48">48 Hours</SelectItem>
                        <SelectItem value="72">72 Hours</SelectItem>
                        <SelectItem value="168">1 Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="reminder-frequency">Reminder Frequency</Label>
                    <Select>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="every-2-days">Every 2 Days</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Approval Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email-reports" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Send className="h-5 w-5" />
                <span>Email Reports & Cron Settings</span>
              </CardTitle>
              <CardDescription>Configure automated email reports and scheduling</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Scheduled Email Reports</h4>
                <Button className="bg-[#C72030] hover:bg-[#A01825]">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Report
                </Button>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Frequency</TableHead>
                    <TableHead>Schedule</TableHead>
                    <TableHead>Recipients</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {emailReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{report.name}</p>
                          <p className="text-sm text-gray-500">{report.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{report.frequency}</TableCell>
                      <TableCell>{report.time}</TableCell>
                      <TableCell className="max-w-48 truncate">{report.recipients}</TableCell>
                      <TableCell>
                        <Badge variant="default">{report.status}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Edit</Button>
                          <Button variant="outline" size="sm">Test</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">SMTP Configuration</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" placeholder="smtp.gmail.com" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" placeholder="587" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">Username</Label>
                    <Input id="smtp-username" placeholder="your-email@domain.com" className="bg-white" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">Password</Label>
                    <Input id="smtp-password" type="password" placeholder="Your password" className="bg-white" />
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center space-x-2">
                    <Switch id="smtp-ssl" />
                    <Label htmlFor="smtp-ssl">Enable SSL/TLS</Label>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h4 className="font-medium text-gray-900 mb-4">Global Settings</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="enable-reports">Enable Automated Reports</Label>
                      <p className="text-sm text-gray-500">Master switch for all email reports</p>
                    </div>
                    <Switch id="enable-reports" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="retry-failed">Retry Failed Deliveries</Label>
                      <p className="text-sm text-gray-500">Automatically retry failed email deliveries</p>
                    </div>
                    <Switch id="retry-failed" defaultChecked />
                  </div>
                </div>
              </div>

              <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Email Settings</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
