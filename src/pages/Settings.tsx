
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from '@/components/Settings/ProfileTab';
import SecurityTab from '@/components/Settings/SecurityTab';
import NotificationsTab from '@/components/Settings/NotificationsTab';
import AppearanceTab from '@/components/Settings/AppearanceTab';
import IntegrationsTab from '@/components/Settings/IntegrationsTab';
import BillingTab from '@/components/Settings/BillingTab';
import ApprovalTab from '@/components/Settings/ApprovalTab';
import EmailReportsTab from '@/components/Settings/EmailReportsTab';

const Settings = () => {
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
          <ProfileTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <NotificationsTab />
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <AppearanceTab />
        </TabsContent>

        <TabsContent value="integrations" className="space-y-6">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <BillingTab />
        </TabsContent>

        <TabsContent value="approval" className="space-y-6">
          <ApprovalTab />
        </TabsContent>

        <TabsContent value="email-reports" className="space-y-6">
          <EmailReportsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
