import { capturePostHogEvent } from './posthogHelpers';
import { normalizeRoute, resolveModule } from './posthogContext';

/**
 * The app-facing analytics API.
 *
 * Deliberately plain functions rather than hooks: `posthog` is a singleton, so a capture
 * needs no React context, and a plain function can be called from an event handler, a
 * `.then()`, or a non-component module alike. The per-module hooks in fm-matrix-revamp
 * (`PostHog*Events.tsx`) exist because that app captures dozens of bespoke event names per
 * module; here the same coverage comes from a small verb vocabulary plus an `entity`, which
 * keeps the project's event list readable.
 *
 * Naming follows the reference: Title Case, "<Entity> <Verb>" — "Rental Created",
 * "Maintenance Request Deleted", "Invoice List Exported".
 */

type Props = Record<string, unknown>;

/** Escape hatch for a one-off event name that does not fit the verbs below. */
export const trackEvent = (event: string, props: Props = {}) =>
  capturePostHogEvent(event, props);

/* ------------------------------------------------------------------ records */

export const trackCreated = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} Created`, { action: 'create', entity, ...props });

export const trackUpdated = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} Updated`, { action: 'update', entity, ...props });

export const trackDeleted = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} Deleted`, { action: 'delete', entity, ...props });

export const trackViewed = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} Viewed`, { action: 'view', entity, ...props });

/** A create/update that the API rejected — the denominator for form success rate. */
export const trackFailed = (entity: string, action: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} ${action} Failed`, {
    action: `${action.toLowerCase()}_failed`,
    entity,
    succeeded: false,
    ...props,
  });

/* -------------------------------------------------------------------- lists */

export const trackListSearched = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} List Searched`, { action: 'search', entity, ...props });

export const trackListFiltered = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} List Filtered`, { action: 'filter', entity, ...props });

export const trackListExported = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} List Exported`, { action: 'export', entity, ...props });

export const trackListPaged = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} List Paged`, { action: 'paginate', entity, ...props });

/* -------------------------------------------------------------------- forms */

export const trackFormOpened = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} Form Opened`, { action: 'form_open', entity, ...props });

export const trackFormStepChanged = (entity: string, props: Props = {}) =>
  capturePostHogEvent(`${entity} Form Step Changed`, { action: 'form_step', entity, ...props });

/* ---------------------------------------------------------------- navigation */

export const trackNavigation = (props: Props = {}) =>
  capturePostHogEvent('Navigation Clicked', { action: 'navigate', ...props });

/* ---------------------------------------------------------------------- auth */

export const trackLoginSucceeded = (props: Props = {}) =>
  capturePostHogEvent('Login Succeeded', { action: 'login', succeeded: true, ...props });

export const trackLoginFailed = (props: Props = {}) =>
  capturePostHogEvent('Login Failed', { action: 'login', succeeded: false, ...props });

export const trackLoggedOut = (props: Props = {}) =>
  capturePostHogEvent('Logged Out', { action: 'logout', ...props });

/* ----------------------------------------------------------------- api layer */

/**
 * Write requests reported from `lib/api.ts`.
 *
 * Every create/update/delete in this app goes through postAuth/putAuth/patchAuth/deleteAuth,
 * so reporting there covers screens nobody remembered to instrument by hand, and gives the
 * failure side of every flow for free. Named per resource rather than per URL so the event
 * list stays finite — `/pms/countries/12` and `/pms/countries/98` are one resource.
 */
export const trackApiWrite = (props: {
  method: string;
  path: string;
  resource: string;
  succeeded: boolean;
  status?: number;
  duration_ms?: number;
  error_message?: string;
}) =>
  capturePostHogEvent(props.succeeded ? 'API Write Succeeded' : 'API Write Failed', {
    action: 'api_write',
    module: resolveModule(),
    screen: normalizeRoute(),
    ...props,
  });

/**
 * Request path → a stable resource label.
 *
 * Ids (numeric, uuid, or `MR-202601-0003`-style) collapse away and the `.json` suffix is
 * dropped, so `/maintenance_requests/318.json` and `/maintenance_requests/4` both report as
 * `maintenance_requests`.
 */
export function resourceFromPath(path: string): string {
  const withoutQuery = path.split('?')[0].replace(/\.json$/i, '');
  const segments = withoutQuery
    .split('/')
    .filter(Boolean)
    .filter((segment) => {
      if (/^\d+$/.test(segment)) return false;
      if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(segment)) return false;
      if (/^[A-Za-z]{1,4}[-_]?\d{3,}/.test(segment)) return false;
      return true;
    });
  return segments.join('/') || 'root';
}
