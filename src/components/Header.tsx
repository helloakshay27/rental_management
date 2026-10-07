import React, { useState, useEffect } from 'react';
import { Spinner } from '@/components/ui/loader';
import { Bell, Search, Mail, LogOut, MapPin, Building, ArrowLeft, Shield, ChevronRight, Menu, User, Users, UserRound } from 'lucide-react';
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
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, postAuth, clearToken } from '@/lib/api';
import { trackEvent, trackLoggedOut } from '@/utils/analytics';
import { resetPostHogUser } from '@/utils/posthogHelpers';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge as UIBadge } from '@/components/ui/badge';
import { GoPhygitalLogo } from '@/components/ui/gophygital-logo';
import { PH_EVENTS } from '@/utils/posthogEvents';

interface HeaderProps {
  /** Opens the mobile navigation drawer; only rendered below lg. */
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedZone, setSelectedZone] = useState('');
  const [selectedProperty, setSelectedProperty] = useState('');
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState<{ id?: number; email?: string; full_name?: string; roles?: string[]; avatar_url?: string } | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loadingNotifications, setLoadingNotifications] = useState(false);

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

    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const data = await getAuth('/user_notifications.json');
        // Based on typical Rails JSON response structure
        const notifs = data.user_notifications || data || [];
        setNotifications(notifs);
        setUnreadCount(notifs.filter((n: any) => !n.read).length);
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      } finally {
        setLoadingNotifications(false);
      }
    };

    fetchNotifications();

    const handleMarkAllRead = async () => {
      try {
        await postAuth('/user_notifications/mark_all_read.json', {});
        trackEvent(PH_EVENTS.NOTIFICATIONS_MARKED_ALL_READ, { source: 'header' });
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
        toast.success('All notifications marked as read');
      } catch (error) {
        console.error('Failed to mark notifications as read:', error);
        toast.error('Failed to mark notifications as read');
      }
    };

    // Expose for usage in JSX
    (window as any).headerMarkAllRead = handleMarkAllRead;

    return () => {
      window.removeEventListener('auth-changed', onAuthChanged);
    };
  }, []);

  const handleLogout = () => {
    trackLoggedOut();
    resetPostHogUser();
    clearToken();
    try {
      window.dispatchEvent(new Event('auth-changed'));
    } catch (e) { }
    navigate('/login', { replace: true });
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
    <header className="relative h-16 shrink-0 bg-brand-bg px-4 sm:px-6 flex items-center shadow-sm border-b border-brand-border">
      <div className="flex items-center justify-between w-full gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="h-9 w-9 shrink-0 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        {/* The sidebar (and its wordmark) is off-canvas below lg, so the
            header carries the brand, centred between the two icon clusters. */}
        <Link
          to="/dashboard"
          aria-label="Home"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden"
        >
          <GoPhygitalLogo className="h-8 w-[150px]" />
        </Link>
        {/* Navigation and Location Selectors removed */}
        <div className="flex-1"></div>

        {/* User Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full p-0 hover:bg-transparent focus-visible:ring-0 [&_svg]:!text-brand-text">
                {/* Same 32px circle as the avatar next to it, so the two controls read as one pair. */}
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-selected">
                  <Bell className="h-[18px] w-[18px]" strokeWidth={1.75} />
                </span>
                {unreadCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-semibold leading-none text-white">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[min(360px,calc(100vw-2rem))] bg-brand-card border-brand-border shadow-dropdown p-0">
              <div className="flex items-center justify-between px-4 py-3 border-b border-brand-border">
                <h3 className="font-semibold text-base text-brand-text">Notifications</h3>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-xs h-7 px-2 text-brand-text hover:bg-brand-selected"
                      onClick={() => (window as any).headerMarkAllRead?.()}
                    >
                      Mark all read
                    </Button>
                  )}
                  {unreadCount > 0 && (
                    <UIBadge variant="secondary" className="bg-brand-selected text-brand-text text-xs border-none">
                      {unreadCount} New
                    </UIBadge>
                  )}
                </div>
              </div>
              <ScrollArea className="h-[350px]">
                {loadingNotifications ? (
                  <div className="flex justify-center items-center py-8">
                    <Spinner className="h-6 w-6 text-brand" />
                  </div>
                ) : notifications.length > 0 ? (
                  notifications.map((notification: any) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className="flex flex-col items-start px-4 py-3 border-b border-brand-border focus:bg-brand-selected cursor-pointer"
                    >
                      <div className="flex justify-between w-full mb-1">
                        <span className="font-semibold text-sm text-brand-text">{notification.title || 'Notification'}</span>
                        <span className="text-xs text-brand-text-light">{notification.time_ago || 'Just now'}</span>
                      </div>
                      <p className="text-sm text-brand-text/80 line-clamp-2">{notification.message || notification.content}</p>
                      {!notification.read && (
                        <div className="mt-2 h-1.5 w-1.5 rounded-full bg-brand"></div>
                      )}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                    <div className="p-3 bg-brand-selected rounded-full mb-3">
                      <Bell className="h-6 w-6 text-brand-text-light" />
                    </div>
                    <p className="text-base font-medium text-brand-text">No notifications</p>
                    <p className="text-sm text-brand-text-light mt-1">We'll notify you when something happens</p>
                  </div>
                )}
              </ScrollArea>
              <div className="p-2 border-t border-brand-border flex justify-center">
                <Button variant="ghost" size="sm" className="text-sm font-medium text-brand-text hover:bg-brand-selected hover:text-brand-text w-full">
                  View All Notifications
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full p-0 h-8 w-8 hover:opacity-90 focus-visible:ring-0 [&_svg]:!text-white">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand">
                  <UserRound className="h-[18px] w-[18px] text-white" fill="none" strokeWidth={1.75} />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-brand-card border-brand-border shadow-dropdown p-0 rounded-md overflow-hidden">
              {/* Identity */}
              <div className="px-4 pt-4 pb-3">
                <p className="font-semibold text-sm text-brand-text leading-tight">
                  {currentUser?.full_name || 'Guest User'}
                </p>
                <p className="text-sm text-brand-info mt-1 break-all">{currentUser?.email || ''}</p>
                <div className="mt-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-medium text-green-700">
                    <Shield className="h-3 w-3" />
                    {currentUser?.roles?.[0] || 'User'}
                  </span>
                </div>
              </div>

              <DropdownMenuSeparator className="my-0 bg-brand-border" />

              <div className="py-1">
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-brand-text-light focus:bg-brand-selected focus:text-brand-text cursor-pointer rounded-none"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

        </div>
      </div>
    </header>
  );
};

export default Header;
