import { normalizeRoute } from './posthogContext';

/**
 * Route → the page name used in analytics event names ("Utilities Page Viewed").
 *
 * `$pageview` alone answers "how much traffic", but every question about a *screen* then
 * needs a `screen`/`$current_url` filter. A named event per page makes each screen a
 * first-class row in PostHog's event list, so it can be charted, funnelled and alerted on
 * directly. Both are sent — `$pageview` still feeds PostHog's built-in web analytics.
 *
 * Keys are normalised routes (ids collapsed to `:id`, see `normalizeRoute`). Anything not
 * listed falls back to a title built from the path, so a new route is never unnamed —
 * `/masters/lease-custom-fields` becomes "Masters Lease Custom Fields".
 */
const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/dashboard': 'Dashboard',
  '/rental-dashboard': 'Rental Dashboard',
  '/tenant-dashboard': 'Tenant Dashboard',
  '/notifications': 'Notifications',
  '/reports': 'Reports',
  '/analytics': 'Analytics Dashboard',
  '/settings': 'Settings',

  '/properties': 'Properties',
  '/properties/:id': 'Property Details',

  '/rentals': 'Rentals',
  '/rental/new': 'Add Rental',
  '/rental/:id': 'Rental Details',
  '/rental/edit/:id': 'Edit Rental',

  '/maintenance': 'Maintenance',
  '/maintenance/new': 'Add Maintenance Request',
  '/maintenance/:id': 'Maintenance Request Details',
  '/maintenance/edit/:id': 'Edit Maintenance Request',

  '/utilities': 'Utilities',
  '/utilities/new': 'Add Utility',
  '/utilities/:id': 'Utility Details',
  '/utilities/edit/:id': 'Edit Utility',

  '/compliance': 'Compliance',
  '/compliance/new': 'Add Compliance',
  '/compliance/view/:id': 'Compliance Details',
  '/compliance/edit/:id': 'Edit Compliance',

  '/invoicing': 'Invoicing',
  '/invoicing/:id': 'Invoice Details',

  '/opex': 'Opex',
  '/opex/new': 'Add Expense',
  '/opex/:id': 'Expense Details',
  '/opex/edit/:id': 'Edit Expense',

  '/amc': 'AMC',
  '/amc/new': 'Add AMC Contract',
  '/amc/:id': 'AMC Contract Details',
  '/amc/edit/:id': 'Edit AMC Contract',

  '/masters': 'Masters',
  '/masters/access': 'Access Control',
  '/masters/amenities': 'Amenity Master',
  '/masters/branding': 'Branding Management',
  '/masters/branding/:id': 'Branding Details',
  '/masters/budgets': 'Budget Master',
  '/masters/circles': 'Circle Master',
  '/masters/cities': 'City Master',
  '/masters/compliances': 'Compliances Master',
  '/masters/compliances/:id': 'Compliance Requirement Details',
  '/masters/countries': 'Country Master',
  '/masters/countries/:id': 'Country Details',
  '/masters/expense-categories': 'Expense Category Master',
  '/masters/facility-types': 'Facility Types',
  '/masters/landlords': 'Landlords',
  '/masters/landlords/:id': 'Landlord Details',
  '/masters/lease-custom-fields': 'Lease Custom Fields',
  '/masters/lease-custom-fields/:id': 'Lease Custom Field Details',
  '/masters/properties': 'Properties Master',
  '/masters/properties/:id': 'Property Master Details',
  '/masters/regions': 'Region Master',
  '/masters/regions/:id': 'Region Details',
  '/masters/roles': 'Roles',
  '/masters/roles/:id': 'Role Details',
  '/masters/service-types': 'Service Type Master',
  '/masters/states': 'States Master',
  '/masters/states/:id': 'State Details',
  '/masters/takeover-conditions': 'Takeover Conditions',
  '/masters/tenants': 'Lessees',
  '/masters/tenants/:id': 'Lessee Details',
  '/masters/users': 'Users',
  '/masters/users/:id': 'User Details',
  '/masters/vendors': 'Vendors',
  '/masters/vendors/add': 'Add Vendor',
  '/masters/vendors/edit/:id': 'Edit Vendor',
  '/masters/vendors/:id': 'Vendor Details',
  '/masters/zones': 'Zone Master',
  '/masters/zones/:id': 'Zone Details',
};

/** "/masters/lease-custom-fields" → "Masters Lease Custom Fields"; ":id" → "Details". */
function titleFromRoute(route: string): string {
  const words = route
    .split('/')
    .filter(Boolean)
    .map((segment) => (segment === ':id' ? 'Details' : segment.replace(/[-_]+/g, ' ')))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!words) return 'Home';
  return words.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getPageTitle(pathname: string = window.location.pathname): string {
  const route = normalizeRoute(pathname);
  return PAGE_TITLES[route] ?? titleFromRoute(route);
}

/** The analytics event name for a screen view, e.g. "Utilities Page Viewed". */
export function getPageViewEventName(pathname: string = window.location.pathname): string {
  return `${getPageTitle(pathname)} Page Viewed`;
}
