/**
 * KPI dictionary and target defaults.
 *
 * Every tile and chart carries an `i` affordance whose popover explains the metric: the
 * formula it is computed from, and what it means for the business. Keeping the two strings
 * here rather than at each call site is what makes it practical to keep them consistent.
 */

export interface KpiInfo {
  /** How the metric is computed. */
  f: string;
  /** Why it matters. */
  m: string;
}

export const KPI_INFO: Record<string, KpiInfo> = {
  'Active Admins': { f: 'Distinct user_id values (confirmed identity property, tied to a real $identify event at login) that fired at least one event during the selected period.', m: 'The number of Admins actively using the Lease Management console. Because user_id is a real, confirmed join key here, this is a direct headcount — not a device/browser proxy.' },
  'Screen Views': { f: 'Count of all <Page> Page Viewed and List/Viewed events across modules (e.g. Rental Viewed, Invoice Viewed, Properties List Viewed).', m: 'Overall screen/content consumption across the Lease Management back office.' },
  'Total Sessions': { f: 'Count of distinct browser sessions started in the period, associated with a confirmed user_id.', m: 'Usage volume across all Admin sessions.' },
  'Average Session Duration': { f: 'Total session time ÷ total sessions.', m: 'Engagement depth per visit to the console.' },
  'Bounce Rate': { f: '% of sessions with only a single List-Viewed or Page-Viewed event and no further interaction.', m: 'Immediate exits — the console was opened, glanced at, and left.' },
  'Returning Admins': { f: 'user_id values active in the period who were also active in a prior period.', m: 'Retention and consistency of Admin usage, based on confirmed identity.' },
  'Recently Active': { f: 'Distinct user_id values with an event in the last 30 minutes.', m: 'A live pulse of who is currently working in the console.' },
  'Views / Session': { f: 'Total screen views ÷ total sessions.', m: 'How much of the console Admins traverse per visit.' },
  'Session Mix': { f: 'Share of sessions that touch each top-level area (Rental, Financial Ops, Compliance/Maintenance, Masters) at least once.', m: 'Shows where Admin attention concentrates in a working session.' },
  'Engagement Rate': { f: '% of sessions with a meaningful interaction beyond a list view (a Created/Updated event tied to a real workflow).', m: 'Distinguishes active console usage from an idle/logged-in session.' },
  'Average Time Spent': { f: 'Total time spent in a module ÷ sessions using it.', m: 'How much attention a module commands per visit.' },
  'Average Sessions per Admin': { f: 'Total sessions ÷ unique active user_id values.', m: 'Habit and usage frequency across the Admin base.' },
  'Feature Interaction Rate': { f: '% of sessions where an Admin fired a Created/Updated event, not just a list load.', m: 'Indicates depth of feature-level engagement beyond browsing lists.' },
  'Module Breadth': { f: 'Count of distinct modules used at least once ÷ total modules available (15).', m: 'How much of the console an Admin base has actually adopted, not just Rental and Masters.' },
  'Workflow Adoption': { f: '% of active Admins who fired the workflow\'s first event (e.g. Rental Form Opened, Expense Created, AMC Contract Created).', m: 'Shows how many Admins attempt this process.' },
  'Workflow Completion Rate': { f: '% of Admins who reached the workflow\'s terminal event after starting.', m: 'How effectively the workflow converts to a created rental, recorded expense, or completed AMC contract.' },
  'Drop-off Rate': { f: '% of Admins who fired the start event but never fired the terminal event.', m: 'Highlights where the operational process is losing completions.' },
  'Average Completion Time': { f: 'Median time from the workflow\'s first to last event.', m: 'Indicates process friction for Admins — lower is smoother and faster.' },
  'Successful Completions': { f: 'Count of Admins who fired the workflow\'s terminal event this period.', m: 'Absolute volume of created rentals, recorded expenses, or completed contracts.' },
  'Feature Adoption Rate': { f: '% of active Admins who used at least one tracked module.', m: 'How broadly modules are being adopted across the Admin base.' },
  'Feature Usage Frequency': { f: 'Avg. number of times a module\'s events fire per active Admin per week.', m: 'How habitual a module is once discovered.' },
  'Unique Admins per Module': { f: 'Distinct user_id values who triggered any event in the module at least once.', m: 'Reach of a module across the Admin base.' },
  'Repeat Usage Rate': { f: '% of module users who used it more than once.', m: 'Signals whether a module earns repeat trust across visits.' },
  'Day 1 Retention': { f: '% of new user_id values who return exactly 1 day after their first session.', m: 'Immediate stickiness of onboarding for newly created Admin accounts.' },
  'Day 7 Retention': { f: '% of new user_id values who return in the 7 days after their first session.', m: 'Whether the console has earned a place in Admins\' weekly routine.' },
  'Day 30 Retention': { f: '% of new user_id values still active 30 days after their first session.', m: 'Long-run habit formation among Admins.' },
  'Churn Rate': { f: '% of previously active user_id values with no activity in the last 30 days.', m: 'How many Admins have gone inactive outright — the mirror image of retention.' },
  'Sessions': { f: 'Count of distinct browser sessions started in the period, associated with a confirmed user_id.', m: 'Usage volume across all Admin sessions.' },
  'Session Duration': { f: 'Total session time ÷ total sessions.', m: 'Engagement depth per visit to the console.' },
  'Seat Utilisation': { f: 'Active Admin accounts ÷ total licensed seats.', m: 'Measures how much of the purchased software capacity is actively in use.' },
  'Stickiness': { f: 'Ratio of Daily Active Users (DAU) to Monthly Active Users (MAU).', m: 'Indicates how habitually admins return to the console each day.' },
  'Adoption Trend': { f: 'Percentage growth in weekly active admins compared to previous trailing window.', m: 'Tracks whether adoption momentum is accelerating or dropping over time.' },
  '14-Day Activation': { f: '% of newly onboarded Admin accounts who completed at least one core workflow within 14 days.', m: 'Validates initial onboarding success and speed-to-value.' },
  'Completion Rate': { f: '% of Admins who reached the workflow\'s terminal event after starting.', m: 'How effectively the workflow converts to a completed action.' },
  'Biggest Step Drop': { f: 'The workflow step with the highest drop-off rate between consecutive steps.', m: 'Identifies the primary UX or operational bottleneck in the workflow.' },
  'Usage Volume': { f: 'Total count of times this workflow was successfully completed in the selected period.', m: 'Throughput and operational execution volume for this module.' },
  'Dormant Admins': { f: 'Registered Admin accounts (by confirmed user_id) with no activity in the last 14 days.', m: 'Identifies admins who have lapsed and may need training or offboarding.' },
  'Top Entry Screen': { f: 'The screen property value most often seen on the first event of a session.', m: 'Where Admins land first — usually the Dashboard or a module\'s List Viewed screen.' },
  'Top Exit Screen': { f: 'The screen property value most often seen on the last event of a session.', m: 'Where Admins stop working — either a completed task or a mid-flow drop-off, depending on the screen.' },
};

export function kpiInfo(label: string): KpiInfo {
  return (
    KPI_INFO[label] ?? {
      f: 'Definition not yet finalized for this metric.',
      m: 'Business meaning to be confirmed with product team.',
    }
  );
}

/** Starting targets; a viewer can type their own into any tile's Target box. */
export const BM_DEFAULTS: Record<string, number> = {
  activeAdmins: 60, bounceRate: 18, engagementRate: 65, featureInteractionRate: 50,
  wfAdoption: 50, wfCompletion: 70, wfDropoff: 30,
  featureAdoptionRate: 60, repeatUsageRate: 55,
  day1Retention: 55, day7Retention: 35, day30Retention: 20, churnRate: 10,
};
