/**
 * Lease Management analytics API — the PostHog Adoption Analytics service.
 *
 * Ported from fm-matrix-revamp's `/posthog-dashboard` feature
 * (`src/features/posthog-dashboard/api/adoptionApi.ts`); the `/vi-posthog-dashboard` build
 * uses the same nine endpoints and the same response shapes, differing only in how the
 * tenant is identified (`app_id` for the mobile product, `url` for a web one). Lease
 * Management is web-only, so it identifies itself with `url`, exactly like FM Matrix.
 *
 * Contract notes carried over from the reference implementation:
 *   • No auth header — the service is unauthenticated and `team` is fixed server-side.
 *   • `site_id` is deliberately NOT sent: it is not part of this API's contract.
 *   • `device_type` is not sent either, and there is no persona filter. Per §8 of the Chart
 *     Calculation & Instrumentation Reference, `platform` has a single value ("web") and
 *     filtering by `user_role` was explicitly descoped, so the date range is the only filter.
 */

import { getBaseUrlDomain } from '@/lib/api';

/**
 * Where the analytics service lives.
 *
 * Always the absolute PostHog Adoption Analytics origin — in development too, so the URLs
 * in the network tab are exactly the ones the deployed build sends. No `/analytics-api`
 * dev-proxy prefix, no localhost in the request URL.
 */
const BASE_URL = (
  (import.meta.env.VITE_LM_ANALYTICS_API_URL as string | undefined)?.trim() ||
  'https://posthog-api.lockated.com'
).replace(/\/+$/, '');

/**
 * How this product is identified to the analytics service.
 *
 * FM Matrix scopes by host (`url=fm-matrix.lockated.com`) and Vi by `app_id`, because those
 * are the identifiers their events carry. Lease Management stamps `project_code` /
 * `project_id` on *every* event (§6.1 of the Chart Calculation & Instrumentation Reference,
 * and §7.1's cross-cutting controls: "every query in this section is implicitly scoped to
 * project_code = LMV-01 / project_id = P-274"), so that is the selector used here.
 *
 * It is also the more accurate one: this app runs on three hosts (rental-web,
 * rental-uat-web, local-web) and a host filter would see only one of them. Verified against
 * the live service — `url=rental-uat.lockated.com` returns zeros while
 * `project_code=LMV-01` returns the real sessions.
 *
 * Setting VITE_LM_ANALYTICS_TENANT_URL switches back to host scoping for a deployment that
 * needs to look at exactly one host.
 */
export const ANALYTICS_PROJECT_CODE =
  (import.meta.env.VITE_LM_ANALYTICS_PROJECT_CODE as string | undefined)?.trim() || 'LMV-01';

const TENANT_URL_OVERRIDE = (
  import.meta.env.VITE_LM_ANALYTICS_TENANT_URL as string | undefined
)?.trim();

/**
 * The host sent as `url`, the way FM Matrix sends `url=fm-matrix.lockated.com`.
 *
 * Resolution order: an env override, then the browser's own hostname on a real deployment,
 * then the session's stored base URL (localStorage `baseUrl`, written at login by
 * `lib/api.ts`) while running locally.
 *
 * Worth knowing when reading a local dashboard: PostHog fills `url` from `$current_url`, so
 * it is the FRONT-END origin events were fired from, not the API host the session talks to.
 * A stored base URL of `rental-uat.lockated.com` therefore ANDs the query down to zero rows
 * — verified against the live service — while `rental.lockated.com` returns the real
 * sessions. Set VITE_LM_ANALYTICS_TENANT_URL locally to look at a deployed host's data.
 */
export function analyticsTenantUrl(): string {
  if (TENANT_URL_OVERRIDE) return TENANT_URL_OVERRIDE;

  const host = (typeof window !== 'undefined' && window.location.hostname) || '';
  const isLocal = !host || host === 'localhost' || host === '127.0.0.1' || host === '::1';

  // A dev machine is not a tenant: `url=localhost` would scope the query to events fired on
  // someone's laptop. Fall back to the session's configured base URL instead.
  return isLocal ? getBaseUrlDomain() : host;
}

