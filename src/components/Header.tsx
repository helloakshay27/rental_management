import React, { useState, useEffect } from 'react';
import { Bell, Search, Mail, LogOut, MapPin, Building, ArrowLeft } from 'lucide-react';
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
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<{ id?: number; email?: string; full_name?: string } | null>(null);

  const handleBackClick = () => {
    navigate(-1);
  };

  useEffect(() => {
    const readUser = () => {
      try {
        const raw = localStorage.getItem('user');
        if (raw) {
          const parsed = JSON.parse(raw);
          setCurrentUser(parsed);
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    };

    readUser();

    const onAuthChanged = () => readUser();
    window.addEventListener('auth-changed', onAuthChanged);

    return () => {
      window.removeEventListener('auth-changed', onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      localStorage.removeItem('userEmail');
    } catch (e) {}
    navigate('/login', { replace: true });
    // reload to reset any in-memory auth state
    try {
      window.location.reload();
    } catch (e) {}
  };

  const initials = (() => {
    const name = currentUser?.full_name || currentUser?.email || '';
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'U';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (String(parts[0][0]) + String(parts[parts.length - 1][0])).toUpperCase();
  })();

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
    <header className="bg-[#f6f4ee] px-6 py-4 shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between">
        {/* Back Button and Location Selectors */}
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackClick}
            className="text-[#1a1a1a] hover:bg-gray-100 hover:text-[#1a1a1a] p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-[#1a1a1a]" />
            <Select value={selectedRegion} onValueChange={(value) => {
              setSelectedRegion(value);
              setSelectedZone('');
              setSelectedProperty('');
            }}>
              <SelectTrigger className="w-48 bg-white border-gray-200 text-[#1a1a1a] focus:ring-[#C72030]">
                <SelectValue placeholder="Select Region" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-dropdown">
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id} className="hover:bg-gray-50 text-[#1a1a1a]">
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedRegion && (
            <div className="flex items-center space-x-2">
              <div className="text-[#1a1a1a]">→</div>
              <Select value={selectedZone} onValueChange={(value) => {
                setSelectedZone(value);
                setSelectedProperty('');
              }}>
                <SelectTrigger className="w-40 bg-white border-gray-200 text-[#1a1a1a] focus:ring-[#C72030]">
                  <SelectValue placeholder="Select Zone" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-dropdown">
                  {zones.map((zone) => (
                    <SelectItem key={zone.id} value={zone.id} className="hover:bg-gray-50 text-[#1a1a1a]">
                      {zone.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {selectedZone && (
            <div className="flex items-center space-x-2">
              <div className="text-[#1a1a1a]">→</div>
              <Building className="h-4 w-4 text-[#1a1a1a]" />
              <Select value={selectedProperty} onValueChange={setSelectedProperty}>
                <SelectTrigger className="w-48 bg-white border-gray-200 text-[#1a1a1a] focus:ring-[#C72030]">
                  <SelectValue placeholder="Select Property" />
                </SelectTrigger>
                <SelectContent className="bg-white border-gray-200 shadow-dropdown">
                  {properties.map((property) => (
                    <SelectItem key={property.id} value={property.id} className="hover:bg-gray-50 text-[#1a1a1a]">
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#1a1a1a]" size={18} />
            <Input
              placeholder="Search properties, agreements, vendors..."
              className="pl-10 w-full bg-white border-gray-200 text-[#1a1a1a] placeholder-gray-400 focus:ring-[#C72030]"
            />
          </div>
          
          <Button variant="ghost" size="sm" className="relative text-[#1a1a1a] hover:bg-gray-100 hover:text-[#1a1a1a]">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-[#C72030] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              3
            </span>
          </Button>
          
          <DropdownMenu>
              <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center space-x-3 text-[#1a1a1a] hover:bg-gray-100 hover:text-[#1a1a1a] px-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-[#C72030] text-white font-medium">{initials}</AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-body font-medium text-[#1a1a1a]">{currentUser?.full_name || currentUser?.email || 'Guest User'}</p>
                  <p className="text-body-sm text-gray-500">User</p>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-white border-gray-200 shadow-dropdown p-3">
              <div className="flex items-start space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-[#C72030] text-white font-medium">{initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-sm text-[#1a1a1a]">{currentUser?.full_name || currentUser?.email || 'Guest User'}</p>
                  <div className="flex items-center text-sm text-gray-500 space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span>{currentUser?.email || ''}</span>
                  </div>
                  <div className="mt-2">
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">User</span>
                  </div>
                </div>
              </div>
              <DropdownMenuSeparator className="my-2 bg-gray-200" />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-[#C72030] hover:bg-gray-50">
                <LogOut size={16} />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
