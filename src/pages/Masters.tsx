
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Users, UserCheck, Building2, User, Shield, Key } from 'lucide-react';

const Masters = () => {
  const masterModules = [
    {
      title: 'Tenants Management',
      description: 'Manage tenant information, documents, and profiles',
      icon: Users,
      path: '/masters/tenants',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Landlords Management',
      description: 'Manage landlord profiles, properties, and contact details',
      icon: UserCheck,
      path: '/masters/landlords',
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Properties Master',
      description: 'Central property database with all property details',
      icon: Building2,
      path: '/masters/properties',
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Users Management',
      description: 'Manage system users and their basic information',
      icon: User,
      path: '/masters/users',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      title: 'Roles Management',
      description: 'Define and manage user roles and responsibilities',
      icon: Shield,
      path: '/masters/roles',
      color: 'bg-red-50 text-red-600'
    },
    {
      title: 'Access Management',
      description: 'Control user permissions and access levels',
      icon: Key,
      path: '/masters/access',
      color: 'bg-indigo-50 text-indigo-600'
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#FFFFFF]">Masters</h1>
          <p className="text-[#FFFFFF]">Manage all master data and system configurations</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {masterModules.map((module) => {
          const Icon = module.icon;
          return (
            <Card key={module.path} className="bg-[#FFFFFF] hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 flex flex-col">
              <CardHeader className="pb-4 flex-1">
                <div className={`w-12 h-12 rounded-lg ${module.color} flex items-center justify-center mb-3`}>
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg text-[#1a1a1a]">{module.title}</CardTitle>
                <CardDescription className="text-[#D5DbDB]">{module.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={module.path}>
                  <Button className="w-full bg-[#C72030] hover:bg-[#A01825]">
                    Manage {module.title.split(' ')[0]}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Masters;
