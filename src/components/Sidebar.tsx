import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GoPhygitalLogo } from '@/components/ui/gophygital-logo';
import {
  LayoutDashboard,
  FileText,
  DollarSign,
  Zap,
  Wrench,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Database,
  Receipt,
  ShieldCheck,
  Hammer,
  LayoutGrid,
  Building2,
  UserCog,
  Users,
  Truck,
  User,
  KeyRound,
  Lock,
  Palette,
  Sparkles,
  Factory,
  ClipboardCheck,
  ListPlus,
  Tags,
  PiggyBank,
  Globe,
  Map,
  MapPinned,
  LandPlot,
  Building,
  CircleDot,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
  subItems?: { label: string; path: string; icon: React.ElementType }[];
}

/**
 * Navigation model. `subItems` render as a collapsible group, matching
 * fm-matrix-revamp's nested sidebar; collapsed mode shows top-level icons only
 * and jumps to the group's first child.
 */
const menuItems: NavItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Rental Agreement', path: '/rental-dashboard' },
  { icon: ShieldCheck, label: 'Compliance', path: '/compliance' },
  { icon: DollarSign, label: 'OPEX Management', path: '/opex' },
  { icon: Zap, label: 'Utilities', path: '/utilities' },
  { icon: Wrench, label: 'AMC Management', path: '/amc' },
  { icon: Hammer, label: 'Maintenance', path: '/maintenance' },
  { icon: Receipt, label: 'Invoicing', path: '/invoicing' },
  {
    icon: Database,
    label: 'Masters',
    path: '/masters',
    subItems: [
      { icon: LayoutGrid, label: 'Overview', path: '/masters' },
      { icon: Building2, label: 'Properties', path: '/masters/properties' },
      { icon: UserCog, label: 'Landlords', path: '/masters/landlords' },
      { icon: Users, label: 'Lessees', path: '/masters/tenants' },
      { icon: Truck, label: 'Vendors', path: '/masters/vendors' },
      { icon: ShieldCheck, label: 'Compliances', path: '/masters/compliances' },
      { icon: User, label: 'Users', path: '/masters/users' },
      { icon: KeyRound, label: 'Roles', path: '/masters/roles' },
      { icon: Lock, label: 'Access Control', path: '/masters/access' },
      { icon: Palette, label: 'Branding', path: '/masters/branding' },
      { icon: Sparkles, label: 'Amenities', path: '/masters/amenities' },
      { icon: Factory, label: 'Facility Types', path: '/masters/facility-types' },
      { icon: ClipboardCheck, label: 'Takeover Conditions', path: '/masters/takeover-conditions' },
      { icon: ListPlus, label: 'Lease Custom Fields', path: '/masters/lease-custom-fields' },
      { icon: Tags, label: 'Expense Categories', path: '/masters/expense-categories' },
      { icon: PiggyBank, label: 'Budgets', path: '/masters/budgets' },
      { icon: Wrench, label: 'Service Types', path: '/masters/service-types' },
      { icon: Globe, label: 'Countries', path: '/masters/countries' },
      { icon: Map, label: 'States', path: '/masters/states' },
      { icon: MapPinned, label: 'Regions', path: '/masters/regions' },
      { icon: LandPlot, label: 'Zones', path: '/masters/zones' },
      { icon: Building, label: 'Cities', path: '/masters/cities' },
      { icon: CircleDot, label: 'Circles', path: '/masters/circles' },
    ],
  },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  /** A leaf is active on exact match; a group is active anywhere in its subtree. */
  const isActiveRoute = (path: string) => location.pathname === path;
  const isInSection = (item: NavItem) =>
    location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);

  // Keep the group containing the current route open as the user navigates.
  useEffect(() => {
    const owning = menuItems.find((item) => item.subItems && isInSection(item));
    if (owning && !expandedItems.includes(owning.label)) {
      setExpandedItems((prev) => [...prev, owning.label]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const toggleExpanded = (label: string) =>
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((l) => l !== label) : [...prev, label]
    );

  return (
    <div
      className={cn(
        'relative bg-brand-bg flex flex-col h-screen shrink-0 overflow-hidden',
        'transition-[width] duration-300 ease-in-out motion-reduce:transition-none',
        isCollapsed ? 'w-14' : 'w-60'
      )}
    >
      {/* Brand header — same height as the top Header so both bottom borders line up */}
      <div
        className={cn(
          'shrink-0 h-16 flex items-center overflow-hidden border-b border-brand-sidebar-border/70',
          isCollapsed ? 'justify-center px-2' : 'justify-center px-2'
        )}
      >
        {/* Stays visible through the toggle — collapsed shows the glyph only, since
            the wordmark cannot fit a 56px rail. */}
        <Link to="/dashboard" aria-label="Home" className="flex min-w-0 items-center">
          <GoPhygitalLogo
            mark={isCollapsed}
            className={cn('shrink-0 max-w-full', isCollapsed ? 'h-7 w-7' : 'h-9 w-[180px]')}
          />
        </Link>
      </div>

      {/* Collapse toggle — sits between the logo and the first nav item */}
      <div
        className={cn(
          'shrink-0 flex items-center px-2 pt-2 transition-all duration-300 ease-in-out motion-reduce:transition-none',
          isCollapsed ? 'justify-center' : 'justify-end'
        )}
      >
        <button
          onClick={onToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          className={cn(
            'flex items-center justify-center rounded-lg text-brand-text/60 hover:text-brand hover:bg-brand-sidebar-hover',
            'transition-all duration-300 ease-in-out active:scale-90 motion-reduce:transition-none',
            isCollapsed
              ? 'w-9 h-9 border border-brand-sidebar-border'
              : 'w-8 h-8 border border-transparent'
          )}
        >
          {/* A single chevron that spins 180°, so the direction change is animated
              rather than an instant icon swap. */}
          <ChevronLeft
            className={cn(
              'w-4 h-4 transition-transform duration-300 ease-in-out motion-reduce:transition-none',
              isCollapsed && 'rotate-180'
            )}
          />
        </button>
      </div>

      <nav
        className={cn(
          'flex-1 overflow-y-auto overflow-x-hidden',
          isCollapsed ? 'px-2 pb-4' : 'px-2 pb-4'
        )}
      >
        {isCollapsed ? (
          // ---------------- Collapsed: icon rail with tooltips ----------------
          <div className="flex flex-col items-center space-y-3 pt-2 animate-in fade-in duration-300 motion-reduce:animate-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isInSection(item);
              // A group jumps to its first child, as in the reference sidebar.
              const target = item.subItems?.[0]?.path ?? item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => navigate(target)}
                  title={item.label}
                  aria-label={item.label}
                  className={cn(
                    'relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200',
                    active
                      ? 'bg-brand-sidebar-active shadow-inner'
                      : 'hover:bg-brand-sidebar-hover'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l bg-brand" />
                  )}
                  <Icon
                    className={cn('w-4 h-4', active ? 'text-brand' : 'text-brand-text')}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          // ---------------- Expanded: labelled nav with nested groups ----------------
          <div className="space-y-1 pt-1 animate-in fade-in slide-in-from-left-2 duration-300 motion-reduce:animate-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = !!item.subItems?.length;
              const active = isInSection(item);
              const isExpanded = expandedItems.includes(item.label);

              if (hasSubItems) {
                return (
                  <div key={item.path}>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={cn(
                        'relative flex items-center justify-between w-full gap-3 px-3 py-1.5 rounded-md text-[16px] font-semibold transition-colors text-brand-text hover:bg-brand-sidebar-hover',
                        active && 'bg-brand-sidebar-active'
                      )}
                    >
                      {active && (
                        <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-brand" />
                      )}
                      <span className="flex items-center gap-3">
                        <Icon className={cn('w-4 h-4', active && 'text-brand')} />
                        {item.label}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subItems!.map((subItem) => {
                          const SubIcon = subItem.icon;
                          const subActive = isActiveRoute(subItem.path);
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              className={cn(
                                'relative flex items-center w-full px-3 py-1.5 rounded-lg text-[15px] transition-colors hover:bg-brand-sidebar-hover',
                                subActive
                                  ? 'text-brand font-medium bg-brand-sidebar-active'
                                  : 'text-brand-text'
                              )}
                            >
                              {subActive && (
                                <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-brand" />
                              )}
                              <SubIcon className={cn('mr-2 h-4 w-4 shrink-0', subActive && 'text-brand')} />
                              {subItem.label}
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'relative flex items-center gap-3 w-full px-3 py-1.5 rounded-md text-[16px] font-medium transition-colors text-brand-text hover:bg-brand-sidebar-hover',
                    active && 'bg-brand-sidebar-active'
                  )}
                >
                  {active && (
                    <span className="absolute left-0 top-0 bottom-0 w-1 rounded-l bg-brand" />
                  )}
                  <Icon className={cn('w-4 h-4', active && 'text-brand')} />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
