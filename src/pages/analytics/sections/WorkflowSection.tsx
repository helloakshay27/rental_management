import React from 'react';
import {
  ChartCard, EmptyState, metricText, Note, Tile,
} from '../components/primitives';
import type { Palette } from '../lib/palette';
import { deltaDir, formatDelta, type ModuleRow, type WorkflowModel } from '../data/metrics';

interface SectionProps {
  active: boolean;
  palette: Palette;
  /** The API's live module tree — the chips are built from it. */
  modules: ModuleRow[] | null;
  /** The chip currently selected; null while the tree is still loading. */
  activeModule: string | null;
  onModuleChange: (module: string) => void;
  targets: Record<string, number | null>;
  setTarget: (id: string, value: number | null) => void;
  /** Live data for the selected module; null until the query answers. */
  workflow: WorkflowModel | null;
  loading: boolean;
  error: unknown;
}

export function WorkflowSection({
  active, palette, modules, activeModule, onModuleChange, targets, setTarget,
  workflow, loading, error,
}: SectionProps) {
  /* The API derives and measures the step sequence; nothing here is catalogued. */
  const funnelRows = (workflow?.funnel ?? []).map((f, i) => ({
    step: f.step,
    remaining: Math.round(f.reach),
    width: 45 + (Math.min(100, Math.max(0, f.reach)) / 100) * 55,
    drop: i > 0 && f.dropPct != null ? Math.round(f.dropPct) : null,
    opacity: 1 - i * 0.1,
  }));

  return (
    <section className={`page${active ? ' on' : ''}`} id="pgFlows">
      <div className="section-head">
        <h2>Workflow Usage</h2>
        <span className="sd">
          Admin completion per module — pick a module below to scope the funnel, its step-level events and its
          submodule league table. The chips are the analytics API's own module tree for the selected range.
        </span>
      </div>

      <div className="mnav" title="Choose a module — every card below is scoped to it">
        <div className="mnav-buckets">
          {(modules ?? []).map((m) => (
            <button
              key={m.name}
              type="button"
              className={m.name === activeModule ? 'on' : undefined}
              onClick={() => onModuleChange(m.name)}
              title={`${m.users} admin(s) · ${m.events} events · ${m.sessions} sessions`}
            >
              {m.name}
              <span className="mcount">{m.users}</span>
            </button>
          ))}
        </div>
      </div>

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
            <Note tone="good">
              <b>Confirmed identity, applies to every module here.</b> A real user_id property exists on every event
              in this catalogue — Workflow Adoption, Completion Rate and Usage Volume above are all built on that
              confirmed join key, not a proposed distinct_id workaround.
            </Note>
          </div>

          <ChartCard
            style={{ margin: '16px 0' }}
            eyebrow="Workflow funnel (measured event sequence)"
            title={activeModule ? `${activeModule} — completion funnel` : 'Completion funnel'}
            purpose="Step-by-step completion and drop-off for the selected module, measured by the analytics API over the selected range."
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
              <EmptyState
                loading={loading}
                error={error}
                empty="No funnel for this module in the selected period. The API derives its steps from the custom events fired in scope, and returns none until enough have been recorded."
              />
            )}
          </ChartCard>

          <ChartCard
            style={{ marginTop: 12 }}
            eyebrow="All steps in this module"
            title="All steps in this module"
            purpose={`Every event in ${activeModule ?? 'the selected module'}, with distinct Admins (confirmed user_id), event counts, sessions and completion rate for each — the module-scoped equivalent of the funnel above, at the individual-event level.`}
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
    </section>
  );
}

export default WorkflowSection;
