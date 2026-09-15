import React, { useEffect, useRef, useState } from 'react';
import './lease-analytics.css';
import { trackViewed } from '@/utils/analytics';
import { usePalette } from './lib/palette';
import { BM_DEFAULTS } from './lib/kpi-info';
import { useTargets } from './components/primitives';
import { BUCKET_ORDER, LICENSED_SEATS, MASTERS_BUCKET, workflows } from './lib/catalogue';
import {
  dateRangeFor, useAdoptionEngagement, useAdoptionTrend, useGrowth, useModules, useRetention,
  useSubModules, useTrafficSession, useUsageAndDistribution, useWorkflowUsage, type QueryFilters,
} from './api/queries';
import {
  buildAdoption, buildGrowth, buildModules, buildRetention, buildTraffic, buildTrend,
  buildUsage, buildWorkflow, MASTERS_MODULE_PATH, workflowPath,
} from './data/metrics';
import { analyticsScopeLabel } from './api/analyticsApi';
import { TrafficSection } from './sections/TrafficSection';
import { AdoptionSection } from './sections/AdoptionSection';
import { WorkflowSection } from './sections/WorkflowSection';

/**
 * Lease Management · Analytics Dashboard.
 *
 * A React port of the standalone wireframe: the design system, SVG chart engine and every
 * figure are carried over, with the imperative innerHTML builders replaced by components and
 * the page's global state (theme, nav rail, date range, previous-period toggle, workflow
 * bucket) held in React.
 *
 * The stylesheet is scoped under `.lm-root` rather than shipped as the document's own — this
 * route renders inside an app whose globals restyle bare `button`/`input` with `!important`,
 * and the scope is what keeps the two from bleeding into each other.
 *
 * Every figure is queried live from the PostHog Adoption Analytics API (see api/), scoped by
 * project_code. The only static content is the instrumentation catalogue itself — module and
 * event names, workflow step sequences and the reconciled event counts (lib/catalogue.ts).
 */

const PAGES = {
  pgTraffic: 'Traffic & Session',
  pgAdopt: 'Adoption & Engagement',
  pgFlows: 'Workflow Usage',
} as const;

type PageId = keyof typeof PAGES;

const RANGE_LABELS: Record<number, string> = { 7: 'Last 7 days', 30: 'Last 30 days', 90: 'Last 90 days' };

const THEME_KEY = 'lm-theme';
const NAV_KEY = 'lm-nav';

function readStored(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    // private mode / storage disabled — fall back to defaults
    return null;
  }
}

function store(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* best-effort */
  }
}

