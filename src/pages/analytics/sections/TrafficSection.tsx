import React, { useState } from 'react';
import {
  ChartCard, ChartTabs, EmptyState, HBars, KeyValue, Legend, metricText, Note, Tile,
} from '../components/primitives';
import { LineChart } from '../charts/LineChart';
import { fmtC } from '../lib/format';
import type { Palette } from '../lib/palette';
import {
  deltaDir, formatDelta, formatDuration,
  type ModuleRow, type TrafficModel, type UsageModel,
} from '../data/metrics';

interface SectionProps {
  active: boolean;
  showPrev: boolean;
  palette: Palette;
  targets: Record<string, number | null>;
  setTarget: (id: string, value: number | null) => void;
  /** Live data. Null until the query answers — no seeded stand-in is rendered. */
  traffic: TrafficModel | null;
  usage: UsageModel | null;
  modules: ModuleRow[] | null;
  loading: boolean;
  error: unknown;
}

type UsageTab = 'staff' | 'views' | 'sessions';

/**
 * Top-level areas the session-mix card rolls the module tree up into. §7.1 U8 tags this
 * grouping as "proposed": it is a convenience rollup of real module names, not a catalogued
 * property — the shares themselves are measured, only the grouping is editorial.
 */
const AREAS: [label: string, modules: string[]][] = [
  ['Rental & Property', ['rental', 'rentals', 'property', 'properties']],
  ['Financial Ops (Invoicing/Opex/AMC)', ['invoicing', 'opex', 'amc']],
  ['Compliance & Maintenance', ['compliance', 'maintenance', 'utilities', 'utility']],
  ['Masters & other modules', []], // everything the first three did not claim
];

function areaRows(modules: ModuleRow[], palette: Palette): [React.ReactNode, number, string][] {
  const colors = [palette.blue, palette.violet, palette.mint, palette.green];
  const total = modules.reduce((a, m) => a + m.sessions, 0) || 1;
  const claimed = new Set<string>();
  const sums = AREAS.map(([, names]) => {
    let sum = 0;
    for (const m of modules) {
      const key = m.name.toLowerCase();
      if (names.some((n) => key === n || key.startsWith(n))) {
        sum += m.sessions;
        claimed.add(m.name);
      }
    }
    return sum;
  });
  sums[sums.length - 1] = modules
    .filter((m) => !claimed.has(m.name))
    .reduce((a, m) => a + m.sessions, 0);

  return AREAS.map(([label], i) => [label, sums[i] / total, colors[i]]);
}

