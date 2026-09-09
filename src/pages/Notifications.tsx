import React, { useState, useEffect } from 'react';
import { PageLoader } from '@/components/ui/loader';
import { PageContainer } from '@/components/ui/page';
import { Bell, AlertCircle, CheckCircle, Clock, Trash2, Settings as SettingsIcon, Filter, Check, BellDot } from 'lucide-react';
import { getAuth, postAuth } from '@/lib/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Heading, Text } from '@/components/ui/typography';

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
      default: return <CheckCircle className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'urgent': return <Badge variant="destructive" className="shrink-0 px-2 py-0.5 text-[11px]">Urgent</Badge>;
      case 'warning': return <Badge className="shrink-0 bg-orange-100 px-2 py-0.5 text-[11px] text-orange-800">Warning</Badge>;
      default: return <Badge variant="secondary" className="shrink-0 px-2 py-0.5 text-[11px]">Info</Badge>;
    }
  };

  const filteredNotifications = selectedFilter === 'all'
    ? notificationsList
    : notificationsList.filter(n => n.category === selectedFilter || n.type === selectedFilter);

  if (loading) {
    return (
      <PageLoader />
    );
  }

  // One bordered list with hairline-divided rows: a Card per notification made
  // every entry a tall panel, which is what read as oversized. Titles are spans
  // rather than <h3> — a bare h3 picks up the 20px global heading size.
  const renderRow = (notification: any) => (
    <div
      key={notification.id}
      className={`group flex items-start gap-3 px-5 py-4 transition-colors hover:bg-gray-50 ${
        !notification.read ? 'border-l-[3px] border-l-[#C72030] bg-[#f6f4ee]/60' : 'border-l-[3px] border-l-transparent'
      }`}
    >
      <span className="mt-1 shrink-0">{getTypeIcon(notification.type)}</span>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={`truncate text-brand-body-3 ${!notification.read ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
            {notification.title || 'Notification'}
          </span>
          {getTypeBadge(notification.type || 'info')}
          {!notification.read && <span className="h-2 w-2 shrink-0 rounded-full bg-[#C72030]" />}
        </div>
        <p className="mt-1 truncate text-sm text-gray-600">
          {notification.message || notification.content}
        </p>
        <p className="mt-1 text-xs text-gray-400">
          {notification.time_ago || notification.time}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1">
        {!notification.read && (
          <Button variant="ghost" size="icon" className="h-8 w-8" title="Mark as read">
            <CheckCircle className="h-4 w-4" />
          </Button>
        )}
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Delete">
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderList = (items: any[]) =>
    items.length === 0 ? (
      <div className="flex flex-col items-center justify-center rounded-md border border-brand-border bg-white py-12 text-center">
        <Bell className="h-6 w-6 text-gray-300" />
        <p className="mt-3 text-sm font-medium text-gray-900">No notifications</p>
        <p className="mt-1 text-xs text-gray-500">You're all caught up</p>
      </div>
    ) : (
      <div className="divide-y divide-gray-100 overflow-hidden rounded-md border border-brand-border bg-white">
        {items.map(renderRow)}
      </div>
    );

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <div>
          <Heading level="h1">Notifications</Heading>
          <Text size="sm" variant="muted">Stay updated with important property management alerts</Text>
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
        {/* Tab bar is full-width, so the category filter sits on its own row below it. */}
        <div className="space-y-4">
          <TabsList>
            <TabsTrigger value="all">
              <Bell className="h-4 w-4 mr-2" />
              All Notifications
            </TabsTrigger>
            <TabsTrigger value="unread">
              <BellDot className="h-4 w-4 mr-2" />
              Unread
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center justify-end space-x-3">
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

        <TabsContent value="all" className="mt-4">
          {renderList(filteredNotifications)}
        </TabsContent>

        <TabsContent value="unread" className="mt-4">
          {renderList(filteredNotifications.filter(n => !n.read))}
        </TabsContent>

        {/* Settings tab content removed */}
      </Tabs>
    </PageContainer>
  );
};

export default Notifications;
