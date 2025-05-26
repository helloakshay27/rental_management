
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
    <header className="bg-[#C4b89D] px-6 py-4 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Location Selectors */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[#D5DbDB]" />
            <Select value={selectedRegion} onValueChange={(value) => {
              setSelectedRegion(value);
              setSelectedZone('');
              setSelectedProperty('');
            }}>
              <SelectTrigger className="w-48 bg-[#B4A88D] border-[#B4A88D] text-[#D5DbDB] focus:ring-[#C72030]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="bg-[#f6f4ee] border-gray-200 shadow-dropdown">
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id} className="hover:bg-gray-50 text-[#D5DbDB]">
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRegion && (
            <div className="flex items-center space-x-2">
              <div className="text-[#D5DbDB]">→</div>
              <Select value={selectedZone} onValueChange={(value) => {
                setSelectedZone(value);
                setSelectedProperty('');
              }}>
                <SelectTrigger className="w-40 bg-[#B4A88D] border-[#B4A88D] text-[#D5DbDB] focus:ring-[#C72030]">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent className="bg-[#f6f4ee] border-gray-200 shadow-dropdown">
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id} className="hover:bg-gray-50 text-[#D5DbDB]">
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedZone && (
            <div className="flex items-center space-x-2">
              <div className="text-[#D5DbDB]">→</div>
              <Building className="h-4 w-4 text-[#D5DbDB]" />
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48 bg-[#B4A88D] border-[#B4A88D] text-[#D5DbDB] focus:ring-[#C72030]">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent className="bg-[#f6f4ee] border-gray-200 shadow-dropdown">
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id} className="hover:bg-gray-50 text-[#D5DbDB]">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#D5DbDB]" size={18} />
            <Input
              placeholder="Search properties, agreements, vendors..."
              className="pl-10 w-full bg-[#B4A88D] border-[#B4A88D] text-[#D5DbDB] placeholder-[#D5DbDB]/60 focus:ring-[#C72030]"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative text-[#D5DbDB] hover:bg-[#B4A88D] hover:text-[#D5DbDB]">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-[#C72030] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-3 text-[#D5DbDB] hover:bg-[#B4A88D] hover:text-[#D5DbDB] px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#C72030] text-white font-medium">JD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-body font-medium text-[#D5DbDB]">John Doe</p>
                  <p className="text-body-sm text-[#D5DbDB]/80">Property Manager</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#f6f4ee] border-gray-200 shadow-dropdown">
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-50 text-[#D5DbDB]">
                <User size={16} />
                <span>Profile Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center space-x-2 hover:bg-gray-50 text-[#D5DbDB]">
                <Settings size={16} />
                <span>Account Preferences</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem className="text-[#C72030] hover:bg-gray-50">
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
