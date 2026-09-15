import React from 'react';
import {
  ChartCard, EmptyState, metricText, Note, StatusPill, Tile, TrendArrow,
} from '../components/primitives';
import {
  BUCKET_ORDER, MASTERS_BUCKET, MASTERS_SUBMODULES, workflows,
} from '../lib/catalogue';
import type { Palette } from '../lib/palette';
import { deltaDir, formatDelta, type ModuleRow, type WorkflowModel } from '../data/metrics';

interface SectionProps {
  active: boolean;
  palette: Palette;
  bucket: string;
  wfKey: string;
  onBucketChange: (bucket: string) => void;
  onWorkflowChange: (key: string) => void;
  targets: Record<string, number | null>;
  setTarget: (id: string, value: number | null) => void;
  /** Live data for the selected workflow; null until the query answers. */
  workflow: WorkflowModel | null;
  /** Masters sub-module tree, for the league table in that bucket. */
  mastersModules: ModuleRow[] | null;
  loading: boolean;
  error: unknown;
}

/**
 * The disclosure notes carry inline <code>/<b> markup straight from the catalogue write-up.
 * They are authored content, not user input, and rendering them as markup is what keeps the
 * event names monospaced the way the rest of the page shows them.
 */
function NoteMarkup({ html }: { html: string }) {
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

function statusFor(share: number): ['st-drop' | 'st-watch' | 'st-healthy', string] {
  if (share < 0.25) return ['st-drop', 'Watch'];
  if (share < 0.6) return ['st-watch', 'Steady'];
  return ['st-healthy', 'Healthy'];
}

export function WorkflowSection({
  active, palette, bucket, wfKey, onBucketChange, onWorkflowChange, targets, setTarget,
  workflow, mastersModules, loading, error,
}: SectionProps) {
  const isMasters = bucket === MASTERS_BUCKET;
  const wf = workflows.find((w) => w.key === wfKey) ?? workflows[0];
  const bucketCount = (b: string) =>
    b === MASTERS_BUCKET ? MASTERS_SUBMODULES.length : workflows.filter((w) => w.bucket === b).length;

  /* The catalogue defines the step sequence; the API measures each step's reach. */
  const funnelRows = (workflow?.funnel ?? []).map((f, i) => ({
    step: f.step,
    remaining: Math.round(f.reach),
    width: 45 + (Math.min(100, Math.max(0, f.reach)) / 100) * 55,
    drop: i > 0 && f.dropPct != null ? Math.round(f.dropPct) : null,
    opacity: 1 - i * 0.1,
  }));

  const mastersRows = (mastersModules ?? []).slice().sort((a, b) => b.users - a.users);
  const mastersTotals = mastersModules?.length
    ? {
      tracked: mastersModules.length,
      actions: mastersModules.reduce((a, m) => a + m.events, 0),
      admins: Math.max(...mastersModules.map((m) => m.users)),
    }
    : null;

  return (
    <section className={`page${active ? ' on' : ''}`} id="pgFlows">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          Admin completion of key lease-management workflows per bucket, all-workflows comparison, and where the biggest
          step drop-offs occur.
        </span>
      </div>

      <div className="mnav" title="Choose a workflow — this filter applies to the per-workflow cards only">
        <div className="mnav-buckets">
          {BUCKET_ORDER.map((b) => (
            <button key={b} type="button" className={b === bucket ? 'on' : undefined} onClick={() => onBucketChange(b)}>
              {b}
              <span className="mcount">{bucketCount(b)}</span>
            </button>
          ))}
        </div>
        {isMasters ? null : (
          <div className="mnav-mods">
            <div className="segbar">
              {workflows
                .filter((w) => w.bucket === bucket)
                .map((w) => (
                  <button
                    key={w.key}
                    type="button"
                    className={w.key === wf.key ? 'on' : undefined}
                    onClick={() => onWorkflowChange(w.key)}
                  >
                    {w.name}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>

      {isMasters ? (
        <>
          <div className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <Tile
              label="Submodules with activity"
              val={mastersTotals ? `${mastersTotals.tracked} / ${MASTERS_SUBMODULES.length}` : '—'}
              dir="flat" sub="of the catalogued reference-data entities" noTarget
            />
            <Tile
              label="Total CRUD Actions" val={metricText(mastersTotals?.actions)}
              dir="up" delta="this period" sub="events across all Masters submodules" noTarget
            />
            <Tile
              label="Active Admins (Masters)" val={metricText(mastersTotals?.admins)}
              dir="up" delta="vs prev. period" sub="confirmed user_id touching Masters" noTarget
            />
            <Tile
              label="Named Events (Masters)" val="96 / 143" dir="flat"
              sub="catalogue share of all named custom events" noTarget
            />
          </div>

          <div>
            <Note tone="crash">
              <b>Scope note — this is a league table, not a funnel.</b> Master Data Admin spans 21
              reference/configuration-data submodules, each firing a near-identical
              Created/Updated/Deleted/Form Opened/Viewed event set plus a matching List-prefix entry. These are
              single-step reference-data CRUD actions, not multi-step user workflows — a funnel visualization would
              imply a linear process with meaningful step-to-step drop-off that does not exist here, so this bucket is
              presented as a ranking table of submodules by measured activity.
            </Note>
            <Note tone="good">
              <b>Confirmed identity applies here too.</b> Every row below uses the same confirmed user_id join key as
              the rest of this dashboard.
            </Note>
          </div>

          <ChartCard
            style={{ margin: '16px 0' }}
            eyebrow="League table · Masters submodules"
            title="Master Data Admin — submodule league table"
            purpose="Measured CRUD activity, distinct Admins and events per session for each Masters submodule the API reports, ranked highest-activity first."
          >
            {mastersRows.length ? (
              <table className="league">
                <thead>
                  <tr>
                    <th>Submodule</th>
                    <th className="num">Active Admins</th>
                    <th className="num">Events</th>
                    <th className="num">Events / session</th>
                    <th>Trend</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mastersRows.map((row) => {
                    const [kind, label] = statusFor(row.share);
                    const dir: 'up' | 'dn' | 'flat' =
                      row.share > 0.6 ? 'up' : row.share > 0.25 ? 'flat' : 'dn';
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
              <EmptyState
                loading={loading}
                error={error}
                empty="No Masters submodule activity in this period."
              />
            )}
          </ChartCard>
        </>
      ) : (
        <>
          <div className="tiles" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
            <Tile
              id="wfAdoption" label="Workflow Adoption"
              val={metricText(workflow?.adoption, (n) => `${Math.round(n)}%`)}
              dir={deltaDir(workflow?.deltas.adoption)} delta={formatDelta(workflow?.deltas.adoption)}
              raw={workflow?.adoption ?? undefined} unit="%"
              target={targets.wfAdoption} onTargetChange={setTarget}
            />
            <Tile
              id="wfCompletion" label="Completion Rate"
              val={metricText(workflow?.completion, (n) => `${Math.round(n)}%`)}
              dir={deltaDir(workflow?.deltas.completion)} delta={formatDelta(workflow?.deltas.completion)}
              raw={workflow?.completion ?? undefined} unit="%"
              target={targets.wfCompletion} onTargetChange={setTarget}
            />
            <Tile
              label="Biggest Step Drop"
              val={metricText(workflow?.biggestStepDropPct, (n) => `${Math.round(n)}%`)}
              dir="dn" delta={workflow?.biggestStepLabel ?? undefined}
              sub={workflow?.biggestStepLabel ? `at ${workflow.biggestStepLabel}` : undefined} noTarget
            />
            <Tile
              label="Usage Volume" val={metricText(workflow?.volume)}
              dir="up" delta="this period" sub="completions" noTarget
            />
          </div>

          <div>
            {wf.incompleteNote ? (
              <Note tone="crash">
                <b>Scope note.</b> <NoteMarkup html={wf.incompleteNote} />
              </Note>
            ) : null}
            <Note tone="good">
              <b>Confirmed identity, applies to every workflow here.</b> A real user_id property exists on every event
              in this catalogue — Workflow Adoption, Completion Rate and Usage Volume above are all built on that
              confirmed join key, not a proposed distinct_id workaround.
            </Note>
          </div>

          <ChartCard
            style={{ margin: '16px 0' }}
            eyebrow="Workflow funnel (measured event sequence)"
            title={`${wf.name} — completion funnel`}
            purpose="Step-by-step completion and drop-off for the selected workflow, measured by the analytics API over the selected range."
          >
            {funnelRows.length ? (
              <div className="funnel">
                {funnelRows.map((f) => (
                  <React.Fragment key={f.step}>
                    {f.drop != null ? <div className="fdrop">▼ {f.drop}% drop-off</div> : null}
                    <div
                      className="fstep"
                      style={{ width: `${f.width}%`, background: palette.blue, opacity: f.opacity, borderRadius: 8 }}
                      title={`${f.step}: ${f.remaining}% of entrants remain`}
                    >
                      {f.step}
                      <span className="fsub">{f.remaining}% of entrants</span>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              <EmptyState loading={loading} error={error}>
                <>
                  No funnel for this workflow in the selected period. Its catalogued sequence is{' '}
                  <b>{wf.steps.join(' → ')}</b>; the API returns steps once those events have been recorded.
                </>
              </EmptyState>
            )}
          </ChartCard>

          <ChartCard
            style={{ marginTop: 12 }}
            eyebrow="All steps in this workflow"
            title="All steps in this workflow"
            purpose={`Every event in ${wf.name}, with distinct Admins (confirmed user_id), event counts, sessions and completion rate for each — the workflow-scoped equivalent of the funnel above, at the individual-event level.`}
          >
            {workflow?.flows.length ? (
              <table className="pathtbl">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th className="num">Admins (confirmed user_id)</th>
                    <th className="num">Events</th>
                    <th className="num">Sessions</th>
                    <th className="num">Completion</th>
                  </tr>
                </thead>
                <tbody>
                  {workflow.flows.map((row) => (
                    <tr key={row.path}>
                      <td>{row.path}</td>
                      <td className="num">{row.users.toLocaleString()}</td>
                      <td className="num">{row.events.toLocaleString()}</td>
                      <td className="num">{row.sessions.toLocaleString()}</td>
                      <td className="num">{row.comp != null ? `${Math.round(row.comp)}%` : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState loading={loading} error={error} empty="No step-level events recorded for this workflow." />
            )}
          </ChartCard>

          <ChartCard
            style={{ marginTop: 12 }}
            eyebrow="Top entry screens"
            title="Top entry screens"
            purpose="The first screen property seen in each session — measured across the console, not scoped to the selected workflow."
          >
            {workflow?.entryScreens.length ? (
              <table className="pathtbl">
                <thead>
                  <tr>
                    <th>Screen</th>
                    <th className="num">Admins (confirmed user_id)</th>
                    <th className="num">Views</th>
                    <th className="num">Bounce</th>
                  </tr>
                </thead>
                <tbody>
                  {workflow.entryScreens.map((row) => (
                    <tr key={row.path}>
                      <td>{row.path}</td>
                      <td className="num">{row.visitors.toLocaleString()}</td>
                      <td className="num">{row.views.toLocaleString()}</td>
                      <td className="num">{Math.round(row.bounce)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState loading={loading} error={error} empty="No entry screens recorded in this period." />
            )}
          </ChartCard>
        </>
      )}
    </section>
  );
}

export default WorkflowSection;
