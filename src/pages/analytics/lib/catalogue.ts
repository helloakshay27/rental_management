/**
 * Lease Management · instrumentation catalogue.
 *
 * Structural facts only — module names, workflow step sequences, bucket grouping, Masters
 * submodules and the reconciled event counts, all taken verbatim from
 * Lease-Management-PostHog-Event-Dictionary.xlsx and the Chart Calculation & Instrumentation
 * Reference.
 *
 * No metric values live here. Every volume, rate and trend on the dashboard comes from the
 * analytics API (`api/analyticsApi.ts`); a card with no data renders as empty rather than
 * falling back to an invented number.
 */

/* ---------- identifiers (Global Properties sheet, confirmed) ---------- */

export const PROJECT_ID = 'P-274';
export const PROJECT_CODE = 'LMV-01';

/* ---------- reconciled event counts (§9.1) ---------- */

export const TOTAL_CUSTOM_NAMED = 143; // Custom Events sheet, 144 rows minus header
export const TOTAL_CUSTOM_LIST = 205; // 41 list-prefixes × 5 event-name variants
export const TOTAL_CUSTOM_PAGEVIEW = 74; // Page View Events sheet, 75 rows minus header
export const TOTAL_CUSTOM_EVENTS = TOTAL_CUSTOM_NAMED + TOTAL_CUSTOM_LIST + TOTAL_CUSTOM_PAGEVIEW; // 422
export const TOTAL_AUTOMATIC_EVENTS = 5; // $pageview, $pageleave, $autocapture, $rageclick, recording
export const TOTAL_EVENTS = TOTAL_CUSTOM_EVENTS + TOTAL_AUTOMATIC_EVENTS; // 427

/* ---------- modules (Modules sheet, 15 confirmed) ---------- */

export const MODULE_NAMES = [
  'Dashboard', 'Rental', 'Property', 'Maintenance', 'Utility', 'Compliance', 'Invoicing',
  'Opex', 'AMC', 'Masters', 'Tenant', 'Reports', 'Settings', 'Notifications', 'Auth',
];

export const TOTAL_MODULES = MODULE_NAMES.length; // 15

/* ---------- workflows (step names verbatim from the catalogue) ---------- */

export interface Workflow {
  key: string;
  name: string;
  bucket: string;
  /** The real event sequence, first → terminal. */
  steps: string[];
  /** A documented nuance: a funnel gap, instrumentation thinness, or a near-duplicate family. */
  incompleteNote?: string;
}

