# PostHog instrumentation

Ported from `fm-matrix-revamp` (`src/utils/posthogContext.ts`, `posthogDebug.ts`,
`posthogHelpers.ts`, `downloadTracking.ts`, `components/PostHogPageView.tsx`, `main.tsx`).
Same shape, adapted to this app's auth storage, routes and modules.


## Architecture (implementation guide alignment)

| Layer | File |
| --- | --- |
| Initialization | `src/lib/posthog.ts` — client + init options, called once from `main.tsx` |
| Connection settings | `src/config/posthog.ts` — token/host, env-overridable |
| Super properties | `src/utils/posthogContext.ts` |
| Page views | `src/components/PostHogPageView.tsx` + `src/utils/pageTitles.ts` |
| Event catalogue | `src/utils/posthogEvents.ts` — `PH_MODULES`, `PH_EVENTS`, `PH_ENTITY_SUFFIXES` |
| Helpers | `src/utils/analytics.ts` (app-facing verbs) → `src/utils/posthogHelpers.ts` (root capture) |
| Auto-capture | `installDeclarativeAutoCapture()` in `posthogEvents.ts` — `data-ph-*` attributes |
| Debugger | `src/utils/posthogDebug.ts` — per-event line + missing-context warning |

Init options: `autocapture: true`, `capture_pageview: 'history_change'`, `capture_pageleave: true`,
`disable_session_recording: false`, `advanced_disable_decide: false` (the /decide response configures
recording), `disable_toolbar: true`.

So PostHog's own `$pageview`, `$pageleave`, `$autocapture` and session recording are ON, and the
app's named events run alongside them. A navigation therefore appears twice in the activity
feed — once as `$pageview`, once as `<Page> Page Viewed` — which is the price of having the
built-in Web Analytics and replay products work.

The root capture re-registers the super-properties immediately before each send, so events
fired right after a sign-in or a company switch never carry the previous context.

### Declarative auto-capture

```tsx
<button
  data-ph-btn="Approve Invoice"
  data-ph-module={PH_MODULES.INVOICING}
  data-ph-action="update"      // create | update | delete | view | export | status | click
  data-ph-entity="Invoice"
  data-ph-id={invoice.id}
  onClick={approve}
>
  Approve
</button>
```

One document-level listener maps the action to the right event. It reports the *click*, not
the API result — flows that need the confirmed outcome keep their explicit helper call after
the request succeeds.

## Setup

```
VITE_POSTHOG_PROJECT_TOKEN=phc_...      # required — without it every event is dropped
VITE_POSTHOG_HOST=https://posthog.lockated.com
VITE_APP_VERSION=<git tag or short sha> # stamped on every event as release_version
```

`main.tsx` calls `initPostHog()` (src/lib/posthog.ts) **before** React renders, so a `capture()` inside a mount
effect is never made against an uninitialised client. posthog-js captures `$pageview`/`$pageleave`/`$autocapture` itself; `PostHogPageView` adds the
named `<Page> Page Viewed` twin, and every other event is explicit.

If no token is configured, `initPostHog()` logs a loud `console.error` and skips init rather
than silently dropping events. Token/host live in `src/config/posthog.ts`; the env vars above
override them.

## What is sent on every event (super-properties)

Registered at init and refreshed on every navigation — see `src/utils/posthogContext.ts`.

| Property | Meaning |
| --- | --- |
| `client` | `rental-web`, `rental-uat-web`, or `local-web`, by hostname |
| `is_test` | true for dev builds and localhost — production queries filter on `is_test = false` |
| `platform` | always `web` |
| `release_version` | `VITE_APP_VERSION` |
| `screen` | route with record ids collapsed (`/rental/:id`) |
| `module` | `rental`, `maintenance`, `utility`, `compliance`, `invoicing`, `opex`, `amc`, `masters`, … |
| `user_role`, `client_company` | from the stored user, once signed in |

`capturePostHogEvent` (`src/utils/posthogHelpers.ts`) adds identity context —
`project_id`, `project_code`, `user_id`, `email`, `company_*`, `site_*`.

## Event vocabulary

`src/utils/analytics.ts` is the app-facing API. Plain functions, not hooks: `posthog` is a
singleton, so a capture works from an event handler, a `.then()`, or a plain module.

| Helper | Event name |
| --- | --- |
| `trackCreated(entity)` | `<Entity> Created` |
| `trackUpdated(entity)` | `<Entity> Updated` |
| `trackDeleted(entity)` | `<Entity> Deleted` |
| `trackViewed(entity)` | `<Entity> Viewed` |
| `trackFailed(entity, verb)` | `<Entity> <Verb> Failed` |
| `trackListSearched/Filtered/Exported/Paged(entity)` | `<Entity> List Searched` … |
| `trackFormOpened/trackFormStepChanged` | `<Entity> Form Opened`, `Form Step Changed` |
| `trackNavigation()` | `Navigation Clicked` |
| `trackLoginSucceeded/Failed`, `trackLoggedOut` | `Login Succeeded` … |
| `trackApiWrite()` | `API Write Succeeded` / `API Write Failed` |
| `trackEvent(name, props)` | escape hatch for a one-off name |

