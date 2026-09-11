import { capturePostHogEvent } from './posthogHelpers';

/**
 * Event catalogue + declarative auto-capture.
 *
 * The catalogue exists so an event name is written once and reused, rather than being
 * retyped (and quietly mistyped) at each call site — `PH_EVENTS.RENTAL_CREATED` is one row
 * in PostHog; `'Rental created'` typed by hand somewhere is a second, near-duplicate row.
 *
 * Auto-capture covers the long tail of ordinary buttons: instead of an onClick that calls a
 * helper, a button declares what it is with `data-ph-*` attributes and one document-level
 * listener does the reporting. Domain events with real business properties still go through
 * the helpers in `analytics.ts` — auto-capture is for repetitive UI actions, not a
 * replacement for them.
 */

/* ------------------------------------------------------------------ modules */

export const PH_MODULES = {
  DASHBOARD: 'Dashboard',
  RENTAL: 'Rental',
  PROPERTY: 'Property',
  MAINTENANCE: 'Maintenance',
  UTILITY: 'Utility',
  COMPLIANCE: 'Compliance',
  INVOICING: 'Invoicing',
  OPEX: 'Opex',
  AMC: 'AMC',
  MASTERS: 'Masters',
  TENANT: 'Tenant',
  REPORTS: 'Reports',
  SETTINGS: 'Settings',
  NOTIFICATIONS: 'Notifications',
  AUTH: 'Auth',
} as const;

export type PhModule = (typeof PH_MODULES)[keyof typeof PH_MODULES];

/* ------------------------------------------------------------------- events */

/**
 * Approved event names. Entity-shaped events are built by the helpers
 * (`<Entity> Created`), so this lists the fixed names only — add a row here before wiring a
 * new one into the UI.
 */
export const PH_EVENTS = {
  // auth
  LOGIN_SUCCEEDED: 'Login Succeeded',
  LOGIN_FAILED: 'Login Failed',
  LOGGED_OUT: 'Logged Out',

  // generic UI
  BUTTON_CLICKED: 'Button Clicked',
  FORM_STEP_CHANGED: 'Form Step Changed',

  // notifications
  NOTIFICATIONS_MARKED_ALL_READ: 'Notifications Marked All Read',
  NOTIFICATIONS_TAB_CHANGED: 'Notifications Tab Changed',

  // settings
  SETTINGS_TAB_CHANGED: 'Settings Tab Changed',
  ACCESS_CONFIG_SAVE_CLICKED: 'Access Configuration Save Clicked',

  // api safety net
  API_WRITE_SUCCEEDED: 'API Write Succeeded',
  API_WRITE_FAILED: 'API Write Failed',
} as const;

export type PhEvent = (typeof PH_EVENTS)[keyof typeof PH_EVENTS];

/** Suffixes the helpers append to an entity name — kept here so the shape is documented. */
export const PH_ENTITY_SUFFIXES = {
  CREATED: 'Created',
  UPDATED: 'Updated',
  DELETED: 'Deleted',
  VIEWED: 'Viewed',
  STATUS_CHANGED: 'Status Changed',
  LIST_SEARCHED: 'List Searched',
  LIST_FILTERED: 'List Filtered',
  LIST_EXPORTED: 'List Exported',
  LIST_PAGED: 'List Paged',
  FORM_OPENED: 'Form Opened',
  PAGE_VIEWED: 'Page Viewed',
} as const;

/* --------------------------------------------------------- declarative capture */

type PhAction = 'create' | 'update' | 'delete' | 'view' | 'export' | 'status' | 'click';

interface PhDataset {
  btn?: string;
  module?: string;
  action?: string;
  entity?: string;
  id?: string;
  status?: string;
}

function readDataset(el: HTMLElement): PhDataset {
  return {
    btn: el.dataset.phBtn,
    module: el.dataset.phModule,
    action: el.dataset.phAction,
    entity: el.dataset.phEntity,
    id: el.dataset.phId,
    status: el.dataset.phStatus,
  };
}

let installed = false;

/**
 * One document-level click listener for every element carrying `data-ph-btn`.
 *
 *   <button
 *     data-ph-btn="Approve Invoice"
 *     data-ph-module={PH_MODULES.INVOICING}
 *     data-ph-action="update"
 *     data-ph-entity="Invoice"
 *     data-ph-id={invoice.id}
 *     onClick={approve}
 *   >
 *
 * The click is reported immediately, so `create`/`update`/`delete` here mean "the user asked
 * for it", not "the API confirmed it" — a flow that needs the confirmed outcome keeps its
 * explicit helper call after the request succeeds (see the rules in the analytics doc).
 */
export function installDeclarativeAutoCapture(): void {
  if (installed || typeof document === 'undefined') return;
  installed = true;

  document.addEventListener(
    'click',
    (event) => {
      // Analytics must never break a click: everything below is best-effort.
      try {
        const target = event.target as HTMLElement | null;
        const el = target?.closest<HTMLElement>('[data-ph-btn]');
        if (!el) return;

        const data = readDataset(el);
        const label = data.btn || el.textContent?.trim().slice(0, 60) || 'Button';
        const entity = data.entity || label;
        const props = {
          label,
          module: data.module,
          record_id: data.id,
          source: 'auto_capture',
        };

        // Built here rather than through analytics.ts: that module imports this one for
        // the catalogue, and a cycle between them is a trap waiting for the next edit.
        const suffix: Record<PhAction, string | null> = {
          create: PH_ENTITY_SUFFIXES.CREATED,
          update: PH_ENTITY_SUFFIXES.UPDATED,
          delete: PH_ENTITY_SUFFIXES.DELETED,
          view: PH_ENTITY_SUFFIXES.VIEWED,
          export: PH_ENTITY_SUFFIXES.LIST_EXPORTED,
          status: PH_ENTITY_SUFFIXES.STATUS_CHANGED,
          click: null,
        };
        const action = (data.action || 'click') as PhAction;
        const end = suffix[action];

        if (end) {
          capturePostHogEvent(`${entity} ${end}`, {
            action,
            entity,
            new_status: data.status,
            ...props,
          });
        } else {
          capturePostHogEvent(PH_EVENTS.BUTTON_CLICKED, { action: 'click', ...props });
        }
      } catch (err) {
        console.warn('[analytics] auto-capture failed', err);
      }
    },
    // Capture phase, so a handler that calls stopPropagation() cannot hide the click.
    true
  );
}
