
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Home, CreditCard, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MyRentals from '@/components/Tenant/MyRentals';
import PaymentHistory from '@/components/Tenant/PaymentHistory';
import MaintenanceRequests from '@/components/Tenant/MaintenanceRequests';
import Documents from '@/components/Tenant/Documents';

const RentalDashboard = () => {
    const navigate = useNavigate();

    return (
        <div className="p-6 space-y-6 bg-white min-h-full">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-[#1a1a1a]">Rental Agreement</h1>
                    <p className="text-[#1a1a1a]/70 mt-2">Manage your rental properties and agreements</p>
                </div>
                <Button onClick={() => navigate('/rental/new')} className="bg-[#C72030] hover:bg-[#A01825] text-white">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rental Agreement
                </Button>
            </div>

            <div className="bg-white">
                <MyRentals />
            </div>
        </div>
    );
};

export default RentalDashboard;
