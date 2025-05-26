
import React, { useState } from 'react';
import { Bell, Search, User, Settings, MapPin, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Header = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');

  // Mock data for regions, zones, and properties
  const regions = [
    { id: 'north', name: 'North Region' },
    { id: 'south', name: 'South Region' },
    { id: 'east', name: 'East Region' },
    { id: 'west', name: 'West Region' }
  ];

  const zones = selectedRegion ? [
    { id: 'zone1', name: 'Zone 1', regionId: selectedRegion },
    { id: 'zone2', name: 'Zone 2', regionId: selectedRegion },
    { id: 'zone3', name: 'Zone 3', regionId: selectedRegion }
  ] : [];

  const properties = selectedZone ? [
    { id: 'prop1', name: 'Sunset Apartments', zoneId: selectedZone },
    { id: 'prop2', name: 'Downtown Plaza', zoneId: selectedZone },
    { id: 'prop3', name: 'Green Valley Complex', zoneId: selectedZone }
  ] : [];

  return (
    <header className="bg-white border-b border-tertiary-1 px-6 py-4 shadow-card">
      <div className="flex items-center justify-between">
        {/* Location Selectors */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-500" />
            <Select value={selectedRegion} onValueChange={(value) => {
              setSelectedRegion(value);
              setSelectedZone('');
              setSelectedProperty('');
            }}>
              <SelectTrigger className="w-48 border-tertiary-1 focus:ring-primary">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="bg-white border-tertiary-1 shadow-dropdown">
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id} className="hover:bg-base-white">
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRegion && (
            <div className="flex items-center space-x-2">
              <div className="text-gray-400">→</div>
              <Select value={selectedZone} onValueChange={(value) => {
                setSelectedZone(value);
                setSelectedProperty('');
              }}>
                <SelectTrigger className="w-40 border-tertiary-1 focus:ring-primary">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent className="bg-white border-tertiary-1 shadow-dropdown">
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id} className="hover:bg-base-white">
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedZone && (
            <div className="flex items-center space-x-2">
              <div className="text-gray-400">→</div>
              <Building className="h-4 w-4 text-gray-500" />
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48 border-tertiary-1 focus:ring-primary">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent className="bg-white border-tertiary-1 shadow-dropdown">
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id} className="hover:bg-base-white">
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Search and User Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search properties, agreements, vendors..."
              className="pl-10 w-full search-input"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative hover:bg-base-white">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-3 hover:bg-base-white px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-body font-medium text-gray-900">John Doe</p>
                  <p className="text-body-sm text-gray-500">Property Manager</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-tertiary-1 shadow-dropdown">
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-base-white">
                <User size={16} />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-base-white">
                <Settings size={16} />
                <span>Account Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-tertiary-1" />
              <DropdownMenuItem className="text-error hover:bg-base-white">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
