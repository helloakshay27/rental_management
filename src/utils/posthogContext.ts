/**
 * PostHog super-properties — stamped on EVERY event this app sends.
 *
 * Registered once at init (see `main.tsx`) and refreshed on every navigation (see
 * `components/PostHogPageView.tsx`), so they reach `$pageview` and every per-module event
 * helper without each call site having to remember them.
 *
 * Ported from fm-matrix-revamp's `utils/posthogContext.ts`. `client` and `is_test` are the
 * two mandatory query filters: several apps report into the same PostHog project, so without
 * them a query silently mixes this app with the others plus everyone's local debug builds.
 */

/**
 * Hostname → `client`.
 *
 * Web values are suffixed `-web` so they never collide with the Flutter apps' own client
 * values in the shared project.
 */
// ORDER IS SIGNIFICANT — first match wins and the entries overlap.
const CLIENT_BY_HOST: [test: (h: string) => boolean, client: string][] = [
  [(h) => h === 'localhost' || h === '127.0.0.1', 'local-web'],
  [(h) => h.includes('rental-uat'), 'rental-uat-web'],
  [(h) => h.includes('rental'), 'rental-web'],
];

/** Unrecognised hosts report as the primary product rather than as an unfilterable blank. */
const DEFAULT_CLIENT = 'rental-web';

export function resolveClient(hostname: string = window.location.hostname): string {
  for (const [matches, client] of CLIENT_BY_HOST) {
    if (matches(hostname)) return client;
  }
  return DEFAULT_CLIENT;
}

/**
 * True for anything that is not a real production visit — the dev server and local builds.
 * Analytics queries filter on `is_test = false`; getting this wrong in the safe direction
 * (marking real traffic as test) loses data, so it keys off the build mode plus localhost
 * rather than guessing from the hostname alone.
 */
export function resolveIsTest(hostname: string = window.location.hostname): boolean {
  if (import.meta.env.DEV) return true;
  return hostname === 'localhost' || hostname === '127.0.0.1';
}

/**
 * Route → `screen`, the primary grouping dimension for every module breakdown.
 *
 * Record identifiers collapse to `:id`, so a screen stays one screen instead of fragmenting
 * into a row per record — `/rental/118` and `/rental/204` are the same screen, viewed twice.
 */
export function normalizeRoute(pathname: string = window.location.pathname): string {
  const collapsed = pathname
    .split('/')
    .filter(Boolean)
    .map((segment) => {
      if (/^\d+$/.test(segment)) return ':id';
      // UUID, with or without hyphens
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) return ':id';
      if (/^[0-9a-f]{24,32}$/i.test(segment)) return ':id';
      // Mixed identifiers that are mostly digits, e.g. "MR-202601-0003"
      if (/^[A-Za-z]{1,4}[-_]?\d{3,}/.test(segment)) return ':id';
      return segment.toLowerCase();
    })
    .join('/');
  return collapsed ? `/${collapsed}` : '/';
}

/** Route → the module an event belongs to, for module-level breakdowns. */
const MODULE_BY_PREFIX: [prefix: string, module: string][] = [
  ['/rental', 'rental'],
  ['/properties', 'property'],
  ['/maintenance', 'maintenance'],
  ['/utilities', 'utility'],
  ['/compliance', 'compliance'],
  ['/invoicing', 'invoicing'],
  ['/opex', 'opex'],
  ['/amc', 'amc'],
  ['/masters', 'masters'],
  ['/reports', 'reports'],
  ['/settings', 'settings'],
  ['/notifications', 'notifications'],
  ['/tenant-dashboard', 'tenant'],
  ['/dashboard', 'dashboard'],
];

export function resolveModule(pathname: string = window.location.pathname): string {
  for (const [prefix, module] of MODULE_BY_PREFIX) {
    if (pathname.startsWith(prefix)) return module;
  }
  return 'other';
}

/** The stored user blob, written by the login flow (`pages/Login.tsx`). */
export function getStoredUser(): Record<string, any> | null {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    // A corrupt or partially-written user blob must not take analytics down with it.
    return null;
  }
}

/**
 * The signed-in user's role, for adoption-by-role breakdowns. Undefined when unknown —
 * better an unclassified event than one stamped with a guess.
 */
function resolveUserRole(): string | undefined {
  const user = getStoredUser();
  const role =
    user?.lock_role?.name ??
    user?.role?.name ??
    user?.role ??
    (Array.isArray(user?.roles) ? user?.roles[0]?.name ?? user?.roles[0] : undefined) ??
    user?.user_type;
  return typeof role === 'string' && role ? role : undefined;
}

/** Tenant/company label, when the account carries one. */
function resolveClientCompany(): string | undefined {
  const user = getStoredUser();
  return (
    localStorage.getItem('selectedCompany') ??
    user?.company_name ??
    user?.company?.name ??
    undefined
  );
}

export interface PostHogSuperProperties {
  client: string;
  is_test: boolean;
  platform: 'web';
  release_version: string;
  client_company?: string;
  user_role?: string;
}

export function getPostHogSuperProperties(): PostHogSuperProperties {
  return {
    client: resolveClient(),
    is_test: resolveIsTest(),
    platform: 'web',
    release_version: (import.meta.env.VITE_APP_VERSION as string) ?? 'dev',
    client_company: resolveClientCompany(),
    user_role: resolveUserRole(),
  };
}