export function TrafficSection({
  active, showPrev, palette, targets, setTarget, traffic, usage, modules, loading, error,
}: SectionProps) {
  const [usageTab, setUsageTab] = useState<UsageTab>('staff');

  const series = usage
    ? { staff: usage.visitors, views: usage.views, sessions: usage.sessions }[usageTab]
    : null;

  const tabStyle: Record<UsageTab, { color: string; fill: string; label: string }> = {
    staff: { color: palette.blue, fill: palette.fill, label: 'Active Admins' },
    views: { color: palette.violet, fill: palette.violetTint, label: 'Views' },
    sessions: { color: palette.green, fill: palette.greenTint, label: 'Sessions' },
  };
  const style = tabStyle[usageTab];

  return (
    <section className={`page${active ? ' on' : ''}`} id="pgTraffic">
      <div className="section-head">
        <div className="eyebrow-sec" />
        <h2>Traffic &amp; Session</h2>
        <span className="sd">
          Monitor overall admin console traffic and session behavior across the Lease Management back office.
        </span>
      </div>

      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>How many admins are actively using the console, and how frequently?</li>
          <li>
            Are admin sessions concentrated in a few heavy users, or spread across the whole back office, and is
            day-over-day activity holding up?
          </li>
        </ul>
      </div>

      <Note tone="good" style={{ marginTop: 0 }}>
        <b>Identity is confirmed for this product.</b> Lease Management's Global Properties include a real{' '}
        <code>user_id</code> (number) and <code>email</code>, and a genuine <code>$identify</code>/<code>$set</code>{' '}
        automatic event fires at login carrying person properties (email, name, role, company, is_internal). "Active
        Admins" and every session figure below are therefore built on a <b>real user_id join key</b>, not a proposed
        distinct_id/browser-fingerprint workaround — no undercount/overcount caveat is needed here.
      </Note>

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(3,1fr)' }}>
        <Tile
          id="activeAdmins" label="Active Admins" val={metricText(traffic?.activeAdmins)}
          dir={deltaDir(traffic?.delta?.active_users)}
          delta={formatDelta(traffic?.delta?.active_users)}
          sub="confirmed user_id this period" raw={traffic?.activeAdmins}
          target={targets.activeAdmins} onTargetChange={setTarget}
        />
        <Tile
          id="screenViews" label="Screen Views" val={metricText(traffic?.screenViews, fmtC)}
          dir={deltaDir(traffic?.delta?.screen_views)}
          delta={formatDelta(traffic?.delta?.screen_views)}
          sub="total across modules" noTarget
        />
        <Tile
          id="totalSessions" label="Sessions" val={metricText(traffic?.sessions)}
          dir={deltaDir(traffic?.delta?.sessions)}
          delta={formatDelta(traffic?.delta?.sessions)}
          sub="browser sessions, by user_id" noTarget
        />
        <Tile
          id="avgSessionDur" label="Session Duration"
          val={traffic ? formatDuration(traffic.avgSessionSeconds) : '—'}
          dir={deltaDir(traffic?.delta?.avg_session_seconds)}
          delta={formatDelta(traffic?.delta?.avg_session_seconds)}
          sub="per session" noTarget
        />
        <Tile
          id="bounceRate" label="Bounce Rate"
          val={metricText(traffic?.bounceRate, (n) => `${Math.round(n)}%`)}
          dir={deltaDir(traffic?.delta?.bounce_rate, false)}
          delta={formatDelta(traffic?.delta?.bounce_rate)}
          sub="lower is better" raw={traffic?.bounceRate} unit="%" goodUp={false}
          target={targets.bounceRate} onTargetChange={setTarget}
        />
        <Tile
          id="recentlyActive" label="Recently Active" val={metricText(traffic?.recentlyActive)}
          dir="flat" sub="active in last 30 min" noTarget
        />
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Usage over time · SVG chart"
          title="Usage over time"
          purpose="Active Admins, screen views, and sessions over time, with the previous period overlaid for comparison. Built on the confirmed user_id join key."
        >
          <ChartTabs
            style={{ marginBottom: 10 }}
            value={usageTab}
            onChange={(key) => setUsageTab(key as UsageTab)}
            tabs={[
              { key: 'staff', label: 'Active Admins' },
              { key: 'views', label: 'Views' },
              { key: 'sessions', label: 'Sessions' },
            ]}
          />
          {series?.cur.length ? (
            <div>
              <LineChart
                cur={series.cur} prev={series.prev} showPrev={showPrev} labels={usage?.labels}
                color={style.color} fill={style.fill} palette={palette}
                seriesName={style.label}
              />
              <Legend items={[{ label: style.label, color: style.color }, { label: 'Previous period', dash: true }]} />
            </div>
          ) : (
            <EmptyState loading={loading} error={error} empty="No sessions recorded in this period." />
          )}
        </ChartCard>

        <ChartCard
          eyebrow="Session mix"
          title="What Admins touch in a session"
          purpose="Share of sessions that touch each top-level area at least once — a rollup of the API's module tree, since the area grouping is not itself a catalogued property."
        >
          {modules?.length ? (
            <>
              <HBars rows={areaRows(modules, palette)} />
              <div style={{ marginTop: 14 }}>
                <KeyValue
                  k="Views / session"
                  v={metricText(usage?.viewsPerSession, (n) => n.toFixed(1))}
                  u="screens per visit"
                  valueStyle={{ fontSize: 18 }}
                />
              </div>
            </>
          ) : (
            <EmptyState
              loading={loading}
              error={error}
              empty="The module tree is empty for this period — no screen-level events have been attributed to a module yet."
            />
          )}
        </ChartCard>
      </div>
    </section>
  );
}

export default TrafficSection;
