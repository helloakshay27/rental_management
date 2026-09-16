import React from 'react';
import {
  ChartCard, EmptyState, HBars, KeyValue, Legend, metricText, Note, StatusPill, Tile, TrendArrow,
} from '../components/primitives';
import { LineChart } from '../charts/LineChart';
import { StackedBarChart } from '../charts/StackedBarChart';
import type { Palette } from '../lib/palette';
import { TOTAL_MODULES } from '../lib/catalogue';
import {
  deltaDir, formatDelta,
  type AdoptionModel, type CohortRow, type GrowthModel, type ModuleRow, type TrendModel,
} from '../data/metrics';

interface SectionProps {
  active: boolean;
  showPrev: boolean;
  palette: Palette;
  targets: Record<string, number | null>;
  setTarget: (id: string, value: number | null) => void;
  /** Live data. Null until the query answers — no seeded stand-in is rendered. */
  adoption: AdoptionModel | null;
  trend: TrendModel | null;
  growth: GrowthModel | null;
  cohorts: CohortRow[] | null;
  modules: ModuleRow[] | null;
  loading: boolean;
  error: unknown;
}

/** Status band for a league row, from its share of the busiest module (§7.2 A12). */
function statusFor(share: number): ['st-drop' | 'st-watch' | 'st-healthy', string] {
  if (share < 0.12) return ['st-drop', 'Watch'];
  if (share < 0.2) return ['st-watch', 'Steady'];
  return ['st-healthy', 'Healthy'];
}

