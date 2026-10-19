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
  subItems?: { label: string; path: string }[];
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
      { label: 'Overview', path: '/masters' },
      { label: 'Properties', path: '/masters/properties' },
      { label: 'Landlords', path: '/masters/landlords' },
      { label: 'Lessees', path: '/masters/tenants' },
      { label: 'Vendors', path: '/masters/vendors' },
      { label: 'Compliances', path: '/masters/compliances' },
      { label: 'Users', path: '/masters/users' },
      { label: 'Roles', path: '/masters/roles' },
      { label: 'Access Control', path: '/masters/access' },
      { label: 'Branding', path: '/masters/branding' },
      { label: 'Amenities', path: '/masters/amenities' },
      { label: 'Facility Types', path: '/masters/facility-types' },
      { label: 'Takeover Conditions', path: '/masters/takeover-conditions' },
      { label: 'Lease Custom Fields', path: '/masters/lease-custom-fields' },
      { label: 'Expense Categories', path: '/masters/expense-categories' },
      { label: 'Budgets', path: '/masters/budgets' },
      { label: 'Service Types', path: '/masters/service-types' },
      { label: 'Countries', path: '/masters/countries' },
      { label: 'States', path: '/masters/states' },
      { label: 'Regions', path: '/masters/regions' },
      { label: 'Zones', path: '/masters/zones' },
      { label: 'Cities', path: '/masters/cities' },
      { label: 'Circles', path: '/masters/circles' },
    ],
  },
  { icon: Bell, label: 'Notifications', path: '/notifications' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  /**
   * A group's active child is resolved from the current route, so a page reached
   * from the Masters overview cards (or a detail page beneath it) highlights the
   * same child as direct sidebar entry. Longest matching prefix wins, so
   * Overview (/masters) is active only on the overview itself.
   */
  const resolveActiveChild = (item: NavItem) =>
    (item.subItems ?? [])
      .filter(
        (sub) =>
          location.pathname === sub.path ||
          (sub.path !== item.path && location.pathname.startsWith(`${sub.path}/`))
      )
      .sort((a, b) => b.path.length - a.path.length)[0]?.path;
  /** A group is active anywhere in its subtree. */
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
        'relative bg-brand-sidebar flex flex-col h-screen shrink-0 overflow-hidden border-r border-brand-sidebar-border',
        'transition-[width] duration-300 ease-in-out motion-reduce:transition-none',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Brand header — same height as the top Header so both bottom borders line up.
          Hidden below lg: there the sidebar is a drawer and the top Header already
          carries the wordmark, so repeating it wastes a row. */}
      <div
        className={cn(
          'shrink-0 h-16 hidden lg:flex items-center overflow-hidden border-b border-brand-sidebar-border/70',
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
          'shrink-0 flex items-center px-2 py-0.5 transition-all duration-300 ease-in-out motion-reduce:transition-none',
          isCollapsed ? 'justify-center' : 'justify-end'
        )}
      >
        <button
          onClick={onToggle}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          aria-expanded={!isCollapsed}
          className={cn(
            'flex items-center justify-center rounded-lg text-[rgba(26,26,24,0.48)] hover:text-[#1A1A18] hover:bg-brand-sidebar-hover',
            'transition-all duration-300 ease-in-out active:scale-90 motion-reduce:transition-none',
            isCollapsed
              ? 'w-7 h-7 border border-brand-sidebar-border'
              : 'w-7 h-7 border border-transparent'
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
          'app-scrollbar flex-1 overflow-y-auto overflow-x-hidden px-2 pb-2 space-y-2'
        )}
      >
        {isCollapsed ? (
          // ---------------- Collapsed: icon rail with tooltips ----------------
          <div className="flex flex-col items-center space-y-2 pt-1 animate-in fade-in duration-300 motion-reduce:animate-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isInSection(item);
              // A group jumps to its first child, as in the reference sidebar.
              const target = item.subItems?.[0]?.path ?? item.path;

              return (
                <button
                  key={item.path}
                  // The destination reports itself as "<Page> Page Viewed"; a click event
                  // here would just duplicate every navigation.
                  onClick={() => navigate(target)}
                  title={item.label}
                  aria-label={item.label}
                  className={cn(
                    'group relative flex items-center justify-center w-10 h-10 rounded-[10px] transition-all duration-150',
                    active
                      ? 'bg-brand-sidebar-active'
                      : 'hover:bg-brand-sidebar-hover'
                  )}
                >
                  <Icon
                    className={cn(
                      'w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5',
                      active ? 'text-[#1A1A18]' : 'text-[rgba(26,26,24,0.62)]'
                    )}
                  />
                </button>
              );
            })}
          </div>
        ) : (
          // ---------------- Expanded: labelled nav with nested groups ----------------
          <div className="space-y-2 pt-1 animate-in fade-in slide-in-from-left-2 duration-300 motion-reduce:animate-none">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubItems = !!item.subItems?.length;
              const active = isInSection(item);
              const isExpanded = expandedItems.includes(item.label);
              const activeChild = hasSubItems ? resolveActiveChild(item) : undefined;

              if (hasSubItems) {
                return (
                  <div key={item.path}>
                    <button
                      onClick={() => toggleExpanded(item.label)}
                      className={cn(
                        'group relative flex items-center justify-between w-full gap-3 px-3 py-[9px] rounded-[10px] text-[13.5px] font-medium transition-colors duration-150',
                        active
                          ? 'bg-brand-sidebar-active text-[#1A1A18]'
                          : 'text-[rgba(26,26,24,0.62)] hover:bg-brand-sidebar-hover hover:text-[#1A1A18]'
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
                        {item.label}
                      </span>
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 shrink-0" />
                      )}
                    </button>

                    {isExpanded && (
                      <div className="mt-0.5 space-y-0.5">
                        {item.subItems!.map((subItem) => {
                          const subActive = subItem.path === activeChild;
                          return (
                            <Link
                              key={subItem.path}
                              to={subItem.path}
                              aria-current={subActive ? 'page' : undefined}
                              className={cn(
                                // Indented child row: 7px 10px 7px 40px, radius 8px, 12.5px text, 4px dot.
                                'relative flex items-center gap-2.5 w-full py-[7px] pr-[10px] pl-[40px] rounded-[8px] text-[12.5px] transition-colors duration-150',
                                subActive
                                  ? 'bg-brand-sidebar-active text-[#1A1A18] font-medium'
                                  : 'text-[rgba(26,26,24,0.62)] hover:bg-brand-sidebar-hover hover:text-[#1A1A18]'
                              )}
                            >
                              <span
                                aria-hidden
                                className={cn(
                                  'h-1 w-1 shrink-0 rounded-full',
                                  subActive ? 'bg-[#1A1A18]' : 'bg-[rgba(26,26,24,0.38)]'
                                )}
                              />
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
                    'group relative flex items-center gap-3 w-full px-3 py-[9px] rounded-[10px] text-[13.5px] font-medium transition-colors duration-150',
                    active
                      ? 'bg-brand-sidebar-active text-[#1A1A18]'
                      : 'text-[rgba(26,26,24,0.62)] hover:bg-brand-sidebar-hover hover:text-[#1A1A18]'
                  )}
                >
                  <Icon className="w-4 h-4 transition-transform duration-300 group-hover:-translate-y-0.5" />
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
