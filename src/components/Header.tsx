
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
    <header className="bg-[#1B2B3D] px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Location Selectors */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-300" />
            <Select value={selectedRegion} onValueChange={(value) => {
              setSelectedRegion(value);
              setSelectedZone('');
              setSelectedProperty('');
            }}>
              <SelectTrigger className="w-48 bg-[#2A3F54] border-[#2A3F54] text-white focus:ring-[#E74C3C]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-dropdown">
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id} className="hover:bg-gray-50">
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
                <SelectTrigger className="w-40 bg-[#2A3F54] border-[#2A3F54] text-white focus:ring-[#E74C3C]">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-dropdown">
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id} className="hover:bg-gray-50">
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
              <Building className="h-4 w-4 text-gray-300" />
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48 bg-[#2A3F54] border-[#2A3F54] text-white focus:ring-[#E74C3C]">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-dropdown">
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id} className="hover:bg-gray-50">
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
              className="pl-10 w-full bg-[#2A3F54] border-[#2A3F54] text-white placeholder-gray-400 focus:ring-[#E74C3C]"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative text-gray-300 hover:bg-[#2A3F54] hover:text-white">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-[#E74C3C] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-3 text-gray-300 hover:bg-[#2A3F54] hover:text-white px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#E74C3C] text-white font-medium">JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-body font-medium text-white">John Doe</p>
                  <p className="text-body-sm text-gray-300">Property Manager</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white border-gray-200 shadow-dropdown">
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-50">
                <User size={16} />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-50">
                <Settings size={16} />
                <span>Account Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="text-red-600 hover:bg-gray-50">
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
