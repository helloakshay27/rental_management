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
    } catch (e) { }
    navigate('/login', { replace: true });
    // reload to reset any in-memory auth state
    try {
      window.location.reload();
    } catch (e) { }
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
        {/* Navigation and Location Selectors removed */}
        <div className="flex-1"></div>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
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
