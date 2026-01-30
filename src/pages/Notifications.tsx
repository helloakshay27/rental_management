import React, { useState, useEffect } from 'react';
import { Bell, AlertCircle, CheckCircle, Clock, Trash2, Settings as SettingsIcon, Filter, Loader2, Check } from 'lucide-react';
import { getAuth, postAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const Notifications = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [notificationsList, setNotificationsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const data = await getAuth('/user_notifications.json');
        const notifs = data.user_notifications || data || [];
        setNotificationsList(notifs);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await postAuth('/user_notifications/mark_all_read.json', {});
      setNotificationsList(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Failed to mark notifications as read:', error);
      toast.error('Failed to mark notifications as read');
    }
  };

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
    ? notificationsList
    : notificationsList.filter(n => n.category === selectedFilter || n.type === selectedFilter);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-[#C72030]" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">Stay updated with important property management alerts</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2 text-[#C72030] border-[#C72030] hover:bg-red-50"
            onClick={handleMarkAllRead}
          >
            <Check className="h-4 w-4" />
            Mark all as read
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="bg-white border border-gray-200">
            <TabsTrigger value="all" className="text-gray-700">All Notifications</TabsTrigger>
            <TabsTrigger value="unread" className="text-gray-700">Unread</TabsTrigger>
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
                          {notification.title || 'Notification'}
                        </h3>
                        {getTypeBadge(notification.type || 'info')}
                        {!notification.read && <div className="w-2 h-2 bg-[#C72030] rounded-full"></div>}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message || notification.content}</p>
                      <p className="text-xs text-gray-400">{notification.time_ago || notification.time}</p>
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
                        <h3 className="font-semibold text-gray-900">{notification.title || 'Notification'}</h3>
                        {getTypeBadge(notification.type || 'info')}
                        <div className="w-2 h-2 bg-[#C72030] rounded-full"></div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message || notification.content}</p>
                      <p className="text-xs text-gray-400">{notification.time_ago || notification.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Settings tab content removed */}
      </Tabs>
    </div>
  );
};

export default Notifications;
