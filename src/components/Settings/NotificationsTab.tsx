
import React from 'react';
import { Bell } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

const NotificationsTab = () => {
  return (
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
  );
};

export default NotificationsTab;
