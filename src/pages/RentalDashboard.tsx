
import React from 'react';
import { PageContainer, PageHeader } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Home, CreditCard, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyRentals from '@/components/Tenant/MyRentals';
import PaymentHistory from '@/components/Tenant/PaymentHistory';
import MaintenanceRequests from '@/components/Tenant/MaintenanceRequests';
import Documents from '@/components/Tenant/Documents';
import { Heading } from '@/components/ui/typography';

const RentalDashboard = () => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <PageHeader title="Rental Agreement" description="Manage your rental properties and agreements" />

            <div className="bg-white">
                <MyRentals />
            </div>
        </PageContainer>
    );
};

export default RentalDashboard;
