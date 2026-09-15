import { useQuery } from '@tanstack/react-query';
import {
  fetchAdoptionEngagement,
  fetchAdoptionTrend,
  fetchGrowth,
  fetchModules,
  fetchRetention,
  fetchTrafficSession,
  fetchUsageAndDistribution,
  fetchWorkflowUsage,
} from './analyticsApi';

/**
 * React Query hooks for the analytics endpoints, following the caching and key structure of
 * fm-matrix-revamp's `/posthog-dashboard` (`api/queries.ts`).
 *
 * Each call is a multi-second scan, so the cache is generous and nothing refetches on focus
 * or remount — a dashboard that silently re-queries every time the window regains focus
 * costs far more than the staleness it saves.
 */

/** Look-back windows, matching the reference dashboard's constants. */
export const TREND_WEEKS = 8;
export const GROWTH_WEEKS = 6;
export const RETENTION_WEEKS = 6;

export interface QueryFilters {
  /** The dashboard sets this false while it has no usable range yet. */
  enabled: boolean;
  from: string;
  to: string;
  /** Registered-Admin ceiling; without it seat utilisation comes back null. */
  licensedSeats: number | null;
  /** Selected workflow's module / sub-module, for the Layer-3 queries. */
  module: string | null;
  subModule: string | null;
  /** Bumped by the Refresh control to force a re-fetch. */
  requestId: number;
}

const CACHE = {
  staleTime: 5 * 60_000,
  gcTime: 30 * 60_000,
  refetchOnWindowFocus: false,
  refetchOnMount: false,
  retry: false,
} as const;

function ymd(d: Date): string {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** `days` inclusive of today, matching the API's day snapping. */
export function dateRangeFor(days: number): { from: string; to: string } {
  const to = new Date();
  const from = new Date(to);
  from.setDate(to.getDate() - (days - 1));
  return { from: ymd(from), to: ymd(to) };
}

const keyBase = (f: QueryFilters) => [f.from, f.to, f.requestId];

export function useTrafficSession(f: QueryFilters) {
  return useQuery({
    queryKey: ['lm-analytics', 'traffic_session', ...keyBase(f)],
    queryFn: () => fetchTrafficSession({ from: f.from, to: f.to }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useUsageAndDistribution(f: QueryFilters) {
  return useQuery({
    queryKey: ['lm-analytics', 'usage_and_distribution', ...keyBase(f)],
    queryFn: () => fetchUsageAndDistribution({ from: f.from, to: f.to }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useAdoptionEngagement(f: QueryFilters) {
  return useQuery({
    queryKey: ['lm-analytics', 'adoption_engagement', ...keyBase(f), f.licensedSeats],
    queryFn: () =>
      fetchAdoptionEngagement({ from: f.from, to: f.to, licensedSeats: f.licensedSeats }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useAdoptionTrend(f: QueryFilters) {
  return useQuery({
    queryKey: ['lm-analytics', 'adoption_trend', f.to, f.requestId],
    queryFn: () => fetchAdoptionTrend({ to: f.to, weeks: TREND_WEEKS }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useGrowth(f: QueryFilters) {
  return useQuery({
    queryKey: ['lm-analytics', 'growth', f.to, f.requestId],
    queryFn: () => fetchGrowth({ to: f.to, weeks: GROWTH_WEEKS }),
    enabled: f.enabled,
    ...CACHE,
  });
}

export function useRetention(f: QueryFilters) {
  return useQuery({
    queryKey: ['lm-analytics', 'retention', f.to, f.requestId],
    queryFn: () => fetchRetention({ to: f.to, weeks: RETENTION_WEEKS }),
    enabled: f.enabled,
    ...CACHE,
  });
}

/** Top-level module tree — powers module breadth and the league table. */
export function useModules(f: QueryFilters) {
  return useQuery({
    queryKey: ['lm-analytics', 'modules', ...keyBase(f)],
    queryFn: () => fetchModules({ from: f.from, to: f.to }),
    enabled: f.enabled,
    ...CACHE,
  });
}

/** Sub-module tree for the selected module — powers the Masters submodule league table. */
export function useSubModules(f: QueryFilters, module: string | null) {
  return useQuery({
    queryKey: ['lm-analytics', 'modules', module ?? '-', ...keyBase(f)],
    queryFn: () => fetchModules({ from: f.from, to: f.to, module: module as string }),
    enabled: f.enabled && !!module,
    ...CACHE,
  });
}

export function useWorkflowUsage(f: QueryFilters) {
  return useQuery({
    queryKey: [
      'lm-analytics', 'workflow_usage', ...keyBase(f), f.module ?? '-', f.subModule ?? '-',
    ],
    queryFn: () =>
      fetchWorkflowUsage({
        from: f.from,
        to: f.to,
        module: f.module ?? undefined,
        subModule: f.subModule ?? undefined,
      }),
    enabled: f.enabled,
    ...CACHE,
  });
}