export const ANALYTICS_BASE_URL = BASE_URL;

/** What the badge shows as the current scope. */
export function analyticsScopeLabel(): string {
  return `${ANALYTICS_PROJECT_CODE} · ${analyticsTenantUrl()}`;
}

/** Requests are multi-second ClickHouse scans; give them room but never hang the page. */
const TIMEOUT_MS = 60_000;

export interface RangeFilters {
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
}

export interface WeeklyFilters {
  to: string; // YYYY-MM-DD
  weeks: number;
}

/**
 * Both identifiers go on every request: `project_code` (stamped on every event this app
 * sends) and `url` (the session's host, the way FM Matrix scopes its dashboard). The service
 * ANDs them, so the result is this product on this deployment.
 */
function baseParams(): Record<string, string> {
  const params: Record<string, string> = { project_code: ANALYTICS_PROJECT_CODE };
  const host = analyticsTenantUrl();
  if (host) params.url = host;
  return params;
}

const rangeParams = (f: RangeFilters) => ({ ...baseParams(), from: f.from, to: f.to });
const weeklyParams = (f: WeeklyFilters) => ({ ...baseParams(), to: f.to, weeks: String(f.weeks) });

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${BASE_URL}/fm/adoption/${path}?${qs}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`${path} failed: ${res.status} ${res.statusText}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

/* ------------------------------------------------------------------ shared */

export interface AdoptionMeta {
  metric: string;
  layer?: string;
  level?: string;
  module?: string;
  sub_module?: string;
  filters: {
    url: string;
    from: string;
    to: string;
    [key: string]: unknown;
  };
  generated_at: string;
}

/** Every response carries a self-describing block (summary + per-metric formulas). */
export interface AdoptionInfo {
  summary?: string;
  period?: Record<string, string>;
  formula?: Record<string, string>;
  notes?: Record<string, string>;
}

/* ------------------------------------------------- Layer 1 · traffic_session */

export interface TrafficSessionResponse {
  meta: AdoptionMeta;
  tiles: {
    active_users: number;
    screen_views: number;
    sessions: number;
    avg_session_seconds: number;
    bounce_rate: number; // already a percentage (0-100)
    recently_online: number;
  };
  previous: {
    active_users: number;
    screen_views: number;
    sessions: number;
    avg_session_seconds: number;
    bounce_rate: number;
  };
  delta_pct: {
    active_users: number | null;
    screen_views: number | null;
    sessions: number | null;
    avg_session_seconds: number | null;
    bounce_rate: number | null;
  };
  info?: AdoptionInfo;
}

export const fetchTrafficSession = (f: RangeFilters) =>
  get<TrafficSessionResponse>('traffic_session', rangeParams(f));

/* ------------------------------------------ Layer 1 · usage_and_distribution */

export interface UsageDay {
  day: string; // YYYY-MM-DD
  visitors: number;
  views: number;
  sessions: number;
}

export interface UsageDistributionResponse {
  meta: AdoptionMeta;
  usage_over_time: { current: UsageDay[]; previous: UsageDay[] };
  device_split: {
    total_sessions: number;
    devices: { device: string; users: number; sessions: number; session_share: number }[];
  };
  views_per_session: number;
  info?: AdoptionInfo;
}

export const fetchUsageAndDistribution = (f: RangeFilters) =>
  get<UsageDistributionResponse>('usage_and_distribution', rangeParams(f));

/* ---------------------------------------- Layer 2 · adoption_engagement (A*) */

export interface AdoptionEngagementResponse {
  meta: AdoptionMeta;
  seat_utilisation: {
    value: number | null; // null unless licensed_seats was passed
    used_seats: number;
    licensed_seats: number | null;
    delta_pct: number | null;
  };
  stickiness: { value: number; avg_dau: number; mau: number; delta_pct: number | null };
  adoption_trend: { value: number | null; wau_now: number; wau_4wk_ago: number };
  activation: { value: number; joiners: number; delta_pct: number | null };
  module_breadth: { in_use: number; total: number };
  dormant_users: { value: number; band: string };
  info?: AdoptionInfo;
}

/**
 * `licensed_seats` is billing data, not events — without it A1 comes back null. Lease
 * Management's registered-Admin ceiling stands in for it (§7.2 A1 tags that ceiling as an
 * illustrative constant, not a live account-table read).
 */
export const fetchAdoptionEngagement = (f: RangeFilters & { licensedSeats?: number | null }) =>
  get<AdoptionEngagementResponse>('adoption_engagement', {
    ...rangeParams(f),
    ...(f.licensedSeats != null && f.licensedSeats > 0
      ? { licensed_seats: String(f.licensedSeats) }
      : {}),
  });

/* -------------------------------------------- Layer 2 · adoption_trend (A3) */

export interface WeeklyWau {
  week: string; // Monday of the ISO week
  wau: number;
}

export interface AdoptionTrendResponse {
  meta: AdoptionMeta;
  weekly: { current: WeeklyWau[]; previous: WeeklyWau[] };
  trend_pct: number | null;
  wau_now: number;
  wau_4wk_ago: number;
  info?: AdoptionInfo;
}

export const fetchAdoptionTrend = (f: WeeklyFilters) =>
  get<AdoptionTrendResponse>('adoption_trend', weeklyParams(f));

/* ------------------------------------------------------- Layer 2 · growth */

export interface GrowthWeekRow {
  week: string;
  new: number;
  returning: number;
  resurrected: number;
  dormant: number; // positive; rendered below the axis
}

export interface GrowthResponse {
  meta: AdoptionMeta;
  weeks: GrowthWeekRow[];
  info?: AdoptionInfo;
}

export const fetchGrowth = (f: WeeklyFilters) => get<GrowthResponse>('growth', weeklyParams(f));

/* ---------------------------------------------------- Layer 2 · retention */

/** week0..weekN keys are flat on the row, so index them dynamically. */
export interface RetentionCohort {
  cohort_week: string;
  size: number;
  [weekKey: string]: number | string | null;
}

export interface RetentionResponse {
  meta: AdoptionMeta;
  cohorts: RetentionCohort[];
  info?: AdoptionInfo;
}

export const fetchRetention = (f: WeeklyFilters) =>
  get<RetentionResponse>('retention', weeklyParams(f));

/* ----------------------------------------------------- Layer 3 · modules */

export interface ModuleNode {
  name: string;
  users: number;
  events: number;
  sessions: number;
}

export interface ModulesResponse {
  meta: AdoptionMeta;
  tree: ModuleNode[];
  info?: AdoptionInfo;
}

/** Omit `module` for the top-level tree; pass it to walk into a module's sub-tree. */
export const fetchModules = (f: RangeFilters & { module?: string }) =>
  get<ModulesResponse>('modules', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
  });

/* ---------------------------------------------- Layer 3 · workflow_usage */

export interface WorkflowKpi {
  value: number | null;
  delta_pct: number | null;
}

export interface WorkflowFunnelStep {
  step: string;
  reach: number;
  drop_pct: number | null;
  biggest: boolean;
}

export interface WorkflowFlowRow {
  path: string;
  users: number;
  events: number;
  sessions: number;
  f_comp: number | null;
}

export interface WorkflowEntryScreen {
  path: string;
  visitors: number;
  views: number;
  bounce: number; // percentage
  visitors_trend: number | null;
  views_trend: number | null;
  bounce_trend: number | null;
}

export interface WorkflowUsageResponse {
  meta: AdoptionMeta;
  kpis: {
    f_adopt: WorkflowKpi;
    f_comp: WorkflowKpi;
    f_step: WorkflowKpi;
    f_vol: WorkflowKpi;
  };
  funnel: WorkflowFunnelStep[];
  flows: WorkflowFlowRow[];
  entry_screens: WorkflowEntryScreen[];
  info?: AdoptionInfo;
}

export const fetchWorkflowUsage = (f: RangeFilters & { module?: string; subModule?: string }) =>
  get<WorkflowUsageResponse>('workflow_usage', {
    ...rangeParams(f),
    ...(f.module ? { module: f.module } : {}),
    ...(f.subModule ? { sub_module: f.subModule } : {}),
  });
