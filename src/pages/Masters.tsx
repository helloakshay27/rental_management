
import React from 'react';
import { PageContainer } from '@/components/ui/page';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Building2, User, Shield, Key, Palette, FileCheck, Globe2, MapPin, Truck, Layout, Building, Wallet, PieChart, FileText, Settings2, MapPinned } from 'lucide-react';

const Masters = () => {
  const masterModules = [
    // 1. Geography / Setup
    {
      title: 'Country Master',
      description: 'Manage countries with codes and currency information',
      icon: Globe2,
      path: '/masters/countries',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'States Master',
      description: 'Manage states and their association with countries',
      icon: MapPin,
      path: '/masters/states',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Region Master',
      description: 'Manage regions and their association with states',
      icon: MapPin,
      path: '/masters/regions',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Zone Master',
      description: 'Manage zones and their association with regions',
      icon: MapPinned,
      path: '/masters/zones',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'City Master',
      description: 'Manage cities and their association with zones',
      icon: MapPinned,
      path: '/masters/cities',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Circle Master',
      description: 'Manage circles and their association with cities',
      icon: MapPinned,
      path: '/masters/circles',
      color: 'bg-gray-100 text-black'
    },
    // 2. Business Entities
    {
      title: 'Landlords Management',
      description: 'Manage landlord profiles, properties, and contact details',
      icon: UserCheck,
      path: '/masters/landlords',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Lessee Management',
      description: 'Manage lessee information, documents, and profiles',
      icon: Users,
      path: '/masters/tenants',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Vendor Master',
      description: 'Manage vendors, suppliers, and contractor details',
      icon: Truck,
      path: '/masters/vendors',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Amenity Master',
      description: 'Central Amenities',
      icon: Building2,
      path: '/masters/amenities',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Properties Master',
      description: 'Central property database with all property details',
      icon: Building2,
      path: '/masters/properties',
      color: 'bg-gray-100 text-black'
    },
    {
      title: ' Property Takeover Conditions',
      description: 'Conditions under which properties are taken over',
      icon: Layout,
      path: '/masters/takeover-conditions',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Facility Types',
      description: 'Categories for property facilities and amenities',
      icon: Building,
      path: '/masters/facility-types',
      color: 'bg-gray-100 text-black'
    },
    // 4. Operations & Financials
    {
      title: 'Agreement Service Types',
      description: 'Manage service types for agreements (e.g., CAM)',
      icon: FileText,
      path: '/masters/service-types',
      color: 'bg-gray-100 text-black',
      cta: 'Manage Service Types'
    },
    {
      title: 'Compliances Master',
      description: 'Manage property compliances, regulations, and renewals',
      icon: FileCheck,
      path: '/masters/compliances',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Expense Categories',
      description: 'Manage categories for property expenses and tracking',
      icon: Wallet,
      path: '/masters/expense-categories',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Budget Master',
      description: 'Define and track annual budgets for properties',
      icon: PieChart,
      path: '/masters/budgets',
      color: 'bg-gray-100 text-black'
    },
    // 5. System Configuration
    {
      title: 'Users Management',
      description: 'Manage system users and their basic information',
      icon: User,
      path: '/masters/users',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Roles Management',
      description: 'Define and manage user roles and responsibilities',
      icon: Shield,
      path: '/masters/roles',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Access Control',
      description: 'Configure module permissions for each role',
      icon: Key,
      path: '/masters/access',
      color: 'bg-gray-100 text-black',
      cta: 'Manage Access'
    },
    {
      title: 'Branding Management',
      description: 'Manage invoice branding and company profiles',
      icon: Palette,
      path: '/masters/branding',
      color: 'bg-gray-100 text-black'
    },
    {
      title: 'Lease Custom Fields',
      description: 'Manage custom fields for lease agreements',
      icon: Settings2,
      path: '/masters/lease-custom-fields',
      color: 'bg-gray-100 text-black'
    }
  ];

  return (
    <PageContainer>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-brand-body-1 font-bold text-[#1a1a1a]">Masters</h1>
          <p className="text-sm text-[#D5DbDB]">Manage all master data and system configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {masterModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.path} className="bg-[#FFFFFF] hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 flex flex-col">
              <CardHeader className="pb-3 flex-1">
                <div className={`w-10 h-10 rounded-lg ${module.color} flex items-center justify-center mb-2`}>
                  <Icon className="h-5 w-5" />
                </div>
                <CardTitle className="text-base text-[#1a1a1a]">{module.title}</CardTitle>
                <CardDescription className="text-[13px] text-[#D5DbDB]">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={module.path}>
                  <Button className="w-full fm-button-fix fm-button-brand h-8 px-4 text-[13px]">
                    {'cta' in module ? module.cta : `Manage ${module.title.split(' ')[0]}`}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PageContainer>
  );
};

export default Masters;
