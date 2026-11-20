import { fetchWithSlowWarning } from "@/lib/slowRequest";
import { getToken } from "@/lib/api";
import { fetchGet, runExportJob, type ExportPhase } from './exportJob';
/**
 * Lease Management analytics API — the PostHog Adoption Analytics service.
 *
 * Ported from fm-matrix-revamp's `/posthog-dashboard` feature
 * (`src/features/posthog-dashboard/api/adoptionApi.ts`), same endpoints and response shapes.
 * Lease Management has its own API in the analytics backend, `/commercial/lease/adoption/*`,
 * and that API fixes on the server which events it reads: project_code LMV-01 from the live
 * web build (client rental-web, is_test false). So a request carries only the filters
 * (from / to / weeks / module / sub_module / limit); no project_code or url is sent.
 *
 * Contract notes carried over from the reference implementation:
 *   • No auth header — the service is unauthenticated and `team` is fixed server-side.
 *   • `site_id` is deliberately NOT sent: it is not part of this API's contract.
 *   • `device_type` is not sent either, and there is no persona filter. Per §8 of the Chart
 *     Calculation & Instrumentation Reference, `platform` has a single value ("web") and
 *     filtering by `user_role` was explicitly descoped, so the date range is the only filter.
 */
 

/**
 * Where the analytics service lives.
 *
 * In development, routed through Vite's `/analytics-api` proxy so local dev requests don't
 * trigger CORS issues with the server's duplicate Access-Control-Allow-Origin headers.
 * In production builds (or when overridden via env), the direct origin is used.
 */
const BASE_URL = (
  (import.meta.env.VITE_LM_ANALYTICS_API_URL as string | undefined)?.trim() ||
  (import.meta.env.DEV ? '/analytics-api' : 'https://posthog-api.lockated.com')
).replace(/\/+$/, '');

/** Lease Management's own analytics API (Commercial::LeaseController in the analytics backend). */
export const ANALYTICS_API_PATH = 'commercial/lease';

export const ANALYTICS_BASE_URL = BASE_URL;

/** What the analytics read: the API's fixed scope, for labels. */
export function analyticsScopeLabel(): string {
  return 'Lease Management live web app (LMV-01)';
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

/** Only the filters: the API fixes the scope (project_code LMV-01, live web build) itself. */
const rangeParams = (f: RangeFilters) => ({ from: f.from, to: f.to });
const weeklyParams = (f: WeeklyFilters) => ({ to: f.to, weeks: String(f.weeks) });

const adoptionUrl = (base: string, path: string) => `${base}/${ANALYTICS_API_PATH}/adoption/${path}`;

/**
 * The signed-in user's login token for the analytics API, which checks it on every request
 * (`Authorization: Bearer <token>`, the JWT this app's backend returns at login). An explicit one
 * (the Recent Activity filters' authToken) wins.
 */
function authHeaders(explicit?: string): Record<string, string> {
  const token = explicit || getToken() || '';
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function get<T>(path: string, params: Record<string, string>): Promise<T> {
  const qs = new URLSearchParams(params).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetchWithSlowWarning(`${adoptionUrl(BASE_URL, path)}?${qs}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json', ...authHeaders() },
    }, async (res) => {
      if (!res.ok) throw new Error(`${path} failed: ${res.status} ${res.statusText}`);
      return (await res.json()) as T;
    });
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

/* ------------------------------------------- Recent Active Users & Export */

export interface RecentActiveUser {
  user_id: string;
  /** "First Last" as the API sends it. */
  user_name?: string | null;
  email?: string | null;
  /** Older API field; the API now sends user_name. */
  display_name?: string | null;
  path: string | null;
  last_event: string | null;
  minutes_ago: number | null;
  site_name: string | null;
}

export interface RecentActiveUsersResponse {
  users: RecentActiveUser[];
}

export interface RecentActivityApiFilters {
  project_code?: string;
  project?: string;
  tenant?: string;
  site_ids?: (string | number)[] | string;
  siteIds?: (string | number)[];
  devPlatform?: string;
  device?: string;
  devices?: string[];
  platform?: string;
  baseUrl?: string;
  authToken?: string;
  from?: string;
  to?: string;
  limit?: number;
  requestId?: number;
  enabled?: boolean;
  [key: string]: unknown;
}

/** Recent Activity / download: the date range and row limit only (the API fixes the scope). */
export function buildRecentActivityParams(
  filters: RecentActivityApiFilters = {},
  limit?: number,
): Record<string, string> {
  const params: Record<string, string> = {};
  if (limit != null) params.limit = String(limit);
  if (filters.from) params.from = String(filters.from);
  if (filters.to) params.to = String(filters.to);
  return params;
}

export async function fetchRecentActiveUsers(
  filters: RecentActivityApiFilters = {},
  limit: number = 10,
): Promise<RecentActiveUsersResponse> {
  const params = buildRecentActivityParams(filters, limit);
  const baseUrl = (filters.baseUrl || BASE_URL).replace(/\/+$/, '');
  const headers: Record<string, string> = { Accept: 'application/json' };
  Object.assign(headers, authHeaders(filters.authToken));

  const qs = new URLSearchParams(params).toString();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetchWithSlowWarning(`${adoptionUrl(baseUrl, 'recent_active_users')}?${qs}`, {
      signal: controller.signal,
      headers,
    }, async (res) => {
      if (!res.ok) throw new Error(`recent_active_users failed: ${res.status} ${res.statusText}`);
      return (await res.json()) as RecentActiveUsersResponse;
    });
  } finally {
    clearTimeout(timer);
  }
}

/** The .xlsx of every event in the range, made in the background on the server (see ./exportJob). */
export async function downloadActiveUsersExport(
  filters: RecentActivityApiFilters = {},
  onPhase?: (phase: ExportPhase) => void,
): Promise<void> {
  const params = buildRecentActivityParams(filters);
  const baseUrl = (filters.baseUrl || BASE_URL).replace(/\/+$/, '');
  const headers: Record<string, string> = {
    Accept:
      'application/json, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream, */*',
  };
  Object.assign(headers, authHeaders(filters.authToken));

  const qs = new URLSearchParams(params).toString();
  const url = `${adoptionUrl(baseUrl, 'active_users_export')}${qs ? `?${qs}` : ''}`;

  const { blob, filename: serverName } = await runExportJob({
    exportUrl: url,
    adoptionUrl: adoptionUrl(baseUrl, '').replace(/\/$/, ''),
    get: fetchGet({ headers }),
    onPhase,
  });

  let filename = 'active_users.xlsx';
  if (serverName) {
    filename = serverName;
  } else if (filters.from && filters.to) {
    filename = `active_users_${filters.from}_to_${filters.to}.xlsx`;
  }

  const blobUrl = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
  // Revoking straight away can cancel the download in Safari.
  setTimeout(() => window.URL.revokeObjectURL(blobUrl), 1000);
}

