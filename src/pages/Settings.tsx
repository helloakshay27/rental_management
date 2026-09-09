
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { User, Shield } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from '@/components/Settings/ProfileTab';
import SecurityTab from '@/components/Settings/SecurityTab';
import { Heading, Text } from '@/components/ui/typography';

const Settings = () => {
  return (
    <PageContainer>
      <PageHeader title="Settings" description="Manage your account and application preferences" />

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <SecurityTab />
        </TabsContent>
      </Tabs>
    </PageContainer>
  );
};

export default Settings;
