import React, { useState } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, Trash2, Settings as SettingsIcon, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Notifications = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  const notifications = [
    {
      id: 1,
      title: 'Rent Payment Overdue',
      message: 'Tenant at Sunset Apartments Unit 12A has overdue rent payment of $2,500',
      type: 'urgent',
      time: '2 hours ago',
      read: false,
      category: 'payments'
    },
    {
      id: 2,
      title: 'Maintenance Request',
      message: 'New maintenance request for HVAC repair at Downtown Plaza',
      type: 'info',
      time: '4 hours ago',
      read: false,
      category: 'maintenance'
    },
    {
      id: 3,
      title: 'Lease Renewal Due',
      message: 'Lease renewal needed for Green Valley Complex Unit 5B expires in 30 days',
      type: 'warning',
      time: '1 day ago',
      read: true,
      category: 'leases'
    },
    {
      id: 4,
      title: 'Property Inspection Scheduled',
      message: 'Annual property inspection scheduled for next week at Riverside Towers',
      type: 'info',
      time: '2 days ago',
      read: true,
      category: 'inspections'
    },
    {
      id: 5,
      title: 'Utility Bill Ready',
      message: 'Monthly utility bill generated for Ocean View Apartments',
      type: 'info',
      time: '3 days ago',
      read: true,
      category: 'utilities'
    }
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'urgent': return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'warning': return <Clock className="h-4 w-4 text-orange-500" />;
      default: return <CheckCircle className="h-4 w-4 text-blue-500" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'urgent': return <Badge variant="destructive">Urgent</Badge>;
      case 'warning': return <Badge className="bg-orange-100 text-orange-800">Warning</Badge>;
      default: return <Badge variant="secondary">Info</Badge>;
    }
  };

  const filteredNotifications = selectedFilter === 'all' 
    ? notifications 
    : notifications.filter(n => n.category === selectedFilter);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important property management alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <SettingsIcon className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm">
            Mark All Read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="all" className="text-gray-700">All Notifications</TabsTrigger>
            <TabsTrigger value="unread" className="text-gray-700">Unread</TabsTrigger>
            <TabsTrigger value="settings" className="text-gray-700">Settings</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center space-x-3">
            <Filter className="h-4 w-4 text-gray-500" />
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48 bg-white border-gray-200">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent className="bg-white">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="payments">Payments</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="leases">Leases</SelectItem>
                <SelectItem value="inspections">Inspections</SelectItem>
                <SelectItem value="utilities">Utilities</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card key={notification.id} className={`transition-all duration-200 hover:shadow-md ${!notification.read ? 'border-l-4 border-l-[#C72030] bg-[#f6f4ee]' : 'bg-[#FFFFFF]'}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${!notification.read ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h3>
                        {getTypeBadge(notification.type)}
                        {!notification.read && <div className="w-2 h-2 bg-[#C72030] rounded-full"></div>}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="unread" className="space-y-4">
          {filteredNotifications.filter(n => !n.read).map((notification) => (
            <Card key={notification.id} className="border-l-4 border-l-[#C72030] bg-[#f6f4ee] transition-all duration-200 hover:shadow-md">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getTypeIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                        {getTypeBadge(notification.type)}
                        <div className="w-2 h-2 bg-[#C72030] rounded-full"></div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-400">{notification.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Customize how and when you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="payment-alerts">Payment Alerts</Label>
                    <Switch id="payment-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="maintenance-requests">Maintenance Requests</Label>
                    <Switch id="maintenance-requests" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="lease-renewals">Lease Renewals</Label>
                    <Switch id="lease-renewals" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium text-gray-900">Push Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="urgent-alerts">Urgent Alerts</Label>
                    <Switch id="urgent-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="daily-summary">Daily Summary</Label>
                    <Switch id="daily-summary" />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <Button className="bg-[#C72030] hover:bg-[#A01825]">Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Notifications;