Guide-shaped wrappers over the same events, for new code and auto-capture:

| Helper | Event name |
| --- | --- |
| `trackCreate(entity, id, props)` | `<Entity> Created` |
| `trackUpdate(entity, id, props)` | `<Entity> Updated` |
| `trackDelete(entity, id, props)` | `<Entity> Deleted` |
| `trackStatusChange(entity, props)` | `<Entity> Status Changed` |
| `trackButtonClick(label, props)` | `Button Clicked` |
| `trackSearch` / `trackFilter` / `trackExport` | aliases of the list helpers |

Fixed event names live in `PH_EVENTS` and entity suffixes in `PH_ENTITY_SUFFIXES`
(`src/utils/posthogEvents.ts`) — add a row there before wiring a new event into the UI.

## Where it is wired

Choke points first — one edit covering many screens, the same approach the reference uses
for downloads:

- **`src/lib/api.ts`** (safety net — the masters screens also send their own domain events) — `postAuth`/`putAuth`/`patchAuth`/`deleteAuth` all funnel through one
  `writeRequest`, which reports `API Write Succeeded|Failed` with `resource` (ids stripped),
  `status` and `duration_ms`. This covers every create/update/delete in the app, including
  the ~20 master screens that have no bespoke events.
- **`src/components/enhanced-table/EnhancedTable.tsx`** — every list in the app: search
  (debounced 800ms, one event per completed search), filter button, export, pagination, and
  row click (`<List> Viewed`). The export path also calls `markDownloadReported()` so the
  anchor-click fallback does not double-count.
- **`src/utils/downloadTracking.ts`** — patches `HTMLAnchorElement.click` so any
  `<a download>` (including SheetJS/jsPDF saves) reports `<Module> Download: <Label>`.
- **`src/components/PostHogPageView.tsx`** — one named event per route change, after the
  screen: `Utilities Page Viewed`, `Rental Details Page Viewed`, `Country Master Page
  Viewed`. Names come from `src/utils/pageTitles.ts` (74 routes mapped; anything unmapped
  falls back to a title built from the path). `page_name` also rides along as a
  super-property, so every other event says which screen it came from.

  The SDK sends `$pageview` and `$pageleave` for the same navigation, so both appear in the
  activity feed: `$pageview` powers Web Analytics, the named event is what dashboards and
  funnels here are built on. Sidebar clicks are not tracked separately — the destination
  already reports itself (and `$autocapture` covers the click).
- **`src/components/ui/form-stepper.tsx`** — `Form Step Changed` on multi-step forms.

Domain events on the main flows (so reporting reads in business terms, not just API writes):

| Screen | Events |
| --- | --- |
| Login / Header logout | `Login Succeeded`, `Login Failed`, `Logged Out`, plus `identify` / `reset` |
| Add & Edit Rental | `Rental Created/Updated`, `Rental Create/Update Failed` |
| Add & Edit Maintenance Request | `Maintenance Request …` |
| Add & Edit Utility | `Utility …` |
| Add & Edit Expense | `Expense …` |
| Add & Edit AMC Contract | `AMC Contract …` |
| Compliance form | `Compliance Created/Updated/Failed` |
| Detail pages (rental, maintenance, utility, expense, AMC, invoice, compliance, property, landlord, lessee, country, state, region, zone, user, role, vendor, branding, lease custom field) | `<Entity> Viewed` |
| Every masters submodule (country, state, region, zone, city, circle, landlord, lessee, vendor, amenity, property, takeover condition, facility type, compliance requirement, expense category, budget, user, role, branding, lease custom field, service type) | `<Entity> Created/Updated/Deleted` (status toggles report as `Updated`), `<Entity> Form Opened` on the Add button |
| Access Control | `Access Configuration Save Clicked` (screen has no API yet) |

## Debugging

`src/utils/posthogDebug.ts` prints one console line per captured event.

```
localStorage.ph_debug = '1'     // PostHog lines only (default on the dev server)
localStorage.ph_debug = 'all'   // PostHog lines plus normal console output
localStorage.ph_debug = '0'     // off
```

## Adding an event

Prefer an existing verb: `trackCreated('Budget', { … })` beats a new bespoke name — the
`screen` and `module` super-properties already say where it happened. Never put a raw
identifier in an event *name*; ids belong in properties (`record_id`), otherwise the
project's event list grows a row per record.