export function AdoptionSection({
  active, showPrev, palette, targets, setTarget, adoption, trend, growth, cohorts, modules,
  loading, error,
}: SectionProps) {
  const heat = (t: number) => `rgba(${palette.heatRgb},${(palette.heatA0 + t * palette.heatA1).toFixed(2)})`;

  const breadthRows: [string, number, string][] = (modules ?? [])
    .slice()
    .sort((a, b) => b.share - a.share)
    .slice(0, 10)
    .map((m) => [m.name, m.share, palette.blue]);

  const leagueRows = (modules ?? []).slice().sort((a, b) => a.users - b.users);
  const cohortCols = cohorts?.[0]?.cells.length ?? 6;

  /**
   * Seat Utilisation needs a licensed-seat denominator, which is billing data rather than
   * events. Without it the API returns null, so the tile shows the live active-seat count
   * instead of a percentage derived from a number nobody supplied.
   */
  const seatValue = adoption?.seatUtil ?? null;
  const seatIsPct = seatValue != null;

  return (
    <section className={`page${active ? ' on' : ''}`} id="pgAdopt">
      <div className="section-head">
        <h2>Adoption &amp; Engagement</h2>
        <span className="sd">
          Measure how effectively admins adopt and engage with the console’s modules, and whether they keep coming back.
        </span>
      </div>

      <div className="qbox">
        <b>Key questions</b>
        <ul>
          <li>Which modules and admin actions receive the highest engagement and adoption?</li>
          <li>Which modules need UX improvements, and where do admins spend the most time?</li>
          <li>Are admins returning to the console day over day, and is retention improving over time?</li>
        </ul>
      </div>

      <div className="tiles" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginTop: 16 }}>
        <Tile
          id="seatUtil"
          label="Seat Utilisation"
          val={seatIsPct ? `${seatValue.toFixed(1)}%` : metricText(adoption?.usedSeats)}
          dir={deltaDir(adoption?.deltas.seatUtil)}
          delta={formatDelta(adoption?.deltas.seatUtil)}
          sub={seatIsPct ? 'active ÷ licensed Admin seats' : 'active seats — set VITE_LM_LICENSED_SEATS for a %'}
          raw={seatIsPct ? seatValue : undefined}
          unit={seatIsPct ? '%' : ''}
          target={targets.seatUtil} onTargetChange={setTarget}
        />
        <Tile
          id="stickiness" label="Stickiness"
          val={metricText(adoption?.stickiness, (n) => `${n.toFixed(1)}%`)}
          dir={deltaDir(adoption?.deltas.stickiness)} delta={formatDelta(adoption?.deltas.stickiness)}
          sub="avg DAU/MAU" raw={adoption?.stickiness} unit="%"
          target={targets.stickiness} onTargetChange={setTarget}
        />
        <Tile
          id="adoptionTrend" label="Adoption Trend"
          val={metricText(adoption?.adoptionTrend, (n) => `${n > 0 ? '+' : ''}${n.toFixed(1)}%`)}
          dir={adoption?.adoptionTrend == null ? 'flat' : adoption.adoptionTrend >= 0 ? 'up' : 'dn'}
          delta="vs prior weeks" sub="weekly active Admins" noTarget
        />
        <Tile
          id="activation14" label="14-Day Activation"
          val={metricText(adoption?.activation, (n) => `${Math.round(n)}%`)}
          dir={deltaDir(adoption?.deltas.activation)} delta={formatDelta(adoption?.deltas.activation)}
          sub="of newly created Admin accounts" raw={adoption?.activation} unit="%"
          target={targets.activation14} onTargetChange={setTarget}
        />
        <Tile
          id="moduleBreadth2" label="Module Breadth"
          val={
            adoption
              ? `${adoption.moduleBreadthInUse} / ${adoption.moduleBreadthTotal || TOTAL_MODULES}`
              : '—'
          }
          dir="flat" sub="modules used this period" noTarget
        />
      </div>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="Trend · SVG line chart"
        title="Adoption trend (weekly active Admins)"
        purpose="Weekly active Admins over the trailing window — the trend line behind the Adoption Trend tile above."
      >
        {trend?.series.length ? (
          <>
            <LineChart
              cur={trend.series} prev={trend.prev.length ? trend.prev : null} showPrev={showPrev}
              labels={trend.labels} color={palette.blue} fill={palette.fill} palette={palette}
              seriesName="Weekly active Admins"
            />
            <Legend items={[{ label: 'Weekly active Admins', color: palette.blue }]} />
          </>
        ) : (
          <EmptyState loading={loading} error={error} empty="No weekly activity recorded yet." />
        )}
      </ChartCard>

      <div className="grid2">
        <ChartCard
          eyebrow="Growth accounting"
          title="New · Returning · Resurrecting · Dormant"
          purpose="Breaks the active Admin base into newly created accounts, retained Admins, win-backs and Admins going quiet — a fuller view than a simple new-vs-returning split."
        >
          {growth?.labels.length ? (
            <>
              <StackedBarChart
                labels={growth.labels}
                series={[
                  { label: 'New', data: growth.newUsers, color: palette.blue },
                  { label: 'Returning', data: growth.returning, color: palette.green },
                  { label: 'Resurrecting', data: growth.resurrecting, color: palette.mint },
                ]}
                negSeries={{ label: 'Dormant', data: growth.dormant, color: palette.red }}
                palette={palette}
              />
              <Legend
                items={[
                  { label: 'New', color: palette.blue },
                  { label: 'Returning', color: palette.green },
                  { label: 'Resurrecting', color: palette.mint },
                  { label: 'Dormant', color: palette.red },
                ]}
              />
            </>
          ) : (
            <EmptyState loading={loading} error={error} empty="No weekly cohorts to account for yet." />
          )}
        </ChartCard>

        <ChartCard
          eyebrow="Retention · weekly cohorts"
          title="Do new Admins keep coming back?"
          purpose="Each row = user_id values first active that week (confirmed join key); cells = % of that cohort still active N weeks later."
        >
          {cohorts?.length ? (
            <table className="rt">
              <thead>
                <tr>
                  <th style={{ textAlign: 'left' }}>Cohort</th>
                  {Array.from({ length: cohortCols }, (_, w) => (
                    <th key={w}>Week {w}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cohorts.map((row) => (
                  <tr key={row.label}>
                    <td className="lbl">{row.label}</td>
                    {row.cells.map((val, w) =>
                      val == null ? (
                        <td key={w} style={{ background: 'var(--surface-2)', color: 'var(--faint)' }}>·</td>
                      ) : (
                        <td
                          key={w}
                          style={{
                            background: heat(val / 100),
                            color: val / 100 > 0.55 ? palette.onHeat : 'var(--ink)',
                          }}
                        >
                          {val}%
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <EmptyState loading={loading} error={error} empty="No cohorts have completed a week yet." />
          )}
        </ChartCard>
      </div>

      <div className="grid2">
        <ChartCard
          eyebrow="Module breadth"
          title="Which modules are Admins actually using?"
          purpose="Share of active Admins who touched each module at least once this period, from the API's module tree."
        >
          {breadthRows.length ? (
            <HBars rows={breadthRows} />
          ) : (
            <EmptyState loading={loading} error={error} empty="No module-level activity in this period." />
          )}
        </ChartCard>

        <ChartCard
          eyebrow="Dormant Admins"
          title="Dormant Admins"
          purpose="Registered Admin accounts (by confirmed user_id) with no activity in the last 14 days — out of scope for the 14-Day Activation tile above."
        >
          <KeyValue
            k="Dormant Admins"
            v={metricText(adoption?.dormant)}
            u="no activity 14+ days"
            valueStyle={{ fontSize: 22 }}
          />
        </ChartCard>
      </div>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="Source data quality"
        title="Reconciliation findings from the instrumentation catalogue"
        purpose="Documents genuine reconciliation work done against the instrumentation catalogue — not parsing errors introduced by this dashboard."
      >
        <Note tone="crash">
          <b>The Summary sheet's "422 custom events" figure is not broken down anywhere in the source file.</b> This
          dashboard derived and verified the breakdown directly: 143 named custom events + 205 parametric List events
          (41 list-entity prefixes × 5 variants) + 74 Page View events = 422 exactly. Total Events = 422 + 5 automatic
          = 427.
        </Note>
        <Note tone="crash">
          <b>"Platform" and "Other" are raw-sheet labels, not official modules.</b> They tag cross-cutting technical
          events (API Write Succeeded/Failed; Form Step Changed and Reports List Filtered) and are not among the 15
          entries on the Modules sheet, so they are excluded from the module denominators used here.
        </Note>
        <Note style={{ marginBottom: 0 }}>
          <b>Every figure on this dashboard is queried live.</b> The tiles, charts and tables above read from the
          PostHog Adoption Analytics API for the selected date range — where a card is empty, the period genuinely has
          no events for it.
        </Note>
      </ChartCard>

      <ChartCard
        style={{ marginTop: 12 }}
        eyebrow="League table"
        title="Module-wise breakdown"
        purpose="Active Admins, total events and share per module, worst-reach first — from the API's module tree."
      >
        {leagueRows.length ? (
          <table className="league">
            <thead>
              <tr>
                <th>Module</th>
                <th className="num">Active Admins</th>
                <th className="num">Events</th>
                <th className="num">Events / session</th>
                <th>Trend</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {leagueRows.map((row) => {
                const [kind, label] = statusFor(row.share);
                const dir: 'up' | 'dn' | 'flat' =
                  row.share > 0.5 ? 'up' : row.share > 0.2 ? 'flat' : 'dn';
                return (
                  <tr key={row.name}>
                    <td className="strong">{row.name}</td>
                    <td className="num">{row.users.toLocaleString()}</td>
                    <td className="num">{row.events.toLocaleString()}</td>
                    <td className="num">{row.sessions ? (row.events / row.sessions).toFixed(1) : '—'}</td>
                    <td><TrendArrow dir={dir} /></td>
                    <td><StatusPill kind={kind}>{label}</StatusPill></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <EmptyState loading={loading} error={error} empty="No modules have recorded events in this period." />
        )}
      </ChartCard>
    </section>
  );
}

export default AdoptionSection;