export const workflows: Workflow[] = [
  {
    key: 'rentalCreate', name: 'Rental Creation & Update', bucket: 'Rental Lifecycle',
    steps: ['Rental Form Opened', 'Rental Created', 'Rental Viewed', 'Rental Updated'],
    incompleteNote:
      '<code>Rental Create Failed</code> and <code>Rental Update Failed</code> are real, documented failure counterparts to the Created/Updated steps in the Custom Events sheet — they are genuine exit branches from this funnel (not a 5th linear step), and are counted into the Drop-off Rate rather than drawn as their own funnel stage. <code>Rental Form Opened</code> is module-tagged "Tenant" in the raw sheet, not "Rental" — the form that kicks off this Rental-owned funnel is wired from Tenant-adjacent component code.',
  },
  {
    key: 'leaseRenewals', name: 'Lease Renewals', bucket: 'Rental Lifecycle',
    steps: ['Lease Renewals List Viewed', 'Lease Renewals List Filtered', 'Lease Renewals List Exported'],
    incompleteNote:
      '<b>Real instrumentation gap.</b> The Custom Events sheet has no explicit "Lease Renewal Created" or "Lease Renewal Completed" event anywhere — Lease Renewals exists in the catalogue only as a List-prefix entity (List Searched/Filtered/Exported/Paged, plus Viewed). This is charted here as a thin list/view surface, not a create-to-complete funnel, because the underlying create/complete action for a renewal is not separately tracked today. Completion and Drop-off Rate are not meaningful in the usual sense for a list-only surface like this one.',
  },
  {
    key: 'expenseCreate', name: 'Expense Creation (Opex)', bucket: 'Financial Ops',
    steps: ['Expense Created', 'Expense Updated', 'Expense Viewed'],
    incompleteNote:
      '<code>Expense Create Failed</code> is a documented failure branch off the Created step and is counted into the Drop-off Rate rather than drawn as a linear stage. <code>Expense Deleted</code> also exists in the catalogue as a documented terminal action outside this create/view funnel.',
  },
  {
    key: 'amcContract', name: 'AMC Contract Lifecycle', bucket: 'Financial Ops',
    steps: ['AMC Contract Created', 'AMC Contract Updated', 'AMC Contract Viewed'],
    incompleteNote:
      'Create/Update Failed variants exist in the catalogue as documented failure branches and are folded into the Drop-off Rate, consistent with the Expense workflow.',
  },
  {
    key: 'invoiceViewed', name: 'Invoicing (Invoice Viewed)', bucket: 'Financial Ops',
    steps: ['Invoice Viewed', 'Payment Created'],
    incompleteNote:
      '<b>Real instrumentation thinness, disclosed here rather than smoothed over.</b> <code>Invoice Viewed</code> is essentially the only Invoicing-owned custom event in the catalogue &mdash; there is no Invoicing-owned "Invoice Created" or "Invoice Sent" event. <code>Payment Created</code>, shown here as the funnel\'s terminal step, does not fire from an Invoicing-owned page at all: it is wired from <code>components/Dashboard/InvoiceManagement.tsx</code> and <code>components/Tenant/MyRentals.tsx</code>. This funnel is a best-effort stand-in for an Invoicing lifecycle that is not instrumented as its own multi-step flow today.',
  },
  {
    key: 'complianceCreate', name: 'Compliance Records (Tenant-facing)', bucket: 'Compliance & Maintenance',
    steps: ['Compliance Created', 'Compliance Updated', 'Compliance Viewed'],
    incompleteNote:
      '<b>Not a duplicate of the workflow below.</b> <code>Compliance Created/Updated/Viewed</code> fires from Tenant-facing components and is a distinct event family from Masters\' <code>Compliance Requirement</code> events (next workflow) &mdash; same near-identical shape, two separate real sources in the catalogue. Both are charted separately here to avoid conflating them.',
  },
  {
    key: 'complianceRequirement', name: 'Compliance Requirement (Masters)', bucket: 'Compliance & Maintenance',
    steps: ['Compliance Requirement Form Opened', 'Compliance Requirement Created', 'Compliance Requirement Updated', 'Compliance Requirement Viewed'],
    incompleteNote:
      'This is Masters\' own reference-data catalogue of compliance requirement types (e.g. a fire-safety certificate, an AMC clause) &mdash; distinct from the Tenant-facing <code>Compliance</code> event family above, which tracks actual per-lease/per-property compliance records. <code>Compliance Requirement Deleted</code> also exists in the catalogue as a documented terminal action outside this create/view funnel.',
  },
  {
    key: 'maintenanceRequest', name: 'Maintenance Request Lifecycle', bucket: 'Compliance & Maintenance',
    steps: ['Maintenance Request Created', 'Maintenance Request Updated', 'Maintenance Request Viewed', 'Maintenance Cost Created'],
    incompleteNote:
      '<code>Maintenance Request Create Failed</code> and <code>Maintenance Request Update Failed</code> are documented failure branches folded into the Drop-off Rate. <code>Maintenance Cost Created</code> is the closest the catalogue has to a cost/closure step and is charted as this funnel\'s terminal stage.',
  },
  {
    key: 'utilityCreate', name: 'Utility Record Lifecycle', bucket: 'Compliance & Maintenance',
    steps: ['Utility Created', 'Utility Updated', 'Utility Viewed'],
    incompleteNote:
      '<code>Utility Create Failed</code> and <code>Utility Update Failed</code> are documented failure branches folded into the Drop-off Rate.',
  },
];

/**
 * Master Data Admin is deliberately not a workflow: each submodule fires a near-identical
 * Created/Updated/Deleted/Form Opened/Viewed CRUD set rather than a multi-step flow, so it is
 * presented as a league table. A funnel would imply step-to-step drop-off that does not exist.
 */
export const MASTERS_SUBMODULES = [
  'Countries', 'States', 'Cities', 'Zones', 'Regions', 'Circles', 'Landlords', 'Lessees',
  'Properties', 'Vendors', 'Users', 'Roles', 'Access Controls', 'Amenities', 'Budgets',
  'Branding Profiles', 'Expense Categories', 'Facility Types', 'Lease Custom Fields',
  'Service Types', 'Takeover Conditions',
];

export const MASTERS_BUCKET = 'Master Data Admin';

export const BUCKET_ORDER = [
  'Rental Lifecycle', 'Financial Ops', 'Compliance & Maintenance', MASTERS_BUCKET,
];

/**
 * Licensed Admin seats, for Seat Utilisation's denominator.
 *
 * Billing data, not events — the API returns `seat_utilisation.value = null` unless it is
 * supplied. Left unset by default rather than filled with a guess: without it the tile shows
 * the live active-seat count instead of a percentage derived from an invented ceiling.
 */
export const LICENSED_SEATS = (() => {
  const raw = (import.meta.env.VITE_LM_LICENSED_SEATS as string | undefined)?.trim();
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : null;
})();
