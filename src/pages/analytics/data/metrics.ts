import type {
  AdoptionEngagementResponse,
  AdoptionTrendResponse,
  GrowthResponse,
  ModulesResponse,
  RetentionResponse,
  TrafficSessionResponse,
  UsageDistributionResponse,
  WorkflowUsageResponse,
} from '../api/analyticsApi';
import { workflows } from '../lib/catalogue';

/**
 * API responses → the shapes the sections render.
 *
 * Mirrors fm-matrix-revamp's `data/metrics.ts`: responses are never rendered raw. The rules
 * that matter here are the same ones the reference applies — align current/previous series
 * so a shorter previous window cannot skew the overlay, turn percentage shares into chart
 * fractions, and rebuild the retention grid as rows of weekly offsets.
 *
 * Every builder returns `null` when its query has no data. The sections render that as an
 * explicit loading/empty state — a card with no events says so, rather than being padded out
 * with an illustrative number the viewer could mistake for a measurement.
 */

/* ------------------------------------------------------------------ helpers */

/** "2h 40m" / "7m 10s" from a second count, matching the tiles' existing format. */
export function formatDuration(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds <= 0) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.round(seconds % 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m ${s}s`;
}

/** Signed percentage for a delta badge: 4.6% / −1.2%. */
export function formatDelta(pct: number | null | undefined): string | null {
  if (pct == null || !Number.isFinite(pct)) return null;
  return `${Math.abs(pct).toFixed(1)}%`;
}

export function deltaDir(pct: number | null | undefined, goodUp = true): 'up' | 'dn' | 'flat' {
  if (pct == null || !Number.isFinite(pct) || pct === 0) return 'flat';
  const rising = pct > 0;
  return rising === goodUp ? 'up' : 'dn';
}

/** Title-cases an API module/path label: "masters" → "Masters", "/rental" → "Rental". */
export function prettyLabel(raw: string): string {
  return String(raw)
    .replace(/^\//, '')
    .replace(/[-_/]+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/* ------------------------------------------------------- Layer 1 · traffic */

export interface TrafficModel {
  activeAdmins: number;
  screenViews: number;
  sessions: number;
  avgSessionSeconds: number;
  bounceRate: number;
  recentlyActive: number;
  delta: TrafficSessionResponse['delta_pct'];
  generatedAt?: string;
}

export function buildTraffic(res?: TrafficSessionResponse | null): TrafficModel | null {
  if (!res?.tiles) return null;
  return {
    activeAdmins: res.tiles.active_users,
    screenViews: res.tiles.screen_views,
    sessions: res.tiles.sessions,
    avgSessionSeconds: res.tiles.avg_session_seconds,
    bounceRate: res.tiles.bounce_rate,
    recentlyActive: res.tiles.recently_online,
    delta: res.delta_pct,
    generatedAt: res.meta?.generated_at,
  };
}

export interface UsageModel {
  labels: string[];
  visitors: { cur: number[]; prev: number[] };
  views: { cur: number[]; prev: number[] };
  sessions: { cur: number[]; prev: number[] };
  viewsPerSession: number;
}

/**
 * Aligns the two series by index from the end: the API can return a previous window with a
 * different number of days, and a point-for-point overlay has to compare like with like.
 */
function alignTail(cur: number[], prev: number[]): { cur: number[]; prev: number[] } {
  if (!prev.length) return { cur, prev: [] };
  const n = Math.min(cur.length, prev.length);
  return { cur, prev: prev.slice(prev.length - n) };
}

export function buildUsage(res?: UsageDistributionResponse | null): UsageModel | null {
  const cur = res?.usage_over_time?.current;
  if (!cur?.length) return null;
  const prev = res?.usage_over_time?.previous ?? [];

  // Short labels: the axis has room for ~6 ticks, so use "12 Sep"-style day labels.
  const labels = cur.map((d) => {
    const dt = new Date(d.day);
    return Number.isNaN(dt.getTime())
      ? d.day
      : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  });

  return {
    labels,
    visitors: alignTail(cur.map((d) => d.visitors), prev.map((d) => d.visitors)),
    views: alignTail(cur.map((d) => d.views), prev.map((d) => d.views)),
    sessions: alignTail(cur.map((d) => d.sessions), prev.map((d) => d.sessions)),
    viewsPerSession: res?.views_per_session ?? 0,
  };
}

/* ----------------------------------------------------- Layer 2 · adoption */

export interface AdoptionModel {
  seatUtil: number | null;
  usedSeats: number;
  stickiness: number;
  adoptionTrend: number | null;
  activation: number;
  moduleBreadthInUse: number;
  moduleBreadthTotal: number;
  dormant: number;
  deltas: {
    seatUtil: number | null;
    stickiness: number | null;
    activation: number | null;
  };
}

export function buildAdoption(res?: AdoptionEngagementResponse | null): AdoptionModel | null {
  if (!res) return null;
  return {
    seatUtil: res.seat_utilisation?.value ?? null,
    usedSeats: res.seat_utilisation?.used_seats ?? 0,
    stickiness: res.stickiness?.value ?? 0,
    adoptionTrend: res.adoption_trend?.value ?? null,
    activation: res.activation?.value ?? 0,
    moduleBreadthInUse: res.module_breadth?.in_use ?? 0,
    moduleBreadthTotal: res.module_breadth?.total ?? 0,
    dormant: res.dormant_users?.value ?? 0,
    deltas: {
      seatUtil: res.seat_utilisation?.delta_pct ?? null,
      stickiness: res.stickiness?.delta_pct ?? null,
      activation: res.activation?.delta_pct ?? null,
    },
  };
}

export interface TrendModel {
  labels: string[];
  series: number[];
  prev: number[];
  trendPct: number | null;
}

export function buildTrend(res?: AdoptionTrendResponse | null): TrendModel | null {
  const weekly = res?.weekly?.current;
  if (!weekly?.length) return null;
  const prev = res?.weekly?.previous ?? [];
  return {
    labels: weekly.map((w, i) => `W${i + 1}`),
    series: weekly.map((w) => w.wau),
    prev: alignTail(weekly.map((w) => w.wau), prev.map((w) => w.wau)).prev,
    trendPct: res?.trend_pct ?? null,
  };
}

export interface GrowthModel {
  labels: string[];
  newUsers: number[];
  returning: number[];
  resurrecting: number[];
  dormant: number[];
}

export function buildGrowth(res?: GrowthResponse | null): GrowthModel | null {
  const weeks = res?.weeks;
  if (!weeks?.length) return null;
  return {
    labels: weeks.map((_, i) => `W${i + 1}`),
    newUsers: weeks.map((w) => w.new),
    returning: weeks.map((w) => w.returning),
    resurrecting: weeks.map((w) => w.resurrected),
    dormant: weeks.map((w) => w.dormant),
  };
}

export interface CohortRow {
  label: string;
  /** null = the cohort has not lived this long yet (upper-triangular blackout). */
  cells: (number | null)[];
}

export function buildRetention(res?: RetentionResponse | null, cols = 6): CohortRow[] | null {
  const cohorts = res?.cohorts;
  if (!cohorts?.length) return null;
  return cohorts.map((c) => {
    const label = (() => {
      const dt = new Date(c.cohort_week);
      return Number.isNaN(dt.getTime())
        ? String(c.cohort_week)
        : dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    })();
    const cells: (number | null)[] = [];
    for (let w = 0; w < cols; w++) {
      const raw = c[`week${w}`];
      cells.push(typeof raw === 'number' ? Math.round(raw) : null);
    }
    return { label, cells };
  });
}

export interface ModuleRow {
  name: string;
  users: number;
  events: number;
  sessions: number;
  /** Share of the busiest module, for the breadth bars. */
  share: number;
}

export function buildModules(res?: ModulesResponse | null): ModuleRow[] | null {
  const tree = res?.tree;
  if (!tree?.length) return null;
  const maxUsers = Math.max(...tree.map((m) => m.users), 1);
  return tree.map((m) => ({
    name: prettyLabel(m.name),
    users: m.users,
    events: m.events,
    sessions: m.sessions,
    share: m.users / maxUsers,
  }));
}

/* ----------------------------------------------------- Layer 3 · workflow */

export interface WorkflowModel {
  adoption: number | null;
  completion: number | null;
  biggestStepDropPct: number | null;
  biggestStepLabel: string | null;
  volume: number | null;
  funnel: { step: string; reach: number; dropPct: number | null; biggest: boolean }[];
  flows: { path: string; users: number; events: number; sessions: number; comp: number | null }[];
  entryScreens: { path: string; visitors: number; views: number; bounce: number }[];
  deltas: { adoption: number | null; completion: number | null; volume: number | null };
}

export function buildWorkflow(res?: WorkflowUsageResponse | null): WorkflowModel | null {
  if (!res?.kpis) return null;
  const biggest = res.funnel?.find((s) => s.biggest) ?? null;
  return {
    adoption: res.kpis.f_adopt?.value ?? null,
    completion: res.kpis.f_comp?.value ?? null,
    biggestStepDropPct: res.kpis.f_step?.value ?? biggest?.drop_pct ?? null,
    biggestStepLabel: biggest ? prettyLabel(biggest.step) : null,
    volume: res.kpis.f_vol?.value ?? null,
    funnel: (res.funnel ?? []).map((s) => ({
      step: prettyLabel(s.step),
      reach: s.reach,
      dropPct: s.drop_pct,
      biggest: s.biggest,
    })),
    flows: (res.flows ?? []).map((r) => ({
      path: prettyLabel(r.path),
      users: r.users,
      events: r.events,
      sessions: r.sessions,
      comp: r.f_comp,
    })),
    entryScreens: (res.entry_screens ?? []).map((r) => ({
      path: prettyLabel(r.path),
      visitors: r.visitors,
      views: r.views,
      bounce: r.bounce,
    })),
    deltas: {
      adoption: res.kpis.f_adopt?.delta_pct ?? null,
      completion: res.kpis.f_comp?.delta_pct ?? null,
      volume: res.kpis.f_vol?.delta_pct ?? null,
    },
  };
}

/**
 * Workflow key → the API's module / sub-module path segments.
 *
 * The service derives its module tree from `$pathname`, so these are this app's own route
 * segments (`/rental/…`, `/opex/…`, `/masters/…`) rather than the catalogue's display names.
 */
const WORKFLOW_PATHS: Record<string, { module: string; subModule?: string }> = {
  rentalCreate: { module: 'rental' },
  leaseRenewals: { module: 'rentals' },
  expenseCreate: { module: 'opex' },
  amcContract: { module: 'amc' },
  invoiceViewed: { module: 'invoicing' },
  complianceCreate: { module: 'compliance' },
  complianceRequirement: { module: 'masters', subModule: 'compliances' },
  maintenanceRequest: { module: 'maintenance' },
  utilityCreate: { module: 'utilities' },
};

export function workflowPath(key: string): { module: string | null; subModule: string | null } {
  const hit = WORKFLOW_PATHS[key];
  if (!hit) {
    // Unknown key: fall back to the workflow's own bucket module rather than querying blind.
    const wf = workflows.find((w) => w.key === key);
    return { module: wf ? wf.bucket.toLowerCase().split(' ')[0] : null, subModule: null };
  }
  return { module: hit.module, subModule: hit.subModule ?? null };
}

/** The Masters bucket's league table walks the `masters` sub-module tree. */
export const MASTERS_MODULE_PATH = 'masters';