const LeaseAnalyticsDashboard = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = readStored(THEME_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });
  const [navCollapsed, setNavCollapsed] = useState(() => readStored(NAV_KEY) === 'collapsed');
  const [page, setPage] = useState<PageId>('pgTraffic');
  const [range, setRange] = useState(30);
  const [rangeLabel, setRangeLabel] = useState('Last 30 days');
  const [rangeOpen, setRangeOpen] = useState(false);
  const [customApplied, setCustomApplied] = useState(false);
  const [dateFrom, setDateFrom] = useState('2026-06-15');
  const [dateTo, setDateTo] = useState('2026-09-11');
  const [showPrev, setShowPrev] = useState(true);
  const [bucket, setBucket] = useState<string>('Rental Lifecycle');
  const [wfKey, setWfKey] = useState<string>('rentalCreate');

  const [requestId, setRequestId] = useState(0);

  const palette = usePalette(rootRef, theme);
  const { targets, setTarget } = useTargets(BM_DEFAULTS);

  /* ---------------------------------------------------------------- queries */

  // A preset maps to a trailing window ending today; a custom range is used verbatim.
  // Named queryWindow, not window — shadowing the global breaks matchMedia/history below.
  const queryWindow = customApplied && dateFrom && dateTo
    ? { from: dateFrom, to: dateTo }
    : dateRangeFor(range);

  const { module: wfModule, subModule: wfSubModule } = workflowPath(wfKey);

  const filters: QueryFilters = {
    enabled: true,
    from: queryWindow.from,
    to: queryWindow.to,
    // Billing data, not events: supplied only when a deployment configures it.
    licensedSeats: LICENSED_SEATS,
    module: bucket === MASTERS_BUCKET ? MASTERS_MODULE_PATH : wfModule,
    subModule: bucket === MASTERS_BUCKET ? null : wfSubModule,
    requestId,
  };

  const trafficQ = useTrafficSession(filters);
  const usageQ = useUsageAndDistribution(filters);
  const adoptionQ = useAdoptionEngagement(filters);
  const trendQ = useAdoptionTrend(filters);
  const growthQ = useGrowth(filters);
  const retentionQ = useRetention(filters);
  const modulesQ = useModules(filters);
  const mastersQ = useSubModules(filters, bucket === MASTERS_BUCKET ? MASTERS_MODULE_PATH : null);
  const workflowQ = useWorkflowUsage(filters);

  const traffic = buildTraffic(trafficQ.data);
  const usage = buildUsage(usageQ.data);
  const adoption = buildAdoption(adoptionQ.data);
  const trend = buildTrend(trendQ.data);
  const growth = buildGrowth(growthQ.data);
  const cohorts = buildRetention(retentionQ.data);
  const modules = buildModules(modulesQ.data);
  const mastersModules = buildModules(mastersQ.data);
  const workflow = buildWorkflow(workflowQ.data);

  const queries = [trafficQ, usageQ, adoptionQ, trendQ, growthQ, retentionQ, modulesQ, workflowQ];
  const isFetching = queries.some((q) => q.isFetching);
  // 'live' the moment any query has answered; cards whose own query is still in flight show
  // their loading state rather than a stand-in value.
  const isLive = queries.some((q) => q.data != null);
  const failed = queries.filter((q) => q.isError).length;

  useEffect(() => {
    trackViewed('Analytics Dashboard', { source: 'analytics_route' });
  }, []);

  // Follow the OS only while the viewer has not chosen a theme themselves.
  useEffect(() => {
    if (!window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      if (!readStored(THEME_KEY)) setTheme(e.matches ? 'dark' : 'light');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // `[` toggles the rail, except while typing.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== '[' || e.metaKey || e.ctrlKey || e.altKey) return;
      const t = e.target as HTMLElement | null;
      const tag = t?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || t?.isContentEditable) return;
      e.preventDefault();
      setNavCollapsed((c) => {
        store(NAV_KEY, !c ? 'collapsed' : 'open');
        return !c;
      });
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  // Close the date popover on any click outside it.
  useEffect(() => {
    if (!rangeOpen) return;
    const onClick = (e: MouseEvent) => {
      const pop = rootRef.current?.querySelector('.daterange');
      if (pop && !pop.contains(e.target as Node)) setRangeOpen(false);
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [rangeOpen]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    store(THEME_KEY, next);
  };

  const toggleNav = () => {
    const next = !navCollapsed;
    setNavCollapsed(next);
    store(NAV_KEY, next ? 'collapsed' : 'open');
  };

  const applyPreset = (days: number) => {
    setRange(days);
    setRangeLabel(RANGE_LABELS[days]);
    setCustomApplied(false);
  };

  const applyCustomRange = () => {
    if (!dateFrom || !dateTo) return;
    const days = Math.max(
      1,
      Math.round((new Date(dateTo).getTime() - new Date(dateFrom).getTime()) / 86400000) + 1
    );
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    setRange(days);
    setRangeLabel(`${fmt(dateFrom)} – ${fmt(dateTo)}`);
    setCustomApplied(true);
  };

  const goto = (id: PageId) => {
    setPage(id);
    rootRef.current?.scrollTo?.({ top: 0, behavior: 'smooth' });
  };

  const onBucketChange = (b: string) => {
    setBucket(b);
    if (b !== MASTERS_BUCKET) {
      const first = workflows.find((w) => w.bucket === b);
      if (first) setWfKey(first.key);
    }
  };

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pgTraffic',
      label: 'Traffic & Session',
      icon: (
        <>
          <path d="M2.4 12.6 6.6 7.4l3.4 3.1 4.1-5.4 3.5 4.3" />
          <path d="M2.4 16.4h15.2" />
        </>
      ),
    },
    {
      id: 'pgAdopt',
      label: 'Adoption & Engagement',
      icon: (
        <>
          <circle cx="7.6" cy="6.8" r="2.9" />
          <path d="M2.6 16.6c0-2.7 2.2-4.6 5-4.6s5 1.9 5 4.6" />
          <path d="M13.4 4.3a2.9 2.9 0 0 1 0 5.4M14.6 12.4c1.8.5 3 1.9 3 4.2" />
        </>
      ),
    },
    {
      id: 'pgFlows',
      label: 'Workflow Usage',
      icon: (
        <>
          <path d="M10 2.4 17.4 6 10 9.6 2.6 6Z" />
          <path d="M2.6 10 10 13.6 17.4 10" />
          <path d="M2.6 14 10 17.6 17.4 14" />
        </>
      ),
    },
  ];

  return (
    <div
      ref={rootRef}
      className={`lm-root${navCollapsed ? ' nav-collapsed' : ''}`}
      data-theme={theme}
    >
      <header className="topbar">
        <button
          className="iconbtn nav-toggle"
          onClick={toggleNav}
          aria-label={`${navCollapsed ? 'Expand' : 'Collapse'} navigation`}
          aria-expanded={!navCollapsed}
          title={`${navCollapsed ? 'Expand' : 'Collapse'} navigation`}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="2.5" y="3.5" width="15" height="13" rx="2.5" />
            <line x1="8" y1="3.5" x2="8" y2="16.5" />
          </svg>
        </button>
        <button className="back" aria-label="Back" onClick={() => window.history.back()}>←</button>
        <span className="topbar-title">Lease Management Analytics</span>
        <div className="spacer" />
        <span className="rule" />
        <button
          className="iconbtn"
          id="themeBtn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <svg className="i-moon" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16.5 11.8A7 7 0 0 1 8.2 3.5a7 7 0 1 0 8.3 8.3Z" />
          </svg>
          <svg className="i-sun" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="10" cy="10" r="3.6" />
            <path d="M10 1.8v1.7M10 16.5v1.7M18.2 10h-1.7M3.5 10H1.8M15.8 4.2l-1.2 1.2M5.4 14.6l-1.2 1.2M15.8 15.8l-1.2-1.2M5.4 5.4 4.2 4.2" />
          </svg>
        </button>
        <span className="badge-sample" title={failed ? 'One or more analytics queries failed — affected cards show the error' : 'Every figure is queried live from the analytics API, scoped to ' + analyticsScopeLabel()}>
          {failed ? 'Analytics unavailable' : isLive ? 'Live · ' + analyticsScopeLabel() : 'Loading…'}
        </span>
        <button
          className="iconbtn"
          onClick={() => setRequestId((n) => n + 1)}
          aria-label="Refresh analytics"
          title={isFetching ? 'Refreshing…' : 'Refresh analytics'}
          disabled={isFetching}
        >
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M16.5 10a6.5 6.5 0 1 1-1.9-4.6" />
            <path d="M16.6 3.2v3.2h-3.2" />
          </svg>
        </button>
        <div className="avatar">LM</div>
      </header>

      <div className="shell">
        <aside className="sidebar">
          <h1 className="brandmark">
            <span className="bm-full">Lease Management</span>
            <span className="bm-mini">LM</span>
          </h1>
          <p className="brandmark-sub">Lease Management · Admin Back-Office Console</p>
          <nav aria-label="Sections">
            <div className="nav-group">
              <div className="nav-label">Layers</div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className={`nav-item${page === item.id ? ' on' : ''}`}
                  data-tip={item.label}
                  onClick={() => goto(item.id)}
                >
                  <span className="ni-ic">
                    <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      {item.icon}
                    </svg>
                  </span>
                  <span className="ni-t">{item.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </aside>

        <main className="main">
          <div className="page-head">
            <h2>{PAGES[page]}</h2>
            <p className="page-sub">
              <span>Lease Management back office</span> ·{' '}
              <span>Admin users only — single-tier persona by scoping decision</span>
            </p>
          </div>

          <div className="filterbar">
            <div className={`daterange${rangeOpen ? ' open' : ''}`}>
              <button
                className="ctrl"
                onClick={(e) => {
                  e.stopPropagation();
                  setRangeOpen((o) => !o);
                }}
              >
                <span className="ic">📅</span>
                <span>{rangeLabel}</span>
                <span className="chev">▾</span>
              </button>
              <div className="daterange-pop">
                <div className="dr-presets">
                  {[7, 30, 90].map((days) => (
                    <button
                      key={days}
                      className={`dr-preset${!customApplied && range === days ? ' on' : ''}`}
                      onClick={() => applyPreset(days)}
                    >
                      {RANGE_LABELS[days]}
                    </button>
                  ))}
                </div>
                <div className="dr-custom">
                  <div className="dr-custom-label">Custom range</div>
                  <div className="dr-custom-row">
                    <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
                    <span className="dr-to">–</span>
                    <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
                  </div>
                  <button
                    className={`dr-apply${customApplied ? ' applied' : ''}`}
                    onClick={applyCustomRange}
                  >
                    {customApplied ? 'Range applied ✓' : 'Apply custom range'}
                  </button>
                </div>
              </div>
            </div>

            {/* No device/platform toggle: this is a web-only React SPA — `platform`'s only
                value is "web" and every `client` value is a "-web"-suffixed hostname, so
                there is nothing to split by. No persona filter either: `user_role` exists,
                but a single Admin tier was an explicit scoping decision. See the footer. */}
            <label
              className={`ctrl${showPrev ? ' toggle-on' : ''}`}
              onClick={() => setShowPrev((p) => !p)}
            >
              <span className="ic">↺</span> Previous period {showPrev ? '✓' : ''}
            </label>
            <div className="spacer" />
            <span className="pill">
              <span className="dot" />
              <span>{traffic ? traffic.recentlyActive.toLocaleString() : '—'} recently active</span>
            </span>
          </div>

          <TrafficSection
            active={page === 'pgTraffic'} showPrev={showPrev} palette={palette}
            targets={targets} setTarget={setTarget}
            traffic={traffic} usage={usage} modules={modules}
            loading={trafficQ.isLoading || usageQ.isLoading || modulesQ.isLoading}
            error={trafficQ.error ?? usageQ.error ?? modulesQ.error}
          />
          <AdoptionSection
            active={page === 'pgAdopt'} showPrev={showPrev} palette={palette}
            targets={targets} setTarget={setTarget}
            adoption={adoption} trend={trend} growth={growth} cohorts={cohorts} modules={modules}
            loading={adoptionQ.isLoading || trendQ.isLoading || growthQ.isLoading || retentionQ.isLoading}
            error={adoptionQ.error ?? trendQ.error ?? growthQ.error ?? retentionQ.error ?? modulesQ.error}
          />
          <WorkflowSection
            active={page === 'pgFlows'} palette={palette} bucket={bucket} wfKey={wfKey}
            onBucketChange={onBucketChange} onWorkflowChange={setWfKey}
            targets={targets} setTarget={setTarget}
            workflow={workflow} mastersModules={mastersModules}
            loading={workflowQ.isLoading || mastersQ.isLoading}
            error={workflowQ.error ?? mastersQ.error}
          />

          <div className="footer">
            <b>Wireframe note.</b> Lease Management is a{' '}
            <b>web-only React single-page application for internal Admin back-office use</b> (posthog-js SDK,{' '}
            <code>src/lib/posthog.ts</code>, browser session recording, <code>history_change</code>-based pageview
            capture) — the catalogue's <code>platform</code> global property's only example value is <code>web</code>,
            and every <code>client</code> value is a <code>-web</code>-suffixed hostname (rental-web / rental-uat-web /
            local-web); routes are web-style (e.g. <code>/rental/:id</code>). There is <b>no device/platform toggle</b>{' '}
            on this dashboard, and no mobile SDK, app-store version, or build-number property exists anywhere in the
            catalogue — every series here is scaled only by the date-range picker and the previous-period toggle.{' '}
            <b>Persona is single-tier: Admin only</b>, by explicit client scoping decision — a <code>user_role</code>{' '}
            Global Property does exist in the data, but filtering by it was descoped for this dashboard, so there is no
            persona/role filter here; treat this as a scoping choice, not a data gap. <b>User identity is confirmed</b>:
            Global Properties include a real <code>user_id</code> and <code>email</code>, with a genuine{' '}
            <code>$identify</code>/<code>$set</code> event firing at login — "Active Admins" and session metrics use
            this real join key.
            <br />
            <br />
            <b>Event-count reconciliation (derived finding).</b> The source catalogue's Summary sheet states Total
            Custom Events = <b>422</b> without breaking the figure down; this dashboard derived and verified that
            breakdown directly from the sheets: <b>143</b> named custom events (Custom Events sheet) + <b>205</b>{' '}
            parametric List events (41 list-entity prefixes × 5 event-name variants each: List Searched / List Filtered
            / List Exported / List Paged / Viewed) + <b>74</b> Page View events (one <code>&lt;Page&gt; Page Viewed</code>{' '}
            per route) = <b>422</b> exactly. Total Events = 422 custom + <b>5</b> automatic ($pageview, $pageleave,
            $autocapture, $rageclick, Session Recording) = <b>427</b>. <code>project_id = "P-274"</code>,{' '}
            <code>project_code = "LMV-01"</code> (both confirmed, Global Properties).
            <br />
            <br />
            <b>Module distribution and Masters dominance.</b> There are <b>15</b> confirmed product modules (Modules
            sheet): Dashboard, Rental, Property, Maintenance, Utility, Compliance, Invoicing, Opex, AMC, Masters,
            Tenant, Reports, Settings, Notifications, Auth. Of the 143 named custom events, Masters alone accounts for{' '}
            <b>96</b> — it is the reference/configuration-data module spanning roughly 21 near-identical submodules,
            each firing its own Created/Updated/Deleted/Form Opened/Viewed set. Because of this shape,{' '}
            <b>Master Data Admin is presented as a league/ranking table of submodules, not a funnel</b> — these are
            reference-data CRUD actions, not multi-step user workflows. Note also that <b>"Platform" and "Other" are
            raw-sheet labels, not official modules</b>.
            <br />
            <br />
            <b>Disclosed instrumentation gaps.</b> (1) <b>Lease Renewals</b> appear only as a List-prefix surface —
            there is no explicit "Lease Renewal Created" or "Lease Renewal Completed" event, so renewals are tracked as
            a list-view surface only. (2) <b>Invoicing has almost no lifecycle instrumentation</b>:{' '}
            <code>Invoice Viewed</code> is essentially the only Invoicing-owned custom event, and{' '}
            <code>Payment Created</code> fires from Dashboard/Tenant-adjacent component code, not from an
            Invoicing-owned page. (3) <code>Compliance Created/Updated/Viewed</code> and{' '}
            <code>Compliance Requirement …</code> are <b>two distinct real event families, not a duplicate</b>.
            <br />
            <br />
            <b>Every volume, rate and trend on this dashboard is queried live</b> from the PostHog Adoption Analytics
            API for the selected date range, scoped to <code>{analyticsScopeLabel()}</code> — nothing is seeded or
            illustrative. A card that renders empty means the period genuinely has no events for it; a card showing an
            error means its query failed. The <b>module names, event names, workflow step sequences and reconciled
            counts</b> quoted above are the documented facts from the instrumentation catalogue, and are the only
            static content on this page. Hover the <code>i</code> on any tile or chart for its exact definition.
          </div>
        </main>
      </div>
    </div>
  );
};

export default LeaseAnalyticsDashboard;
